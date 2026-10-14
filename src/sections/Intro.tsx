import { AvailabilityPill } from '../components/AvailabilityPill'
import { profile } from '../content/profile'
import text from '../styles/text.module.css'
import styles from './Intro.module.css'

/** Chapter 01: the first screen. Name, what Dave studies, and one line about him. */
export function Intro() {
  return (
    <section id="intro" aria-labelledby="intro-title" className={styles.intro}>
      <div className={styles.window} aria-hidden="true" />
      <div className={styles.hero}>
        <h1 id="intro-title" className={`${text.display} ${styles.name}`}>
          <span>{profile.firstName}</span> <span>{profile.lastName}</span>
        </h1>
        <p className={styles.meta}>{profile.meta.join(' · ')}</p>
        <p className={styles.oneLiner}>{profile.oneLiner}</p>
        <AvailabilityPill className={styles.pill} />
      </div>
      <p className={styles.scroll} aria-hidden="true">
        Scroll ↓
      </p>
    </section>
  )
}
