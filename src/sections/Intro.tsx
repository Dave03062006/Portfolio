import type { CSSProperties } from 'react'
import { AvailabilityPill } from '../components/AvailabilityPill'
import { profile } from '../content/profile'
import { restingTime } from '../motion/choreography'
import { heroReveal } from '../motion/cover'
import { useReducedMotion } from '../motion/useReducedMotion'
import { useStoryTime } from '../motion/useStoryTime'
import text from '../styles/text.module.css'
import styles from './Intro.module.css'

/**
 * Chapter 01: name, what Dave studies, and one line about him. The section is two screens
 * tall, and the hero stays pinned while you scroll through it. That scroll is the logo's
 * moment to fly in from the cover (Cover.tsx), turn, and come apart, as the hero fades in.
 */
export function Intro() {
  const time = useStoryTime()
  const reduced = useReducedMotion()
  // 0 on the cover, 1 once the logo has arrived. With reduced motion it switches, and the CSS fades it.
  const reveal = heroReveal(reduced ? restingTime(time) : time)

  return (
    <section id="intro" aria-labelledby="intro-title" className={styles.intro}>
      <div className={styles.window} aria-hidden="true" />
      <div className={styles.hero} style={{ opacity: reveal, '--rise': 1 - reveal } as CSSProperties}>
        <h1 id="intro-title" className={`${text.display} ${styles.name}`}>
          <span>{profile.firstName}</span> <span>{profile.lastName}</span>
        </h1>
        <p className={styles.meta}>{profile.meta.join(' · ')}</p>
        <p className={styles.oneLiner}>{profile.oneLiner}</p>
        <AvailabilityPill className={styles.pill} />
        <p className={styles.scroll} aria-hidden="true">
          Scroll ↓
        </p>
      </div>
    </section>
  )
}
