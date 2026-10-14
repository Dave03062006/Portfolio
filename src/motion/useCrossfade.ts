import { useEffect, useState } from 'react'

/**
 * Changes a value with a quick fade instead of instantly: fade out, swap, fade back in.
 * With reduced motion on, this lets the logo change pose without anything visibly moving.
 */
export function useCrossfade<T>(value: T, fadeMs = 200): { shown: T; visible: boolean } {
  const [shown, setShown] = useState(value)

  // While a new value is waiting to be shown, the old one is fading out.
  const visible = Object.is(value, shown)

  useEffect(() => {
    if (visible) return
    // Once the fade-out has finished, swap in the new value (which fades back in).
    const timer = window.setTimeout(() => setShown(value), fadeMs)
    return () => window.clearTimeout(timer)
  }, [value, visible, fadeMs])

  return { shown, visible }
}
