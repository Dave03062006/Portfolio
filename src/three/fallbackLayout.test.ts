import { describe, expect, it } from 'vitest'
import { CHAPTER_POSES } from '../motion/pose'
import { fallbackLayout } from './fallbackLayout'

describe('fallbackLayout', () => {
  it('stacks both pieces on the same spot when assembled, with the core hidden inside', () => {
    const layout = fallbackLayout(CHAPTER_POSES.intro)
    expect([layout.d.x, layout.d.y]).toEqual([layout.t.x, layout.t.y])
    expect(layout.core.opacity).toBe(0)
    expect(layout.seamGlow).toBeGreaterThan(0)
  })

  it('brings the D forward in Projects and dims the T', () => {
    const layout = fallbackLayout(CHAPTER_POSES.projects)
    expect(layout.d.highlight).toBe(1)
    expect(layout.t.highlight).toBe(0)
    expect(layout.t.opacity).toBeLessThan(layout.d.opacity)
  })

  it('brings the T forward in Experience and dims the D', () => {
    const layout = fallbackLayout(CHAPTER_POSES.experience)
    expect(layout.t.highlight).toBe(1)
    expect(layout.d.opacity).toBeLessThan(layout.t.opacity)
  })

  it('lights the core brightest in About', () => {
    const about = fallbackLayout(CHAPTER_POSES.about)
    const projects = fallbackLayout(CHAPTER_POSES.projects)
    expect(about.core.glow).toBe(1)
    expect(about.core.glow).toBeGreaterThan(projects.core.glow)
    expect(about.d.highlight + about.t.highlight).toBe(0)
  })

  it('glows the most at Contact', () => {
    expect(fallbackLayout(CHAPTER_POSES.contact).ambientGlow).toBeGreaterThan(
      fallbackLayout(CHAPTER_POSES.intro).ambientGlow,
    )
  })
})
