import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import PixelFloppy from '@/assets/svg/PixelFloppy';
import PixelCloudSync from '@/assets/svg/PixelCloudSync';
import PixelCloud from '@/assets/svg/PixelCloud';

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
    <div>
      {!user ? (
        <button
          onClick={handleSignIn}
          disabled={loading}
          title="Sign in and save"
          className={`cursor-pointer flex items-center justify-center overflow-hidden`}
        >
          <PixelFloppy className="w-7 h-7 drop-shadow" />
        </button>
      ) : (
        <div className="relative group">
          <button className={`cursor-pointer flex items-center justify-center overflow-hidden`}>
            {isSyncRecent ? (
              <PixelCloudSync className="w-7 h-7 drop-shadow animate-pulse" />
            ) : (
              <PixelCloud className="w-7 h-7 drop-shadow" />
            )}
          </button>

          {/* Dropdown menu on hover */}
          <div className="absolute top-0 right-9 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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
