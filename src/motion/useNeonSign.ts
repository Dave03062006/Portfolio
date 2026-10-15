import { useLayoutEffect, type RefObject } from 'react'
import { FlashBudget, nextFlicker, powerOn, SWITCH_ON, STUTTER_ON, type FlickerState, type SignEvent } from './neonSign'

/** The logo's own neon flickers on in the first moments after the page loads (see ignition.ts). */
const LOGO_FLICKER = { name: 'logo', keyframes: [], duration: 800, flashes: 3 }
/** The sign starts switching on once the logo has finished (in milliseconds on the page's clock). */
const FIRST_START = 1200

/**
 * Plays the cover's neon sign (the rules are in neonSign.ts): switches the letters on one by
 * one in a random order, then keeps flickering random letters, one at a time.
 *
 * `root` holds the name's lines (`data-line`), each with its lit letters (`data-letter` inside
 * `data-lit`). The cover's `--room` (0 to 1) says how much of the first line is lit, so the
 * glow around it can follow. While `enabled` is false, every letter simply stays lit.
 */
export function useNeonSign(rootRef: RefObject<HTMLElement | null>, enabled: boolean) {
  // A layout effect runs before the browser paints, so the letters never show lit for a moment first
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !enabled) return
    const lines = [...root.querySelectorAll('[data-line]')].map((line) => [
      ...line.querySelectorAll<HTMLElement>('[data-lit] [data-letter]'),
    ])
    const letters = lines.flat()
    if (letters.length === 0 || typeof letters[0].animate !== 'function') return

    // Every letter as a number, line by line, which is how neonSign.ts refers to them
    let count = 0
    const numbered = lines.map((line) => line.map(() => count++))
    const firstLineSize = lines[0].length

    // Start dark: the sign switches on letter by letter
    for (const letter of letters) letter.style.opacity = '0'
    let firstLineLit = 0
    root.style.setProperty('--room', '0')

    const state: FlickerState = { budget: new FlashBudget(), bag: [], previous: -1 }
    const now = performance.now()
    if (now < FIRST_START + 1000) state.budget.record(0, LOGO_FLICKER)
    const queue: SignEvent[] = powerOn(numbered, Math.max(now + 150, FIRST_START), state.budget, Math.random)

    const running = new Set<Animation>()
    let lastEnd = 0
    let timer = 0

    const play = (event: SignEvent) => {
      const letter = letters[event.letter]
      const animation = letter.animate(event.flicker.keyframes, { duration: event.flicker.duration })
      running.add(animation)
      animation.onfinish = () => {
        running.delete(animation)
        letter.style.opacity = '1'
        const switchedOn = event.flicker === SWITCH_ON || event.flicker === STUTTER_ON
        if (switchedOn && event.letter < firstLineSize) {
          firstLineLit += 1
          root.style.setProperty('--room', String(firstLineLit / firstLineSize))
        }
      }
      lastEnd = Math.max(lastEnd, event.at + event.flicker.duration)
    }

    // Plays whatever is due, then sleeps until the next event. Once the sign is fully on,
    // each finished flicker queues the next random one.
    const tick = () => {
      while (queue.length > 0 && queue[0].at <= performance.now() + 4) play(queue.shift()!)
      if (queue.length === 0) queue.push(nextFlicker(lastEnd, letters.length, state, Math.random))
      timer = window.setTimeout(tick, Math.max(0, queue[0].at - performance.now()))
    }
    tick()

    // Switched off (or leaving the page): stop, and leave every letter steadily lit
    return () => {
      window.clearTimeout(timer)
      for (const animation of running) animation.cancel()
      for (const letter of letters) letter.style.opacity = ''
      root.style.removeProperty('--room')
    }
  }, [rootRef, enabled])
}
