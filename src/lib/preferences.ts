// Small settings the visitor picks (scroll mode, the cover's flicker), remembered in the
// browser's localStorage so they stick for the next visit. Some browsers (private windows)
// don't allow saving; then the switches still work, just for this visit.

/** The visitor's saved choice, or null if there isn't one (or it can't be read). */
export function readPreference(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

/** Remembers the visitor's choice, if the browser allows it. */
export function savePreference(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Not saved: the choice still applies for this visit.
  }
}
