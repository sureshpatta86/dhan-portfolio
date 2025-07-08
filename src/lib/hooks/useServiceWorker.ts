/**
 * Service worker registration for handling chunk loading errors
 */

'use client';

import { useEffect } from 'react';

export function useServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Listen for messages from the service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'CHUNK_LOAD_ERROR') {
          console.warn('Chunk loading error detected by service worker:', event.data.url);
          window.location.reload();
        }
      });
    }
  }, []);
}

// Component that uses the hook
export function ServiceWorkerRegistration() {
  useServiceWorkerRegistration();
  return null;
}
