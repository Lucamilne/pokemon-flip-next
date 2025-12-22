import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { allPokemonNames } from "@/utils/cardHelpers.js";

import pokemon from '@/data/game-data.json';

// Starter Pokemon that every player begins with (loaded from game data)
const starterPokemon = allPokemonNames.filter(
  (pokemonName) => pokemon.cards[pokemonName].starter
);

/**
 * Initialize a new user's collection with starter Pokemon
 * @param {string} userId - The user's Firebase UID
 * @returns {Promise<Object>} The initialized collection
 */
export async function initialiseUserCollection(userId) {
  if (!userId) return {};

  try {
    const starterCollection = {};
    starterPokemon.forEach(name => {
      starterCollection[name] = true;
    });

    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, { collection: starterCollection }, { merge: true });

    return starterCollection;
  } catch (error) {
    console.error('Error initializing user collection:', error);
    throw error;
  }
}

/**
 * Get the user's Pokemon collection from Firestore
 * If the user is new, initialize with starter Pokemon
 * @param {string} userId - The user's Firebase UID
 * @returns {Promise<Object>} Object with pokemon names as keys and true as values
 */
export async function getUserCollection(userId) {
  if (!userId) return {};

  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const collection = data.collection || {};

      // Ensure all starter Pokemon are present
      let needsUpdate = false;
      const updatedCollection = { ...collection };

      starterPokemon.forEach(starter => {
        if (!updatedCollection[starter]) {
          updatedCollection[starter] = true;
          needsUpdate = true;
        }
      });

      // If any starters were missing, update Firestore
      if (needsUpdate) {
        await setDoc(docRef, { collection: updatedCollection }, { merge: true });
        return updatedCollection;
      }

      return collection;
    } else {
      // New user - initialize with starter Pokemon
      return await initialiseUserCollection(userId);
    }
  } catch (error) {
    console.error('Error fetching user collection:', error);
    return {};
  }
}

/**
 * Add a single card to the user's collection
 * @param {string} userId - The user's Firebase UID
 * @param {string} pokemonName - The pokemon name (e.g., "bulbasaur")
 */
export async function addCardToCollection(userId, pokemonName) {
  if (!userId || !pokemonName) return;

  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, {
      collection: {
        [pokemonName]: true
      }
    }, { merge: true });
  } catch (error) {
    console.error('Error adding card to collection:', error);
    throw error;
  }
}

/**
 * Check if user owns a specific card
 * @param {string} userId - The user's Firebase UID
 * @param {string} pokemonName - The pokemon name to check
 * @returns {Promise<boolean>}
 */
export async function hasCard(userId, pokemonName) {
  const collection = await getUserCollection(userId);
  return collection[pokemonName] === true;
}

/**
 * Add multiple cards to the user's collection at once
 * @param {string} userId - The user's Firebase UID
 * @param {string[]} pokemonNames - Array of pokemon names
 */
export async function addMultipleCards(userId, pokemonNames) {
  if (!userId || !pokemonNames || pokemonNames.length === 0) return;

  try {
    const docRef = doc(db, 'users', userId);
    const collection = {};

    pokemonNames.forEach(name => {
      collection[name] = true;
    });

    await setDoc(docRef, { collection }, { merge: true });
  } catch (error) {
    console.error('Error adding multiple cards:', error);
    throw error;
  }
}

/**
 * Remove a card from the user's collection
 * @param {string} userId - The user's Firebase UID
 * @param {string} pokemonName - The pokemon name to remove
 */
export async function removeCardFromCollection(userId, pokemonName) {
  if (!userId || !pokemonName) return;

  try {
    const docRef = doc(db, 'users', userId);
    const collection = await getUserCollection(userId);

    // Remove the pokemon from collection
    delete collection[pokemonName];

    await setDoc(docRef, { collection }, { merge: true });
  } catch (error) {
    console.error('Error removing card from collection:', error);
    throw error;
  }
}

/**
 * Remove multiple cards from the user's collection at once
 * @param {string} userId - The user's Firebase UID
 * @param {string[]} pokemonNames - Array of pokemon names to remove
 */
export async function removeMultipleCards(userId, pokemonNames) {
  if (!userId || !pokemonNames || pokemonNames.length === 0) return;

  try {
    const docRef = doc(db, 'users', userId);
    const collection = await getUserCollection(userId);

    pokemonNames.forEach(name => {
      delete collection[name];
    });

    await setDoc(docRef, { collection });
  } catch (error) {
    console.error('Error removing multiple cards:', error);
    throw error;
  }
}

/**
 * Get count of cards in user's collection
 * @param {string} userId - The user's Firebase UID
 * @returns {Promise<number>}
 */
export async function getCollectionCount(userId) {
  const collection = await getUserCollection(userId);
  return Object.keys(collection).length;
}
