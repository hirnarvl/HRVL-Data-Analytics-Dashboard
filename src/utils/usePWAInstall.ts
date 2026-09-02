import { useEffect, useState, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISSAL_STORAGE_KEY = 'hrvl_pwa_install_dismissed_at';
const DISMISSAL_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    // 1. Detect if already running in standalone / installed mode
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      const isDocumentStandalone = document.referrer.includes('android-app://');
      return isStandaloneMedia || isIOSStandalone || isDocumentStandalone;
    };

    setIsInstalled(checkStandalone());

    // 2. Detect iOS Device
    const userAgent = (typeof navigator !== 'undefined' ? navigator.userAgent || '' : '').toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // 3. Check dismissal timestamp
    try {
      const dismissedTimestamp = localStorage.getItem(DISMISSAL_STORAGE_KEY);
      if (dismissedTimestamp) {
        const timePassed = Date.now() - parseInt(dismissedTimestamp, 10);
        if (timePassed < DISMISSAL_COOLDOWN_MS) {
          setIsDismissed(true);
        } else {
          localStorage.removeItem(DISMISSAL_STORAGE_KEY);
          setIsDismissed(false);
        }
      }
    } catch {
      // Ignore storage errors
    }

    // 4. Listen for Chromium beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      try {
        localStorage.removeItem(DISMISSAL_STORAGE_KEY);
      } catch {
        // Ignore
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('PWA installation prompt failed:', err);
      return false;
    }
  }, [deferredPrompt]);

  const dismissPrompt = useCallback(() => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISSAL_STORAGE_KEY, Date.now().toString());
    } catch {
      // Ignore
    }
  }, []);

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isDismissed,
    install,
    dismissPrompt,
  };
}
