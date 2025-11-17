'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInAnonymously,
  signInWithPopup,
  linkWithPopup
} from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Auto sign-in anonymously if no user
        try {
          const result = await signInAnonymously(auth);
          setUser(result.user);
        } catch (error) {
          console.error('Error signing in anonymously:', error);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      // If user is anonymous, link the Google account
      if (user && user.isAnonymous) {
        const result = await linkWithPopup(user, googleProvider);
        setUser(result.user);
        return { success: true, user: result.user, linked: true };
      } else {
        // Otherwise just sign in with Google
        const result = await signInWithPopup(auth, googleProvider);
        setUser(result.user);
        return { success: true, user: result.user, linked: false };
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      // After sign out, auto sign-in anonymously again
      const result = await signInAnonymously(auth);
      setUser(result.user);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    isAnonymous: user?.isAnonymous || false,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
