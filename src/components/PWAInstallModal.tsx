import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Share2, PlusSquare, Smartphone, CheckCircle2, ShieldCheck, Zap, WifiOff } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  onInstall: () => Promise<boolean>;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  isIOS,
  onInstall
}) => {
  const { t } = useI18n();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <img 
                src="/hrvl-emblem.png" 
                alt="HRVL Emblem" 
                className="w-10 h-10 object-contain rounded-lg p-0.5 bg-slate-900 border border-slate-700 shadow-sm"
              />
              <div>
                <h3 id="pwa-modal-title" className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {t.installHRVLDashboard || 'Install HRVL Dashboard'}
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {isInstalled ? (t.appInstalled || 'App Installed & Active') : 'Progressive Web App (PWA)'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={t.close || 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {isInstalled ? (
              <div className="text-center py-4 space-y-3">
                <div className="inline-flex p-3 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t.appInstalled || 'HRVL Dashboard is Installed'}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  You are currently using or have installed the standalone version of the Hirna Regional Veterinary Laboratory Analytics application.
                </p>
              </div>
            ) : isIOS ? (
              /* iOS Safari Guided Steps */
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Follow these simple steps in <strong>Apple Safari</strong> to install HRVL ADNIS on your home screen:
                </p>

                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Share2 className="w-4 h-4 text-blue-500" />
                        {t.iosShareStep || 'Tap the Share button in Safari'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Located at the bottom bar on iPhone or top right on iPad.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <PlusSquare className="w-4 h-4 text-emerald-500" />
                        {t.iosAddHomeStep || 'Scroll down and tap "Add to Home Screen"'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Confirm with <strong>Add</strong> at the top right corner.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : isInstallable ? (
              /* Chromium / Android Direct Install */
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {t.installPwaDescription || 'Install HRVL ADNIS for instant offline-first field surveillance, GIS mapping, and rapid outbreak analytics.'}
                </p>

                {/* Key Benefits Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <WifiOff className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">Offline Ready</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">Field surveys without network</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <Zap className="w-5 h-5 text-blue-500 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">Fast Launch</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">Native app performance</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">Secure</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">Role-based data sync</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Fallback / Already Available */
              <div className="space-y-3 text-center py-2">
                <Smartphone className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  To install, use your browser&apos;s menu (⋮) and select <strong>Install App</strong> or <strong>Add to Home screen</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {isInstalled ? (t.close || 'Close') : (t.notNow || 'Not Now')}
            </button>

            {isInstallable && !isInstalled && (
              <button
                onClick={async () => {
                  const installed = await onInstall();
                  if (installed) onClose();
                }}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-all shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                {t.installNow || 'Install Now'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
