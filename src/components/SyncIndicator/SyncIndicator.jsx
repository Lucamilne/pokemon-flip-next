import { useAuth } from '@/contexts/AuthContext';

export default function SyncIndicator() {
  const { user, syncMetadata } = useAuth();

  if (!user) {
    return (
      <div className="text-sm text-gray-500">
        ⚠️ Offline mode - Sign in to sync
      </div>
    );
  }

  const isRecent = syncMetadata?.lastSyncedAt &&
    Date.now() - new Date(syncMetadata.lastSyncedAt).getTime() < 5000;

  return (
    <div className={`text-sm ${isRecent ? 'text-green-600' : 'text-gray-500'}`}>
      {isRecent ? '✓ Synced' : '☁️ Cloud enabled'}
    </div>
  );
}
