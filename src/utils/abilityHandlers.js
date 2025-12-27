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

const updateStatOnElementalTileByModifier = (stat, types, tileElement, modifier = 1) => {
    if (types.includes(tileElement) && stat < 10) {
        // stat cannot be increased above 10
        return stat + modifier;
    } else if (!types.includes(tileElement) && stat > 1) {
        // stat cannot be decreased below 1
        return stat - 1;
    }
    return stat; // No change
};

const transform = (card, cellId, gameState) => {
    const adjacentCellIds = getAdjacentCells(cellId, gameState.cells);
    const adjacentCard = findStrongestAdjacentCard(adjacentCellIds, gameState.cells);

    if (adjacentCard) {
        // Copy stats from adjacent card
        card.stats = [...adjacentCard.stats];
        card.types = [...adjacentCard.types];
        card.id = adjacentCard.id;
    }

    return card;
};

const oblivious = (card, cellId, gameState) => {
    const tileElement = gameState.cells[cellId].element;
    if (!tileElement) return card.stats;

    const updateStatOnElementalTile = (stat) => {
        if (card.types.includes(tileElement) && stat < 10) {
            return stat + 1;
        }

        return stat;
    };

    return card.stats.map(updateStatOnElementalTile);
}

const overgrow = (card, cellId, gameState) => {
    const tileElement = gameState.cells[cellId].element;
    if (!tileElement) return card.stats;

    return card.stats.map(stat => updateStatOnElementalTileByModifier(stat, card.types, tileElement, 2));
}

const blaze = overgrow;
const torrent = overgrow;

const chlorophyll = (card, cellId, gameState) => {
    const collectiveHand = [...gameState.playerHand, ...gameState.cpuHand];

    // Count grass-type cards in both hands
    const cardTypeCount = collectiveHand.filter(c =>
        c.types.includes(card.types[0])
    ).length;

    if (cardTypeCount === 0) return card;

    // Create a new stats array
    const newStats = [...card.stats];

    // Boost random stats based on grass card count
    for (let i = 0; i < cardTypeCount; i++) {
        // Pick a random stat index (0-3)
        const randomStatIndex = Math.floor(Math.random() * newStats.length);

        // Increase by +1, but cap at 10
        if (newStats[randomStatIndex] < 10) {
            newStats[randomStatIndex] += 1;
        }
    }

    return {
        ...card,
        stats: newStats
    };
}

const flashFire = chlorophyll;
const swiftSwim = chlorophyll;

export const abilityHandlers = {
    blaze,
    chlorophyll,
    flashFire,
    oblivious,
    overgrow,
    swiftSwim,
    torrent,
    transform
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
