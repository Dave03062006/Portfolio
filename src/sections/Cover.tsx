import { profile } from '../content/profile'
import { restingTime } from '../motion/choreography'
import { COVER_SLOT_ID, coverAmount, coverNameOpacity } from '../motion/cover'
import { useReducedMotion } from '../motion/useReducedMotion'
import { useStoryTime } from '../motion/useStoryTime'
import styles from './Cover.module.css'

/**
 * The first screen, before the hero: the DT logo, big and in the middle, with Dave's name
 * around it. The logo itself belongs to the Stage. While the cover shows, the Stage places it
 * over this page's empty "slot"; the first scroll flies it to its usual place (motion/cover.ts).
 *
 * Decoration only: the name is also the page's main heading, in the hero, so screen readers
 * skip this.
 */
export function Cover() {
  const time = useStoryTime()
  const reduced = useReducedMotion()
  // With reduced motion the cover is simply on or off, and the CSS fades it.
  const story = reduced ? restingTime(time) : time
  const opacity = coverNameOpacity(story)
  // As the name fades, its two lines drift apart, making way for the logo
  const drift = (1 - opacity) * 2.5

  return (
    <div
      className={styles.cover}
      aria-hidden="true"
      // Fully gone once the logo has left (but still laid out, so the slot can be measured)
      style={{ visibility: coverAmount(story) === 0 ? 'hidden' : undefined }}
    >
      <p className={styles.first} style={{ opacity, transform: `translateY(${-drift}rem)` }}>
        {profile.firstName}
      </p>
      <div id={COVER_SLOT_ID} className={styles.slot} />
      <p className={styles.last} style={{ opacity, transform: `translateY(${drift}rem)` }}>
        {profile.lastName}
      </p>
      <p className={styles.cue} style={{ opacity }}>
        Scroll ↓
      </p>
    </div>
  )
}
