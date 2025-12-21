import pokemon from '@/data/game-data.json';

// localStorage key for the collection
const COLLECTION_KEY = 'pokemonCollection';

// Version for schema migrations
const CURRENT_VERSION = 1;

/**
 * Get starter Pokemon names from game data
 * @returns {string[]} Array of starter Pokemon names
 */
function getStarterPokemonNames() {
  return Object.keys(pokemon.cards).filter(
    (pokemonName) => pokemon.cards[pokemonName].starter
  );
}

/**
 * Get default starter collection
 * @returns {Object} Collection object with starter Pokemon
 */
function getStarterCollection() {
  const collection = {};
  getStarterPokemonNames().forEach(name => {
    collection[name] = true;
  });
  return collection;
}

/**
 * Validate collection data structure
 * @param {any} data - Data to validate
 * @returns {boolean} True if valid
 */
function validateCollectionData(data) {
  try {
    if (!data || typeof data !== 'object') return false;
    if (!data.version || typeof data.version !== 'number') return false;
    if (!data.collection || typeof data.collection !== 'object') return false;
    if (!data.lastUpdated || typeof data.lastUpdated !== 'string') return false;
    if (!data.syncState || typeof data.syncState !== 'object') return false;

    // Validate collection entries
    for (const key in data.collection) {
      if (data.collection[key] !== true) return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Create default collection structure
 * @param {Object} collection - Pokemon collection object
 * @param {string|null} userId - User ID if signed in
 * @returns {Object} Full collection data structure
 */
function createCollectionData(collection = {}, userId = null) {
  return {
    version: CURRENT_VERSION,
    lastUpdated: new Date().toISOString(),
    collection: collection,
    syncState: {
      lastSyncedAt: null,
      userId: userId
    }
  };
}

/**
 * Load collection from localStorage
 * Falls back to starter collection if not found or corrupted
 * @returns {Object} Pokemon collection object
 */
export function getLocalCollection() {
  try {
    const stored = localStorage.getItem(COLLECTION_KEY);

    if (!stored) {
      // No collection found - return starters
      const starterCollection = getStarterCollection();
      saveLocalCollection(starterCollection);
      return starterCollection;
    }

    const data = JSON.parse(stored);

    // Validate structure
    if (!validateCollectionData(data)) {
      console.warn('Invalid collection data, resetting to starters');
      const starterCollection = getStarterCollection();
      saveLocalCollection(starterCollection);
      return starterCollection;
    }

    // Ensure all starters are present
    const starters = getStarterPokemonNames();
    let needsUpdate = false;
    const collection = { ...data.collection };

    starters.forEach(starter => {
      if (!collection[starter]) {
        collection[starter] = true;
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      saveLocalCollection(collection, data.syncState.userId);
    }

    return collection;
  } catch (error) {
    console.error('Error loading collection from localStorage:', error);
    // Fall back to starters on any error
    const starterCollection = getStarterCollection();
    try {
      saveLocalCollection(starterCollection);
    } catch (saveError) {
      console.error('localStorage unavailable, using in-memory collection');
    }
    return starterCollection;
  }
}

/**
 * Save collection to localStorage
 * @param {Object} collection - Pokemon collection object
 * @param {string|null} userId - User ID if signed in
 */
export function saveLocalCollection(collection, userId = null) {
  try {
    // Preserve existing sync state if userId not provided
    let syncState = { lastSyncedAt: null, userId: userId };

    try {
      const existing = localStorage.getItem(COLLECTION_KEY);
      if (existing && userId === null) {
        const parsed = JSON.parse(existing);
        if (parsed.syncState) {
          syncState = parsed.syncState;
        }
      }
    } catch (e) {
      // Ignore errors reading existing state
    }

    const data = {
      version: CURRENT_VERSION,
      lastUpdated: new Date().toISOString(),
      collection: collection,
      syncState: syncState
    };

    localStorage.setItem(COLLECTION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving collection to localStorage:', error);
    throw error;
  }
}

/**
 * Merge local and Firebase collections (union merge)
 * Always keeps all cards from both sources
 * @param {Object} localCollection - Local collection
 * @param {Object} firebaseCollection - Firebase collection
 * @returns {Object} Merged collection
 */
export function mergeCollections(localCollection, firebaseCollection) {
  const starters = getStarterCollection();

  // Union merge: combine all unique Pokemon from all sources
  const merged = {
    ...starters,           // Always include starters
    ...localCollection,    // Add local cards
    ...firebaseCollection  // Add Firebase cards
  };

  return merged;
}

/**
 * Update sync state after successful Firebase sync
 * @param {string} userId - User ID
 * @param {string} timestamp - ISO timestamp of sync
 */
export function updateSyncState(userId, timestamp) {
  try {
    const stored = localStorage.getItem(COLLECTION_KEY);
    if (!stored) return;

    const data = JSON.parse(stored);
    data.syncState.lastSyncedAt = timestamp;
    data.syncState.userId = userId;
    data.lastUpdated = new Date().toISOString();

    localStorage.setItem(COLLECTION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error updating sync state:', error);
  }
}

/**
 * Clear sync state (keep collection) on sign-out
 */
export function clearSyncState() {
  try {
    const stored = localStorage.getItem(COLLECTION_KEY);
    if (!stored) return;

    const data = JSON.parse(stored);
    data.syncState.userId = null;
    // Keep lastSyncedAt to show when it was last synced
    data.lastUpdated = new Date().toISOString();

    localStorage.setItem(COLLECTION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error clearing sync state:', error);
  }
}

/**
 * Get collection metadata for UI display
 * @returns {Object} Metadata including sync state
 */
export function getCollectionMetadata() {
  try {
    const stored = localStorage.getItem(COLLECTION_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);
    return {
      lastUpdated: data.lastUpdated,
      lastSyncedAt: data.syncState.lastSyncedAt,
      userId: data.syncState.userId,
      cardCount: Object.keys(data.collection).length
    };
  } catch (error) {
    console.error('Error getting collection metadata:', error);
    return null;
  }
}

/**
 * Clear all collection data (for debugging/testing)
 * WARNING: This will delete the user's collection
 */
export function clearAllCollectionData() {
  try {
    localStorage.removeItem(COLLECTION_KEY);
  } catch (error) {
    console.error('Error clearing collection data:', error);
  }
}
