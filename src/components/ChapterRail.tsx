import type { CSSProperties } from 'react'
import { CHAPTERS } from '../content/chapters'
import { useActiveChapter } from '../motion/chapterContext'
import styles from './ChapterRail.module.css'

/** The numbered chapter list on the left (laptop screens). The red marker slides to where you are. */
export function ChapterRail() {
  const active = useActiveChapter()
  const index = CHAPTERS.findIndex((c) => c.id === active)

  return (
    <nav className={styles.rail} aria-label="Chapters">
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
