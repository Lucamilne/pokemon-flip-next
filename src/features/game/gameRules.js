import gameData from '@/data/game-data.json';
import abilities from '@/data/ability-data.json';
import { applySelfAbilities, applyStatusAbilities, statLoweringImmunityAbilities } from '@/utils/abilityHandlers.js';

export function calculateTypeEffectiveness(attackingCard, defendingCard) {
    let isImmune = false;

    for (const attackType of attackingCard.types) {
        const matchup = gameData.typeMatchups[attackType];
        for (const defendType of defendingCard.types) {
            if (matchup.immune.includes(defendType)) {
                isImmune = true;
                break;
            }
        }
        if (isImmune) break;
    }

    if (isImmune) return { isImmune: true, effectivenessBonus: 0, hasEffectivenessBonus: false };

    let effectivenessBonus = 0;
    attackingCard.types.forEach(attackType => {
        const matchup = gameData.typeMatchups[attackType];
        defendingCard.types.forEach(defendType => {
            if (matchup.superEffective.includes(defendType)) effectivenessBonus++;
            else if (matchup.notEffective.includes(defendType)) effectivenessBonus--;
        });
    });

    return { isImmune: false, effectivenessBonus, hasEffectivenessBonus: effectivenessBonus > 0 };
}

export function calculateModifiedStats(card, cell) {
    if (!cell.element) return card.stats;

    return card.stats.map(stat => {
        if (card.types.includes(cell.element) && stat < 10) return stat + 1;
        if (stat > 1) return stat - 1;
        return stat;
    });
}

function incrementMatchStat(card, stat) {
    return {
        ...card,
        matchStats: {
            ...card.matchStats,
            [stat]: (card.matchStats?.[stat] ?? 0) + 1
        }
    };
}

function applyTileStatModifiers(attackingCard, cellTarget, cells, playerHand, cpuHand) {
    const targetCell = cells[cellTarget];

    if (attackingCard.ability && abilities[attackingCard.ability]?.trigger === 'onElementalTilePlace') {
        const result = applySelfAbilities(attackingCard, 'onElementalTilePlace', cellTarget, { cells, playerHand, cpuHand });

        if (statLoweringImmunityAbilities.includes(attackingCard.ability)) return result;
        if (!result.stats.every((stat, index) => stat === attackingCard.stats[index])) return result;
    }

    return { ...attackingCard, stats: calculateModifiedStats(attackingCard, targetCell) };
}

/**
 * Resolves all board changes caused by placing one card. It never mutates `cells`.
 */
export function resolveCardPlacement({ cells, attackingCard, cellTarget, playerHand, cpuHand }) {
    let nextCells = applyStatusAbilities(attackingCard, 'onGridPlace', cellTarget, cells);
    const targetCell = nextCells[cellTarget];
    let nextAttackingCard = {
        ...attackingCard,
        matchStats: { ...attackingCard.matchStats },
        wasSuperEffective: false,
        wasNoEffect: false
    };

    if (targetCell.element) {
        nextAttackingCard = applyTileStatModifiers(nextAttackingCard, cellTarget, nextCells, playerHand, cpuHand);
    }

    const capturedCells = {};

    targetCell.adjacentCells.forEach((adjacentCellKey, statIndex) => {
        if (!adjacentCellKey || !nextCells[adjacentCellKey].pokemonCard) return;

        const defendingCell = nextCells[adjacentCellKey];
        let defendingCard = defendingCell.pokemonCard;
        const defendingStatIndex = defendingCell.adjacentCells.indexOf(cellTarget);
        const attackingStat = nextAttackingCard.stats[statIndex];
        const defendingStat = defendingCard.stats[defendingStatIndex];
        const { isImmune, hasEffectivenessBonus } = calculateTypeEffectiveness(nextAttackingCard, defendingCard);
        const isOpponent = defendingCard.isPlayerCard !== nextAttackingCard.isPlayerCard;

        if (isImmune && isOpponent) {
            nextAttackingCard = { ...nextAttackingCard, wasNoEffect: true };
            defendingCard = incrementMatchStat(defendingCard, 'immuneDefenses');
            nextCells = { ...nextCells, [adjacentCellKey]: { ...defendingCell, pokemonCard: defendingCard } };
        }

        if (!isOpponent || isImmune || (attackingStat < defendingStat) || (attackingStat === defendingStat && !hasEffectivenessBonus)) return;

        capturedCells[adjacentCellKey] = nextAttackingCard.isPlayerCard;
        nextAttackingCard = applySelfAbilities(nextAttackingCard, 'onCapture', cellTarget, { cells: nextCells, playerHand, cpuHand });
        nextAttackingCard = incrementMatchStat(nextAttackingCard, 'capturesMade');
        defendingCard = incrementMatchStat(defendingCard, 'timesFlipped');

        if (hasEffectivenessBonus) {
            nextAttackingCard = incrementMatchStat({ ...nextAttackingCard, wasSuperEffective: true }, 'superEffectiveCaptures');
        }

        nextCells = { ...nextCells, [adjacentCellKey]: { ...nextCells[adjacentCellKey], pokemonCard: defendingCard } };
    });

    Object.entries(capturedCells).forEach(([cellKey, isPlayerCard]) => {
        nextCells = {
            ...nextCells,
            [cellKey]: {
                ...nextCells[cellKey],
                pokemonCard: { ...nextCells[cellKey].pokemonCard, isPlayerCard }
            }
        };
    });

    return {
        ...nextCells,
        [cellTarget]: { ...nextCells[cellTarget], pokemonCard: nextAttackingCard }
    };
}
