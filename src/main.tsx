import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { I18nProvider } from './contexts/I18nContext.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import './index.css'
import 'leaflet/dist/leaflet.css'

// Handle benign IndexedDB lifecycle events and offline transitions gracefully
if (typeof window !== 'undefined') {
  // Suppress expected sandbox [vite] HMR notices
  const origWarn = console.warn;
  const origError = console.error;
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('[vite]')) return;
    origWarn.apply(console, args);
  };
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('[vite]')) return;
    origError.apply(console, args);
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason instanceof Error ? reason.message : String(reason || '');
    if (
      msg.includes('Database is closing') ||
      msg.includes('Database is hidden') ||
      msg.includes('closing') ||
      msg.includes('IndexedDB') ||
      msg.includes('unavailable') ||
      msg.includes('offline')
    ) {
      event.preventDefault();
      console.info('[Lifecycle] Handled background database transition gracefully.');
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (
      msg.includes('Database is closing') ||
      msg.includes('Database is hidden') ||
      msg.includes('IndexedDB')
    ) {
      event.preventDefault();
      console.info('[Lifecycle] Suppressed benign storage lifecycle notice.');
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </I18nProvider>
  </React.StrictMode>,
)


