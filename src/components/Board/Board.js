"use client"

import { useState, useEffect } from 'react'
import Grid from "../Grid/Grid.js";
import Card from "../Card/Card.js";
import { DndContext } from '@dnd-kit/core';
import PokeballSplash from "../PokeballSplash/PokeballSplash.js";
import { allocateRandomCpuCards, allocateStarterDeck } from "@/utils/cardHelpers.js";

export default function Board() {
    const [cpuHand, setCpuHand] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [pokeballIsOpen, setPokeballIsOpen] = useState(false);

    const [cells, setCells] = useState({
        A1: {
            pokemonCard: null,
            element: null,
            adjacentCells: [null, null, "A2", "B1"],
        },
        A2: {
            pokemonCard: null,
            element: null,
            adjacentCells: ["A1", null, "A3", "B2"],
        },
        A3: {
            pokemonCard: null,
            element: null,
            adjacentCells: ["A2", null, null, "B3"],
        },
        B1: {
            pokemonCard: null,
            element: null,
            adjacentCells: [null, "A1", "B2", "C1"],
        },
        B2: {
            pokemonCard: null,
            element: null,
            adjacentCells: ["B1", "A2", "B3", "C2"],
        },
        B3: {
            pokemonCard: null,
            element: null,
            adjacentCells: ["B2", "A3", null, "C3"],
        },
        C1: {
            pokemonCard: null,
            element: null,
            adjacentCells: [null, "B1", "C2", null],
        },
        C2: {
            pokemonCard: null,
            element: null,
            adjacentCells: ["C1", "B2", "C3", null],
        },
        C3: {
            pokemonCard: null,
            element: null,
            adjacentCells: ["C2", "B3", null, null],
        },
    });

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
        if (!pokeballIsOpen) setPokeballIsOpen(true);

        // Allocate hands
        const newCpuHand = allocateRandomCpuCards();
        const newPlayerHand = allocateStarterDeck();

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
            if (tilesPlaced < maxTiles && Math.random() < 0.15 && availableTypes.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableTypes.length);
                const randomElement = availableTypes[randomIndex];
                updatedCells[cell] = { ...updatedCells[cell], element: randomElement };
                availableTypes.splice(randomIndex, 1); // Remove the used element from available pool
                tilesPlaced++;
            }
        });

        // Set all state at once
        setCpuHand(newCpuHand);
        setPlayerHand(newPlayerHand);
        setCells(updatedCells);
    }, []);

    const applyTileStatModifiers = (attackingCard, cellTargetObject) => {
        if (attackingCard.types.some((type) => type === "normal")) {
            return attackingCard.stats; // normal pokemon are not affected by elemental tiles
        }

        const updateStatOnElementalTile = (stat) => {
            if (attackingCard.types.includes(cellTargetObject.element) && stat < 10) {
                // stat cannot be increased above 10
                return stat + 1;
            } else if (cellTargetObject.element && stat > 1) {
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

        // apply attack logic against adjacent cards
        cellTargetObject.adjacentCells.forEach((adjacentCellKey, statIndex) => {
            if (!adjacentCellKey || !cells[adjacentCellKey].pokemonCard) return; // No adjacent cell or no adjacent defending card present

            const defendingCard = cells[adjacentCellKey].pokemonCard;
            const defendingStatIndex = cells[adjacentCellKey].adjacentCells.indexOf(cellTarget); // index of the attacking cell in the defending cell's adjacentCells
            const defendingStat = defendingCard.stats[defendingStatIndex];
            const attackingStat = attackingCard.stats[statIndex];

            // check if attackingCard and defendingCard belong to different players
            if (
                attackingStat > defendingStat &&
                defendingCard.isPlayerCard !== attackingCard.isPlayerCard
            ) {
                defendingCard.isPlayerCard = attackingCard.isPlayerCard; // capture the defending card
            }
        });
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function handleDragEnd(event) {
        const { active, over } = event;
        if (!over) return; // Dropped outside a droppable area

        let cellTarget = over.id; // e.g. A1

        let attackingCard = active.data.current.pokemonCard;

        const sourceIndex = active.data.current.index;
        // Remove card from the player hand
        setPlayerHand(prev => prev.map((card, index) => index === sourceIndex ? null : card));

        placeAttackingCard(cellTarget, attackingCard)

        // Update cells to identify where the card is placed (logic handled in the-grid.js)
        setCells(prev => ({
            ...prev,
            [cellTarget]: {
                ...prev[cellTarget],
                pokemonCard: attackingCard
            }
        }));

        // end the turn!
        setIsPlayerTurn(false)
    }

    // Helper to calculate what a card's stats would be after elemental tile modifiers
    const calculateModifiedStats = (card, cellKey) => {
        const cellData = cells[cellKey];

        // No element on this tile - return original stats
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
                return stat + 1; // Boost if card type matches tile element
            } else if (cellData.element && stat > 1) {
                return stat - 1; // Debuff if card doesn't match
            }
            return stat;
        });
    };

    const makeCpuMove = async () => {
        await sleep(500 + Math.random() * 500);

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

        if (arrayOfCellsToPlace.length === 0 || availableCpuCards.length === 0) {
            // end game here todo
            return;
        }

        const validPlacementsSet = new Set(arrayOfCellsToPlace);

        let arrayOfCellsToPlaceToAttack = [...new Set(
            arrayOfPlayerOccupiedCells.flatMap(playerOccupiedCell =>
                cells[playerOccupiedCell].adjacentCells.filter(adjacentCell =>
                    adjacentCell !== null && validPlacementsSet.has(adjacentCell)
                )
            )
        )];

        // Analyze each potential placement cell
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

                for (const { statIndex, defendingStat } of analysis.exposedDefendingStats) {
                    if (modifiedStats[statIndex] > defendingStat) {
                        captureCount++;
                    }
                }

                // Update best move if this scores higher
                if (captureCount > bestScore) {
                    bestScore = captureCount;
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
                            // Strong bonus for having a high stat facing a player threat (using modified stats)
                            defensiveScore += modifiedStats[statIndex] * 3;
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

        placeAttackingCard(cellTarget, attackingCard);

        // Place the card in the selected cell
        setCells(prevCells => ({
            ...prevCells,
            [cellTarget]: {
                ...prevCells[cellTarget],
                pokemonCard: attackingCard
            }
        }));

        setIsPlayerTurn(true); // end the turn!
    }

    useEffect(() => {
        if (isPlayerTurn) return;

        makeCpuMove();
    }, [isPlayerTurn])

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="overflow-hidden relative h-full flex flex-col gap-3 bg-neutral-400 rounded-xl" >
                    <>
                        <div className="grid grid-cols-[repeat(5,124px)] lg:grid-cols-[repeat(5,174px)] items-center gap-4 hand-top-container pb-8 p-4 w-full justify-center">
                            {cpuHand.map((pokemonCard, index) => {
                                return (
                                    <div className="relative aspect-square" key={index}>
                                        <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-pokedex-inner-red" />

                                        {pokemonCard && pokeballIsOpen && (
                                            <Card pokemonCard={pokemonCard} isPlayerCard={false} index={index} isDraggable={!isPlayerTurn} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="relative arena-backdrop flex items-center justify-center">
                            <Grid cells={cells} ref="grid" />
                        </div>
                        <div className="grid grid-cols-[repeat(5,124px)] lg:grid-cols-[repeat(5,174px)] items-center gap-4 hand-bottom-container pt-8 p-4 w-full justify-center">
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
                    </>
                <PokeballSplash pokeballIsOpen={pokeballIsOpen} setPokeballIsOpen={setPokeballIsOpen} />
            </div>
        </DndContext>
    )
}