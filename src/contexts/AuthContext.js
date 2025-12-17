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
  getCollectionCount
} from '@/lib/userCollection';
import {
  getLocalCollection,
  saveLocalCollection,
  mergeCollections,
  updateSyncState,
  clearSyncState,
  getCollectionMetadata
} from '@/utils/collectionStorage';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCollection, setUserCollection] = useState({});
  const [isLoadingCollection, setIsLoadingCollection] = useState(true);
  const [syncMetadata, setSyncMetadata] = useState(getCollectionMetadata());

  useEffect(() => {
    // Load local collection immediately (before Firebase)
    const localCollection = getLocalCollection();
    setUserCollection(localCollection);

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Load user's collection and merge with local
        setIsLoadingCollection(true);
        try {
          const firebaseCollection = await getUserCollection(currentUser.uid);
          const merged = mergeCollections(localCollection, firebaseCollection);

          // Save merged result to both Firebase and localStorage
          await addMultipleCards(currentUser.uid, Object.keys(merged));
          saveLocalCollection(merged, currentUser.uid);
          setUserCollection(merged);
        } catch (error) {
          console.error('Error loading user collection:', error);
          // Fall back to local collection on error
          setUserCollection(localCollection);
        } finally {
          setIsLoadingCollection(false);
        }
      } else {
        // No user signed in - keep local collection for offline play
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

      // Load user's collection after signing in and merge
      setIsLoadingCollection(true);
      const firebaseCollection = await getUserCollection(result.user.uid);
      const merged = mergeCollections(localCollection, firebaseCollection);

      // Save merged result to both Firebase and localStorage
      await Promise.all([
        addMultipleCards(result.user.uid, Object.keys(merged)),
        saveLocalCollection(merged, result.user.uid)
      ]);

      setUserCollection(merged);
      setIsLoadingCollection(false);

      // Return merge info for potential UI notification
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
      // Keep collection in localStorage, just clear sync state
      clearSyncState();
      const localCollection = getLocalCollection();
      setUserCollection(localCollection);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Helper function to check if user owns a card
  const hasCard = (pokemonName) => {
    return userCollection[pokemonName] === true;
  };

  // Add a single card to the collection
  const addCard = async (pokemonName) => {
    try {
      // Optimistic update - save to localStorage immediately
      const updated = { ...userCollection, [pokemonName]: true };
      setUserCollection(updated);
      saveLocalCollection(updated, user?.uid);

      // Sync to Firebase if signed in
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

  // Add multiple cards to the collection
  const addCards = async (pokemonNames) => {
    try {
      // Optimistic update - save to localStorage immediately
      const newCards = {};
      pokemonNames.forEach(name => {
        newCards[name] = true;
      });
      const updated = { ...userCollection, ...newCards };
      setUserCollection(updated);
      saveLocalCollection(updated, user?.uid);

      // Sync to Firebase if signed in
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

  // Remove a card from the collection
  const removeCard = async (pokemonName) => {
    try {
      // Optimistic update - save to localStorage immediately
      const updated = { ...userCollection };
      delete updated[pokemonName];
      setUserCollection(updated);
      saveLocalCollection(updated, user?.uid);

      // Sync to Firebase if signed in
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

  // Get the count of owned cards
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
