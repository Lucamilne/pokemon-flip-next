"use client"

import pokemon from "@/lib/pokemon-species.js";
import { useState, useEffect, useMemo } from 'react'
import Grid from "./the-grid.js";
import Card from "./card.js";

export default function TheBoard() {
    const [cardsToDeal, setCardsToDeal] = useState([]);
    const [cellsOccupied, setCellsOccupied] = useState(0);
    const statModifier = 20;

    let cells = {
        A1: {
            class: "border-r-0 border-b-0",
            pokemonCardRef: null,
            element: null,
            adjacentCells: [null, null, "A2", "B1"],
        },
        A2: {
            class: "border-r-0 border-b-0",
            pokemonCardRef: null,
            element: null,
            adjacentCells: ["A1", null, "A3", "B2"],
        },
        A3: {
            class: "border-b-0",
            pokemonCardRef: null,
            element: null,
            adjacentCells: ["A2", null, null, "B3"],
        },
        B1: {
            class: "border-b-0 border-r-0",
            pokemonCardRef: null,
            element: null,
            adjacentCells: [null, "A1", "B2", "C1"],
        },
        B2: {
            class: "border-b-0 border-r-0",
            pokemonCardRef: null,
            element: null,
            adjacentCells: ["B1", "A2", "B3", "C2"],
        },
        B3: {
            class: "border-b-0",
            pokemonCardRef: null,
            element: null,
            adjacentCells: ["B2", "A3", null, "C3"],
        },
        C1: {
            class: "border-r-0",
            pokemonCardRef: null,
            element: null,
            adjacentCells: [null, "B1", "C2", null],
        },
        C2: {
            class: "border-r-0",
            pokemonCardRef: null,
            element: null,
            adjacentCells: ["C1", "B2", "C3", null],
        },
        C3: {
            class: "",
            pokemonCardRef: null,
            element: null,
            adjacentCells: ["C2", "B3", null, null],
        },
    };

    const decrementRandomStat = (stats) => {
        const randomIndex = Math.floor(Math.random() * stats.length);

        if (stats[randomIndex] > 1) {
            stats[randomIndex] -= 1;
        } else {
            // If it's 1 or less, recursively call the function again
            decrementRandomStat(stats);
        }
    };

    const allocateStatsByPokemon = (pokemonName) => {
        const currentPokemon = pokemon.data[pokemonName];
        let statSum = Math.round(currentPokemon.stats / statModifier);
        let statsToReturn = [10, 10, 10, 10];

        let numberOfIterations =
            statsToReturn.reduce((total, value) => total + value, 0) - statSum;

        for (let i = 0; i < numberOfIterations; i++) {
            decrementRandomStat(statsToReturn);
        }

        return statsToReturn;
    };

    const setRandomCards = () => {
        const shuffledArray = Object.keys(pokemon.data).sort(() => Math.random() - 0.5);

        const createCard = (pokemonName) => {
            const stats = allocateStatsByPokemon(pokemonName);
            const statsSum = stats.reduce((acc, cur) => acc + cur, 0);
            let rarity = 'common';

            if (statsSum >= 30) {
                rarity = 'legendary';
            } else if (statsSum >= 26) {
                rarity = 'epic';
            } else if (statsSum >= 22) {
                rarity = 'rare';
            } else if (statsSum >= 18) {
                rarity = 'uncommon';
            }

            return {
                name: pokemonName,
                types: pokemon.data[pokemonName].types,
                id: pokemon.data[pokemonName].id,
                stats: stats,
                originalStats: stats, // A copy of stats is kept to track modifications
                rarity: rarity,
                playerOwned: false // this is an unimplemented feature as of writing
            };
        };

        setCardsToDeal(shuffledArray.slice(0, 10).map(createCard));
    }

    const setRandomElementalTiles = () => {
        const gridCells = Object.keys(cells);
        const arrayOfPokemonTypes = pokemon.types.filter((type) => type !== "normal");

        gridCells.forEach((cell) => {
            if (Math.random() < 0.25 && arrayOfPokemonTypes.length > 0) {
                const randomIndex = Math.floor(Math.random() * arrayOfPokemonTypes.length);
                const randomElement = arrayOfPokemonTypes[randomIndex];
                cells[cell].element = randomElement; // cells may not be reactive
                arrayOfPokemonTypes.splice(randomIndex, 1); // Remove the element at the randomIndex
            }
        });
    };

    const dealCards = useMemo(() => {
        return [cardsToDeal.slice(0, 5), cardsToDeal.slice(5, 10)];
    }, [cardsToDeal]);

    //on mount
    useEffect(() => {
        setRandomCards();
        setRandomElementalTiles();
    }, []);
    // grid grid-rows-[1fr_3fr_1fr]
    return (
        < section className="h-full flex flex-col justify-between gap-8" >
            <div className="grid grid-cols-5 items-center gap-4 bg-black/15 rounded p-4">
                {dealCards[0].map((pokemonCard, index) => (
                    <Card key={index} pokemonCard={pokemonCard} isPlayerCard={true} index={index} />
                ))}
            </div>
            <Grid cells={cells} ref="grid" />
            <div className="grid grid-cols-5 items-center gap-4 bg-black/15 rounded p-4">
                {dealCards[1].map((pokemonCard, index) => (
                    <Card key={index} pokemonCard={pokemonCard} isPlayerCard={false} index={index} />
                ))}
            </div>
            {/* <Reveal /> */}
        </section >
    )
}