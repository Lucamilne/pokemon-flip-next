import pokemon from "@/data/game-data.json";

export const createCard = (pokemonName, isPlayerCard = false) => {
    return {
        name: pokemonName,
        types: pokemon.cards[pokemonName].types,
        id: pokemon.cards[pokemonName].id,
        stats: pokemon.cards[pokemonName].stats,
        originalStats: pokemon.cards[pokemonName].originalStats, // A copy of stats is kept to track modifications
        rarity: pokemon.cards[pokemonName].rarity,
        playerOwned: pokemon.cards[pokemonName].starter, // this is an unimplemented feature as of writing
        isPlayerCard: isPlayerCard
    };
};

export const allocateRandomCpuCards = () => {
    const shuffledArray = Object.keys(pokemon.cards).sort(() => Math.random() - 0.5);

    return shuffledArray.slice(0, 5).map((el) => createCard(el));
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

export const fetchBalancedTierCards = (isPlayerCard = true) => {
    const weakCards = [];
    const midCards = [];
    const strongCards = [];

    Object.keys(pokemon.cards).forEach((pokemonName) => {
        const statWeight = pokemon.cards[pokemonName].statWeight;
        if (statWeight <= 400) weakCards.push(pokemonName);
        else if (statWeight < 520) midCards.push(pokemonName);
        else strongCards.push(pokemonName);
    });

    // Get random items without sorting entire arrays
    const getRandomItems = (arr, count) => {
        const result = [];
        const copy = [...arr];
        for (let i = 0; i < count && copy.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * copy.length);
            result.push(copy.splice(randomIndex, 1)[0]);
        }
        return result;
    };

    const selectedCards = [
        ...getRandomItems(weakCards, 1),
        ...getRandomItems(midCards, 3),
        ...getRandomItems(strongCards, 1)
    ];

    return selectedCards
        .sort(() => Math.random() - 0.5)
        .map((pokemonName) => createCard(pokemonName, isPlayerCard));
}

