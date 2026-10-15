import { describe, expect, it } from 'vitest'
import { CHAPTERS } from '../content/chapters'
import { scrollProgress, sheetPart, shouldSweep } from './sheet'

describe('scrollProgress', () => {
  it('goes from 0 at the top of the page to 1 at the bottom', () => {
    expect(scrollProgress(0, 5000, 1000)).toBe(0)
    expect(scrollProgress(2000, 5000, 1000)).toBe(0.5)
    expect(scrollProgress(4000, 5000, 1000)).toBe(1)
  })

  it('stays between 0 and 1 when the browser scrolls past the ends (phones bounce)', () => {
    expect(scrollProgress(-60, 5000, 1000)).toBe(0)
    expect(scrollProgress(4080, 5000, 1000)).toBe(1)
  })

  it('is 0 when the whole page fits on the screen', () => {
    expect(scrollProgress(0, 800, 1000)).toBe(0)
  })
})

describe('sheetPart', () => {
  it('names the piece of the logo each chapter is about', () => {
    expect(CHAPTERS.map((chapter) => sheetPart(chapter))).toEqual(['DT', 'Core', 'D', 'T', 'DT'])
  })
})

describe('shouldSweep', () => {
  const leavingIntro = { from: 'intro', to: 'about', played: false, reduced: false, msSinceLoad: 5000 } as const

  it('plays the first time the visitor scrolls out of the intro', () => {
    expect(shouldSweep(leavingIntro)).toBe(true)
  })

  it('plays only once per visit', () => {
    expect(shouldSweep({ ...leavingIntro, played: true })).toBe(false)
  })

  it('stays quiet for the other chapter changes', () => {
    expect(shouldSweep({ ...leavingIntro, from: 'about', to: 'projects' })).toBe(false)
    expect(shouldSweep({ ...leavingIntro, from: 'about', to: 'intro' })).toBe(false)
  })

  it('ignores the page finding its place just after loading, like a link to #projects', () => {
    expect(shouldSweep({ ...leavingIntro, to: 'projects', msSinceLoad: 120 })).toBe(false)
  })

  it('never plays with reduced motion', () => {
    expect(shouldSweep({ ...leavingIntro, reduced: true })).toBe(false)
  })
})
