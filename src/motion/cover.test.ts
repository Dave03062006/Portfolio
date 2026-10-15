import { describe, expect, it } from 'vitest'
import { EXPLODED_STOP, restingTime } from './choreography'
import { coverAmount, coverNameOpacity, heroReveal, initialFlicker } from './cover'

describe('initialFlicker', () => {
  it('flickers for a first-time visitor', () => {
    expect(initialFlicker(null, false)).toBe(true)
  })

  it('stays steady when their device asks for reduced motion', () => {
    expect(initialFlicker(null, true)).toBe(false)
  })

  it('keeps the position the visitor flipped the switch to', () => {
    expect(initialFlicker('off', false)).toBe(false)
    expect(initialFlicker('on', true)).toBe(true)
  })
})

describe('the cover', () => {
  it('starts with the logo big on the cover, the name showing and the hero hidden', () => {
    expect(coverAmount(0)).toBe(1)
    expect(coverNameOpacity(0)).toBe(1)
    expect(heroReveal(0)).toBe(0)
  })

  it('has flown the logo to its place and shown the hero by the time the logo is apart', () => {
    expect(coverAmount(EXPLODED_STOP)).toBe(0)
    expect(coverNameOpacity(EXPLODED_STOP)).toBe(0)
    expect(heroReveal(EXPLODED_STOP)).toBe(1)
  })

  it('clears the cover name before the hero text appears, so they never overlap', () => {
    const moments = Array.from({ length: 101 }, (_, i) => i / 100)
    const overlaps = moments.filter((time) => coverNameOpacity(time) > 0 && heroReveal(time) > 0)
    expect(overlaps).toEqual([])
  })

  it('switches cleanly between the resting moments used with reduced motion', () => {
    expect(coverAmount(restingTime(0.2))).toBe(1)
    expect(coverAmount(restingTime(0.8))).toBe(0)
    expect(heroReveal(restingTime(0.8))).toBe(1)
  })
})
