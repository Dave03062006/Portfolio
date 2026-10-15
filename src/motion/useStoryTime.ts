import { useEffect, useState } from 'react'
import { springStep } from './spring'
import { story } from './story'

/** How snappily the animation follows the scroll position: it settles in about 6 ÷ SPRING seconds. */
const SPRING = 6

/**
 * Story time for components that draw with React, like the flat logo and its labels.
 * Rather than jumping straight to the scroll position, it glides there like a spring,
 * easing in and then settling. That smooths out mouse wheels, which scroll in big steps,
 * and the page's jumps from one chapter to the next.
 */
export function useStoryTime(): number {
  const [time, setTime] = useState(story.time)

  useEffect(() => {
    let frame = 0
    let current = story.time
    let velocity = 0
    let measured = story.ready
    let last = performance.now()

    const tick = (now: number) => {
      const seconds = Math.min(0.1, (now - last) / 1000)
      last = now

      if (!measured && story.ready) {
        // First frame after the page was measured: start where the page actually is.
        current = story.time
        velocity = 0
        measured = true
      }
      const next = springStep(current, velocity, story.time, seconds, SPRING)
      current = next.position
      velocity = next.velocity
      // Close enough: land exactly on the target, so the logo stops redrawing
      if (Math.abs(story.time - current) < 0.0005 && Math.abs(velocity) < 0.005) {
        current = story.time
        velocity = 0
      }

      setTime(current) // React skips the redraw when the number hasn't changed
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return time
}
