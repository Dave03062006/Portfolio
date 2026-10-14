import { profile } from '../content/profile'
import styles from './AvailabilityPill.module.css'

/** The "Open to internships" pill. Shows nothing when `profile.availability` is empty. */
export function AvailabilityPill({ className }: { className?: string }) {
  if (!profile.availability) return null
  return (
    <p className={`${styles.pill} ${className ?? ''}`}>
      <span className={styles.dot} aria-hidden="true" />
      {profile.availability}
    </p>
  )
}
