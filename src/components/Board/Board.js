"use client"

import pokemon from "@/data/game-data.json";
import { useState, useEffect } from 'react'
import Grid from "../Grid/Grid.js";
import Card from "../Card/Card.js";
import { DndContext } from '@dnd-kit/core';

export default function Board() {
    const [cpuHand, setCpuHand] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
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

    const createCard = (pokemonName, isPlayerCard = false) => {
        return {
            name: pokemonName,
            types: pokemon.cards[pokemonName].types,
            id: pokemon.cards[pokemonName].id,
            stats: pokemon.cards[pokemonName].stats,
            originalStats: pokemon.cards[pokemonName].originalStats, // A copy of stats is kept to track modifications
            rarity: pokemon.cards[pokemonName].rarity,
            playerOwned: pokemon.cards[pokemonName].starter, // this is an unimplemented feature as of writing
            isPlayerCard: isPlayerCard
        };
    };

    const allocateRandomCpuCards = () => {
        const shuffledArray = Object.keys(pokemon.cards).sort(() => Math.random() - 0.5);

        setCpuHand(shuffledArray.slice(0, 5).map((el) => createCard(el)));
    }

    const allocateStarterDeck = () => {
        const starterPokemon = Object.keys(pokemon.cards).filter((pokemonName) => pokemon.cards[pokemonName].starter);
        setPlayerHand(starterPokemon.map((el) => createCard(el, true)));
    }

    const setRandomElementalTiles = () => {
        const gridCells = Object.keys(cells);
        const arrayOfPokemonTypes = pokemon.types.filter((type) => type !== "normal");

        gridCells.forEach((cell) => {
            if (Math.random() < 0.15 && arrayOfPokemonTypes.length > 0) {
                const randomIndex = Math.floor(Math.random() * arrayOfPokemonTypes.length);
                const randomElement = arrayOfPokemonTypes[randomIndex];
                cells[cell].element = randomElement;
                arrayOfPokemonTypes.splice(randomIndex, 1); // Remove the element at the randomIndex
            }
        });
    };

    //on mount
    useEffect(() => {
        allocateStarterDeck(); // if a user is new, todo
        allocateRandomCpuCards();
        setRandomElementalTiles();
    }, []);

    const applyTileStatModifiers = (attackingCard, cellTargetObject) => {
        if (attackingCard.types.some((type) => type === "normal")) {
            return; // normal pokemon are not affected by elemental tiles
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

    const attack = (cellTarget, attackingCard) => {
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

    function handleDragEnd(event) {
        const { active, over } = event;
        if (!over) return; // Dropped outside a droppable area

        let cellTarget = over.id; // e.g. A1

        let attackingCard = active.data.current.pokemonCard;

        const sourceIndex = active.data.current.index;
        // Remove card from the player hand
        setPlayerHand(prev => prev.map((card, index) => index === sourceIndex ? null : card));

        attack(cellTarget, attackingCard)

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

    // CPU scripting
    useEffect(() => {
        if (isPlayerTurn) return;

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
            // end game here
            return;
        }

        // Randomly select a cell to place a card
        const randomCellIndex = Math.floor(Math.random() * arrayOfCellsToPlace.length);
        const cellTarget = arrayOfCellsToPlace[randomCellIndex];

        const randomCardIndex = Math.floor(Math.random() * availableCpuCards.length);
        const attackingCard = availableCpuCards[randomCardIndex];

        // Find the original index in cpuHand
        const originalIndex = cpuHand.findIndex(card => card === attackingCard);

        setCpuHand(prev => prev.map((card, index) => index === originalIndex ? null : card));

        attack(cellTarget, attackingCard);

        // Place the card in the selected cell
        setCells(prevCells => ({
            ...prevCells,
            [cellTarget]: {
                ...prevCells[cellTarget],
                pokemonCard: attackingCard
            }
        }));

        setIsPlayerTurn(true); // end the turn!

        // consider placement of elemental tiles
        // scan CPU hand, adjust weighting
        // identify direction which CPU is strongest
        // scan opponent hand, adjust weighting
        // identify direction which player is weakest
        // identify players weakest exposed stats, adjust weighting
        // placing in the center (cell B2) on turn 1 should be disabled
        // check if it's possible to take two cards
        // if none of the above, act defensive



    }, [isPlayerTurn])

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <section className="h-full flex flex-col gap-4 bg-neutral-400 rounded-xl" >
                <div className="grid grid-cols-[repeat(3,124px)] sm:grid-cols-[repeat(5,158px)] items-center gap-4 hand-top-container pb-8 p-4 w-full justify-center">
                    {cpuHand.map((pokemonCard, index) => {
                        return (
                            <div className="relative aspect-square" key={index}>
                                <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-theme-red-100" />

                                {pokemonCard && (
                                    <Card pokemonCard={pokemonCard} isPlayerCard={false} index={index} isDraggable={!isPlayerTurn} />
                                )}
                            </div>
                        )
                    })}
                </div>
                <div className="relative arena-backdrop grow flex items-center justify-center">
                    <Grid cells={cells} ref="grid" />
                </div>
                <div className="grid grid-cols-[repeat(3,124px)] sm:grid-cols-[repeat(5,158px)] items-center gap-4 hand-bottom-container pt-8 p-4 w-full justify-center">
                    {playerHand.map((pokemonCard, index) => {
                        return (
                            <div className="relative aspect-square" key={index}>
                                <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-theme-red-100" />

                                {pokemonCard && (
                                    <Card pokemonCard={pokemonCard} index={index} isDraggable={isPlayerTurn} />
                                )}
                            </div>
                        )
                    })}
                </div>
                {/* <Reveal /> */}
            </section >
        </DndContext>
    )
}