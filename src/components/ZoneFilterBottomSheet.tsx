import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Map } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

interface ZoneFilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentZone: string;
  onSelectZone: (zone: string) => void;
}

export const ZoneFilterBottomSheet: React.FC<ZoneFilterBottomSheetProps> = ({
  isOpen,
  onClose,
  currentZone,
  onSelectZone
}) => {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');

  const zones = [
    { id: 'All', label: t.allZones },
    { id: 'E/H', label: t.eastHararghe },
    { id: 'W/H', label: t.westHararghe },
  ];

  const filteredZones = zones.filter(z => z.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl border-t border-slate-200 dark:border-slate-800 p-4 lg:hidden max-h-[85vh] flex flex-col"
          >
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4" />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Map className="w-5 h-5 text-indigo-500" />
                <span>Select Zone</span>
              </h3>
              <button
                onClick={onClose}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search zones..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="overflow-y-auto space-y-2 pb-safe custom-scrollbar flex-1">
              {filteredZones.map(zone => (
                <button
                  key={zone.id}
                  onClick={() => {
                    onSelectZone(zone.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-colors ${
                    currentZone === zone.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={`font-semibold ${currentZone === zone.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>
                    {zone.label}
                  </span>
                  {currentZone === zone.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  )}
                </button>
              ))}
              {filteredZones.length === 0 && (
                <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                  No zones found matching "{searchTerm}"
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
