import { useState, useEffect } from 'react';
import { fetchStarterCards, fetchAllCards } from '@/utils/cardHelpers.js';
import PokeballSplash from "../PokeballSplash/PokeballSplash.js";
import Card from "../Card/Card.js";
import styles from './retro.module.css';

export default function Select() {
    const [playerHand, setPlayerHand] = useState([null, null, null, null, null]);
    const [pokeballIsOpen, setPokeballIsOpen] = useState(false);
    const [searchString, setSearchString] = useState('')

    // const playerCardLibrary = fetchStarterCards(); // todo expand to user library
    const playerCardLibrary = fetchAllCards();

    useEffect(() => {
        if (!pokeballIsOpen) setPokeballIsOpen(true);
    }, [])

    const helperText = "Choose your hand!"

    return (
        <div className="overflow-hidden relative h-full flex flex-col bg-neutral-400 rounded-xl" >
            <div className="px-7 pt-4 pb-6 flex justify-between items-center hand-top-container">
                <h1 className="header-text text-2xl">Your Pokémon cards</h1>
                <input type="text" id="search" className={styles['snes-input']} placeholder='Search Cards' value={searchString}
                    onChange={(e) => setSearchString(e.target.value)} />
            </div>
            <div className='relative default-tile text-hop text-shadow-sm/30 px-8 py-4 border-b-8 border-black text-2xl font-press-start text-center'>
                {helperText.split('').map((char, index) => (<span key={index} style={{
                    animationDelay: `${(index + 1) * 50}ms`
                }}>{char}</span>))}
                {/* <button className='absolute text-black/60 hover:text-black right-2 cursor-pointer p-2 top-1/2 -translate-y-1/2'>X</button> */}
            </div>
            <div className="grow arena-backdrop overflow-y-auto p-8 bg-white">
                <div>
                </div>
                <div className="grid grid-cols-[repeat(5,124px)] lg:grid-cols-[repeat(5,174px)] items-center gap-4 w-full justify-center">
                    {playerCardLibrary
                        .filter(pokemonCard =>
                            pokemonCard.name.toLowerCase().startsWith(searchString.toLowerCase())
                        )
                        .map((pokemonCard, index) => {
                            return (
                                <div className="relative aspect-square" key={index}>
                                    <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-black/15" />

                                    {pokemonCard && pokeballIsOpen && (
                                        <Card pokemonCard={pokemonCard} index={index} isDraggable={true} isPlacedInGrid={true} />
                                    )}
                                </div>
                            )
                        })}
                </div>
            </div>
            <div className="grid grid-cols-[repeat(5,124px)] lg:grid-cols-[repeat(5,174px)] items-center gap-4 hand-bottom-container pt-8 p-4 w-full justify-center">
                {playerHand.map((pokemonCard, index) => {
                    return (
                        <div className="relative aspect-square" key={index}>
                            <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-pokedex-inner-blue" />

                            {pokemonCard && pokeballIsOpen && (
                                <Card pokemonCard={pokemonCard} index={index} isDraggable={true} />
                            )}
                        </div>
                    )
                })}
            </div>
            <PokeballSplash pokeballIsOpen={pokeballIsOpen} setPokeballIsOpen={setPokeballIsOpen} />
        </div>
    )
}