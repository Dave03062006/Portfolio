import { describe, expect, it } from 'vitest'
import { experience } from '../content/experience'
import { filterExperience } from './experienceFilter'

const ids = (filter: Parameters<typeof filterExperience>[1]) =>
  filterExperience(experience, filter).map(({ entry }) => entry.id)

describe('filterExperience', () => {
  it('shows everything, in order, under ALL', () => {
    expect(ids('all')).toEqual(experience.map((entry) => entry.id))
  })

  it('shows only organizations under ORGANIZATIONS', () => {
    expect(ids('organization')).toEqual(['imt-pulse-intern', 'su-internal', 'ukm-tabletop'])
  })

  it('shows only teaching under TEACHING', () => {
    expect(ids('teaching')).toEqual(['teaching-assistant'])
  })

  it('includes the Student Union under KEPANITIAAN, showing only its committees', () => {
    const visible = filterExperience(experience, 'kepanitiaan')
    expect(visible.map(({ entry }) => entry.id)).toEqual(['oweek-2025', 'su-internal', 'oweek-2026'])

    const studentUnion = visible.find(({ entry }) => entry.id === 'su-internal')
    expect(studentUnion?.committeesOnly).toBe(true)
    expect(visible.filter(({ committeesOnly }) => !committeesOnly)).toHaveLength(2)
  })

  it('returns nothing for an empty list', () => {
    expect(filterExperience([], 'all')).toEqual([])
  })
})
