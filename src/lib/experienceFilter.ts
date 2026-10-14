import type { ExperienceEntry, ExperienceType } from '../content/types'

/** The tabs above the timeline. */
export type ExperienceFilter = 'all' | ExperienceType

export type VisibleEntry = {
  entry: ExperienceEntry
  /** True when the entry only made it into the list because of its committees, so show just those. */
  committeesOnly: boolean
}

/**
 * Decides which timeline entries show for a tab.
 *
 * An entry shows when its type matches the tab. One exception: under KEPANITIAAN, an
 * organization role that ran committees (like Student Union IMT) also shows, but only
 * with its committee chips, because those events were kepanitiaan.
 */
export function filterExperience(
  entries: readonly ExperienceEntry[],
  filter: ExperienceFilter,
): VisibleEntry[] {
  return entries.flatMap((entry): VisibleEntry[] => {
    if (filter === 'all' || entry.type === filter) {
      return [{ entry, committeesOnly: false }]
    }
    if (filter === 'kepanitiaan' && entry.committees && entry.committees.length > 0) {
      return [{ entry, committeesOnly: true }]
    }
    return []
  })
}
