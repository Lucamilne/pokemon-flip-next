import { useMemo } from 'react';
import { createCard, fetchStarterCards } from '@/utils/cardHelpers.js';

export default function useCardLibrary({ userCollection, searchString, sortByStrength }) {
    const playerCardLibrary = useMemo(() => {
        const ownedPokemonNames = Object.keys(userCollection);
        if (ownedPokemonNames.length === 0) return fetchStarterCards(true);

        return ownedPokemonNames.map(name => createCard(name, true)).sort((a, b) => a.id - b.id);
    }, [userCollection]);

    const filteredCards = useMemo(() => {
        const trimmedSearch = searchString.trim().toLowerCase();
        const cards = trimmedSearch
            ? playerCardLibrary.filter(card => card?.name.toLowerCase().includes(trimmedSearch))
            : playerCardLibrary;

        return sortByStrength ? [...cards].sort((a, b) => b.statWeight - a.statWeight) : cards;
    }, [playerCardLibrary, searchString, sortByStrength]);

    return { filteredCards };
}
