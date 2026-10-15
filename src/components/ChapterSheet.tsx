import { useEffect, useRef } from 'react'
import { CHAPTERS } from '../content/chapters'
import { useActiveChapter } from '../motion/chapterContext'
import { AvailabilityPill } from './AvailabilityPill'
import styles from './ChapterSheet.module.css'
import { ScrollModeToggle } from './ScrollModeToggle'

type ChapterSheetProps = { open: boolean; onClose: () => void }

/**
 * The chapter menu on phones and tablets. It uses the browser's built-in <dialog>, which
 * handles the hard parts for free: keeping keyboard focus inside, and closing on Escape.
 */
export function ChapterSheet({ open, onClose }: ChapterSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const active = useActiveChapter()

  // React tells us whether the menu should be open; this keeps the real <dialog> in step.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    // Tapping outside the panel closes it. Keyboard users have Escape and the Close button,
    // so this mouse-only shortcut is fine: the two rules below don't apply here.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      className={styles.sheet}
      aria-label="Chapters"
      onClose={onClose}
      // A click that lands on the dialog itself (not the panel inside) means the dark backdrop was tapped.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={styles.panel}>
        <div className={styles.head}>
          <span>Chapters</span>
          <button type="button" className={styles.close} onClick={onClose}>
            Close
          </button>
        </div>
        <nav aria-label="Chapters">
          <ol className={styles.list}>
            {CHAPTERS.map((chapter) => (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  className={styles.link}
                  onClick={onClose}
                  aria-current={chapter.id === active ? 'location' : undefined}
                >
                  <span className={styles.number}>{chapter.number}</span>
                  {chapter.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={styles.scrollMode}>
          <ScrollModeToggle />
          <p className={styles.hint}>Guided moves a whole chapter with each swipe. Free scrolls normally.</p>
        </div>
        <AvailabilityPill className={styles.pill} />
      </div>
    </dialog>
  )
}
