import styles from './LightSwitch.module.css'

type LightSwitchProps = {
  on: boolean
  onChange: (on: boolean) => void
  /** What it switches, e.g. "Flicker". Screen readers hear it with the state: "Flicker, switch, on". */
  label: string
  className?: string
}

/**
 * An on/off switch that looks like a wall light switch: a plate with two screws, a rocker
 * that tips up for on and down for off, and a little red light that glows when it's on.
 */
export function LightSwitch({ on, onChange, label, className }: LightSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={`${styles.switch} ${className ?? ''}`}
      onClick={() => onChange(!on)}
    >
      <span className={styles.plate} aria-hidden="true">
        <span className={styles.screw} />
        <span className={styles.rocker} />
        <span className={styles.screw} />
      </span>
      <span className={styles.text}>
        {label}
        <b aria-hidden="true">{on ? 'On' : 'Off'}</b>
      </span>
    </button>
  )
}
