import { useEffect, useRef } from 'react'
import { CHAPTERS } from '../content/chapters'
import { profile } from '../content/profile'
import { scrollProgress, sheetPart } from '../lib/sheet'
import { useActiveChapter } from '../motion/chapterContext'
import { RollingText } from './RollingText'
import styles from './SheetFrame.module.css'

const ZONES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const SHEET_COUNT = String(CHAPTERS.length).padStart(2, '0')

/**
 * Turns the screen into the technical drawing the logo is drawn on: a border with corner
 * marks, grid letters along the top, a title block in the corner, and a red line down the
 * right edge that fills up as you scroll. (The rulers are in SheetRulers, below.)
 *
 * Tablet and up. Phones only get the red progress line, since their edges have no room.
 * It's decoration (the chapter list says the same things), so screen readers skip it.
 */
export function SheetFrame() {
  const active = useActiveChapter()
  const chapter = CHAPTERS.find((c) => c.id === active) ?? CHAPTERS[0]
  const progressRef = useRef<HTMLDivElement>(null)

  // Keep the progress line in step with the scroll position. It writes a CSS variable
  // straight onto the line instead of using React state, so scrolling never redraws React.
  useEffect(() => {
    const line = progressRef.current
    if (!line) return
    const update = () => {
      const page = document.documentElement.scrollHeight
      line.style.setProperty('--progress', String(scrollProgress(window.scrollY, page, window.innerHeight)))
    }
    // The page also changes height on its own, for example when the timeline is filtered
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(document.body)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div className={styles.sheet} aria-hidden="true">
      {/* Solid strips along the top and bottom: the page scrolls "under" the sheet's margins */}
      <div className={`${styles.band} ${styles.bandTop}`} />
      <div className={`${styles.band} ${styles.bandBottom}`} />

      <div className={styles.zones}>
        {ZONES.map((zone) => (
          <span key={zone} data-zone={zone} />
        ))}
      </div>

      <div className={`${styles.edge} ${styles.edgeTop}`} />
      <div className={`${styles.edge} ${styles.edgeRight}`} />
      <div className={`${styles.edge} ${styles.edgeBottom}`} />
      <div className={`${styles.edge} ${styles.edgeLeft}`} />

      <i className={`${styles.cross} ${styles.topLeft}`} />
      <i className={`${styles.cross} ${styles.topRight}`} />
      <i className={`${styles.cross} ${styles.bottomLeft}`} />
      <i className={`${styles.cross} ${styles.bottomRight}`} />

      {/* Marks the middle of the screen: a chapter starts when its red mark on the ruler passes here */}
      <i className={styles.caret} />

      <div className={styles.titleBlock}>
        <span className={styles.cell}>
          Sheet{' '}
          <b>
            <RollingText text={chapter.number} /> / {SHEET_COUNT}
          </b>
        </span>
        <span className={`${styles.cell} ${styles.chapterCell}`}>
          <b>
            <RollingText text={chapter.label} />
          </b>
        </span>
        <span className={styles.cell}>
          Part{' '}
          <b>
            <RollingText text={sheetPart(chapter)} />
          </b>
        </span>
        <span className={styles.cell}>
          Drawn <b>{profile.firstName}</b>
        </span>
      </div>

      <div ref={progressRef} className={styles.progress}>
        <div className={styles.fill} />
        <div className={styles.tip} />
      </div>
    </div>
  )
}

/**
 * The rulers along both sides of the sheet. They live inside the page instead of being
 * fixed to the screen, so the browser scrolls them along with the content, perfectly in step.
 * Each chapter adds its own red mark to the left ruler (see Section.module.css).
 */
export function SheetRulers() {
  return (
    <>
      <div className={`${styles.ruler} ${styles.rulerLeft}`} aria-hidden="true" />
      <div className={`${styles.ruler} ${styles.rulerRight}`} aria-hidden="true" />
    </>
  )
}
