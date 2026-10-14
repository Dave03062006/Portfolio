import { useState } from 'react'
import { FlatLogo } from '../brand/FlatLogo'
import { CHAPTERS } from '../content/chapters'
import { useActiveChapter } from '../motion/chapterContext'
import { AvailabilityPill } from './AvailabilityPill'
import { ChapterSheet } from './ChapterSheet'
import styles from './TopBar.module.css'

/**
 * The bar fixed to the top of the screen. On phones and tablets it also shows which
 * chapter you're in, and opens the chapter menu.
 */
export function TopBar() {
  const active = useActiveChapter()
  const chapter = CHAPTERS.find((c) => c.id === active) ?? CHAPTERS[0]
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={styles.bar}>
      <a href="#intro" className={styles.brand} aria-label="Dave Tristian, back to the top">
        <FlatLogo size={22} label="" className={styles.logo} />
        <span className={styles.brandText} aria-hidden="true">
          DT / Portfolio
        </span>
      </a>

      <AvailabilityPill className={styles.pill} />

      <button
        type="button"
        className={styles.menuButton}
        onClick={() => setMenuOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={menuOpen}
        aria-label={`Chapters menu. Now reading ${chapter.number}, ${chapter.label}`}
      >
        <span className={styles.current}>
          <b>{chapter.number}</b> {chapter.label}
        </span>
        <span className={styles.burger} aria-hidden="true" />
      </button>

      <ChapterSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
