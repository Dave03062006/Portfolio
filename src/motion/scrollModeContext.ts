import { createContext, useContext } from 'react'
import type { ScrollMode } from './scrollMode'

type ScrollModeValue = {
  mode: ScrollMode
  setMode: (mode: ScrollMode) => void
}

/**
 * Shares the visitor's scroll mode with the switches that show it (top bar, chapter menu).
 * `ScrollModeProvider` keeps it up to date and does the actual guiding.
 */
export const ScrollModeContext = createContext<ScrollModeValue>({ mode: 'free', setMode: () => undefined })

/** The current scroll mode, and a function to change it. */
export function useScrollMode(): ScrollModeValue {
  return useContext(ScrollModeContext)
}
