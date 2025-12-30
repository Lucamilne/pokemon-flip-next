import gameData from '@/data/game-data.json';

const { abilities } = gameData;

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
    if (!tileElement) return card;

    return {
        ...card,
        stats: card.stats.map(stat => stat < 10 ? stat + 1 : stat)
    };
}

const magicGuard = (card, cellId, gameState) => {
    const tileElement = gameState.cells[cellId].element;
    if (!tileElement) return card;

    return {
        ...card,
        types: [tileElement],
        stats: card.stats.map(stat => stat < 10 ? stat + 1 : stat)
    };
}

const shieldDust = (card, cellId, gameState) => {
    const tileElement = gameState.cells[cellId].element;
    if (!tileElement) return card;

    const updateStatOnElementalTile = (stat) => {
        if (card.types.includes(tileElement) && stat < 10) {
            return stat + 1;
        }

        return stat;
    };

    return {
        ...card,
        stats: card.stats.map(updateStatOnElementalTile)
    };
}

const shellArmor = shieldDust;
const sandVeil = shieldDust;
const clearBody = shieldDust;
const sturdy = shieldDust;

const overgrow = (card, cellId, gameState) => {
    const tileElement = gameState.cells[cellId].element;
    if (!tileElement) return card;

    return {
        ...card,
        stats: card.stats.map(stat => updateStatOnElementalTileByModifier(stat, card.types, tileElement, 2))
    };
}

const evolve = (card, cellId, gameState) => {
    const tileElement = gameState.cells[cellId].element;
    const validElements = ['fire', 'electric', 'water'];

    if (!tileElement || !validElements.includes(tileElement)) return card;

    // Map tile elements to evolution cards
    const evolutionMap = {
        fire: gameData.cards.flareon,
        water: gameData.cards.vaporeon,
        electric: gameData.cards.jolteon
    };

    const evolution = evolutionMap[tileElement];

    return {
        ...card,
        id: evolution.id,
        types: [...evolution.types],
        stats: [...evolution.stats],
    };
}

// "bug",
// "dragon",
// "electric",
// "fairy",
// "fighting",
// "fire",
// "flying",
// "ghost",
// "grass",
// "ground",
// "ice",
// "normal",
// "poison",
// "psychic",
// "rock",
// "water"

const blaze = overgrow; // fire
const torrent = overgrow; // water
const lightningRod = overgrow; // electric
const iceBody = overgrow; // ice
const poisonTouch = overgrow; // poison
const rockHead = overgrow; // rock
const bigPecks = overgrow; // flying

const chlorophyll = (card, cellId, gameState) => {
    const collectiveHand = [...gameState.playerHand, ...gameState.cpuHand];

    // Count type cards in both hands
    const cardTypeCount = collectiveHand.filter(c =>
        c.types.includes(card.types[0])
    ).length - 1;

    if (cardTypeCount < 1) return card;

    // Create a new stats array
    const newStats = [...card.stats];

    // Boost random stats based on type card count
    for (let i = 0; i < cardTypeCount; i++) {
        // Find all stat indices that are below 10
        const availableStatIndices = newStats
            .map((stat, index) => ({ stat, index }))
            .filter(({ stat }) => stat < 10)
            .map(({ index }) => index);

        // If all stats are at 10, stop boosting
        if (availableStatIndices.length === 0) break;

        // Pick a random stat from available indices
        const randomIndex = Math.floor(Math.random() * availableStatIndices.length);
        const statIndexToBoost = availableStatIndices[randomIndex];

        newStats[statIndexToBoost] += 1;
    }

    return {
        ...card,
        stats: newStats
    };
}

// "bug",
// "dragon",
// "electric",
// "fairy",
// "fighting",
// "fire",
// "flying",
// "ghost",
// "grass",
// "ground",
// "ice",
// "normal",
// "poison",
// "psychic",
// "rock",
// "water"

const flashFire = chlorophyll; // fire
const keenEye = chlorophyll; // flying
const rockSlide = chlorophyll; // rock
const swiftSwim = chlorophyll; // water
const staticElectricity = chlorophyll; // electric
const swarm = chlorophyll; // bug
const synchronise = chlorophyll; // psychic

const familyBond = (card, cellId, gameState) => {
    const collectiveHand = [...gameState.playerHand, ...gameState.cpuHand];

    // Count Nido family members in both hands (excluding this card)
    const nidoFamilyCount = collectiveHand.filter(c =>
        c.name.toLowerCase().startsWith('nido')
    ).length - 1;

    if (nidoFamilyCount < 1) return card;

    // Create a new stats array
    const newStats = [...card.stats];

    // Boost random stats based on Nido family count
    for (let i = 0; i < nidoFamilyCount; i++) {
        // Find all stat indices that are below 10
        const availableStatIndices = newStats
            .map((stat, index) => ({ stat, index }))
            .filter(({ stat }) => stat < 10)
            .map(({ index }) => index);

        // If all stats are at 10, stop boosting
        if (availableStatIndices.length === 0) break;

        // Pick a random stat from available indices
        const randomIndex = Math.floor(Math.random() * availableStatIndices.length);
        const statIndexToBoost = availableStatIndices[randomIndex];

        newStats[statIndexToBoost] += 1;
    }

    return {
        ...card,
        stats: newStats
    };
}


const rest = (card, cellId, gameState) => {
    const hasCardsOnGrid = Object.values(gameState.cells).some(cell => cell.pokemonCard);

    // If no cards on grid, do nothing
    if (!hasCardsOnGrid) return card;

    // Only boost if it's the card owner's turn
    if (gameState.isPlayerTurn !== card.isPlayerCard) return card;

    const newStats = [...card.stats];

    // Find all stat indices that are not already at max (10)
    const availableStatIndices = newStats
        .map((stat, index) => ({ stat, index }))
        .filter(({ stat }) => stat < 10)
        .map(({ index }) => index);

    // If all stats are at 10, do nothing
    if (availableStatIndices.length === 0) return card;

    // Pick a random stat from available indices
    const randomIndex = Math.floor(Math.random() * availableStatIndices.length);
    const statIndexToBoost = availableStatIndices[randomIndex];

    newStats[statIndexToBoost] += 1;

    return {
        ...card,
        stats: newStats
    };
};

const harden = rest;

const pressure = (card, cellId, gameState) => {
    const adjacentCellIds = getAdjacentCells(cellId, gameState.cells);

    // Count adjacent cells with any pokemon (friend or foe)
    const occupiedAdjacentCells = adjacentCellIds.filter(adjacentCellId => {
        const adjacentCell = gameState.cells[adjacentCellId];
        return adjacentCell?.pokemonCard;
    }).length;

    // If no adjacent cards, return card unchanged
    if (occupiedAdjacentCells === 0) return card;

    // Create a new stats array
    const newStats = [...card.stats];

    // Boost random stats based on occupied cell count
    for (let i = 0; i < occupiedAdjacentCells; i++) {
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
};

const magnetPull = pressure;

const selfDestruct = (card, cellId, gameState) => {
    return {
        ...card,
        stats: [1, 1, 1, 1]
    };
}

const desperation = (card, cellId, gameState) => {
    const emptySpaces = Object.values(gameState.cells)
        .filter(cell => cell.pokemonCard === null).length;

    if (emptySpaces > 3) return card;

    const gridCards = Object.values(gameState.cells)
        .map(cell => cell.pokemonCard)
        .filter(c => c !== null);

    const playerCards = gridCards.filter(c => c.isPlayerCard).length;
    const cpuCards = gridCards.filter(c => !c.isPlayerCard).length;

    // Check if losing
    const isLosing = card.isPlayerCard
        ? cpuCards > playerCards
        : playerCards > cpuCards;

    // Transform only if losing in late game
    if (isLosing) {
        const gyarados = gameData.cards.gyarados;
        return {
            ...card,
            id: gyarados.id,
            types: [...gyarados.types],
            stats: [...gyarados.stats],
        };
    }

    return card;
};

const lick = (card, cellId, gameState) => {
    const adjacentCellIds = getAdjacentCells(cellId, gameState.cells);

    // Paralyze each adjacent enemy
    adjacentCellIds.forEach(adjacentCellId => {
        const adjacentCell = gameState.cells[adjacentCellId];
        if (adjacentCell?.pokemonCard && adjacentCell.pokemonCard.isPlayerCard !== card.isPlayerCard) {
            // Paralyze: set one random stat to 1
            const randomStatIndex = Math.floor(Math.random() * 4);

            // Create new array with paralyzed stat
            adjacentCell.pokemonCard.stats = adjacentCell.pokemonCard.stats.map((stat, index) =>
                index === randomStatIndex ? 1 : stat
            );
        }
    });

    return card;
};

const guts = (card, cellId, gameState) => {
    const adjacentCellIds = getAdjacentCells(cellId, gameState.cells);

    // Count adjacent enemy cards
    const enemyCount = adjacentCellIds.filter(adjacentCellId => {
        const adjacentCell = gameState.cells[adjacentCellId];
        return adjacentCell?.pokemonCard && adjacentCell.pokemonCard.isPlayerCard !== card.isPlayerCard;
    }).length;

    // Only boost if 2 or more enemies are adjacent
    if (enemyCount < 2) return card;

    // Boost all stats by +1, capped at 10
    return {
        ...card,
        stats: card.stats.map(stat => stat < 10 ? stat + 1 : 10)
    };
};

const lonely = (card, cellId, gameState) => {
    const adjacentCellIds = getAdjacentCells(cellId, gameState.cells);

    // Check if any adjacent cells have pokemon cards
    const hasAdjacentCards = adjacentCellIds.some(adjacentCellId => {
        const adjacentCell = gameState.cells[adjacentCellId];
        return adjacentCell?.pokemonCard;
    });

    // Only boost if no adjacent cards exist
    if (hasAdjacentCards) return card;

    // Boost all stats by +1, capped at 10
    return {
        ...card,
        stats: card.stats.map(stat => stat < 10 ? stat + 1 : 10)
    };
};

const dig = lonely;

const download = (card, cellId, gameState) => {
    const adjacentCellIds = getAdjacentCells(cellId, gameState.cells);
    const adjacentCard = findStrongestAdjacentCard(adjacentCellIds, gameState.cells);

    if (adjacentCard) {
        // Copy stats from adjacent card
        card.stats = [...adjacentCard.stats];
        card.types = [...adjacentCard.types];
    }

    return card;
};


const pickup = (card, cellId, gameState) => {
    const adjacentCellIds = getAdjacentCells(cellId, gameState.cells);

    // Count empty adjacent cells
    const emptyAdjacentCells = adjacentCellIds.filter(adjacentCellId => {
        const adjacentCell = gameState.cells[adjacentCellId];
        return !adjacentCell?.pokemonCard;
    }).length;

    // If no empty cells, return card unchanged
    if (emptyAdjacentCells === 0) return card;

    // Create a new stats array
    const newStats = [...card.stats];

    // Boost random stats based on empty cell count
    for (let i = 0; i < emptyAdjacentCells; i++) {
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
};

export const abilityHandlers = {
    bigPecks,
    blaze,
    chlorophyll,
    clearBody,
    desperation,
    dig,
    download,
    evolve,
    familyBond,
    flashFire,
    guts,
    harden,
    iceBody,
    keenEye,
    lick,
    lightningRod,
    lonely,
    magnetPull,
    magicGuard,
    oblivious,
    overgrow,
    pickup,
    pressure,
    rest,
    rockHead,
    rockSlide,
    sandVeil,
    selfDestruct,
    shellArmor,
    shieldDust,
    staticElectricity,
    sturdy,
    swarm,
    swiftSwim,
    synchronise,
    torrent,
    transform,
};

/**
 * @param {Object} gameState - Current game state { cells, playerHand, cpuHand }
 */
export const triggerAbilities = (card, trigger, cellId, gameState) => {
    if (!card.ability) return card;

    let modifiedCard = { ...card };

    if (abilities[card.ability]?.trigger === trigger && abilityHandlers[card.ability]) {
        modifiedCard = abilityHandlers[card.ability](modifiedCard, cellId, gameState);
    }

    return modifiedCard;
};