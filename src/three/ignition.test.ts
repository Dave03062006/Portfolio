import { describe, expect, it } from 'vitest'
import { ignitionLevel } from './ignition'

describe('ignitionLevel', () => {
  it('is dark before the flicker starts', () => {
    expect(ignitionLevel(0)).toBe(0)
    expect(ignitionLevel(0.2)).toBe(0)
  })

  it('is steady and fully lit once it has finished', () => {
    expect(ignitionLevel(1)).toBe(1)
    expect(ignitionLevel(30)).toBe(1)
  })

  it('stutters on the way: bright, dim, bright', () => {
    const at = (fraction: number) => ignitionLevel(0.25 + fraction * 0.9)
    expect(at(0.08)).toBeCloseTo(0.85)
    expect(at(0.12)).toBeCloseTo(0.1)
    expect(at(0.2)).toBeCloseTo(0.95)
  })
})
