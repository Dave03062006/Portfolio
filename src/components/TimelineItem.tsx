import type { ExperienceEntry, ExperienceType } from '../content/types'
import styles from './TimelineItem.module.css'

const TYPE_LABEL: Record<ExperienceType, string> = {
  organization: 'Organization',
  kepanitiaan: 'Kepanitiaan',
  teaching: 'Teaching',
}

type TimelineItemProps = {
  entry: ExperienceEntry
  /** Show only the committee chips (used under the KEPANITIAAN tab). */
  committeesOnly?: boolean
}

/** One step on the experience timeline. */
export function TimelineItem({ entry, committeesOnly = false }: TimelineItemProps) {
  const typeLabel = committeesOnly ? TYPE_LABEL.kepanitiaan : TYPE_LABEL[entry.type]

  return (
    <li className={styles.item} data-now={entry.now ? '' : undefined}>
      <p className={styles.when}>
        {entry.when}
        <span className={styles.type}>{typeLabel}</span>
      </p>
      <h3 className={styles.role}>
        {entry.role} <span className={styles.org}>{entry.org}</span>
      </h3>
      {!committeesOnly && entry.detail && <p className={styles.detail}>{entry.detail}</p>}
      {entry.committees && (
        <ul className={styles.committees} aria-label="Committees">
          {entry.committees.map((committee) => (
            <li key={committee.event}>
              {committee.role && <b>{committee.role} · </b>}
              {committee.event}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
