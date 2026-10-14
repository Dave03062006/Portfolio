import { createContext, useContext } from 'react'
import type { ChapterId } from '../content/types'

/**
 * Shares "which chapter is on screen right now" with every component that needs it
 * (the chapter list, the top bar, the logo) without passing it through every layer by hand.
 * `ChapterProvider` keeps the value up to date.
 */
export const ChapterContext = createContext<ChapterId>('intro')

/** The chapter currently in the middle of the screen. */
export function useActiveChapter(): ChapterId {
  return useContext(ChapterContext)
}
