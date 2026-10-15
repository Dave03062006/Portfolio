import { describe, expect, it } from 'vitest'
import { easeInOut, glideDuration, pageLayout, planScroll, settleTarget } from './paging'

// Measured from the real page at 1440 × 900: a 2-screen intro, then the four chapters.
const SECTIONS = [
  { top: 0, height: 1800 }, // intro
  { top: 1800, height: 931 }, // about
  { top: 2731, height: 2239 }, // projects
  { top: 4970, height: 1247 }, // experience
  { top: 6217, height: 988 }, // contact
]
const layout = pageLayout(SECTIONS, 900, 64, 6305)

describe('pageLayout', () => {
  it('rests on the name, the logo taken apart, and the start and end of every chapter', () => {
    expect(layout.stops).toEqual([0, 855, 1736, 2667, 4070, 4906, 5317, 6153, 6305])
  })

  it('lets chapters taller than the screen scroll normally inside', () => {
    expect(layout.free).toEqual([
      [2667, 4070],
      [4906, 5317],
      [6153, 6305],
    ])
  })

  it('gives a single stop to a chapter that fits on the screen, or is barely taller', () => {
    // About is 931 px: only 95 px taller than the screen below the top bar, all of it padding
    expect(layout.stops).not.toContain(1831)
    const page = pageLayout([SECTIONS[0], { top: 1800, height: 700 }, { top: 2500, height: 900 }], 900, 64, 2500)
    expect(page.stops).toEqual([0, 855, 1736, 2436])
  })
})

describe('planScroll', () => {
  it('glides from one stop to the next with a single scroll', () => {
    expect(planScroll(0, 100, layout)).toEqual({ kind: 'glide', to: 855 }) // name → logo apart
    expect(planScroll(855, 100, layout)).toEqual({ kind: 'glide', to: 1736 }) // → About
    expect(planScroll(1736, 100, layout)).toEqual({ kind: 'glide', to: 2667 }) // About → Projects
  })

  it('goes back to the end of the chapter above, so nothing is skipped', () => {
    expect(planScroll(4906, -100, layout)).toEqual({ kind: 'glide', to: 4070 }) // Experience → end of Projects
    expect(planScroll(855, -100, layout)).toEqual({ kind: 'glide', to: 0 })
  })

  it('scrolls normally inside a tall chapter, but stops at its edge first', () => {
    expect(planScroll(3000, 100, layout)).toEqual({ kind: 'native' })
    expect(planScroll(3000, -100, layout)).toEqual({ kind: 'native' })
    expect(planScroll(4000, 100, layout)).toEqual({ kind: 'glide', to: 4070 })
  })

  it('stays put at the very top and bottom of the page', () => {
    expect(planScroll(0, -100, layout)).toEqual({ kind: 'glide', to: 0 })
    expect(planScroll(6305, 100, layout)).toEqual({ kind: 'glide', to: 6305 })
  })
})

describe('settleTarget', () => {
  it('carries on to the next stop in the direction the page was moving', () => {
    expect(settleTarget(400, 'down', layout)).toBe(855)
    expect(settleTarget(400, 'up', layout)).toBe(0)
    expect(settleTarget(2200, 'down', layout)).toBe(2667) // between About and Projects
    expect(settleTarget(2200, 'up', layout)).toBe(1736)
  })

  it('leaves the page alone at a stop, or inside a tall chapter', () => {
    expect(settleTarget(855, 'down', layout)).toBeNull()
    expect(settleTarget(3000, 'up', layout)).toBeNull()
  })
})

describe('glideDuration and easeInOut', () => {
  it('takes longer for longer glides, up to 1.2 seconds', () => {
    expect(glideDuration(100)).toBeLessThan(glideDuration(800))
    expect(glideDuration(5000)).toBe(1200)
  })

  it('eases from 0 to 1, starting and ending gently', () => {
    expect(easeInOut(0)).toBe(0)
    expect(easeInOut(0.5)).toBe(0.5)
    expect(easeInOut(1)).toBe(1)
    expect(easeInOut(0.1)).toBeLessThan(0.1)
  })
})
