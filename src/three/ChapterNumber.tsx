import { useChapterDirection } from '../motion/useChapterDirection'
import { useOutgoing } from '../motion/useOutgoing'
import styles from './ChapterNumber.module.css'

/** How long the old number takes to fade. Keep in step with ChapterNumber.module.css. */
const FADE_MS = 300

/**
 * The chapter's number, huge and outlined, behind the logo. When the chapter changes, the
 * old number fades and a thin red scan line draws the new one in: from the top when you
 * scroll down, from the bottom when you go back up.
 */
export function ChapterNumber({ number }: { number: string }) {
  const outgoing = useOutgoing(number, FADE_MS)
  const drawIn = useChapterDirection() === 'up' ? styles.inUp : styles.in

  return (
    <div className={styles.box}>
      {outgoing !== null && (
        <span key={`out-${outgoing}`} className={`${styles.number} ${styles.out}`} data-number={outgoing} />
      )}
      <span key={`in-${number}`} className={`${styles.number} ${drawIn}`} data-number={number} />
    </div>
  )
}
