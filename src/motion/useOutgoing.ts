import { useEffect, useState } from 'react'

/**
 * For animations that swap one value for another, like a number rolling over.
 * Returns the value that was just replaced, so the old and the new can be on screen
 * together while the old one animates away. After `durationMs` (the length of that
 * animation) it returns null again and the old value can go.
 */
export function useOutgoing<T>(value: T, durationMs: number): T | null {
  const [state, setState] = useState<{ value: T; outgoing: T | null }>({ value, outgoing: null })

  // The value changed since the last render: remember the old one. Updating state during
  // render is React's own recipe for "react to a changed prop": React redraws straight
  // away, before anything reaches the screen.
  if (!Object.is(value, state.value)) {
    setState({ value, outgoing: state.value })
  }

  // Once the old value has had time to animate away, let it go.
  useEffect(() => {
    if (state.outgoing === null) return
    const timer = window.setTimeout(() => setState((current) => ({ ...current, outgoing: null })), durationMs)
    return () => window.clearTimeout(timer)
  }, [state.outgoing, durationMs])

  return state.outgoing
}
