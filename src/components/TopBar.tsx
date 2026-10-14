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
      {/* Screen readers hear the visible words plus where the link goes: "DT / Portfolio, back to the top" */}
      <a href="#intro" className={styles.brand}>
        <FlatLogo size={22} label="" className={styles.logo} />
        <span className={styles.brandText}>DT / Portfolio</span>
        <span className="visually-hidden">, back to the top</span>
      </a>

      <AvailabilityPill className={styles.pill} />

      <button
        type="button"
        className={styles.menuButton}
        onClick={() => setMenuOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={menuOpen}
        // Starts with the visible words ("03 Projects"), as screen-reader users would expect
        aria-label={`${chapter.number} ${chapter.label}, open the chapters menu`}
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
