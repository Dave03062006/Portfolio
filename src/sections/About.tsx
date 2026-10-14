import { ImageSlot } from '../components/ImageSlot'
import { Section } from '../components/Section'
import { SpecSheet } from '../components/SpecSheet'
import { profile } from '../content/profile'
import styles from './About.module.css'

/** Chapter 02, the core: who Dave is, what he studies, what he's into. */
export function About() {
  const { about } = profile
  return (
    <Section id="about" copy={{ eyebrow: about.eyebrow, heading: about.heading }}>
      <div className={styles.intro}>
        <p className={styles.bio}>{about.bio}</p>
        <ImageSlot photo={about.photo} placeholder="Your photo" className={styles.photo} />
      </div>
      <div className={styles.spec}>
        <SpecSheet rows={about.spec} />
      </div>
    </Section>
  )
}
