'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup
} from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  getUserCollection,
  addCardToCollection,
  addMultipleCards,
  removeCardFromCollection,
  removeMultipleCards,
} from '@/lib/userCollection';
import {
  getLocalCollection,
  saveLocalCollection,
  mergeCollections,
  updateSyncState,
  clearSyncState,
  getCollectionMetadata
} from '@/utils/collectionStorage';
import pokemon from '@/data/game-data.json';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCollection, setUserCollection] = useState({});
  const [isLoadingCollection, setIsLoadingCollection] = useState(true);
  const [syncMetadata, setSyncMetadata] = useState(getCollectionMetadata());

  useEffect(() => {
    const localCollection = getLocalCollection();
    setUserCollection(localCollection);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        setIsLoadingCollection(true);
        try {
          const firebaseCollection = await getUserCollection(currentUser.uid);
          const merged = mergeCollections(localCollection, firebaseCollection);

          saveLocalCollection(merged, currentUser.uid);
          setUserCollection(merged);
        } catch (error) {
          console.error('Error loading user collection:', error);
          setUserCollection(localCollection);
        } finally {
          setIsLoadingCollection(false);
        }
      } else {
        setUser(null);
        const local = getLocalCollection();
        setUserCollection(local);
        setIsLoadingCollection(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const localCollection = getLocalCollection();
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);

      setIsLoadingCollection(true);
      const firebaseCollection = await getUserCollection(result.user.uid);
      const merged = mergeCollections(localCollection, firebaseCollection);

      await Promise.all([
        addMultipleCards(result.user.uid, Object.keys(merged)),
        saveLocalCollection(merged, result.user.uid)
      ]);

      setUserCollection(merged);
      setIsLoadingCollection(false);

      return {
        success: true,
        user: result.user,
        mergeInfo: {
          localCards: Object.keys(localCollection).length,
          cloudCards: Object.keys(firebaseCollection).length,
          totalCards: Object.keys(merged).length
        }
      };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setIsLoadingCollection(false);
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      clearSyncState();
      const localCollection = getLocalCollection();
      setUserCollection(localCollection);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const hasCard = (pokemonName) => {
    return userCollection[pokemonName] === true;
  };

  const addCard = async (pokemonName) => {
    if (!pokemon.cards[pokemonName]) return;

    try {
      const updated = { ...userCollection, [pokemonName]: true };
      setUserCollection(updated);
      saveLocalCollection(updated, user?.uid);

      if (user) {
        await addCardToCollection(user.uid, pokemonName);
        updateSyncState(user.uid, new Date().toISOString());
        setSyncMetadata(getCollectionMetadata());
      }
    } catch (error) {
      console.error('Error adding card:', error);
      // Local update already succeeded, Firebase will retry later
    }
  };

  const addCards = async (pokemonNames) => {
    try {
      const newCards = {};
      pokemonNames.forEach(name => {
        if (!pokemon.cards[name]) return; // No debug cards!

        newCards[name] = true;
      });
      const updated = { ...userCollection, ...newCards };
      setUserCollection(updated);
      saveLocalCollection(updated, user?.uid);

      if (user) {
        await addMultipleCards(user.uid, pokemonNames);
        updateSyncState(user.uid, new Date().toISOString());
        setSyncMetadata(getCollectionMetadata());
      }
    } catch (error) {
      console.error('Error adding cards:', error);
      // Local update already succeeded, Firebase will retry later
    }
  };

  const removeCard = async (pokemonName) => {
    try {
      const updated = { ...userCollection };
      delete updated[pokemonName];
      setUserCollection(updated);
      saveLocalCollection(updated, user?.uid);

      if (user) {
        await removeCardFromCollection(user.uid, pokemonName);
        updateSyncState(user.uid, new Date().toISOString());
        setSyncMetadata(getCollectionMetadata());
      }
    } catch (error) {
      console.error('Error removing card:', error);
      // Local update already succeeded, Firebase will retry later
    }
  };

  const addAllCards = async () => {
    try {
      const allPokemonNames = Object.keys(pokemon.cards);
      const allCards = {};
      allPokemonNames.forEach(name => {
        allCards[name] = true;
      });

      setUserCollection(allCards);
      saveLocalCollection(allCards, user?.uid);

      if (user) {
        await addMultipleCards(user.uid, allPokemonNames);
        updateSyncState(user.uid, new Date().toISOString());
        setSyncMetadata(getCollectionMetadata());
      }
    } catch (error) {
      console.error('Error adding all cards:', error);
    }
  };

  const resetToStarters = async () => {
    try {
      const starterCards = {};
      Object.keys(pokemon.cards).forEach(name => {
        if (pokemon.cards[name].starter === true) {
          starterCards[name] = true;
        }
      });

      const nonStarterCards = Object.keys(userCollection).filter(
        name => !pokemon.cards[name]?.starter
      );

      setUserCollection(starterCards);
      saveLocalCollection(starterCards, user?.uid);

      if (user) {
        await removeMultipleCards(user.uid, nonStarterCards);
        updateSyncState(user.uid, new Date().toISOString());
        setSyncMetadata(getCollectionMetadata());
      }
    } catch (error) {
      console.error('Error resetting to starters:', error);
    }
  };

  const collectionCount = Object.keys(userCollection).length;

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    // Collection management
    userCollection,
    isLoadingCollection,
    hasCard,
    addCard,
    addCards,
    removeCard,
    addAllCards, // debug functions only
    resetToStarters, // debug functions only
    collectionCount,
    // Sync state for UI indicators
    syncMetadata,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
