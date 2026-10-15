import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { initialScrollMode, readSavedScrollMode, saveScrollMode, type ScrollMode } from './scrollMode'
import { ScrollModeContext } from './scrollModeContext'
import { useReducedMotion } from './useReducedMotion'
import { useSectionPaging } from './useSectionPaging'

/**
 * Remembers whether the visitor wants guided or free scrolling, and switches the guiding on
 * or off to match. Wrap the whole site in it.
 */
export function ScrollModeProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  // The function form of useState runs only once, on the first render: read the saved choice then.
  const [mode, setModeState] = useState<ScrollMode>(() => initialScrollMode(readSavedScrollMode(), reduced))

  const setMode = useCallback((next: ScrollMode) => {
    setModeState(next)
    saveScrollMode(next)
  }, [])
  const value = useMemo(() => ({ mode, setMode }), [mode, setMode])

  // Guided: one scroll glides to the next chapter. With reduced motion, it jumps instead of gliding.
  useSectionPaging(mode === 'guided', reduced)

  return <ScrollModeContext.Provider value={value}>{children}</ScrollModeContext.Provider>
}
