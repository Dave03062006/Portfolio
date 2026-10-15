import { useState, type CSSProperties } from 'react'
import { LightSwitch } from '../components/LightSwitch'
import { profile } from '../content/profile'
import { readPreference, savePreference } from '../lib/preferences'
import { restingTime } from '../motion/choreography'
import { COVER_SLOT_ID, FLICKER_KEY, coverAmount, coverNameOpacity, initialFlicker } from '../motion/cover'
import { useReducedMotion } from '../motion/useReducedMotion'
import { useStoryTime } from '../motion/useStoryTime'
import styles from './Cover.module.css'

// In each line, one letter is a faulty tube that buzzes on its own now and then:
// the second I of TRISTIAN and the H of NURCAHYO (counted from 0, spaces included).
const FIRST_FAULTY = 10
const LAST_FAULTY = 5

/** The text, with one letter wrapped so it can flicker on its own. */
function Letters({ text, faulty }: { text: string; faulty: number }) {
  return (
    <>
      {text.slice(0, faulty)}
      <span className={styles.faulty}>{text.charAt(faulty)}</span>
      {text.slice(faulty + 1)}
    </>
  )
}

type NeonLineProps = { text: string; faulty: number; className: string; style: CSSProperties }

/** A line of the name as a neon sign: the dark glass tubes, with the same letters lit on top. */
function NeonLine({ text, faulty, className, style }: NeonLineProps) {
  return (
    <p className={`${styles.line} ${className}`} style={style}>
      <span className={styles.unlit}>
        <Letters text={text} faulty={faulty} />
      </span>
      <span className={styles.lit}>
        <Letters text={text} faulty={faulty} />
      </span>
    </p>
  )
}

/**
 * The first screen, before the hero: the DT logo, big and in the middle, with Dave's name
 * around it as a neon sign that flickers on, like a title in a dark room. The logo itself
 * belongs to the Stage. While the cover shows, the Stage places it over this page's empty
 * "slot"; the first scroll flies it to its usual place (motion/cover.ts).
 *
 * The name is decoration (it's also the page's main heading, in the hero), so screen readers
 * skip it. The light switch next to it is real: it turns the flicker off.
 */
export function Cover() {
  const time = useStoryTime()
  const reduced = useReducedMotion()
  // With reduced motion the cover is simply on or off, and the CSS fades it.
  const story = reduced ? restingTime(time) : time
  const opacity = coverNameOpacity(story)
  // As the name fades, its two lines drift apart, making way for the logo
  const drift = (1 - opacity) * 2.5

  // The flicker, and its switch, for anyone sensitive to flashing light. Remembered for next time.
  const [flicker, setFlicker] = useState(() => initialFlicker(readPreference(FLICKER_KEY), reduced))
  const flip = (on: boolean) => {
    setFlicker(on)
    savePreference(FLICKER_KEY, on ? 'on' : 'off')
  }

  return (
    <>
      <div
        className={`${styles.cover} ${flicker ? styles.flickering : ''}`}
        aria-hidden="true"
        // Fully gone once the logo has left (but still laid out, so the slot can be measured)
        style={{ visibility: coverAmount(story) === 0 ? 'hidden' : undefined }}
      >
        <NeonLine
          text={profile.firstName}
          faulty={FIRST_FAULTY}
          className={styles.first}
          style={{ opacity, transform: `translateY(${-drift}rem)` }}
        />
        <div id={COVER_SLOT_ID} className={styles.slot} />
        <NeonLine
          text={profile.lastName}
          faulty={LAST_FAULTY}
          className={styles.last}
          style={{ opacity, transform: `translateY(${drift}rem)` }}
        />
        <p className={styles.cue} style={{ opacity }}>
          Scroll ↓
        </p>
      </div>

      {/* Outside the decoration above, so keyboards and screen readers can reach it */}
      <div className={styles.switchDock} style={{ opacity, visibility: opacity === 0 ? 'hidden' : undefined }}>
        <LightSwitch on={flicker} onChange={flip} label="Flicker" />
      </div>
    </>
  )
}
