import pokemon from "@/data/game-data.json";

export const createCard = (pokemonName, isPlayerCard = false, debugMode = false) => {
    let libraryOfCards = debugMode ? "legends" : "cards";
    let cardData = { ...pokemon[libraryOfCards][pokemonName] };

    return {
        ...cardData,
        name: pokemonName,
        isPlayerCard: isPlayerCard,
        // Match stats (reset each game)
        matchStats: {
            timesFlipped: 0,
            capturesMade: 0,
            superEffectiveCaptures: 0,
            immuneDefenses: 0
        }
    };
};

export const fetchCardById = (id, isPlayerCard = true) => {
    const pokemonName = Object.keys(pokemon.cards).find(
        (name) => pokemon.cards[name].id === id
    );

    if (!pokemonName) {
        return null;
    }

    return createCard(pokemonName, isPlayerCard);
};

export const allocateRandomCards = (isPlayerCard) => {
    const shuffledArray = Object.keys(pokemon.cards).sort(() => Math.random() - 0.5);

    return shuffledArray.slice(0, 5).map((el) => createCard(el, isPlayerCard));
};

export const allocateCpuCardsFromPool = (cardPool) => {
    const shuffledArray = cardPool.sort(() => Math.random() - 0.5);

    return shuffledArray.slice(0, 5);
}

export const fetchStarterCards = (isPlayerCard = true) => {
    return Object.keys(pokemon.cards).filter((pokemonName) => pokemon.cards[pokemonName].starter).map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchAllCards = (isPlayerCard = true) => {
    return Object.keys(pokemon.cards).map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchEarlyGameCards = (isPlayerCard = true) => {
    return Object.keys(pokemon.cards).filter((pokemonName) => pokemon.cards[pokemonName].statWeight <= 400).map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchMidGameCards = (isPlayerCard = true) => {
    return Object.keys(pokemon.cards).filter((pokemonName) => pokemon.cards[pokemonName].statWeight > 400 && pokemon.cards[pokemonName].statWeight < 520).map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchStrongCards = (isPlayerCard = true) => {
    return Object.keys(pokemon.cards).filter((pokemonName) => pokemon.cards[pokemonName].statWeight >= 520).map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchSingleTypeCards = (type, isPlayerCard = true) => {
    return Object.keys(pokemon.cards).filter((pokemonName) => pokemon.cards[pokemonName].types.includes(type)).map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchMonoTypeCards = (isPlayerCard = true) => {
    return Object.keys(pokemon.cards).filter((pokemonName) => pokemon.cards[pokemonName].types.length === 1).map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchNidoFamilyCards = (isPlayerCard = true) => {
    return Object.keys(pokemon.cards).filter((pokemonName) => pokemonName.startsWith('nido')).map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchSecretCards = (isPlayerCard = true) => {
    return Object.keys(pokemon.legends).map((pokemonName) => createCard(pokemonName, isPlayerCard, true));
}

// Helper function to get random items from an array
const getRandomItems = (arr, count) => {
    const result = [];
    const copy = [...arr];
    for (let i = 0; i < count && copy.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(randomIndex, 1)[0]);
    }
    return result;
};

// Helper function to categorize cards by tier
const categoriseCardsByTier = () => {
    const weakCards = [];
    const midCards = [];
    const strongCards = [];

    Object.keys(pokemon.cards).forEach((pokemonName) => {
        const statWeight = pokemon.cards[pokemonName].statWeight;
        if (statWeight <= 400) weakCards.push(pokemonName);
        else if (statWeight < 520) midCards.push(pokemonName);
        else strongCards.push(pokemonName);
    });

    return { weakCards, midCards, strongCards };
};

export const fetchBalancedTierCards = (isPlayerCard = true) => {
    const { weakCards, midCards, strongCards } = categoriseCardsByTier();

    const selectedCards = [
        ...getRandomItems(weakCards, 1),
        ...getRandomItems(midCards, 3),
        ...getRandomItems(strongCards, 1)
    ];

    return selectedCards
        .sort(() => Math.random() - 0.5)
        .map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

// Match the player's tier distribution for CPU hand
export const fetchCardsByPlayerTierDistribution = (playerHand) => {
    const { weakCards, midCards, strongCards } = categoriseCardsByTier();

    // Add random variance to tier thresholds (+/- 20)
    const weakThreshold = 400 + Math.floor(Math.random() * 41) - 20; // 380-420
    const midThreshold = 520 + Math.floor(Math.random() * 41) - 20; // 500-540

    // Count player's tier distribution
    const playerTiers = {
        weak: 0,
        mid: 0,
        strong: 0
    };

    playerHand.forEach(card => {
        const statWeight = card.statWeight;
        if (statWeight <= weakThreshold) playerTiers.weak++;
        else if (statWeight < midThreshold) playerTiers.mid++;
        else playerTiers.strong++;
    });

    // Generate CPU hand with same distribution
    const selectedCards = [
        ...getRandomItems(weakCards, playerTiers.weak),
        ...getRandomItems(midCards, playerTiers.mid),
        ...getRandomItems(strongCards, playerTiers.strong)
    ];

    return selectedCards
        .sort(() => Math.random() - 0.5)
        .map((pokemonName) => createCard(pokemonName, false)); // CPU cards are always isPlayerCard = false
}

export const fetchGlassCannonCards = (isPlayerCard = true) => {
    return Object.keys(pokemon.cards)
        .filter((pokemonName) => {
            const card = pokemon.cards[pokemonName];
            const stats = card.stats;
            const maxStat = Math.max(...stats);
            const minStat = Math.min(...stats);
            // Has at least one very high stat and one low stat (variance)
            return maxStat >= 8 && minStat <= 1;
        })
        .map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchDualTypeCards = (isPlayerCard = true) => {
    return Object.keys(pokemon.cards)
        .filter((pokemonName) => pokemon.cards[pokemonName].types.length === 2)
        .map((pokemonName) => createCard(pokemonName, isPlayerCard));
}


export const fetchAllStarterLineCards = (isPlayerCard = true) => {
    const starters = ['bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon', 'charizard',
        'squirtle', 'wartortle', 'blastoise', 'pikachu', 'raichu'];
    return Object.keys(pokemon.cards)
        .filter((pokemonName) => starters.includes(pokemonName))
        .map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

export const fetchFossilCards = (isPlayerCard = true) => {
    const fossils = ['omanyte', 'omastar', 'kabuto', 'kabutops', 'aerodactyl'];
    return Object.keys(pokemon.cards)
        .filter((pokemonName) => fossils.includes(pokemonName))
        .map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

