import type { Chapter, ChapterId } from '../content/types'

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

type ChapterChange = {
  from: ChapterId
  to: ChapterId
  /** Whether the sweep has already played on this visit */
  played: boolean
  reduced: boolean
  msSinceLoad: number
}

/**
 * Whether to play the big scan line across the whole screen. It plays once per visit:
 * the first time the visitor scrolls out of the intro. Seeing it at every chapter would get tiring.
 */
export function shouldSweep({ from, to, played, reduced, msSinceLoad }: ChapterChange): boolean {
  return !played && !reduced && from === 'intro' && to !== 'intro' && msSinceLoad > SETTLE_MS
}
