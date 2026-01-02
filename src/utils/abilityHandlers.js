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

const oblivious = (card, cellId, gameState) => {
    const tileElement = gameState.cells[cellId].element;
    if (!tileElement) return card;

    return {
        ...card,
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
const sturdy = shieldDust;
const thickFat = shieldDust
const leafGuard = shieldDust;

const statLoweringImmunityAbilities = ["leafGuard", "oblivious", "shieldDust", "shellArmor", "sandVeil", "sturdy", "thickFat"]

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

const clearBody = (card, cellId, gameState) => {
    const tileElement = gameState.cells[cellId].element;
    if (!tileElement) return card;

    return {
        ...card,
        types: [tileElement],
        stats: card.stats.map(stat => stat < 10 ? stat + 1 : stat)
    };
}

const magicGuard = clearBody;

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

const swordsDance = (card, cellId, gameState) => {
    if (cellId !== "B2") return card;

    return {
        ...card,
        stats: card.stats.map(stat => stat < 10 ? stat + 1 : 10)
    };
}

const bonemerang = swordsDance;

const overgrow = (card, cellId, gameState) => {
    const tileElement = gameState.cells[cellId].element;
    if (!tileElement) return card;

    return {
        ...card,
        stats: card.stats.map(stat => updateStatOnElementalTileByModifier(stat, card.types, tileElement, 2))
    };
}

const blaze = overgrow; // fire
const hydroPump = overgrow; // water
const lightningRod = overgrow; // electric
const mist = overgrow; // ice
const acidArmor = overgrow; // poison
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

const flashFire = chlorophyll; // fire
const mirrorMove = chlorophyll; // flying
const rockSlide = chlorophyll; // rock
const torrent = chlorophyll; // water
const staticElectricity = chlorophyll; // electric
const swarm = chlorophyll; // bug
const toxic = chlorophyll; // poison
const synchronise = chlorophyll; // psychic

const ancientPower = (card, cellId, gameState) => {
    const newStats = [...card.stats];

    const availableStatIndices = newStats
        .map((stat, index) => ({ stat, index }))
        .filter(({ stat }) => stat < 10)
        .map(({ index }) => index);

    if (availableStatIndices.length === 0) return card;

    const randomIndex = Math.floor(Math.random() * availableStatIndices.length);
    const statIndexToBoost = availableStatIndices[randomIndex];

    newStats[statIndexToBoost] += 1;

    return {
        ...card,
        stats: newStats
    };
}

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

        // 10% chance to boost by 2, otherwise boost by 1 (never exceed 10)
        const boostAmount = Math.random() < 0.1 ? 2 : 1;
        newStats[statIndexToBoost] = Math.min(10, newStats[statIndexToBoost] + boostAmount);
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
const growth = rest;

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
const cuteCharm = pressure;
const lovelyKiss = pressure;

const parentalBond = (card, cellId, gameState) => {
    const collectiveHand = [...gameState.playerHand, ...gameState.cpuHand];

    // Count cards in both hands with statWeight of 355 or less
    const weakCardCount = collectiveHand.filter(c =>
        c.statWeight <= 355
    ).length;

    // If no weak cards in hands, return unchanged
    if (weakCardCount === 0) return card;

    // Create a new stats array
    const newStats = [...card.stats];

    // Boost random stats based on weak card count
    for (let i = 0; i < weakCardCount; i++) {
        // Find all stat indices that are below 10
        const availableStatIndices = newStats
            .map((stat, index) => ({ stat, index }))
            .filter(({ stat }) => stat < 10)
            .map(({ index }) => index);

        // If all stats are at 10, return the card
        if (availableStatIndices.length === 0) return card;

        // Pick a random stat from available indices
        const randomIndex = Math.floor(Math.random() * availableStatIndices.length);
        const statIndexToBoost = availableStatIndices[randomIndex];

        newStats[statIndexToBoost] += 1;
    }

    return {
        ...card,
        stats: newStats
    };
};

const sing = (card, cellId, cells) => {
    const modifiedCells = { ...cells };

    // Reduce all stats for every pokemon on the grid (friendly and enemy)
    Object.keys(modifiedCells).forEach(currentCellId => {
        const currentCell = modifiedCells[currentCellId];

        if (currentCell?.pokemonCard) {
            // Check if the pokemon has stat-lowering immunity
            if (statLoweringImmunityAbilities.includes(currentCell.pokemonCard.ability)) {
                return;
            }

            // Reduce all stats by 1, minimum 1
            const newStats = currentCell.pokemonCard.stats.map(stat =>
                stat > 1 ? stat - 1 : 1
            );


            modifiedCells[currentCellId] = {
                ...currentCell,
                pokemonCard: {
                    ...currentCell.pokemonCard,
                    stats: newStats
                }
            };
        }
    });

    return modifiedCells;
};

const quickAttack = (card, cellId, gameState) => {
    const otherCardsOnGrid = Object.values(gameState.cells).filter(cell => cell.pokemonCard).length;

    if (otherCardsOnGrid > 0) return card;

    return {
        ...card,
        stats: card.stats.map(stat => stat < 10 ? stat + 1 : 10)
    };
}

const agility = quickAttack;

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

    const allCards = [...gridCards, ...gameState.playerHand, ...gameState.cpuHand];
    const playerCards = allCards.filter(c => c.isPlayerCard).length;
    const cpuCards = allCards.filter(c => !c.isPlayerCard).length;

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

const rage = (card, cellId, gameState) => {
    const gridCards = Object.values(gameState.cells)
        .map(cell => cell.pokemonCard)
        .filter(c => c !== null);

    const allCards = [...gridCards, ...gameState.playerHand, ...gameState.cpuHand];

    const playerCards = allCards.filter(c => c.isPlayerCard).length;
    const cpuCards = allCards.filter(c => !c.isPlayerCard).length;

    // Check if losing by 2 or more cards
    const isLosing = card.isPlayerCard
        ? cpuCards >= playerCards + 2
        : playerCards >= cpuCards + 2;

    if (isLosing) {
        return {
            ...card,
            stats: card.stats.map(stat => stat < 10 ? stat + 1 : 10)
        };
    }

    return card;
};

const lick = (card, cellId, cells) => {
    const modifiedCells = { ...cells };
    const adjacentCellIds = modifiedCells[cellId].adjacentCells;

    adjacentCellIds.forEach(adjacentCellId => {
        if (adjacentCellId === null) return;

        const adjacentCell = modifiedCells[adjacentCellId];

        if (adjacentCell?.pokemonCard && adjacentCell.pokemonCard.isPlayerCard !== card.isPlayerCard) {
            // Check if the pokemon has stat-lowering immunity
            if (statLoweringImmunityAbilities.includes(adjacentCell.pokemonCard.ability)) {
                return;
            }

            const stats = adjacentCell.pokemonCard.stats;
            const highestStat = Math.max(...stats);

            // Only reduce if the highest stat is 7 or over
            if (highestStat < 7) return;

            const highestStatIndex = stats.indexOf(highestStat);
            const reducedValue = Math.max(1, highestStat - 2);
            const newStats = stats.map((stat, index) =>
                index === highestStatIndex ? reducedValue : stat
            );

            modifiedCells[adjacentCellId] = {
                ...adjacentCell,
                pokemonCard: {
                    ...adjacentCell.pokemonCard,
                    stats: newStats
                }
            };
        }
    });

    return modifiedCells;
};

const technician = lick;
const jumpKick = lick;

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

const triAttack = (card, cellId, gameState) => {
    const adjacentCellIds = getAdjacentCells(cellId, gameState.cells);

    // Count all adjacent cards (friendly and enemy)
    const adjacentCardCount = adjacentCellIds.filter(adjacentCellId => {
        const adjacentCell = gameState.cells[adjacentCellId];
        return adjacentCell?.pokemonCard;
    }).length;

    // Only boost if 3 or more cards are adjacent
    if (adjacentCardCount < 3) return card;

    // Boost all stats by +2, capped at 10
    return {
        ...card,
        stats: card.stats.map(stat => stat < 10 ? stat + 2 : 10)
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

const teleport = lonely;

const dig = (card, cellId, gameState) => {
    const cornerCells = ["A1", "A3", "C1", "C3"];

    // Only boost if placed on a corner cell
    if (!cornerCells.includes(cellId)) return card;

    const newStats = [...card.stats];

    // Boost 2 random stats
    for (let i = 0; i < 2; i++) {
        const availableStatIndices = newStats
            .map((stat, index) => ({ stat, index }))
            .filter(({ stat }) => stat < 10)
            .map(({ index }) => index);

        if (availableStatIndices.length === 0) break;

        const randomIndex = Math.floor(Math.random() * availableStatIndices.length);
        const statIndexToBoost = availableStatIndices[randomIndex];
        newStats[statIndexToBoost] += 1;
    }

    return {
        ...card,
        stats: newStats
    };
}

const smokeScreen = dig;

const dragonDance = (card, cellId, gameState) => {
    // Count cells with elemental tiles (not null)
    const elementalTilesCount = Object.values(gameState.cells).filter(cell =>
        cell.element !== null && cell.element !== undefined
    ).length;

    // If no elemental tiles, return card unchanged
    if (elementalTilesCount === 0) return card;

    // Create a new stats array
    const newStats = [...card.stats];

    // Boost a random stat by +1 for each elemental tile, capped at 10
    for (let i = 0; i < elementalTilesCount; i++) {
        // Find all stat indices that are below 10
        const availableStatIndices = newStats
            .map((stat, index) => ({ stat, index }))
            .filter(({ stat }) => stat < 10)
            .map(({ index }) => index);

        // If all stats are at 10, return the card
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
};

const leechLife = (card, cellId, gameState) => {
    const adjacentCellIds = getAdjacentCells(cellId, gameState.cells);

    // Find highest stat from all adjacent cards
    let highestStat = 0;
    adjacentCellIds.forEach(adjacentCellId => {
        const adjacentCell = gameState.cells[adjacentCellId];
        if (adjacentCell?.pokemonCard) {
            const maxStatInCard = Math.max(...adjacentCell.pokemonCard.stats);
            if (maxStatInCard > highestStat) {
                highestStat = maxStatInCard;
            }
        }
    });

    // If no adjacent cards, return unchanged
    if (highestStat === 0) return card;

    // Find all stat indices that are lower than the highest stat
    const newStats = [...card.stats];
    const lowerStatIndices = newStats
        .map((stat, index) => ({ stat, index }))
        .filter(({ stat }) => stat < highestStat)
        .map(({ index }) => index);

    // If no stats are lower than the highest stat, return unchanged
    if (lowerStatIndices.length === 0) return card;

    // Pick a random stat from the lower stat indices
    const randomIndex = Math.floor(Math.random() * lowerStatIndices.length);
    const statIndexToReplace = lowerStatIndices[randomIndex];
    newStats[statIndexToReplace] = highestStat;

    return {
        ...card,
        stats: newStats
    };
};

const leechSeed = leechLife;

const confuseRay = (card, cellId, cells) => {
    const modifiedCells = { ...cells };
    const adjacentCellIds = modifiedCells[cellId].adjacentCells;

    adjacentCellIds.forEach(adjacentCellId => {
        const adjacentCell = modifiedCells[adjacentCellId];

        if (adjacentCell?.pokemonCard && adjacentCell.pokemonCard.isPlayerCard !== card.isPlayerCard) {
            // Sattolo's algorithm - ensures no stat stays in original position
            let shuffledStats = [...adjacentCell.pokemonCard.stats];

            for (let i = shuffledStats.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * i);
                [shuffledStats[i], shuffledStats[j]] = [shuffledStats[j], shuffledStats[i]];
            }


            modifiedCells[adjacentCellId] = {
                ...adjacentCell,
                pokemonCard: {
                    ...adjacentCell.pokemonCard,
                    stats: shuffledStats,
                    originalStats: shuffledStats
                }
            };
        }
    });

    return modifiedCells;
};

const confusion = confuseRay;

const hypnosis = (card, cellId, cells) => {
    const modifiedCells = { ...cells };
    const adjacentCellIds = modifiedCells[cellId].adjacentCells;

    adjacentCellIds.forEach(adjacentCellId => {
        if (adjacentCellId === null) return;

        const adjacentCell = modifiedCells[adjacentCellId];

        if (adjacentCell?.pokemonCard && adjacentCell.pokemonCard.isPlayerCard !== card.isPlayerCard) {
            // Check if the pokemon has stat-lowering immunity
            if (statLoweringImmunityAbilities.includes(adjacentCell.pokemonCard.ability)) {
                return;
            }

            const stats = [...adjacentCell.pokemonCard.stats];

            // Find the highest stat value and its index
            const highestStat = Math.max(...stats);
            const highestIndex = stats.indexOf(highestStat);

            // Find the lowest stat value and its index
            const lowestStat = Math.min(...stats);
            const lowestIndex = stats.indexOf(lowestStat);

            // Reduce highest by 1 (minimum 1), increase lowest by 1 (maximum 10)
            const newStats = [...stats];
            newStats[highestIndex] = Math.max(1, highestStat - 1);
            newStats[lowestIndex] = Math.min(10, lowestStat + 1);

            modifiedCells[adjacentCellId] = {
                ...adjacentCell,
                pokemonCard: {
                    ...adjacentCell.pokemonCard,
                    stats: newStats
                }
            };
        }
    });

    return modifiedCells;
};

const supersonic = hypnosis;

const growl = (card, cellId, cells) => {
    const modifiedCells = { ...cells };
    const adjacentCellIds = modifiedCells[cellId].adjacentCells;

    // adjacentCells is ordered: [left, top, right, bottom]
    // If attacking card is to the left (index 0), adjacent card's right stat (index 2) faces it
    const oppositeDirections = [2, 3, 0, 1];

    adjacentCellIds.forEach((adjacentCellId, directionIndex) => {
        if (adjacentCellId === null) return;

        const adjacentCell = modifiedCells[adjacentCellId];

        if (adjacentCell?.pokemonCard && adjacentCell.pokemonCard.isPlayerCard !== card.isPlayerCard) {
            // Check if adjacent card has stat-lowering immunity
            if (statLoweringImmunityAbilities.includes(adjacentCell.pokemonCard.ability)) {
                return;
            }

            const statIndexToLower = oppositeDirections[directionIndex];
            const newStats = [...adjacentCell.pokemonCard.stats];

            // Lower the stat by 1, minimum 1
            if (newStats[statIndexToLower] > 1) {
                newStats[statIndexToLower] -= 1;
            }


            modifiedCells[adjacentCellId] = {
                ...adjacentCell,
                pokemonCard: {
                    ...adjacentCell.pokemonCard,
                    stats: newStats
                }
            };
        }
    });

    return modifiedCells;
}

const intimidate = growl;
const flameBody = growl;
const thunderWave = growl;
const leer = growl;

const smog = (card, cellId, cells) => {
    const modifiedCells = { ...cells };
    const cardHighestStat = Math.max(...card.stats);

    Object.keys(modifiedCells).forEach(currentCellId => {
        const currentCell = modifiedCells[currentCellId];

        if (currentCell?.pokemonCard && currentCell.pokemonCard.isPlayerCard !== card.isPlayerCard) {
            if (statLoweringImmunityAbilities.includes(currentCell.pokemonCard.ability)) {
                return;
            }

            const stats = [...currentCell.pokemonCard.stats];

            // Lower any stats that are greater than the card's highest stat
            const newStats = stats.map(stat => {
                if (stat > cardHighestStat && stat > 1) {
                    return stat - 1;
                }
                return stat;
            });

            modifiedCells[currentCellId] = {
                ...currentCell,
                pokemonCard: {
                    ...currentCell.pokemonCard,
                    stats: newStats
                }
            };
        }
    });

    return modifiedCells;
};

const stench = smog;

const hornDrill = (card, cellId, cells) => {
    const modifiedCells = { ...cells };
    const adjacentCellIds = modifiedCells[cellId].adjacentCells;

    adjacentCellIds.forEach(adjacentCellId => {
        if (adjacentCellId === null) return;

        const adjacentCell = modifiedCells[adjacentCellId];

        if (adjacentCell?.pokemonCard && adjacentCell.pokemonCard.isPlayerCard !== card.isPlayerCard) {
            if (statLoweringImmunityAbilities.includes(adjacentCell.pokemonCard.ability)) {
                return;
            }

            const roll = Math.random();

            if (roll < 0.3) {
                const stats = [...adjacentCell.pokemonCard.stats];

                const randomStatIndex = Math.floor(Math.random() * stats.length);
                const newStats = stats.map((stat, index) =>
                    index === randomStatIndex ? 1 : stat
                );

                modifiedCells[adjacentCellId] = {
                    ...adjacentCell,
                    pokemonCard: {
                        ...adjacentCell.pokemonCard,
                        stats: newStats
                    }
                };
            }
        }
    });

    return modifiedCells;
};

const guillotine = hornDrill;

const safePassage = (card, cellId, cells) => {
    const modifiedCells = { ...cells };
    const adjacentCellIds = modifiedCells[cellId].adjacentCells;

    adjacentCellIds.forEach((adjacentCellId, directionIndex) => {
        if (adjacentCellId === null) return;

        const adjacentCell = modifiedCells[adjacentCellId];

        if (adjacentCell?.pokemonCard && adjacentCell.pokemonCard.isPlayerCard === card.isPlayerCard) {
            const newStats = [...adjacentCell.pokemonCard.stats].map(stat => stat < 10 ? stat + 1 : 10);


            modifiedCells[adjacentCellId] = {
                ...adjacentCell,
                pokemonCard: {
                    ...adjacentCell.pokemonCard,
                    stats: newStats
                }
            };
        }
    });

    return modifiedCells;
}

const softBoiled = safePassage;

const download = (card, cellId, gameState) => {
    const adjacentCellIds = getAdjacentCells(cellId, gameState.cells);
    const adjacentCard = findStrongestAdjacentCard(adjacentCellIds, gameState.cells);

    if (adjacentCard) {
        card.stats = [...adjacentCard.stats];
    }

    return card;
};

const mimic = download;

const payDay = (card, cellId, gameState) => {
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

const illuminate = payDay;

const prismaticPunch = (card, cellId, gameState) => {
    const tileElement = gameState.cells[cellId].element;
    const validElements = ['fire', 'electric', 'ice'];

    if (!tileElement) return card;

    // Handle fighting type - boost stats and change type
    if (tileElement === 'fighting') {
        return {
            ...card,
            stats: card.stats.map(stat => stat < 10 ? stat + 1 : stat)
        };
    }

    if (validElements.includes(tileElement)) {
        return {
            ...card,
            stats: card.stats.map(stat => stat < 10 ? stat + 2 : stat)
        };
    }

    return {
        ...card,
        stats: card.stats.map(stat => stat > 1 ? stat - 1 : stat)
    };
}

export const selfAbilityHandlers = {
    acidArmor,
    agility,
    ancientPower,
    bigPecks,
    blaze,
    bonemerang,
    chlorophyll,
    clearBody,
    cuteCharm,
    desperation,
    dig,
    download,
    dragonDance,
    evolve,
    familyBond,
    flashFire,
    growth,
    guts,
    harden,
    hydroPump,
    illuminate,
    leafGuard,
    leechLife,
    leechSeed,
    lightningRod,
    lonely,
    lovelyKiss,
    magnetPull,
    magicGuard,
    mimic,
    mirrorMove,
    mist,
    oblivious,
    overgrow,
    parentalBond,
    payDay,
    pressure,
    prismaticPunch,
    rage,
    rest,
    sturdy,
    thickFat,
    rockSlide,
    sandVeil,
    selfDestruct,
    shellArmor,
    shieldDust,
    smokeScreen,
    staticElectricity,
    swarm,
    swordsDance,
    synchronise,
    teleport,
    torrent,
    toxic,
    transform,
    triAttack,
    quickAttack
};

export const statusAbilityHandlers = {
    confuseRay,
    confusion,
    flameBody,
    growl,
    guillotine,
    jumpKick,
    hornDrill,
    hypnosis,
    intimidate,
    lick,
    leer,
    safePassage,
    sing,
    smog,
    softBoiled,
    stench,
    supersonic,
    technician,
    thunderWave
}

/**
 * @param {Object} gameState - Current game state { cells, playerHand, cpuHand }
 */
export const applySelfAbilities = (card, trigger, cellId, gameState) => {
    if (!card.ability) return card;

    let modifiedCard = { ...card };

    if (abilities[card.ability]?.trigger === trigger && selfAbilityHandlers[card.ability]) {
        modifiedCard = selfAbilityHandlers[card.ability](modifiedCard, cellId, gameState);
    }

    return modifiedCard;
};

export const applyStatusAbilities = (card, trigger, cellId, cells) => {
    if (!card.ability) return cells;

    let modifiedCells = { ...cells };

    if (abilities[card.ability]?.trigger === trigger && statusAbilityHandlers[card.ability]) {
        modifiedCells = statusAbilityHandlers[card.ability](card, cellId, cells);
    }

    return modifiedCells;
}

