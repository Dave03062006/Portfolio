import { describe, expect, it } from 'vitest'
import { CHAPTERS } from '../content/chapters'
import { scrollProgress, sheetPart, sweepDirection } from './sheet'

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

describe('sweepDirection', () => {
  const change = { from: 'intro', to: 'about', reduced: false, msSinceLoad: 5000 } as const

  it('sweeps down the screen at every chapter change down the page', () => {
    expect(sweepDirection(change)).toBe('down')
    expect(sweepDirection({ ...change, from: 'projects', to: 'experience' })).toBe('down')
  })

  it('sweeps up the screen when the visitor goes back up', () => {
    expect(sweepDirection({ ...change, from: 'about', to: 'intro' })).toBe('up')
    expect(sweepDirection({ ...change, from: 'contact', to: 'projects' })).toBe('up')
  })

  it('ignores the page finding its place just after loading, like a link to #projects', () => {
    expect(sweepDirection({ ...change, to: 'projects', msSinceLoad: 120 })).toBeNull()
  })

  it('stays off when the chapter has not changed, and with reduced motion', () => {
    expect(sweepDirection({ ...change, to: 'intro' })).toBeNull()
    expect(sweepDirection({ ...change, reduced: true })).toBeNull()
  })
})
