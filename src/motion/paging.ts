import { EXPLODED_STOP } from './choreography'
import type { Direction } from './direction'
import type { SectionMetrics } from './storyTime'

// Section paging: scrolling never comes to rest halfway between two chapters. The page has
// "stops" (scroll positions where it can rest), and one scroll gesture glides it from one
// stop to the next. Chapters taller than the screen are "free stretches" in between, where
// scrolling works normally. These are the rules; useSectionPaging.ts wires them to the page.

export type PageLayout = {
  /** Scroll positions where the page can rest, from top to bottom */
  stops: number[]
  /** Stretches of normal scrolling inside tall chapters, as [start, end] scroll positions */
  free: Array<[number, number]>
}

/** Scroll positions this close count as the same place (browsers round scroll positions). */
const NEAR = 2
/** A chapter needs to be at least this much taller than the screen to get a second stop at its
    end. Less than that is only its bottom padding, and stopping for it would feel like a stutter. */
const MIN_STRETCH = 96

/**
 * Works out the stops from where the sections sit. The intro has two: the name at the top,
 * and the logo taken apart with its labels. Every other chapter has a stop where it starts
 * (just below the top bar) and, if it's clearly taller than the screen, another where it ends.
 */
export function pageLayout(
  sections: readonly SectionMetrics[],
  viewportHeight: number,
  topBarHeight: number,
  maxScroll: number,
): PageLayout {
  const onPage = (y: number) => Math.round(Math.min(maxScroll, Math.max(0, y)))
  const [intro, ...chapters] = sections
  const stops = [0]
  const free: Array<[number, number]> = []

  if (intro) {
    const introRoom = Math.max(0, intro.height - viewportHeight)
    stops.push(onPage(intro.top + EXPLODED_STOP * introRoom))
  }
  chapters.forEach((chapter, i) => {
    const isLast = i === chapters.length - 1
    const start = onPage(chapter.top - topBarHeight)
    const end = isLast ? onPage(maxScroll) : onPage(chapter.top + chapter.height - viewportHeight)
    stops.push(start)
    if (end - start >= MIN_STRETCH) {
      stops.push(end)
      free.push([start, end])
    }
  })

  const sorted = [...stops].sort((a, b) => a - b)
  return { stops: sorted.filter((stop, i) => i === 0 || stop - sorted[i - 1] > NEAR), free }
}

/** The free stretch `y` is in, if any. Its two ends count as inside. */
const freeStretchAt = (y: number, layout: PageLayout) =>
  layout.free.find(([start, end]) => y >= start - NEAR && y <= end + NEAR)

/** The next stop past `y` going that way. At the top or bottom of the page there's nowhere to go, so `y`. */
export function nextStop(y: number, direction: Direction, stops: readonly number[]): number {
  if (direction === 'down') return stops.find((stop) => stop > y + NEAR) ?? y
  return stops.findLast((stop) => stop < y - NEAR) ?? y
}

export type Move = { kind: 'native' } | { kind: 'glide'; to: number }

/**
 * What a scroll gesture of `delta` pixels from `y` should do (positive is down). Inside a tall
 * chapter it scrolls normally, but stops at the chapter's edge first. Anywhere else, the page
 * glides to the next stop.
 */
export function planScroll(y: number, delta: number, layout: PageLayout): Move {
  const direction: Direction = delta > 0 ? 'down' : 'up'
  const stretch = freeStretchAt(y, layout)
  if (stretch) {
    const edge = direction === 'down' ? stretch[1] : stretch[0]
    const room = Math.abs(edge - y)
    if (room > NEAR) return Math.abs(delta) <= room ? { kind: 'native' } : { kind: 'glide', to: edge }
  }
  return { kind: 'glide', to: nextStop(y, direction, layout.stops) }
}

/**
 * For scrolling the browser did on its own (a swipe on a phone, the scrollbar): once the page
 * has stopped, where it should glide on to, or null if it's somewhere it can rest.
 */
export function settleTarget(y: number, direction: Direction, layout: PageLayout): number | null {
  const atStop = layout.stops.some((stop) => Math.abs(stop - y) <= NEAR)
  if (atStop || freeStretchAt(y, layout)) return null
  return nextStop(y, direction, layout.stops)
}

/** How long a glide takes, in milliseconds: longer for longer distances, but never sluggish. */
export function glideDuration(distance: number): number {
  return Math.min(1200, 250 + Math.abs(distance) * 0.75)
}

/** Eases in and out: starts gently, speeds up, then settles. `t` runs from 0 to 1. */
export function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}
