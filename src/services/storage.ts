/**
 * Typed localStorage wrappers.
 * Replaces the global save()/load()/clear() functions from storage.js.
 * All serialization and error handling is in one place.
 */

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

export function load<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error('Error loading from localStorage:', e);
    return defaultValue;
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing from localStorage:', e);
  }
}

export function clear(): void {
  try {
    localStorage.clear();
  } catch (e) {
    console.error('Error clearing localStorage:', e);
  }
}
