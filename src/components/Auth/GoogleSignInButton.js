'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function GoogleSignInButton() {
  const { user, syncMetadata, signInWithGoogle, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSyncRecent, setIsSyncRecent] = useState(false);

  useEffect(() => {
    if (!syncMetadata?.lastSyncedAt) {
      setIsSyncRecent(false);
      return;
    }

    const timeSinceSync = Date.now() - new Date(syncMetadata.lastSyncedAt).getTime();

    if (timeSinceSync < 2500) {
      setIsSyncRecent(true);
      const timeoutId = setTimeout(() => {
        setIsSyncRecent(false);
      }, 2500 - timeSinceSync);

      return () => clearTimeout(timeoutId);
    } else {
      setIsSyncRecent(false);
    }
  }, [syncMetadata?.lastSyncedAt]);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };


  return (
    <div className="hidden md:inline-block absolute top-2 right-2 md:top-5 md:right-5 z-50">
      {!user ? (
        <button
          onClick={handleSignIn}
          disabled={loading}
          title="Sign in and save"
          className={`transition-transform hover:scale-110 hover:drop-shadow/30 cursor-pointer ring-2 ring-white shrink-0 grow-0 w-9 h-9 transition-colors bg-blue-500 rounded-full flex items-center justify-center overflow-hidden`}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 2h14v2H4v16h2v-6h12v6h2V6h2v16H2V2h2zm4 18h8v-4H8v4zM20 6h-2V4h2v2zM6 6h9v4H6V6z" fill="#FFF"></path> </g></svg>
        </button>
      ) : (
        <div className="relative group">
          <button className={`transition-transform hover:scale-110 hover:drop-shadow/30 cursor-pointer ring-2 ring-white shrink-0 grow-0 w-9 h-9 transition-colors ${isSyncRecent ? 'bg-amber-500' : 'bg-lime-600'} rounded-full flex items-center justify-center overflow-hidden`}>
            {isSyncRecent ? (
              <svg className="w-6 h-6 mb-0.5 animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g> <path d="M10 4h6v2h-6V4zM8 8V6h2v2H8zm-4 2V8h4v2H4zm-2 2v-2h2v2H2zm0 6H0v-6h2v6zm0 0h7v2H2v-2zM18 8h-2V6h2v2zm4 4h-4V8h2v2h2v2zm0 6v-6h2v6h-2zm0 0v2h-7v-2h7zM11 9h2v2h2v2h2v2h-4v5h-2v-5H7v-2h2v-2h2V9z" fill="#fff"></path> </g></svg>
            ) : (
              <svg className="w-6 h-6 mb-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g> <path d="M16 4h-6v2H8v2H4v2H2v2H0v6h2v2h20v-2h2v-6h-2v-2h-2V8h-2V6h-2V4zm0 2v2h2v4h4v6H2v-6h2v-2h4V8h2V6h6zm-6 6H8v2h2v2h2v-2h2v-2h2v-2h-2v2h-2v2h-2v-2z" fill="#fff"></path> </g></svg>
            )}
          </button>

          {/* Dropdown menu on hover */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="p-2 border-b border-gray-200">
              <p className="text-xs text-gray-500">Signed in as</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.email || 'User'}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 rounded-b-lg transition-colors"
            >
              {loading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      )
      }
    </div >
  );
}
