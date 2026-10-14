import { useState } from 'react'
import { Section } from '../components/Section'
import { TimelineFilters } from '../components/TimelineFilters'
import { TimelineItem } from '../components/TimelineItem'
import { experience, experienceCopy } from '../content/experience'
import { filterExperience, type ExperienceFilter } from '../lib/experienceFilter'
import styles from './Experience.module.css'

/** Chapter 04, the T for Team: organizations, kepanitiaan and teaching, as a climb. */
export function Experience() {
  // "State": a value React remembers between renders. Changing it re-draws the timeline.
  const [filter, setFilter] = useState<ExperienceFilter>('all')
  const visible = filterExperience(experience, filter)

  return (
    <Section id="experience" copy={experienceCopy}>
      <TimelineFilters value={filter} onChange={setFilter} />
      <output className="visually-hidden">
        Showing {visible.length} of {experience.length} entries
      </output>
      <ol className={styles.timeline}>
        {visible.map(({ entry, committeesOnly }) => (
          <TimelineItem key={entry.id} entry={entry} committeesOnly={committeesOnly} />
        ))}
      </ol>
    </Section>
  )
}
