// The cover: the first screen, before the hero. The logo sits big in the middle of the screen
// with Dave's name around it, and the first scroll flies it to its usual place while the hero
// appears. These functions say how far along that is, from story time (see storyTime.ts).

/** The id of the empty box on the cover where the logo sits (Cover.tsx). Stage.tsx measures it. */
export const COVER_SLOT_ID = 'cover-slot'

/** Where the position of the cover's flicker switch is remembered. */
export const FLICKER_KEY = 'dt-cover-flicker'

/**
 * Whether the name on the cover flickers like a neon sign: the visitor's earlier choice if
 * they flipped the switch, otherwise on, unless their device asks for reduced motion.
 */
export function initialFlicker(saved: string | null, reducedMotion: boolean): boolean {
  if (saved === 'on') return true
  if (saved === 'off') return false
  return !reducedMotion
}

/** Eases in and out between two moments of story time: 0 before `start`, 1 after `end`. */
function between(time: number, start: number, end: number): number {
  const x = Math.min(1, Math.max(0, (time - start) / (end - start)))
  return x * x * (3 - 2 * x)
}

/**
 * How much the logo is still on the cover: 1 on the first screen (big, in the middle),
 * 0 once it has flown to its place beside the hero. The flight takes the first half of the
 * intro's story, while the logo turns.
 */
export function coverAmount(time: number): number {
  return 1 - between(time, 0, 0.5)
}

/** How visible the name around the cover is. It clears out first, before the logo has gone far. */
export function coverNameOpacity(time: number): number {
  return 1 - between(time, 0, 0.3)
}

/** How visible the hero's text is. It fades in as the logo arrives, once the cover's name has gone. */
export function heroReveal(time: number): number {
  return between(time, 0.3, 0.65)
}
