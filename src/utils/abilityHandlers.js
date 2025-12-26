const getAdjacentCells = (cellId, cells) => {
    const cell = cells[cellId];
    if (!cell) return [];

    // Filter out null values from the adjacentCells array
    return cell.adjacentCells.filter(adjacentId => adjacentId !== null);
};

const findStrongestAdjacentCard = (adjacentCellIds, cells) => {
    let strongestCard = null;
    let highestStatTotal = 0;

    adjacentCellIds.forEach(cellId => {
        const cell = cells[cellId];
        if (cell?.pokemonCard) {
            const statTotal = cell.pokemonCard.stats.reduce((sum, stat) => sum + stat, 0);
            if (statTotal > highestStatTotal) {
                highestStatTotal = statTotal;
                strongestCard = cell.pokemonCard;
            }
        }
    });

    return strongestCard;
};

/**
 * Ability: Imposter
 * Copies the stats of the strongest adjacent Pokemon when placed on the grid
 */
const imposter = (card, cellId, gameState) => {
    const adjacentCellIds = getAdjacentCells(cellId, gameState.cells);
    const adjacentCard = findStrongestAdjacentCard(adjacentCellIds, gameState.cells);

    if (adjacentCard) {
        // Copy stats from adjacent card
        card.stats = [...adjacentCard.stats];
        card.types = [...adjacentCard.types];
    }

    return card;
};

export const abilityHandlers = {
    imposter
};

/**
 * @param {Object} gameState - Current game state { cells, playerHand, cpuHand }
 */
export const triggerAbilities = (card, trigger, cellId, gameState) => {
    if (!card.ability) return card;

    let modifiedCard = { ...card };

    if (card.ability.trigger === trigger && abilityHandlers[card.ability.name]) {
        modifiedCard = abilityHandlers[card.ability.name](modifiedCard, cellId, gameState);
    }

    return modifiedCard;
};
