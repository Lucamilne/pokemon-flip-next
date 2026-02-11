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

const replaceCardInHands = (originalCard, modifiedCard, gameState) => {
    const handKey = originalCard.isPlayerCard ? 'playerHand' : 'cpuHand';
    const otherHandKey = originalCard.isPlayerCard ? 'cpuHand' : 'playerHand';
    return {
        [handKey]: gameState[handKey].map(c => c.name === originalCard.name ? modifiedCard : c),
        [otherHandKey]: [...gameState[otherHandKey]]
    };
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
const defenceCurl = shieldDust;
const sturdy = shieldDust;
const thickFat = shieldDust
const leafGuard = shieldDust;

const statLoweringImmunityAbilities = ["leafGuard", "oblivious", "shieldDust", "shellArmor", "defenceCurl", "sturdy", "thickFat"]

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
    const validElements = ['electric', 'fairy', 'fire', 'grass', 'ice', 'psychic', 'water'];

    if (!tileElement || !validElements.includes(tileElement)) return card;

    // Map tile elements to evolution cards
    const evolutionMap = {
        electric: gameData.cards.jolteon,
        fairy: gameData.eeveelutions.sylveon,
        fire: gameData.cards.flareon,
        grass: gameData.eeveelutions.leafeon,
        ice: gameData.eeveelutions.glaceon,
        psychic: gameData.eeveelutions.espeon,
        water: gameData.cards.vaporeon,
    };

    const evolution = evolutionMap[tileElement];

    return {
        ...card,
        id: evolution.id,
        types: [...evolution.types],
        stats: evolution.stats.map(stat => Math.min(stat + 1, 10)),
    };
}

const swordsDance = (card, cellId, gameState) => {
    if (cellId !== "B2") return card;

    return {
        ...card,
        stats: card.stats.map(stat => Math.min(10, stat + (Math.random() < 0.5 ? 2 : 1)))
    };
}

const bonemerang = swordsDance;

const overgrow = (card, cellId, gameState) => {
    const tileElement = gameState.cells[cellId].element;
    if (!tileElement) return card;

    const isMatchingType = card.types.includes(tileElement);

    return {
        ...card,
        stats: card.stats.map(stat =>
            isMatchingType ? Math.min(stat * 2, 10) : Math.max(stat - 1, 1)
        )
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

    if (cardTypeCount < 1) return replaceCardInHands(card, card, gameState);

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

    return replaceCardInHands(card, { ...card, stats: newStats }, gameState);
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
    if (Math.random() >= 0.25) return card;

    return {
        ...card,
        stats: card.stats.map(stat => Math.min(stat + 1, 10))
    };
}

const familyBond = (card, cellId, gameState) => {
    const collectiveHand = [...gameState.playerHand, ...gameState.cpuHand];

    // Count Nido family members in both hands (excluding this card)
    const nidoFamilyCount = collectiveHand.filter(c =>
        c.name.toLowerCase().startsWith('nido')
    ).length - 1;

    if (nidoFamilyCount < 1) return replaceCardInHands(card, card, gameState);

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

    return replaceCardInHands(card, { ...card, stats: newStats }, gameState);
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
    const adjacentCellIds = gameState.cells[cellId].adjacentCells;
    const newStats = [...card.stats];

    // adjacentCells is ordered: [left, top, right, bottom]
    adjacentCellIds.forEach((adjacentCellId, directionIndex) => {
        if (adjacentCellId === null) return;

        const adjacentCell = gameState.cells[adjacentCellId];

        if (adjacentCell?.pokemonCard) {
            newStats[directionIndex] = Math.min(newStats[directionIndex] + 1, 10);
        }
    });

    return {
        ...card,
        stats: newStats
    };
};

const magnetPull = pressure;
const cuteCharm = pressure;
const lovelyKiss = pressure;

const maternal = (card, cellId, gameState) => {
    const handKey = card.isPlayerCard ? 'playerHand' : 'cpuHand';
    const otherHandKey = card.isPlayerCard ? 'cpuHand' : 'playerHand';
    const currentHand = gameState[handKey];

    const newHand = currentHand.map(handCard => {
        if (handCard.statWeight <= 355) {
            return {
                ...handCard,
                stats: handCard.stats.map(stat => Math.min(stat + 1, 10))
            };
        }
        return handCard;
    });

    return {
        [handKey]: newHand,
        [otherHandKey]: [...gameState[otherHandKey]]
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
const teleport = quickAttack;

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

    const allCards = [...gridCards, ...gameState.playerHand, ...gameState.cpuHand].filter(c => c !== null);
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

    const allCards = [...gridCards, ...gameState.playerHand, ...gameState.cpuHand].filter(c => c !== null);

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

            // Reduce all stats that are 7 or over by 1
            const newStats = stats.map(stat =>
                stat >= 7 ? stat - 1 : stat
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

    // Double all stats, capped at 10
    return {
        ...card,
        stats: card.stats.map(stat => Math.min(stat * 2, 10))
    };
};

const wish = (card) => {
    if (Math.random() >= 0.15) return card;

    return {
        ...card,
        stats: card.stats.map(() => 10)
    };
};

const lonely = (card, cellId, gameState) => {
    const adjacentCellIds = getAdjacentCells(cellId, gameState.cells);

    const hasAdjacentCards = adjacentCellIds.some(adjacentCellId => {
        const adjacentCell = gameState.cells[adjacentCellId];
        return adjacentCell?.pokemonCard;
    });

    // Only boost if no adjacent cards exist
    if (hasAdjacentCards) return card;

    // Double all stats, capped at 10
    return {
        ...card,
        stats: card.stats.map(stat => Math.min(stat * 2, 10))
    };
};

const dig = (card, cellId, gameState) => {
    const cornerCells = ["A1", "A3", "C1", "C3"];

    // Only boost if placed on a corner cell, 50% chance
    if (!cornerCells.includes(cellId) || Math.random() >= 0.5) return card;

    return {
        ...card,
        stats: card.stats.map(stat => Math.min(stat + 1, 10))
    };
}
const smokeScreen = dig;

const dragonDance = (card, cellId, gameState) => {
    // Count cells with elemental tiles (not null)
    const elementalTilesCount = Object.values(gameState.cells).filter(cell =>
        cell.element !== null && cell.element !== undefined
    ).length;

    // If no elemental tiles, return card unchanged
    if (elementalTilesCount === 0) return replaceCardInHands(card, card, gameState);

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

    return replaceCardInHands(card, { ...card, stats: newStats }, gameState);
};

const leechLife = (card, cellId, gameState) => {
    const adjacentCellIds = gameState.cells[cellId].adjacentCells;

    let leechCount = 0;
    adjacentCellIds.forEach(adjacentCellId => {
        if (adjacentCellId === null) return;
        const adjacentCell = gameState.cells[adjacentCellId];
        if (adjacentCell?.pokemonCard && adjacentCell.pokemonCard.isPlayerCard !== card.isPlayerCard
            && !statLoweringImmunityAbilities.includes(adjacentCell.pokemonCard.ability)) {
            leechCount++;
        }
    });

    if (leechCount === 0) return card;

    const newStats = [...card.stats];
    for (let i = 0; i < leechCount; i++) {
        const availableIndices = newStats
            .map((stat, index) => ({ stat, index }))
            .filter(({ stat }) => stat < 10)
            .map(({ index }) => index);
        if (availableIndices.length === 0) break;
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        newStats[randomIndex] += 1;
    }

    return {
        ...card,
        stats: newStats
    };
};

const leechSeed = leechLife;

const leechLifeStatus = (card, cellId, cells) => {
    const modifiedCells = { ...cells };
    const adjacentCellIds = modifiedCells[cellId].adjacentCells;

    adjacentCellIds.forEach(adjacentCellId => {
        if (adjacentCellId === null) return;

        const adjacentCell = modifiedCells[adjacentCellId];

        if (adjacentCell?.pokemonCard && adjacentCell.pokemonCard.isPlayerCard !== card.isPlayerCard) {
            if (statLoweringImmunityAbilities.includes(adjacentCell.pokemonCard.ability)) {
                return;
            }

            const stats = [...adjacentCell.pokemonCard.stats];
            const randomStatIndex = Math.floor(Math.random() * stats.length);

            if (stats[randomStatIndex] > 1) {
                stats[randomStatIndex] -= 1;
            }

            modifiedCells[adjacentCellId] = {
                ...adjacentCell,
                pokemonCard: {
                    ...adjacentCell.pokemonCard,
                    stats
                }
            };
        }
    });

    return modifiedCells;
};

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
            if (statLoweringImmunityAbilities.includes(adjacentCell.pokemonCard.ability)) {
                return;
            }

            if (Math.random() < 0.5) {
                const newStats = [...adjacentCell.pokemonCard.stats];

                const highestIndex = newStats.indexOf(Math.max(...newStats));
                const lowestIndex = newStats.indexOf(Math.min(...newStats));

                [newStats[highestIndex], newStats[lowestIndex]] = [newStats[lowestIndex], newStats[highestIndex]];

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

            if (roll < 0.25) {
                modifiedCells[adjacentCellId] = {
                    ...adjacentCell,
                    pokemonCard: {
                        ...adjacentCell.pokemonCard,
                        stats: adjacentCell.pokemonCard.stats.map(() => 1)
                    }
                };
            }
        }
    });

    return modifiedCells;
};

const guillotine = hornDrill;

const safePassage = (card, cellId, gameState) => {
    const handKey = card.isPlayerCard ? 'playerHand' : 'cpuHand';
    const otherHandKey = card.isPlayerCard ? 'cpuHand' : 'playerHand';
    const currentHand = gameState[handKey];
    const cardIndex = currentHand.findIndex(c => c.name === card.name);

    const newHand = currentHand.map((handCard, index) => {
        if ((index === cardIndex - 1 || index === cardIndex + 1) && handCard) {
            return {
                ...handCard,
                stats: handCard.stats.map(stat => Math.min(stat + 1, 10))
            };
        }
        return handCard;
    });

    return {
        [handKey]: newHand,
        [otherHandKey]: [...gameState[otherHandKey]]
    };
}

const softBoiled = safePassage;

const mimic = (card, cellId, gameState) => {
    // Determine which hand the card is in
    const currentHand = card.isPlayerCard ? gameState.playerHand : gameState.cpuHand;

    // Find the card's index in the hand
    const cardIndex = currentHand.findIndex(c => c.name === card.name);

    // Check if there's a card at the next index
    const nextCard = currentHand[cardIndex + 1];

    // If there's a next card, copy its stats
    if (nextCard) {
        return replaceCardInHands(card, { ...card, stats: [...nextCard.stats] }, gameState);
    }

    return replaceCardInHands(card, card, gameState);
};

const conversion = (card, cellId, gameState) => {
    const adjacentCellIds = getAdjacentCells(cellId, gameState.cells);
    const adjacentCard = findStrongestAdjacentCard(adjacentCellIds, gameState.cells);

    if (!adjacentCard) return card;

    const { typeMatchups } = gameData;

    // Find all types that are super effective against the adjacent card's types
    const counterTypes = [];

    Object.entries(typeMatchups).forEach(([attackingType, matchup]) => {
        // Check if this attacking type is super effective against any of the adjacent card's types
        const isSuperEffective = adjacentCard.types.some(defenderType =>
            matchup.superEffective.includes(defenderType)
        );

        if (isSuperEffective) {
            counterTypes.push(attackingType);
        }
    });

    // If no counter types found, keep original type
    if (counterTypes.length === 0) return card;

    // Pick a random counter type
    const randomCounterType = counterTypes[Math.floor(Math.random() * counterTypes.length)];

    return {
        ...card,
        types: [randomCounterType]
    };
};

const illuminate = (card, cellId, gameState) => {
    // adjacentCells ordered: [left, top, right, bottom] matching stats [0, 1, 2, 3]
    const adjacentCellIds = gameState.cells[cellId].adjacentCells;
    const newStats = [...card.stats];
    let boosted = false;

    adjacentCellIds.forEach((adjacentCellId, directionIndex) => {
        if (adjacentCellId === null) return;
        const adjacentCell = gameState.cells[adjacentCellId];
        if (!adjacentCell?.pokemonCard && !adjacentCell?.element && newStats[directionIndex] < 10) {
            newStats[directionIndex] += 1;
            boosted = true;
        }
    });

    if (!boosted) return card;

    return {
        ...card,
        stats: newStats
    };
};

// const thunder = (card, cellId, gameState) => {
//     const modifiedCells = {};
//     for (const key in gameState.cells) {
//         modifiedCells[key] = { ...gameState.cells[key], element: card.types[0] };
//     }
//     return {
//         ...replaceCardInHands(card, card, gameState),
//         cells: modifiedCells
//     };
// };

// const flamethrower = thunder;
// const petalDance = thunder;
// const skyAttack = thunder;
// const waterfall = thunder;
// const fissure = thunder;


const payDay = (card, cellId, gameState) => {
    const currentHand = card.isPlayerCard ? gameState.playerHand : gameState.cpuHand;
    const cardIndex = currentHand.findIndex(c => c.name === card.name);
    const nextCard = currentHand[cardIndex + 1];

    if (!nextCard) {
        return replaceCardInHands(card, card, gameState);
    }
    const nextCardTotalStats = nextCard.stats.reduce((sum, stat) => sum + stat, 0);

    // Calculate bonus: +1 to all stats for every 10 stat points
    const bonus = Math.floor(nextCardTotalStats / 10);

    // If no bonus, return unchanged
    if (bonus === 0) {
        return replaceCardInHands(card, card, gameState);
    }

    // Apply bonus to all stats, capped at 10
    return replaceCardInHands(card, {
        ...card,
        stats: card.stats.map(stat => Math.min(stat + bonus, 10))
    }, gameState);
};

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

const metronome = (card, cellId, gameState) => {
    const currentHand = card.isPlayerCard ? gameState.playerHand : gameState.cpuHand;
    const cardIndex = currentHand.findIndex(c => c.name === card.name);
    const nextCard = currentHand[cardIndex + 1];

    // If Mew is the last card in hand, or no next card exists, return unchanged
    if (!nextCard) {
        return replaceCardInHands(card, card, gameState);
    }

    // Copy ability and type from the next card
    const modifiedCard = {
        ...card,
        ability: nextCard.ability,
        wasMetronome: true  // Flag for tooltip display
    };

    // If the copied ability has trigger "onMatchStart" and is a self ability, apply it immediately
    if (nextCard.ability &&
        abilities[nextCard.ability]?.trigger === 'onMatchStart' &&
        selfAbilityHandlers[nextCard.ability]) {
        return selfAbilityHandlers[nextCard.ability](modifiedCard, cellId, gameState);
    }

    return replaceCardInHands(card, modifiedCard, gameState);
};

export const selfAbilityHandlers = {
    acidArmor,
    agility,
    ancientPower,
    bigPecks,
    blaze,
    bonemerang,
    chlorophyll,
    clearBody,
    conversion,
    cuteCharm,
    defenceCurl,
    desperation,
    dig,
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
    magicGuard,
    magnetPull,
    maternal,
    metronome,
    mimic,
    mirrorMove,
    mist,
    oblivious,
    overgrow,
    payDay,
    pressure,
    prismaticPunch,
    quickAttack,
    rage,
    rest,
    rockSlide,
    safePassage,
    selfDestruct,
    shellArmor,
    shieldDust,
    smokeScreen,
    softBoiled,
    staticElectricity,
    sturdy,
    swarm,
    swordsDance,
    synchronise,
    teleport,
    thickFat,
    torrent,
    toxic,
    transform,
    triAttack,
    wish
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
    leechLife: leechLifeStatus,
    leechSeed: leechLifeStatus,
    leer,
    sing,
    smog,
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

export const applyMatchStartAbilities = (gameState) => {
    let playerHand = [...gameState.playerHand];
    let cpuHand = [...gameState.cpuHand];

    const allCards = [...playerHand, ...cpuHand];
    
    allCards.forEach(card => {
        if (card?.ability && abilities[card.ability]?.trigger === 'onMatchStart' && selfAbilityHandlers[card.ability]) {
            const currentCard = [...playerHand, ...cpuHand].find(c => c.name === card.name) || card;
            const result = selfAbilityHandlers[card.ability](currentCard, null, { ...gameState, playerHand, cpuHand });

            if (result?.playerHand) playerHand = result.playerHand;
            if (result?.cpuHand) cpuHand = result.cpuHand;
        }
    });

    return { playerHand, cpuHand };
};
