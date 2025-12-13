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

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCollection, setUserCollection] = useState({});
  const [isLoadingCollection, setIsLoadingCollection] = useState(false);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Load user's collection
        setIsLoadingCollection(true);
        try {
          const collection = await getUserCollection(currentUser.uid);
          setUserCollection(collection);
        } catch (error) {
          console.error('Error loading user collection:', error);
        } finally {
          setIsLoadingCollection(false);
        }
      } else {
        // No user signed in
        setUser(null);
        setUserCollection({});
        setIsLoadingCollection(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);

      // Load user's collection after signing in
      setIsLoadingCollection(true);
      const collection = await getUserCollection(result.user.uid);
      setUserCollection(collection);
      setIsLoadingCollection(false);

      return { success: true, user: result.user };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setIsLoadingCollection(false);
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      // Clear collection on sign out
      setUserCollection({});
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
    if (!user) {
      console.warn('Cannot add cards - user not signed in');
      return;
    }

    try {
      await addCardToCollection(user.uid, pokemonName);
      setUserCollection(prev => ({ ...prev, [pokemonName]: true }));
    } catch (error) {
      console.error('Error adding card:', error);
      throw error;
    }
  };

  // Add multiple cards to the collection
  const addCards = async (pokemonNames) => {
    if (!user) {
      console.warn('Cannot add cards - user not signed in');
      return;
    }

    try {
      await addMultipleCards(user.uid, pokemonNames);
      const newCards = {};
      pokemonNames.forEach(name => {
        newCards[name] = true;
      });
      setUserCollection(prev => ({ ...prev, ...newCards }));
    } catch (error) {
      console.error('Error adding cards:', error);
      throw error;
    }
  };

  // Remove a card from the collection
  const removeCard = async (pokemonName) => {
    if (!user) {
      console.warn('Cannot remove cards - user not signed in');
      return;
    }

    try {
      await removeCardFromCollection(user.uid, pokemonName);
      setUserCollection(prev => {
        const updated = { ...prev };
        delete updated[pokemonName];
        return updated;
      });
    } catch (error) {
      console.error('Error removing card:', error);
      throw error;
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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
