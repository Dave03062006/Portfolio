import type { ExperienceFilter } from '../lib/experienceFilter'
import styles from './TimelineFilters.module.css'

const OPTIONS: { value: ExperienceFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'organization', label: 'Organizations' },
  { value: 'kepanitiaan', label: 'Kepanitiaan' },
  { value: 'teaching', label: 'Teaching' },
]

type TimelineFiltersProps = {
  value: ExperienceFilter
  onChange: (filter: ExperienceFilter) => void
}

/**
 * The tabs above the timeline. This component doesn't remember which tab is picked itself:
 * its parent passes `value` in and gets told about clicks through `onChange`.
 */
export function TimelineFilters({ value, onChange }: TimelineFiltersProps) {
  return (
    <fieldset className={styles.filters}>
      <legend className="visually-hidden">Filter experience</legend>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.filter}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  )
}
