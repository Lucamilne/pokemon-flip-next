const GAME_STATE_KEY = 'pokemonGameState';

/**
 * Save game state to localStorage
 * @param {Object} gameState - The game state object containing cells, hands, and turn info
 */
export const saveGameState = (gameState) => {
    try {
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
    } catch (error) {
        console.error('Failed to save game state:', error);
    }
};

/**
 * Load game state from localStorage
 * @returns {Object|null} The saved game state or null if none exists
 */
export const loadGameState = () => {
    try {
        const savedState = localStorage.getItem(GAME_STATE_KEY);
        return savedState ? JSON.parse(savedState) : null;
    } catch (error) {
        console.error('Failed to load game state:', error);
        return null;
    }
};

/**
 * Clear game state from localStorage
 */
export const clearGameState = () => {
    try {
        localStorage.removeItem(GAME_STATE_KEY);
    } catch (error) {
        // do nothing
    }
};
