import { useOutgoing } from '../motion/useOutgoing'
import styles from './RollingText.module.css'

/** How long the roll takes. Keep in step with RollingText.module.css. */
const ROLL_MS = 450

type RollingTextProps = {
  text: string
  /** Where the new text comes in from. Below (the default) when scrolling down, above when going back up. */
  enterFrom?: 'below' | 'above'
}

/**
 * Text that rolls over like a counter when it changes: the old text slides out while the
 * new text slides into its place. Used in the drawing sheet's title block.
 */
export function RollingText({ text, enterFrom = 'below' }: RollingTextProps) {
  const outgoing = useOutgoing(text, ROLL_MS)
  const fromAbove = enterFrom === 'above'
  const entering = fromAbove ? styles.enterAbove : styles.enterBelow

  return (
    <span className={styles.roll}>
      {outgoing !== null && (
        // `key` makes React treat each text as its own element, so each gets its own animation
        <span key={`out-${outgoing}`} className={fromAbove ? styles.leaveDown : styles.leaveUp}>
          {outgoing}
        </span>
      )}
      <span key={`in-${text}`} className={outgoing !== null ? entering : undefined}>
        {text}
      </span>
    </span>
  )
}
