import { useState } from 'react'
import type { ChapterId } from '../content/types'
import { useActiveChapter } from './chapterContext'
import { directionBetween, type Direction } from './direction'

/**
 * Which way the visitor last moved between chapters: 'down' the page or back 'up'.
 * Animations use it to move the same way the page just did.
 */
export function useChapterDirection(): Direction {
  const active = useActiveChapter()
  const [last, setLast] = useState<{ chapter: ChapterId; direction: Direction }>({
    chapter: active,
    direction: 'down',
  })

  // The chapter changed since the last render: work out which way. (Updating state during
  // render is React's recipe for reacting to a change; see useOutgoing.ts.)
  if (active !== last.chapter) {
    setLast({ chapter: active, direction: directionBetween(last.chapter, active) })
  }

  return last.direction
}
