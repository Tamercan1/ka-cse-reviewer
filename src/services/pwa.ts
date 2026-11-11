import { showToast } from '../utils/toast';

let pwaInitialized = false;

/**
 * Registers the Service Worker for offline PWA functionality
 * and listens for network connectivity changes.
 */
export function initPWA(): void {
  if (pwaInitialized) return;
  pwaInitialized = true;

  // Register Service Worker in supporting browsers
  if ('serviceWorker' in navigator) {
    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
    }
  }

  // Connectivity alerts for seamless offline studying
  window.addEventListener('offline', () => {
    showToast('Offline Mode: Maaari ka pa ring mag-review gamit ang naka-save na questions.', 'info');
  });

  window.addEventListener('online', () => {
    showToast('Online: Nakakonekta ka na muli sa internet.', 'success');
  });
}

function registerSW(): void {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      console.log('[PWA] Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.warn('[PWA] Service Worker registration failed:', error);
    });
}
