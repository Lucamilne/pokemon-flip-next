const pokemonList = Object.keys(pokemon.data);
const obj = pokemon.data;

for (const pokemon of pokemonList) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon}/`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Extract the types from the response
            const types = data.types.map((typeData) => typeData.type.name);

            // Log or use the types as needed
            delete obj[pokemon].type
            obj[pokemon].types = types;
        })
}

const statModifier = 20;

const decrementRandomStat = (stats) => {
    const randomIndex = Math.floor(Math.random() * stats.length);

    if (stats[randomIndex] > 1) {
        stats[randomIndex] -= 1;
    } else {
        // If it's 1 or less, recursively call the function again
        decrementRandomStat(stats);
    }
};

const allocateStatsByPokemon = (pokemonName) => {
    const currentPokemon = pokemon.data[pokemonName];
    let statSum = Math.round(currentPokemon.stats / statModifier);
    let statsToReturn = [10, 10, 10, 10];

    let numberOfIterations =
        statsToReturn.reduce((total, value) => total + value, 0) - statSum;

    for (let i = 0; i < numberOfIterations; i++) {
        decrementRandomStat(statsToReturn);
    }

    return statsToReturn;
}; // an old function I used to allocate stats. Retired but I may want to return to a random element