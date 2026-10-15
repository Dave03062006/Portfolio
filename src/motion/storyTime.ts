/** Where a section sits on the page, in pixels from the top of the document. */
export type SectionMetrics = { top: number; height: number }

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/** The story time each chapter spends arriving and leaving: the logo changing pose (see choreography.ts). */
const EDGE = 0.15
/** ...and the most scrolling that may take, in screens. Otherwise a very tall chapter would
    still be changing pose a whole screen into it. */
const EDGE_MAX_SCREENS = 0.3

/**
 * How far the middle line is through a chapter, from 0 to 1. Arriving (0 → 0.15) and leaving
 * (0.85 → 1) happen over at most 30% of a screen at each end; the rest is spread evenly.
 * For chapters up to two screens tall, that's simply the distance divided by the height.
 */
function progressThrough(distance: number, height: number, viewportHeight: number): number {
  if (height <= 0) return 0
  const d = clamp(distance, 0, height)
  const edge = Math.min(EDGE * height, EDGE_MAX_SCREENS * viewportHeight)
  if (d < edge) return EDGE * (d / edge)
  if (d > height - edge) return 1 - EDGE * ((height - d) / edge)
  return EDGE + (1 - 2 * EDGE) * ((d - edge) / (height - 2 * edge))
}

/**
 * Turns the scroll position into "story time", the single number every animation follows:
 *
 *   0 → 1   the intro: the name stays pinned while the logo turns and comes apart
 *   1 → 2   About        (2 → 3 Projects, 3 → 4 Experience, 4 → 5 Contact)
 *
 * The intro is measured from the top of the page. The other chapters are measured at an
 * invisible line through the middle of the screen, the same line that picks the active chapter.
 */
export function storyTime(
  scrollY: number,
  viewportHeight: number,
  sections: readonly SectionMetrics[],
): number {
  if (sections.length === 0) return 0
  const [intro, ...chapters] = sections

  // The intro is taller than the screen; its extra height is the room the logo has to come apart.
  const introRoom = Math.max(1, intro.height - viewportHeight)
  if (scrollY < intro.top + introRoom) {
    return clamp((scrollY - intro.top) / introRoom, 0, 1)
  }

  const middle = scrollY + viewportHeight / 2
  let time = 1
  chapters.forEach((section, i) => {
    if (middle >= section.top) {
      time = i + 1 + progressThrough(middle - section.top, section.height, viewportHeight)
    }
  })
  return time
}
