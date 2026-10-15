import { describe, expect, it } from 'vitest'
import { initialScrollMode } from './scrollMode'

describe('initialScrollMode', () => {
  it('starts guided for a first-time visitor', () => {
    expect(initialScrollMode(null, false)).toBe('guided')
  })

  it('starts free when their device asks for reduced motion', () => {
    expect(initialScrollMode(null, true)).toBe('free')
  })

  it('keeps the choice the visitor made last time', () => {
    expect(initialScrollMode('free', false)).toBe('free')
    expect(initialScrollMode('guided', true)).toBe('guided')
  })

  it('ignores anything else it finds saved', () => {
    expect(initialScrollMode('sideways', false)).toBe('guided')
  })
})
