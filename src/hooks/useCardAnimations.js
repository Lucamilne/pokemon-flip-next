import { useState, useEffect, useRef } from 'react';
import { sumUpNumbersInArray } from '@/utils/cardHelpers';

export function useCardAnimations(cardRef, pokemonCard, isPlacedInGrid, snapshot) {
    const prevIsPlayerCard = useRef();
    const prevStats = useRef();

    const [showOverlay, setShowOverlay] = useState(false);
    const [statDelta, setStatDelta] = useState(null);

    const handleStatChange = (delta) => {
        setStatDelta(delta);
        setTimeout(() => setStatDelta(null), 1000);
    };

    const weakenCard = () => {
        const animClass = 'shake-vertical';
        return new Promise((resolve) => {
            if (cardRef.current && !cardRef.current.classList.contains(animClass)) {
                cardRef.current.classList.remove('slide-in-blurred-top');
                cardRef.current.classList.add(animClass);
                setTimeout(() => {
                    cardRef.current?.classList.remove(animClass);
                    resolve();
                }, 600);
            } else {
                resolve();
            }
        });
    };

    const strengthenCard = () => {
        const animClass = 'jello-horizontal';
        return new Promise((resolve) => {
            if (cardRef.current && !cardRef.current.classList.contains(animClass)) {
                cardRef.current.classList.remove('slide-in-blurred-top');
                cardRef.current.classList.add(animClass);
                setTimeout(() => {
                    cardRef.current?.classList.remove(animClass);
                    resolve();
                }, 500);
            } else {
                resolve();
            }
        });
    };

    const presentCard = () => {
        const animClass = 'pulsate-fwd';
        return new Promise((resolve) => {
            if (cardRef.current && !cardRef.current.classList.contains(animClass)) {
                cardRef.current.classList.remove('slide-in-blurred-top');
                cardRef.current.classList.add(animClass);
                setTimeout(() => {
                    cardRef.current?.classList.remove(animClass);
                    resolve();
                }, 500);
            } else {
                resolve();
            }
        });
    };

    const dropCard = () => {
        return new Promise((resolve) => {
            if (cardRef.current) {
                cardRef.current.classList.add('slide-in-blurred-top');
                setTimeout(resolve, 400);
            } else {
                resolve();
            }
        });
    };

    const defeatCard = () => {
        return new Promise((resolve) => {
            if (cardRef.current) {
                cardRef.current.classList.remove('slide-in-blurred-top');
                cardRef.current.offsetHeight; // force reflow
                requestAnimationFrame(() => {
                    cardRef.current.classList.add('rotate-vert-center', 'z-50');
                    setTimeout(() => {
                        cardRef.current.classList.remove('rotate-vert-center', 'z-50');
                        resolve();
                    }, 400);
                });
            } else {
                resolve();
            }
        });
    };

    const runStatAnimations = async (prevStatsArray) => {
        const statsToCompare = sumUpNumbersInArray(prevStatsArray || pokemonCard.originalStats);
        const totalStats = sumUpNumbersInArray(pokemonCard.stats);

        if (totalStats < statsToCompare) {
            await weakenCard();
        } else if (totalStats > statsToCompare) {
            await strengthenCard();
        } else {
            await presentCard();
        }
    };

    const runPlacementAnimations = async () => {
        if (!pokemonCard.isPlayerCard) {
            await dropCard();
        }

        if (pokemonCard.wasSuperEffective) {
            setShowOverlay(true);
            setTimeout(() => setShowOverlay(false), 400);
        }

        if (pokemonCard.wasNoEffect) {
            setShowOverlay(true);
            setTimeout(() => setShowOverlay(false), 400);
        }

        runStatAnimations(pokemonCard.originalStats);
    };

    useEffect(() => {
        if (isPlacedInGrid && !snapshot) {
            runPlacementAnimations();
        }
    }, [isPlacedInGrid]);

    useEffect(() => {
        const prevStatsSnapshot = prevStats.current ? [...prevStats.current] : undefined;
        const prevOwnerSnapshot = prevIsPlayerCard.current;

        prevIsPlayerCard.current = pokemonCard.isPlayerCard;
        prevStats.current = [...pokemonCard.stats];

        if (!snapshot) {
            const runAnimations = async () => {
                const ownershipChanged = prevOwnerSnapshot !== undefined &&
                    prevOwnerSnapshot !== pokemonCard.isPlayerCard;

                if (ownershipChanged && isPlacedInGrid) {
                    await defeatCard();
                }

                if (isPlacedInGrid && prevStatsSnapshot !== undefined) {
                    const statsChanged = prevStatsSnapshot.some((stat, i) => stat !== pokemonCard.stats[i]);
                    if (statsChanged) {
                        await runStatAnimations(prevStatsSnapshot);
                    }
                }
            };

            runAnimations();
        }
    }, [pokemonCard.isPlayerCard, pokemonCard.stats]);

    return { statDelta, showOverlay, handleStatChange };
}
