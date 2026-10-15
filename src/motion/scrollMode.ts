import { readPreference, savePreference } from '../lib/preferences'

/**
 * How scrolling works, chosen by the visitor with the switch in the top bar (or the chapter
 * menu on phones): 'guided' glides from chapter to chapter (useSectionPaging.ts), 'free' is
 * ordinary scrolling.
 */
export type ScrollMode = 'guided' | 'free'

/** Where the choice is remembered in the browser, so it sticks for the next visit. */
const STORAGE_KEY = 'dt-scroll-mode'

/**
 * The mode to start in: the visitor's earlier choice, if they made one. Otherwise guided,
 * unless their device asks for reduced motion.
 */
export function initialScrollMode(saved: string | null, reducedMotion: boolean): ScrollMode {
  if (saved === 'guided' || saved === 'free') return saved
  return reducedMotion ? 'free' : 'guided'
}

/** The visitor's saved choice, or null. */
export function readSavedScrollMode(): string | null {
  return readPreference(STORAGE_KEY)
}

export function saveScrollMode(mode: ScrollMode) {
  savePreference(STORAGE_KEY, mode)
}
