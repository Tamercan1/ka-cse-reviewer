/**
 * Toast notification utility.
 * Migrated from the showToast() function in utils.js.
 */

type ToastType = 'success' | 'error' | 'info';

/**
 * Display a temporary toast notification.
 * @param message - Text to display.
 * @param type - Visual style: 'success' (green), 'error' (red), 'info' (blue).
 */
export function showToast(message: string, type: ToastType = 'success'): void {
  const toast = document.createElement('div');
  toast.className =
    'fixed top-5 left-4 right-4 sm:top-auto sm:bottom-5 sm:left-auto sm:right-5 sm:w-auto z-50 flex items-center justify-center sm:justify-start space-x-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold transition-all duration-300 transform -translate-y-4 sm:translate-y-4 opacity-0 select-none';

  let svgIcon = '';

  if (type === 'success') {
    toast.className += ' bg-emerald-50 text-emerald-800 border-emerald-250';
    svgIcon = `<svg class="w-4 h-4 text-emerald-600 flex-shrink-0 fill-none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg>`;
  } else if (type === 'error') {
    toast.className += ' bg-rose-50 text-rose-800 border-rose-250';
    svgIcon = `<svg class="w-4 h-4 text-rose-600 flex-shrink-0 fill-none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>`;
  } else {
    toast.className += ' bg-blue-50 text-blue-800 border-blue-250';
    svgIcon = `<svg class="w-4 h-4 text-blue-600 flex-shrink-0 fill-none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.084-1.008l-.382 1.16a.75.75 0 001.077.942l.04-.02m-.03 2.502h.008v.008H12v-.008zM12 3a9 9 0 100 18 9 9 0 000-18z"></path></svg>`;
  }

  toast.innerHTML = `${svgIcon}<span>${message}</span>`;
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove('-translate-y-4', 'sm:translate-y-4', 'opacity-0');
  }, 10);

  // Animate out and remove
  setTimeout(() => {
    toast.classList.add('-translate-y-4', 'sm:translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
