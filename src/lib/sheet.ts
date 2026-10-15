import type { Chapter, ChapterId } from '../content/types'
import { directionBetween, type Direction } from '../motion/direction'

/** How far down the page you are: 0 at the top, 1 at the very bottom. */
export function scrollProgress(scrollY: number, pageHeight: number, viewportHeight: number): number {
  const room = pageHeight - viewportHeight
  if (room <= 0) return 0
  return Math.min(1, Math.max(0, scrollY / room))
}

/** What the title block's PART box says: the piece of the logo a chapter is about. */
export function sheetPart(chapter: Chapter): string {
  if (chapter.part === 'core') return 'Core'
  return chapter.part ?? 'DT' // no single piece: the whole logo
}

/** Chapter changes this soon after the page loads are the page finding its place, not the visitor scrolling. */
const SETTLE_MS = 800

type ChapterChange = { from: ChapterId; to: ChapterId; reduced: boolean; msSinceLoad: number }

/**
 * Whether the big scan line sweeps across the screen when the chapter changes, and which way:
 * down the screen when the visitor moves down the page, up when they go back. It stays off
 * while the page is still finding its place after loading, and for people who've asked
 * their device for less motion.
 */
export function sweepDirection({ from, to, reduced, msSinceLoad }: ChapterChange): Direction | null {
  if (from === to || reduced || msSinceLoad <= SETTLE_MS) return null
  return directionBetween(from, to)
}
