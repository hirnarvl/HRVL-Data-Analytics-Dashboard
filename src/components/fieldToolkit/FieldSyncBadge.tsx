import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle, HardDrive } from 'lucide-react';
import { SyncStatus } from '../../types/fieldToolkit';
import { soundEngine } from '../../utils/sound';

interface FieldSyncBadgeProps {
  pendingSyncCount: number;
  onManualSync: () => Promise<void>;
  isSyncing: boolean;
}

export const FieldSyncBadge: React.FC<FieldSyncBadgeProps> = ({
  pendingSyncCount,
  onManualSync,
  isSyncing
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-xs">
      <div className="flex items-center gap-1.5">
        {isOnline ? (
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Online
          </span>
        ) : (
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold animate-pulse">
            <WifiOff className="w-3.5 h-3.5" />
            Offline Mode
          </span>
        )}
      </div>

      <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700" />

      <div className="flex items-center gap-1.5">
        {pendingSyncCount > 0 ? (
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
            <HardDrive className="w-3 h-3" />
            {pendingSyncCount} pending sync
          </span>
        ) : (
          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            All records saved
          </span>
        )}
      </div>

      <button
        onClick={() => {
          soundEngine.playClick();
          onManualSync();
        }}
        disabled={isSyncing || !isOnline}
        className={`
          flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all
          ${isOnline 
            ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer active:scale-95' 
            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          }
        `}
        title={isOnline ? 'Sync local drafts with server' : 'Connect to internet to sync'}
      >
        <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
        <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
      </button>
    </div>
  );
};
