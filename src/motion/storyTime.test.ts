import { describe, expect, it } from 'vitest'
import { storyTime, type SectionMetrics } from './storyTime'

// A page laid out like the real one: a 2-screen intro, then four chapters.
const VIEWPORT = 900
const SECTIONS: SectionMetrics[] = [
  { top: 0, height: 1800 }, // intro: 900 px of room for the teardown
  { top: 1800, height: 1000 }, // about
  { top: 2800, height: 2000 }, // projects
  { top: 4800, height: 1500 }, // experience
  { top: 6300, height: 1000 }, // contact
]
const at = (scrollY: number) => storyTime(scrollY, VIEWPORT, SECTIONS)

describe('storyTime', () => {
  it('starts at 0 at the top of the page', () => {
    expect(at(0)).toBe(0)
  })

  it('runs the intro from 0 to 1 over its extra height', () => {
    expect(at(450)).toBeCloseTo(0.5)
    expect(at(899)).toBeCloseTo(1, 2)
  })

  it('holds at 1 until About reaches the middle of the screen', () => {
    expect(at(900)).toBe(1)
    expect(at(1300)).toBe(1) // middle line at 1750, About starts at 1800
  })

  it('moves through each chapter as it crosses the middle of the screen', () => {
    expect(at(1800 - 450 + 500)).toBeCloseTo(1.5) // halfway through About
    expect(at(2800 - 450)).toBeCloseTo(2) // Projects just reached the middle
    expect(at(4800 - 450 + 750)).toBeCloseTo(3.5) // halfway through Experience
  })

  it('never goes backwards as the page scrolls down', () => {
    let previous = -Infinity
    for (let y = 0; y <= 6400; y += 25) {
      const time = at(y)
      expect(time).toBeGreaterThanOrEqual(previous)
      previous = time
    }
  })

  it('is 0 before the page has been measured', () => {
    expect(storyTime(500, VIEWPORT, [])).toBe(0)
  })
})
