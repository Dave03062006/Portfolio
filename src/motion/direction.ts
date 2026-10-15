import { CHAPTERS } from '../content/chapters'
import type { ChapterId } from '../content/types'

/** Which way the visitor moved: down the page, or back up it. */
export type Direction = 'down' | 'up'

const indexOf = (id: ChapterId) => CHAPTERS.findIndex((chapter) => chapter.id === id)

/** Which way the visitor went to get from one chapter to another. */
export function directionBetween(from: ChapterId, to: ChapterId): Direction {
  return indexOf(to) >= indexOf(from) ? 'down' : 'up'
}
