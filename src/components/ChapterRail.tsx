import type { CSSProperties } from 'react'
import { CHAPTERS } from '../content/chapters'
import { useActiveChapter } from '../motion/chapterContext'
import { restingTime } from '../motion/choreography'
import { coverAmount } from '../motion/cover'
import { useReducedMotion } from '../motion/useReducedMotion'
import { useStoryTime } from '../motion/useStoryTime'
import styles from './ChapterRail.module.css'

/**
 * The numbered chapter list on the left (laptop screens). The red marker slides to where you are.
 * It stays out of the way on the cover, and fades in with the hero.
 */
export function ChapterRail() {
  const active = useActiveChapter()
  const index = CHAPTERS.findIndex((c) => c.id === active)
  const time = useStoryTime()
  const reduced = useReducedMotion()
  const shown = 1 - coverAmount(reduced ? restingTime(time) : time)

  return (
    <nav
      className={styles.rail}
      aria-label="Chapters"
      // Fully hidden on the cover, so its links can't be clicked or tabbed to while invisible
      style={{ opacity: shown, visibility: shown === 0 ? 'hidden' : undefined }}
    >
      {/* One marker that moves, instead of one per item: this is what makes it slide. */}
      <span className={styles.marker} style={{ '--index': index } as CSSProperties} aria-hidden="true" />
      <ol className={styles.list}>
        {CHAPTERS.map((chapter) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              className={styles.link}
              aria-current={chapter.id === active ? 'location' : undefined}
            >
              <span className={styles.number}>{chapter.number}</span>
              {chapter.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
