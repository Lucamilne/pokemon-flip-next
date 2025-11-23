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

export const allocateStarterDeck = () => {
    // const starterPokemon = Object.keys(pokemon.cards).filter((pokemonName) => pokemon.cards[pokemonName].starter);
    // return starterPokemon.map((el) => createCard(el, true));
    const pokemonCardsArray = Object.keys(pokemon.cards);

    return pokemonCardsArray.slice(pokemonCardsArray.length - 5, pokemonCardsArray.length).map((el) => createCard(el, true));
};

export const fetchStarterCards = () => {
    return Object.keys(pokemon.cards).filter((pokemonName) => pokemon.cards[pokemonName].starter).map((pokemonName) => createCard(pokemonName, true));
}

export const fetchAllCards = () => {
    return Object.keys(pokemon.cards).map((pokemonName) => createCard(pokemonName, true));
}
