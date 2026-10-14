import { CHAPTERS } from '../content/chapters'
import { useActiveChapter } from '../motion/chapterContext'
import { CHAPTER_POSES } from '../motion/pose'
import { FallbackLogo } from './FallbackLogo'
import styles from './Stage.module.css'

/**
 * The fixed area where the logo lives while the content scrolls past.
 * Laptop and tablet: the right side of the screen. Phone: the top of the screen.
 * It's decoration (everything it shows is also written in the page), so screen readers skip it.
 */
export function Stage() {
  const active = useActiveChapter()
  const chapter = CHAPTERS.find((c) => c.id === active) ?? CHAPTERS[0]

  return (
    <div className={styles.stage} aria-hidden="true">
      <div className={styles.grid} />
      <div className={styles.frame}>
        <FallbackLogo pose={CHAPTER_POSES[active]} />
      </div>
      <p className={styles.figure}>{chapter.figure}</p>
    </div>
  )
}
