/** Where a section sits on the page, in pixels from the top of the document. */
export type SectionMetrics = { top: number; height: number }

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

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
      time = i + 1 + clamp((middle - section.top) / section.height, 0, 1)
    }
  })
  return time
}
