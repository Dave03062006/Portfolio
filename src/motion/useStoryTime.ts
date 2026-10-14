import { useEffect, useState } from 'react'
import { story } from './story'

/** How quickly the animation catches up with the scroll position. Higher is snappier. */
const CATCH_UP = 6

/**
 * Story time for components that draw with React, like the flat logo and its labels.
 * Rather than jumping straight to the scroll position, it glides toward it on every frame.
 * That smooths out mouse wheels, which scroll in big steps.
 */
export function useStoryTime(): number {
  const [time, setTime] = useState(story.time)

  useEffect(() => {
    let frame = 0
    let current = story.time
    let measured = story.ready
    let last = performance.now()

    const tick = (now: number) => {
      const seconds = Math.min(0.1, (now - last) / 1000)
      last = now

      if (!measured && story.ready) {
        // First frame after the page was measured: start where the page actually is.
        current = story.time
        measured = true
      }
      current += (story.time - current) * (1 - Math.exp(-seconds * CATCH_UP))
      if (Math.abs(story.time - current) < 0.0005) current = story.time

      setTime(current) // React skips the redraw when the number hasn't changed
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return time
}
