import { useState, useEffect } from 'react';
import { fetchStarterCards, fetchAllCards } from '@/utils/cardHelpers.js';
import PokeballSplash from "../PokeballSplash/PokeballSplash.js";
import Card from "../Card/Card.js";
import Help from "../Help/Help.js";
import styles from './retro.module.css';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/contexts/GameContext';

export default function Select() {
    const [playerHand, setPlayerHand] = useState([null, null, null, null, null]);
    const [playerCardLibrary, setPlayerCardLibrary] =
        useState(() => fetchStarterCards());
    const [pokeballIsOpen, setPokeballIsOpen] = useState(false);
    const [searchString, setSearchString] = useState('');
    const { setSelectedPlayerHand } = useGameContext();
    const router = useRouter();

    useEffect(() => {
        if (!pokeballIsOpen) setPokeballIsOpen(true);
    }, [])

    useEffect(() => {
        if (playerHand.every(card => card !== null)) {
            setSelectedPlayerHand(playerHand);
            setPokeballIsOpen(false);
        }
    }, [playerHand])

    const helperText = "Choose your hand!"

    const togglePokemonCardSelection = (pokemonCard) => {
        if (!pokemonCard) return;

        // Check if card is already in hand
        const cardIndex = playerHand.findIndex(card => card?.id === pokemonCard.id);

        if (cardIndex !== -1) {
            // Card is in hand, unselect it
            setPlayerHand(prev => {
                const newHand = [...prev];
                newHand[cardIndex] = null;
                return newHand;
            });
            return;
        }

        // Card not in hand, add it to first available slot
        setPlayerHand(prev => {
            const firstNullIndex = prev.findIndex(card =>
                card === null);
            if (firstNullIndex === -1) return prev; // Hand is full

            const newHand = [...prev];
            newHand[firstNullIndex] = pokemonCard;
            return newHand;
        });

        setSearchString("");
    }

    return (
        <div className="overflow-hidden relative h-full flex flex-col rounded-xl" >
            <div className="px-7 pt-4 pb-6 flex justify-between items-center hand-top-container">
                <h1 className="header-text text-2xl text-hop">
                    {helperText.split('').map((char, index) => (<span key={index} style={{
                        animationDelay: `${(index + 1) * 50}ms`
                    }}>{char}</span>))}

                </h1>
                <div className="relative font-press-start">
                    <input type="text" id="search" className={`${styles['snes-input']}`} placeholder='Search Cards' value={searchString}
                        onChange={(e) => setSearchString(e.target.value)} maxLength={18} />
                    {searchString !== "" && (
                        <button
                            onClick={() => setSearchString('')}
                            className="px-1 cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900 text-lg leading-none"
                            aria-label="Clear search"
                        >
                            X
                        </button>
                    )}
                </div>
            </div>
            <div className={`relative grow arena-backdrop p-8 ${styles['hide-scrollbar']} overflow-y-auto overflow-x-hidden`}>
                <div className="grid grid-cols-[repeat(4,124px)] lg:grid-cols-[repeat(4,174px)] items-center gap-4 justify-center">
                    {playerCardLibrary
                        .filter(pokemonCard => {
                            const trimmedSearch = searchString.trim();
                            if (pokemonCard === null) return trimmedSearch === '';
                            return pokemonCard.name.toLowerCase().startsWith(trimmedSearch.toLowerCase())
                        }
                        )
                        .map((pokemonCard, index) => {
                            const isInHand = pokemonCard && playerHand.some(card => card?.id === pokemonCard.id);
                            return (
                                <button
                                    className={`relative rounded-md aspect-square transition-transform ${isInHand ? 'ring-6 scale-105 ring-black' : ''}`}
                                    key={index}
                                    onClick={() => togglePokemonCardSelection(pokemonCard)}
                                >
                                    {pokemonCard && (
                                        <Card pokemonCard={pokemonCard} index={index} isDraggable={true} isPlacedInGrid={true} />
                                    )}
                                </button>
                            )
                        })}
                </div>
            </div>
            <div className="relative grid grid-cols-[repeat(5,124px)] lg:grid-cols-[repeat(5,174px)] items-center gap-4 hand-bottom-container pt-8 p-4 w-full justify-center">
                {playerHand.map((pokemonCard, index) => {
                    return (
                        <button className={`relative aspect-square ${pokemonCard ? "cursor-pointer" : ""}`} key={index} onClick={() => togglePokemonCardSelection(pokemonCard)}>
                            <div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-pokedex-inner-blue flex justify-center items-center">
                                <span className='header-text text-2xl'>{index + 1}</span>
                            </div>

                            {pokemonCard && (
                                <Card pokemonCard={pokemonCard} index={index} isDraggable={false} isPlacedInGrid={true} />
                            )}
                        </button>
                    )
                })}
                {playerHand.every(card => card === null) && (
                    <Help customClass="!absolute !-top-16 !right-4" text="Add cards to your hand!" />
                )}
            </div>
            <PokeballSplash pokeballIsOpen={pokeballIsOpen} href="/play" />
        </div>
    )
}