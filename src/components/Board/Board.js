"use client"

import Grid from "../Grid/Grid.js";
import Card from "../Card/Card.js";
import Balance from "../Balance/Balance.js"
import PokeballSplash from "../PokeballSplash/PokeballSplash.js";
import ResultTransition from '../ResultTransition/ResultTransition.js';
import Coin from "../Coin/Coin.js";
import { useState, useEffect } from 'react'
import { DndContext } from '@dnd-kit/core';
import { loadGameStateFromLocalStorage } from '@/utils/gameStorage';
import { fetchCardsByPlayerTierDistribution, allocateCpuCardsFromPool } from "@/utils/cardHelpers.js";
import { useGameContext } from '@/contexts/GameContext';
import { useNavigate, useLocation } from 'react-router-dom';

import gameData from '@/data/game-data.json';
import styles from './background.module.css';

export default function Board() {
    const [pokeballIsOpen, setPokeballIsOpen] = useState(false);
    const [isGameComplete, setIsGameComplete] = useState(false);
    const [hasWonCoinToss, setHasWonCoinToss] = useState(null);
    const location = useLocation();
    const pathname = location.pathname;
    const {
        selectedPlayerHand,
        setMatchCards,
        cells,
        setCells,
        setIsPlayerVictory,
        isPlayerTurn,
        setIsPlayerTurn,
        playerHand,
        setPlayerHand,
        cpuHand,
        setCpuHand,
        score,
    } = useGameContext();

    const navigate = useNavigate();
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const decrementRandomStat = (stats) => {
        const randomIndex = Math.floor(Math.random() * stats.length);

        if (stats[randomIndex] > 1) {
            stats[randomIndex] -= 1;
        } else {
            // If it's 1 or less, recursively call the function again
            decrementRandomStat(stats);
        }
    };
    
    //on mount
    useEffect(() => {
        // Try to load saved game state first
        const savedGameState = loadGameStateFromLocalStorage();

        if (savedGameState) {
            // Restore saved game state
            setCells(savedGameState.cells);
            setPlayerHand(savedGameState.playerHand);
            setCpuHand(savedGameState.cpuHand);
            setIsPlayerTurn(savedGameState.isPlayerTurn);
            setPokeballIsOpen(true);
            return;
        }

        // Allocate hands
        const cpuCardsToDeal = fetchCardsByPlayerTierDistribution(selectedPlayerHand);
        const newCpuHand = allocateCpuCardsFromPool(cpuCardsToDeal);
        const newPlayerHand = selectedPlayerHand;

        if (!newPlayerHand) {
            // Extract game mode from pathname (e.g., /quickplay/select/play -> quickplay)
            const gameMode = pathname.split('/').filter(Boolean)[0];
            navigate(`/${gameMode}/select`);
            return;
        }

        // Gather types from both hands for elemental tiles
        const playerTypes = newPlayerHand.flatMap(card => card.types);
        const cpuTypes = newCpuHand.flatMap(card => card.types);
        const allHandTypes = [...playerTypes, ...cpuTypes];
        const arrayOfPokemonTypes = [...new Set(allHandTypes)].filter((type) => type !== "normal");

        // Set random elemental tiles
        const gridCells = Object.keys(cells);
        let tilesPlaced = 0;
        const maxTiles = 3;
        const updatedCells = { ...cells };
        const availableTypes = [...arrayOfPokemonTypes]; // Create a copy to track unused types

        gridCells.forEach((cell) => {
            if (tilesPlaced < maxTiles && Math.random() < 0.2 && availableTypes.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableTypes.length);
                const randomElement = availableTypes[randomIndex];
                updatedCells[cell] = { ...updatedCells[cell], element: randomElement };
                availableTypes.splice(randomIndex, 1); // Remove the used element from available pool
                tilesPlaced++;
            }
        });

        setCpuHand(newCpuHand);
        setPlayerHand(newPlayerHand);
        setCells(updatedCells);
        setPokeballIsOpen(true);

        // Set coin toss result
        const randomBool = Math.random() < 0.5 ? true : false;
        setHasWonCoinToss(randomBool);
    }, []);

    useEffect(() => {
        if (hasWonCoinToss === null) return;

        const timer = setTimeout(() => {
            setIsPlayerTurn(hasWonCoinToss);
            setHasWonCoinToss(null); // hide coin toss
        }, 3250);

        return () => clearTimeout(timer);
    }, [hasWonCoinToss])

    const applyTileStatModifiers = (attackingCard, cellTargetObject) => {
        if (attackingCard.types.some((type) => type === "normal")) {
            return attackingCard.stats; // normal pokemon are not affected by elemental tiles
        }

        const updateStatOnElementalTile = (stat) => {
            if (attackingCard.types.includes(cellTargetObject.element) && stat < 10) {
                // stat cannot be increased above 10
                return stat + 1;
            } else if (cellTargetObject.element && !attackingCard.types.includes(cellTargetObject.element) && stat > 1) {
                // stat cannot be decreased below 1
                return stat - 1;
            }
            return stat; // No change
        };

        return attackingCard.stats.map(updateStatOnElementalTile);
    };

    const placeAttackingCard = (cellTarget, attackingCard) => {
        const cellTargetObject = cells[cellTarget];

        if (cellTargetObject.element) {
            attackingCard.stats = applyTileStatModifiers(attackingCard, cellTargetObject); // add or remove stats on placement of attacking card on tile
        }

        // Track if this card captured any cards due to type effectiveness
        attackingCard.wasSuperEffective = false;
        attackingCard.wasNoEffect = false;

        // Track which cells had cards captured
        const capturedCells = {};

        // apply attack logic against adjacent cards
        cellTargetObject.adjacentCells.forEach((adjacentCellKey, statIndex) => {
            if (!adjacentCellKey || !cells[adjacentCellKey].pokemonCard) return; // No adjacent cell or no adjacent defending card present

            const defendingCard = cells[adjacentCellKey].pokemonCard;
            const defendingStatIndex = cells[adjacentCellKey].adjacentCells.indexOf(cellTarget); // index of the attacking cell in the defending cell's adjacentCells
            const defendingStat = defendingCard.stats[defendingStatIndex];
            let attackingStat = attackingCard.stats[statIndex];

            // Calculate type effectiveness
            const typeMatchups = gameData.typeMatchups;

            // First check for immunity - if immune, attack fails completely
            let isImmune = false;
            for (const attackType of attackingCard.types) {
                const matchup = typeMatchups[attackType];

                for (const defendType of defendingCard.types) {
                    if (matchup.immune.includes(defendType)) {
                        isImmune = true;
                        break;
                    }
                }
                if (isImmune) break;
            }

            // Mark if attacking card encountered immunity
            if (isImmune && defendingCard.isPlayerCard !== attackingCard.isPlayerCard) {
                attackingCard.wasNoEffect = true;
                defendingCard.matchStats.immuneDefenses++;
            }

            // Calculate net type effectiveness bonus
            let effectivenessBonus = 0;
            if (!isImmune) {
                attackingCard.types.forEach(attackType => {
                    const matchup = typeMatchups[attackType];

                    defendingCard.types.forEach(defendType => {
                        if (matchup.superEffective.includes(defendType)) {
                            effectivenessBonus++;
                        } else if (matchup.notEffective.includes(defendType)) {
                            effectivenessBonus--;
                        }
                    });
                });
            }

            const hasEffectivenessBonus = effectivenessBonus > 0;

            // check if attackingCard and defendingCard belong to different players
            // Immunity prevents all captures
            if (
                !isImmune &&
                (attackingStat > defendingStat || (attackingStat === defendingStat && hasEffectivenessBonus)) &&
                defendingCard.isPlayerCard !== attackingCard.isPlayerCard
            ) {
                // Track this cell as having been captured (don't mutate the original object)
                capturedCells[adjacentCellKey] = attackingCard.isPlayerCard;

                // Update match stats
                attackingCard.matchStats.capturesMade++;
                defendingCard.matchStats.timesFlipped++;

                // Mark if this capture involved type effectiveness
                if (hasEffectivenessBonus) {
                    attackingCard.wasSuperEffective = true;
                    attackingCard.matchStats.superEffectiveCaptures++;
                }
            }
        });

        return capturedCells;
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        if (!over) return; // Dropped outside a droppable area

        let cellTarget = over.id; // e.g. A1

        let attackingCard = active.data.current.pokemonCard;

        const sourceIndex = active.data.current.index;
        // Remove card from the player hand
        setPlayerHand(prev => prev.map((card, index) => index === sourceIndex ? null : card));

        const capturedCells = placeAttackingCard(cellTarget, attackingCard);

        // Update cells to identify where the card is placed (logic handled in the-grid.js)
        // Force re-render by creating a new cells object so React detects defending card changes
        setCells(prev => {
            const newCells = { ...prev };
            // Spread all cells AND pokemonCards to trigger re-renders on captured cards
            Object.keys(newCells).forEach(key => {
                if (newCells[key].pokemonCard) {
                    newCells[key] = {
                        ...newCells[key],
                        pokemonCard: {
                            ...newCells[key].pokemonCard,
                            // Update isPlayerCard for captured cards
                            ...(capturedCells[key] !== undefined && { isPlayerCard: capturedCells[key] })
                        }
                    };
                } else {
                    newCells[key] = { ...newCells[key] };
                }
            });
            newCells[cellTarget] = {
                ...prev[cellTarget],
                pokemonCard: attackingCard
            };

            return newCells;
        });

        setIsPlayerTurn(false)
    }

    // Helper to calculate what a card's stats would be after elemental tile modifiers
    const calculateModifiedStats = (card, cellKey) => {
        const cellData = cells[cellKey];

        if (!cellData.element) {
            return card.stats;
        }

        // Normal type pokemon aren't affected
        if (card.types.some((type) => type === "normal")) {
            return card.stats;
        }

        // Apply the same logic as applyTileStatModifiers
        return card.stats.map(stat => {
            if (card.types.includes(cellData.element) && stat < 10) {
                return stat + 1;
            } else if (cellData.element && stat > 1) {
                return stat - 1;
            }
            return stat;
        });
    };

    // Helper to calculate type effectiveness between attacking and defending cards
    const calculateTypeEffectiveness = (attackingCard, defendingCard) => {
        const typeMatchups = gameData.typeMatchups;

        // First check for immunity - if immune, attack fails completely
        let isImmune = false;
        for (const attackType of attackingCard.types) {
            const matchup = typeMatchups[attackType];

            for (const defendType of defendingCard.types) {
                if (matchup.immune.includes(defendType)) {
                    isImmune = true;
                    break;
                }
            }
            if (isImmune) break;
        }

        if (isImmune) {
            return { isImmune: true, effectivenessBonus: 0, hasEffectivenessBonus: false };
        }

        // Calculate net type effectiveness bonus
        let effectivenessBonus = 0;
        attackingCard.types.forEach(attackType => {
            const matchup = typeMatchups[attackType];

            defendingCard.types.forEach(defendType => {
                if (matchup.superEffective.includes(defendType)) {
                    effectivenessBonus++;
                } else if (matchup.notEffective.includes(defendType)) {
                    effectivenessBonus--;
                }
            });
        });

        return {
            isImmune: false,
            effectivenessBonus,
            hasEffectivenessBonus: effectivenessBonus > 0
        };
    };

    const makeCpuMove = async () => {
        //known bug: if pokemon super effective against one tile adjacent it's effective to ALL tiles adjacent. Same with No effect
        let arrayOfCellsToPlace = [];
        let arrayOfPlayerOccupiedCells = [];
        let arrayOfCpuOccupiedCells = [];

        Object.entries(cells).forEach(([cell, { pokemonCard }]) => {
            if (!pokemonCard) {
                arrayOfCellsToPlace.push(cell);
            } else if (pokemonCard.isPlayerCard) {
                arrayOfPlayerOccupiedCells.push(cell);
            } else {
                arrayOfCpuOccupiedCells.push(cell);
            }
        });

        // Filter out null cards from CPU hand
        const availableCpuCards = cpuHand.filter(card => card !== null);

        // Ends match: needs work. Only CPU can end game currently.
        if (arrayOfCellsToPlace.length === 0 || availableCpuCards.length === 0) {
            // Create a snapshot of cards in the game to determine the winner and what cards can be awarded or lost
            const cardsFromCells = Object.values(cells)
                .map(cell => cell.pokemonCard)
                .filter(card => card !== null);

            const remainingPlayerCards = playerHand.filter(card => card !== null);
            const remainingCpuCards = cpuHand.filter(card => card !== null);
            const allMatchCards = [...cardsFromCells, ...remainingPlayerCards, ...remainingCpuCards];

            setMatchCards(allMatchCards);
            const playerCardCount = allMatchCards.filter(card => card.isPlayerCard === true).length;
            const cpuCardCount = allMatchCards.filter(card => card.isPlayerCard === false).length;

            if (playerCardCount > cpuCardCount) {
                setIsPlayerVictory(true);
            } else if (cpuCardCount > playerCardCount) {
                setIsPlayerVictory(false);
            }

            setTimeout(() => setIsGameComplete(true), 800);
            return;
        }

        const hasGameStarted = arrayOfPlayerOccupiedCells.length > 0 || arrayOfCpuOccupiedCells.length > 0;
        await sleep(hasGameStarted ? (1250 + Math.random() * 250) : 500);

        const validPlacementsSet = new Set(arrayOfCellsToPlace);

        let arrayOfCellsToPlaceToAttack = [...new Set(
            arrayOfPlayerOccupiedCells.flatMap(playerOccupiedCell =>
                cells[playerOccupiedCell].adjacentCells.filter(adjacentCell =>
                    adjacentCell !== null && validPlacementsSet.has(adjacentCell)
                )
            )
        )];

        // Analyse each potential placement cell
        const cellAnalysis = arrayOfCellsToPlaceToAttack.map(cellKey => {
            const exposedDefendingStats = [];

            // Check each adjacent cell for defending player cards
            cells[cellKey].adjacentCells.forEach((adjacentCellKey, statIndex) => {
                if (!adjacentCellKey || !cells[adjacentCellKey].pokemonCard) return;

                const adjacentCard = cells[adjacentCellKey].pokemonCard;

                // Only care about player cards (defending)
                if (adjacentCard.isPlayerCard) {
                    // Find which stat of the defending card faces this position
                    const defendingStatIndex = cells[adjacentCellKey].adjacentCells.indexOf(cellKey);
                    const defendingStat = adjacentCard.stats[defendingStatIndex];

                    exposedDefendingStats.push({
                        statIndex: statIndex, // which of CPU's card stats needs to counter
                        defendingStat: defendingStat // the stat value to beat
                    });
                }
            });

            // Find the lowest defending stat at this position (easiest to beat)
            const lowestDefendingStat = exposedDefendingStats.length > 0
                ? Math.min(...exposedDefendingStats.map(e => e.defendingStat))
                : Infinity;

            return {
                cellKey,
                exposedDefendingStats,
                lowestDefendingStat
            };
        });

        // Find best card + cell combination
        let bestCellToPlace = null;
        let bestCardToPlay = null;

        // Sort by lowest defending stat (easiest positions first)
        cellAnalysis.sort((a, b) => a.lowestDefendingStat - b.lowestDefendingStat);

        // Score each (cell, card) combination by how many cards it can capture
        let bestScore = -1;

        for (const analysis of cellAnalysis) {
            for (const cpuCard of availableCpuCards) {
                // Calculate what this card's stats would be after elemental modifiers
                const modifiedStats = calculateModifiedStats(cpuCard, analysis.cellKey);

                // Count how many defending cards this combination can beat
                let captureCount = 0;
                let superEffectiveCaptureCount = 0;

                // Check each exposed defending stat at this position
                cells[analysis.cellKey].adjacentCells.forEach((adjacentCellKey, statIndex) => {
                    if (!adjacentCellKey || !cells[adjacentCellKey].pokemonCard) return;

                    const defendingCard = cells[adjacentCellKey].pokemonCard;

                    // Only consider player cards (opponents)
                    if (!defendingCard.isPlayerCard) return;

                    const defendingStatIndex = cells[adjacentCellKey].adjacentCells.indexOf(analysis.cellKey);
                    const defendingStat = defendingCard.stats[defendingStatIndex];
                    const attackingStat = modifiedStats[statIndex];

                    // Calculate type effectiveness
                    const { isImmune, hasEffectivenessBonus } = calculateTypeEffectiveness(cpuCard, defendingCard);

                    // Skip if immune - cannot capture
                    if (isImmune) {
                        return;
                    }

                    // Check if this can capture (same logic as placeAttackingCard)
                    if (attackingStat > defendingStat || (attackingStat === defendingStat && hasEffectivenessBonus)) {
                        captureCount++;
                        if (hasEffectivenessBonus) {
                            superEffectiveCaptureCount++;
                        }
                    }
                });

                // Calculate score: prioritize captures, with bonus for super effective captures
                const score = captureCount * 10 + superEffectiveCaptureCount * 5;

                // Update best move if this scores higher (only accept score > 0 to avoid immune-only positions)
                if (score > bestScore && score > 0) {
                    bestScore = score;
                    bestCellToPlace = analysis.cellKey;
                    bestCardToPlay = cpuCard;
                }
            }
        }

        // Defensive strategy: if no attacking positions available, find the best corner/pocket
        if (!bestCellToPlace) {
            let bestDefensiveScore = -Infinity;

            for (const cellKey of arrayOfCellsToPlace) {
                const cellData = cells[cellKey];

                // Count exposed positions (non-null adjacent cells)
                const exposedPositions = cellData.adjacentCells
                    .map((adj, index) => ({ adjacentCell: adj, statIndex: index }))
                    .filter(({ adjacentCell }) => adjacentCell !== null);

                // Number of exposed sides (2 = corner, 3 = edge, 4 = center)
                const exposureCount = exposedPositions.length;

                for (const cpuCard of availableCpuCards) {
                    // Calculate modified stats for this position
                    const modifiedStats = calculateModifiedStats(cpuCard, cellKey);

                    // Calculate defensive score for this card at this position
                    let defensiveScore = 0;

                    // Base score: prefer corners (2 exposed) > edges (3) > center (4)
                    defensiveScore += (4 - exposureCount) * 10;

                    // Calculate average stat value that would be exposed (using modified stats)
                    const exposedStats = exposedPositions.map(({ statIndex }) => modifiedStats[statIndex]);
                    const avgExposedStat = exposedStats.length > 0
                        ? exposedStats.reduce((sum, stat) => sum + stat, 0) / exposedStats.length
                        : 0;

                    // Prefer positions where we expose our stronger stats
                    defensiveScore += avgExposedStat * 5;

                    // Consider existing threats: bonus for high stats facing player cards
                    exposedPositions.forEach(({ adjacentCell, statIndex }) => {
                        const adjacentCard = cells[adjacentCell]?.pokemonCard;
                        if (adjacentCard?.isPlayerCard) {
                            // Calculate type effectiveness for this matchup
                            const { isImmune, hasEffectivenessBonus, effectivenessBonus } = calculateTypeEffectiveness(cpuCard, adjacentCard);

                            // Strong bonus for having a high stat facing a player threat (using modified stats)
                            let threatBonus = modifiedStats[statIndex] * 3;

                            // Additional bonus if we have type advantage
                            if (hasEffectivenessBonus) {
                                threatBonus += effectivenessBonus * 10;
                            }

                            // Penalty if player has immunity to us (bad positioning)
                            if (isImmune) {
                                threatBonus -= 20;
                            }

                            defensiveScore += threatBonus;
                        }
                    });

                    if (defensiveScore > bestDefensiveScore) {
                        bestDefensiveScore = defensiveScore;
                        bestCellToPlace = cellKey;
                        bestCardToPlay = cpuCard;
                    }
                }
            }

            // Ultimate fallback if somehow still no placement found
            if (!bestCellToPlace) {
                const randomCellIndex = Math.floor(Math.random() * arrayOfCellsToPlace.length);
                bestCellToPlace = arrayOfCellsToPlace[randomCellIndex];
                const randomCardIndex = Math.floor(Math.random() * availableCpuCards.length);
                bestCardToPlay = availableCpuCards[randomCardIndex];
            }
        }

        const cellTarget = bestCellToPlace;
        const attackingCard = bestCardToPlay;

        // Find the original index in cpuHand
        const originalIndex = cpuHand.findIndex(card => card === attackingCard);

        setCpuHand(prev => prev.map((card, index) => index === originalIndex ? null : card));

        const capturedCells = placeAttackingCard(cellTarget, attackingCard);

        // Place the card in the selected cell
        // Force re-render by creating a new cells object so React detects defending card changes
        setCells(prevCells => {
            const newCells = { ...prevCells };
            // Spread all cells AND pokemonCards to trigger re-renders on captured cards
            Object.keys(newCells).forEach(key => {
                if (newCells[key].pokemonCard) {
                    newCells[key] = {
                        ...newCells[key],
                        pokemonCard: {
                            ...newCells[key].pokemonCard,
                            // Update isPlayerCard for captured cards
                            ...(capturedCells[key] !== undefined && { isPlayerCard: capturedCells[key] })
                        }
                    };
                } else {
                    newCells[key] = { ...newCells[key] };
                }
            });
            newCells[cellTarget] = {
                ...prevCells[cellTarget],
                pokemonCard: attackingCard
            };

            return newCells;
        });

        setIsPlayerTurn(true); // end the turn!
    }

    useEffect(() => {
        if (isPlayerTurn || isPlayerTurn === null) {
            return;
        }
        makeCpuMove();
    }, [isPlayerTurn])

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="overflow-hidden relative h-full flex justify-between rounded-xl" >
                <>
                    <div className="relative grid grid-rows-[repeat(5,124px)] place-content-center gap-2 hand-left-container pl-4 pr-8 p-2 h-full">
                        {playerHand.map((pokemonCard, index) => {
                            return (
                                <div className="relative aspect-square" key={index}>
                                    <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-pokedex-inner-blue" />

                                    {pokemonCard && pokeballIsOpen && (
                                        <Card pokemonCard={pokemonCard} index={index} isDraggable={isPlayerTurn} />
                                    )}
                                </div>
                            )
                        })}

                    </div>
                    {/* Arena */}
                    <div className={`grow ${styles.arena} flex items-center justify-center overflow-hidden`}>
                        <div className={styles.wrap}>
                            <div className={styles['top-plane']} />
                            <div className={styles['bottom-plane']} />
                        </div>
                        <Balance score={score} />
                        <Grid cells={cells} ref="grid" isPlayerTurn={isPlayerTurn} hasWonCoinToss={hasWonCoinToss} />
                    </div>
                    <div className="grid grid-rows-[repeat(5,124px)] place-content-center gap-2 hand-right-container pl-8 pr-4 p-2 h-full">
                        {cpuHand.map((pokemonCard, index) => {
                            return (
                                <div className="relative aspect-square" key={index}>
                                    <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-pokedex-inner-red" />

                                    {pokemonCard && pokeballIsOpen && (
                                        <Card pokemonCard={pokemonCard} isPlayerCard={false} index={index} isDraggable={false} startsFlipped={false} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </>
                {hasWonCoinToss !== null && (
                    <Coin hasWonCoinToss={hasWonCoinToss} />
                )}
                <PokeballSplash pokeballIsOpen={pokeballIsOpen} />
                {isGameComplete && <ResultTransition />}
            </div>
        </DndContext>
    )
}