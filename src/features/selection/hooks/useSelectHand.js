import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const EMPTY_HAND = [null, null, null, null, null];

export default function useSelectHand({ isMobile, setSelectedPlayerHand }) {
    const playerHandRef = useRef(EMPTY_HAND);
    const [playerHand, setPlayerHand] = useState(EMPTY_HAND);
    const [lastPokemonCardSelected, setLastPokemonCardSelected] = useState(null);
    const { isHandEmpty, isHandFull } = useMemo(() => ({
        isHandEmpty: playerHand.every(card => card === null),
        isHandFull: playerHand.every(card => card !== null)
    }), [playerHand]);

    useEffect(() => {
        playerHandRef.current = playerHand;
        if (isHandEmpty) setLastPokemonCardSelected(null);
        if (isHandFull) setSelectedPlayerHand(playerHand);
    }, [isHandEmpty, isHandFull, playerHand, setSelectedPlayerHand]);

    const selectedCardIds = useMemo(() => new Set(playerHand.filter(Boolean).map(card => card.id)), [playerHand]);

    const togglePokemonCardSelection = useCallback((pokemonCard) => {
        if (!pokemonCard) return false;
        const isCardInHand = playerHandRef.current.some(card => card?.id === pokemonCard.id);

        setPlayerHand(previousHand => {
            const selectedIndex = previousHand.findIndex(card => card?.id === pokemonCard.id);
            if (selectedIndex !== -1) {
                const nextHand = [...previousHand];
                nextHand[selectedIndex] = null;
                return nextHand;
            }
            const emptyIndex = previousHand.findIndex(card => card === null);
            if (emptyIndex === -1) return previousHand;
            const nextHand = [...previousHand];
            nextHand[emptyIndex] = pokemonCard;
            return nextHand;
        });

        setLastPokemonCardSelected(pokemonCard);
        return isMobile && !isCardInHand;
    }, [isMobile]);

    const clearHand = useCallback(() => setPlayerHand(EMPTY_HAND), []);

    return { playerHand, playerHandRef, setPlayerHand, selectedCardIds, lastPokemonCardSelected, setLastPokemonCardSelected, isHandEmpty, isHandFull, togglePokemonCardSelection, clearHand };
}
