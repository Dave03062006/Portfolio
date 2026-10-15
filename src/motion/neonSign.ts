// The cover's name as a neon sign, letter by letter: the rules for when each letter switches
// on, and for the random flickers after that. useNeonSign.ts plays them on the page.
//
// Safe for people with photosensitive epilepsy (WCAG 2.3.1): only one letter flickers at a
// time, and never more than 3 flashes in any second across the whole name.

/** How one letter changes: opacity keyframes for the Web Animations API, and how many flashes that makes. */
export type Flicker = {
  name: string
  keyframes: Keyframe[]
  duration: number
  flashes: number
}

/** One letter's flicker, starting at `at` (milliseconds on the page's clock). */
export type SignEvent = { at: number; letter: number; flicker: Flicker }

/** An unlit tube still catches a little light, so "off" is never quite black. */
const OFF = 0.06

/**
 * Builds keyframes from [moment (0 to 1), opacity] steps. Each change takes 1% of the time,
 * so the light snaps on and off like a real tube instead of fading.
 */
export function snap(steps: [at: number, opacity: number][]): Keyframe[] {
  const [[, first], ...changes] = steps
  const keyframes: Keyframe[] = [{ offset: 0, opacity: first }]
  let current = first
  for (const [at, opacity] of changes) {
    // Hold the current opacity until `at`, then jump to the new one
    keyframes.push({ offset: at, opacity: current }, { offset: Math.min(1, at + 0.01), opacity })
    current = opacity
  }
  keyframes.push({ offset: 1, opacity: current })
  return keyframes
}

/** Switching a letter on: straight on, or with a stutter first. */
export const SWITCH_ON: Flicker = { name: 'on', keyframes: snap([[0, 0], [0.02, 1]]), duration: 60, flashes: 0 }
export const STUTTER_ON: Flicker = {
  name: 'stutter-on',
  keyframes: snap([[0, 0], [0.02, 0.9], [0.3, OFF], [0.62, 1]]),
  duration: 260,
  flashes: 1,
}

/** The flickers a lit letter can do later. Every one starts and ends fully on. */
export const FLICKERS: Flicker[] = [
  { name: 'blink', keyframes: snap([[0, 1], [0.3, OFF], [0.62, 1]]), duration: 260, flashes: 1 },
  { name: 'double', keyframes: snap([[0, 1], [0.2, OFF], [0.36, 1], [0.56, OFF], [0.76, 1]]), duration: 420, flashes: 2 },
  { name: 'buzz', keyframes: snap([[0, 1], [0.15, 0.35], [0.35, 1], [0.55, 0.5], [0.75, 1]]), duration: 380, flashes: 2 },
  { name: 'dropout', keyframes: snap([[0, 1], [0.08, OFF], [0.55, 0.8], [0.66, OFF], [0.8, 1]]), duration: 900, flashes: 2 },
]
/** How often each of FLICKERS is picked: mostly short blinks, now and then a dropout. */
const FLICKER_WEIGHTS = [0.42, 0.24, 0.24, 0.1]

const MAX_FLASHES_PER_SECOND = 3

/**
 * Keeps count of flashes, so the sign never makes more than 3 in any second. Each flash is
 * written down at the end of its flicker, which can only overcount, never undercount.
 */
export class FlashBudget {
  private times: number[] = []

  /** Whether a flicker making `flashes` flashes may start at `at`. */
  allows(at: number, flashes: number): boolean {
    if (flashes === 0) return true
    const recent = this.times.filter((time) => time > at - 1000).length
    return recent + flashes <= MAX_FLASHES_PER_SECOND
  }

  record(at: number, flicker: Flicker) {
    for (let i = 0; i < flicker.flashes; i++) this.times.push(at + flicker.duration)
    this.times = this.times.filter((time) => time > at - 2000) // old ones no longer matter
  }
}

/** Shuffles a copy of the list (the Fisher–Yates way), using `random` for the dice. */
function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * The sign switching on, from `start`: each line's letters light up one by one in a random
 * order (the first line first), some with a stutter. A stutter only happens when no other
 * letter is mid-stutter and the flash budget allows it.
 * `lines` lists each line's letter numbers. Returns the events, in time order.
 */
export function powerOn(lines: readonly number[][], start: number, budget: FlashBudget, random: () => number): SignEvent[] {
  const events: SignEvent[] = []
  let at = start
  let flashFreeAt = 0 // when the last stutter ends
  for (const line of lines) {
    for (const letter of shuffled(line, random)) {
      const stutter = random() < 0.3 && at >= flashFreeAt && budget.allows(at, STUTTER_ON.flashes)
      const flicker = stutter ? STUTTER_ON : SWITCH_ON
      budget.record(at, flicker)
      if (stutter) flashFreeAt = at + flicker.duration
      events.push({ at, letter, flicker })
      at += 60 + random() * 90
    }
    at += 350 // a breath between the lines
  }
  return events
}

/** What the random flickers remember between one and the next. */
export type FlickerState = {
  budget: FlashBudget
  /** Letters still waiting for a turn. Every letter gets one, in a random order, before any goes again. */
  bag: number[]
  previous: number
}

/**
 * The next random flicker once the sign is lit, after the previous one ended at `after`:
 * the next letter from the bag, a random kind of flicker, at a random moment, delayed
 * further if the flash budget needs it.
 */
export function nextFlicker(after: number, letterCount: number, state: FlickerState, random: () => number): SignEvent {
  if (state.bag.length === 0) {
    state.bag = shuffled(Array.from({ length: letterCount }, (_, i) => i), random)
    // Don't start the new round with the letter that just flickered
    if (state.bag.at(-1) === state.previous && letterCount > 1) state.bag.unshift(state.bag.pop()!)
  }
  const letter = state.bag.pop()!
  let roll = random()
  const index = FLICKER_WEIGHTS.findIndex((weight) => (roll -= weight) < 0)
  const flicker = FLICKERS[index === -1 ? 0 : index]
  let at = after + 250 + random() * 1100
  while (!state.budget.allows(at, flicker.flashes)) at += 100
  state.budget.record(at, flicker)
  state.previous = letter
  return { at, letter, flicker }
}
