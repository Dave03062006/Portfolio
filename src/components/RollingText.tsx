import { useOutgoing } from '../motion/useOutgoing'
import styles from './RollingText.module.css'

/** How long the roll takes. Keep in step with RollingText.module.css. */
const ROLL_MS = 450

/**
 * Text that rolls over like a counter when it changes: the old text slides up and out
 * while the new text slides in from below. Used in the drawing sheet's title block.
 */
export function RollingText({ text }: { text: string }) {
  const outgoing = useOutgoing(text, ROLL_MS)

  return (
    <span className={styles.roll}>
      {outgoing !== null && (
        // `key` makes React treat each text as its own element, so each gets its own animation
        <span key={`out-${outgoing}`} className={styles.out}>
          {outgoing}
        </span>
      )}
      <span key={`in-${text}`} className={outgoing !== null ? styles.in : undefined}>
        {text}
      </span>
    </span>
  )
}
