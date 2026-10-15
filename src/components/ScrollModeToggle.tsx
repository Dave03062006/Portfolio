import type { ScrollMode } from '../motion/scrollMode'
import { useScrollMode } from '../motion/scrollModeContext'
import styles from './ScrollModeToggle.module.css'

const OPTIONS: { mode: ScrollMode; label: string; hint: string }[] = [
  { mode: 'guided', label: 'Guided', hint: 'Each scroll moves a whole chapter' },
  { mode: 'free', label: 'Free', hint: 'Scroll normally' },
]

/**
 * The switch between guided scrolling (each scroll glides to the next chapter) and free,
 * ordinary scrolling. In the top bar on laptops, and in the chapter menu on phones and tablets.
 */
export function ScrollModeToggle({ className }: { className?: string }) {
  const { mode, setMode } = useScrollMode()

  return (
    <fieldset className={`${styles.toggle} ${className ?? ''}`}>
      <legend className="visually-hidden">Scrolling</legend>
      <span className={styles.label} aria-hidden="true">
        Scroll
      </span>
      {OPTIONS.map((option) => (
        <button
          key={option.mode}
          type="button"
          className={styles.option}
          aria-pressed={mode === option.mode}
          title={option.hint}
          onClick={() => setMode(option.mode)}
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  )
}
