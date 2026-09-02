import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Smartphone, Share2 } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

interface PWAInstallBannerProps {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isDismissed: boolean;
  onInstall: () => Promise<boolean>;
  onOpenModal: () => void;
  onDismiss: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  isInstallable,
  isInstalled,
  isIOS,
  isDismissed,
  onInstall,
  onOpenModal,
  onDismiss
}) => {
  const { t } = useI18n();

  // Hide if already installed or dismissed recently
  if (isInstalled || isDismissed) {
    return null;
  }

  // Only show if browser supports direct install or on iOS Safari
  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] bg-slate-900/95 text-white border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md p-4 overflow-hidden"
        role="region"
        aria-label={t.installHRVLDashboard || 'Install App Banner'}
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start gap-3 relative">
          <img 
            src="/hrvl-emblem.png" 
            alt="HRVL Emblem" 
            className="w-11 h-11 object-contain rounded-xl p-0.5 bg-slate-950 border border-slate-700/80 shrink-0 shadow-md"
          />

          <div className="flex-1 min-w-0 pr-4">
            <h4 className="text-xs font-bold text-slate-100 leading-snug">
              {t.installHRVLDashboard || 'Install HRVL Dashboard'}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
              {isIOS 
                ? 'Add to your Home Screen for quick offline field access.'
                : (t.installPwaDescription || 'Install for instant offline field surveillance and GIS mapping.')
              }
            </p>

            <div className="flex items-center gap-2 mt-3">
              {isInstallable ? (
                <button
                  onClick={onInstall}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  {t.installNow || 'Install'}
                </button>
              ) : isIOS ? (
                <button
                  onClick={onOpenModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  How to Install
                </button>
              ) : null}

              <button
                onClick={onDismiss}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                {t.notNow || 'Not now'}
              </button>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 transition-colors shrink-0"
            aria-label={t.close || 'Dismiss'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
