const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Fetches Pokemon data from the PokeAPI
 * @param {string} pokemonName - The name of the Pokemon
 * @returns {Promise<Object>} Pokemon data from the API
 */
export async function getPokemonData(pokemonName) {
    const response = await fetch(`${BASE_URL}/pokemon/${pokemonName}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch pokemon data: ${response.statusText}`);
    }

    return response.json();
}

export async function getPokemonSpeciesData(pokemonName) {
    const response = await fetch(`${BASE_URL}/pokemon-species/${pokemonName}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch pokemon data: ${response.statusText}`);
    }

    return response.json();
}

export const obj = { 
    effective: {

    }
}
