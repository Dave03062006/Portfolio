import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { CHAPTERS } from './chapters'
import { experience } from './experience'
import { profile } from './profile'
import { projects } from './projects'

// "Sanity checks" for the content files: they catch mistakes that TypeScript can't,
// like an empty "my part" line or a link that isn't a real URL.

const isWebUrl = (href: string) => {
  try {
    return new URL(href).protocol === 'https:'
  } catch {
    return false
  }
}

describe('projects', () => {
  it.each(projects)('$name says what Dave did on it', (project) => {
    expect(project.myPart.trim()).not.toBe('')
  })

  it.each(projects)('$name has at least one link', (project) => {
    expect(project.links.length).toBeGreaterThan(0)
  })

  const projectLinks = projects.flatMap((project) =>
    project.links.map((link) => ({ project: project.name, href: link.href })),
  )
  it.each(projectLinks)('$project links to a real https page: $href', ({ href }) => {
    expect(isWebUrl(href)).toBe(true)
  })

  it.each(projects.filter((p) => p.size !== 'small'))('$name has an image for its card', (project) => {
    expect(project.image?.alt.trim()).toBeTruthy()
  })

  it('uses each slug only once', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})

describe('experience', () => {
  it('marks exactly one role as now', () => {
    expect(experience.filter((entry) => entry.now)).toHaveLength(1)
  })

  it('uses each id only once', () => {
    const ids = experience.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('profile', () => {
  it('has a teardown label for every part of the logo', () => {
    expect(profile.teardown.map((label) => label.part).sort()).toEqual(['D', 'T', 'core'].sort())
  })

  it.each(profile.contact.links)('links $label to a real https page', ({ href }) => {
    expect(isWebUrl(href)).toBe(true)
  })

  it('only turns on the CV button once the CV file is in public/', () => {
    const { cvUrl } = profile.contact
    const cvIsReady = cvUrl === '' || existsSync(`public${cvUrl}`)
    expect(cvIsReady).toBe(true)
  })
})

describe('chapters', () => {
  it('numbers the chapters 01 to 05 in order', () => {
    expect(CHAPTERS.map((c) => c.number)).toEqual(['01', '02', '03', '04', '05'])
  })
})
