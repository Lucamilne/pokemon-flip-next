import { useMemo } from 'react';
import abilities from '@/data/ability-data.json';
import { useAuth } from '@/contexts/AuthContext';
import { statLoweringImmunityAbilities } from '@/utils/abilityHandlers';

export default function useCardPresentation(pokemonCard, isUnselected) {
    const { hasCard } = useAuth();
    const bgGradient = useMemo(() => isUnselected
        ? 'bg-gradient-to-b from-neutral-300 to-neutral-500'
        : pokemonCard.isPlayerCard ? 'bg-gradient-to-b from-theme-blue to-theme-blue-100' : 'bg-gradient-to-b from-theme-red to-theme-red-100', [pokemonCard.isPlayerCard, isUnselected]);
    const nameBgStyle = useMemo(() => pokemonCard.types.length === 1
        ? { backgroundColor: `var(--color-${pokemonCard.types[0]}-500)` }
        : { backgroundImage: `linear-gradient(to right, var(--color-${pokemonCard.types[0]}-500) 50%, var(--color-${pokemonCard.types[1]}-500) 50%)` }, [pokemonCard.types]);
    const abilityBgStyle = useMemo(() => ({ backgroundColor: `var(--color-${abilities[pokemonCard.ability]?.type || 'normal'}-500)` }), [pokemonCard.ability]);

    return { bgGradient, nameBgStyle, abilityBgStyle, hasSheenAbility: statLoweringImmunityAbilities.includes(pokemonCard.ability), isOwned: hasCard(pokemonCard.name) || pokemonCard.starter };
}
