import { showToast } from '../utils/toast';

let pwaInitialized = false;

// TypeScript interface for the native beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

/**
 * Checks if the application is currently running in standalone PWA mode.
 */
export function isRunningStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

/**
 * Updates the visibility of the install buttons in the navbar and mobile menu.
 */
function updateInstallButtonsVisibility(): void {
  // If app is already installed or running standalone, keep buttons hidden
  const shouldShow = !!deferredPrompt && !isRunningStandalone();

  const desktopBtn = document.getElementById('pwa-install-btn-desktop');
  const mobileBtn = document.getElementById('pwa-install-btn-mobile');

  if (desktopBtn) {
    if (shouldShow) {
      desktopBtn.classList.remove('hidden');
      desktopBtn.classList.add('inline-flex');
    } else {
      desktopBtn.classList.add('hidden');
      desktopBtn.classList.remove('inline-flex');
    }
  }

  if (mobileBtn) {
    if (shouldShow) {
      mobileBtn.classList.remove('hidden');
      mobileBtn.classList.add('flex');
    } else {
      mobileBtn.classList.add('hidden');
      mobileBtn.classList.remove('flex');
    }
  }
}

/**
 * Triggers the browser's native install prompt.
 */
async function handleInstallClick(): Promise<void> {
  if (!deferredPrompt) return;

  try {
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt');
    } else {
      console.log('[PWA] User dismissed the install prompt');
    }
  } catch (err) {
    console.error('[PWA] Error displaying install prompt:', err);
  } finally {
    deferredPrompt = null;
    updateInstallButtonsVisibility();
  }
}

/**
 * Attaches click handlers and checks visibility for the navbar install buttons.
 */
export function setupInstallButtons(): void {
  const desktopBtn = document.getElementById('pwa-install-btn-desktop');
  const mobileBtn = document.getElementById('pwa-install-btn-mobile');

  if (desktopBtn) {
    desktopBtn.onclick = handleInstallClick;
  }

  if (mobileBtn) {
    mobileBtn.onclick = handleInstallClick;
  }

  // Update initial visibility based on deferredPrompt status
  updateInstallButtonsVisibility();
}

/**
 * Registers the Service Worker for offline PWA functionality
 * and listens for network connectivity and install prompt events.
 */
export function initPWA(): void {
  if (pwaInitialized) return;
  pwaInitialized = true;

  // Capture beforeinstallprompt event (Chromium browsers)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    updateInstallButtonsVisibility();
  });

  // Listen for completed installation (via our button or address bar)
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] Ka-CSE Reviewer was installed.');
    deferredPrompt = null;
    updateInstallButtonsVisibility();
  });

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
