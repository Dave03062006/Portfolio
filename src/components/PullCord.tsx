import { useRef } from 'react'
import { useReducedMotion } from '../motion/useReducedMotion'
import styles from './PullCord.module.css'

/** How long one pull takes, start to settle. */
const PULL_MS = 700
/** When the cord reaches the bottom of its pull: that's when the switch clicks. */
const CLICK_MS = 140

/** Down it goes, then it springs back up, overshoots a little and sways, like a real cord. */
const PULL: Keyframe[] = [
  { offset: 0, transform: 'translateY(0) rotate(0deg)', easing: 'cubic-bezier(0.5, 0, 0.9, 0.5)' },
  { offset: 0.2, transform: 'translateY(1.6rem) rotate(0deg)', easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)' },
  { offset: 0.45, transform: 'translateY(-0.35rem) rotate(1.4deg)' },
  { offset: 0.66, transform: 'translateY(0.12rem) rotate(-0.9deg)' },
  { offset: 0.84, transform: 'translateY(0) rotate(0.35deg)' },
  { offset: 1, transform: 'translateY(0) rotate(0deg)' },
]

type PullCordProps = {
  on: boolean
  onChange: (on: boolean) => void
  /** What it switches, e.g. "Flicker". Screen readers hear it with the state: "Flicker, switch, on". */
  label: string
}

/**
 * An on/off switch drawn as the pull cord of a ceiling light: a ball chain hanging from the
 * top of the screen, with a pull at the end. Clicking it (or Space or Enter) pulls the cord
 * down; at the bottom of the pull the switch clicks, then the cord springs back and sways.
 * Its parent says how far below the top of the screen it hangs, as `--hang`.
 */
export function PullCord({ on, onChange, label }: PullCordProps) {
  const cordRef = useRef<HTMLSpanElement>(null)
  const pulling = useRef(false)
  const reduced = useReducedMotion()

  const pull = () => {
    if (pulling.current) return // let one pull finish before the next
    const cord = cordRef.current
    if (reduced || !cord || typeof cord.animate !== 'function') {
      onChange(!on)
      return
    }
    pulling.current = true
    cord.animate(PULL, { duration: PULL_MS }).onfinish = () => {
      pulling.current = false
    }
    window.setTimeout(() => onChange(!on), CLICK_MS)
  }

  return (
    <span ref={cordRef} className={styles.cord}>
      <span className={styles.chain} aria-hidden="true" />
      <button type="button" role="switch" aria-checked={on} className={styles.pull} onClick={pull}>
        <span className={styles.bead} aria-hidden="true" />
        <span className={styles.text}>
          {label}
          <b aria-hidden="true">{on ? 'On' : 'Off'}</b>
        </span>
      </button>
    </span>
  )
}
