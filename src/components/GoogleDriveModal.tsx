import React from 'react';
import { X, HardDrive, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  records?: any[];
  onImportRecords?: (records: any[]) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <HardDrive className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">HRVL Shared Drive</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Access centralized datasets securely</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                <HardDrive className="w-8 h-8 text-blue-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Official HRVL Data Repository
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  To ensure smooth access without security warnings, all official Epizootiological datasets, logs, and surveillance reports are hosted securely in our centralized Google Drive folder.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                <ShieldCheck className="w-5 h-5" />
                <span>Verified Access Link</span>
              </div>
              <a
                href="https://drive.google.com/drive/folders/1QxnB2XqQJeN-uUWKvo6dlFWKhNQqxrwl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors font-medium shadow-md shadow-blue-500/20"
              >
                <span>Open Google Drive Folder</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
