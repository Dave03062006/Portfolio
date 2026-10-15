import { describe, expect, it } from 'vitest'
import { springStep } from './spring'

// Runs the spring from 0 toward `target` at 60 frames a second, and records each frame's position
const run = (target: number, frames: number) => {
  let state = { position: 0, velocity: 0 }
  const positions: number[] = []
  for (let i = 0; i < frames; i++) {
    state = springStep(state.position, state.velocity, target, 1 / 60, 6)
    positions.push(state.position)
  }
  return positions
}

describe('springStep', () => {
  it('starts gently instead of jumping', () => {
    expect(run(1, 1)[0]).toBeLessThan(0.01)
  })

  it('arrives in about a second', () => {
    expect(run(1, 60).at(-1)).toBeCloseTo(1, 1)
  })

  it('never overshoots the target', () => {
    expect(Math.max(...run(1, 240))).toBeLessThanOrEqual(1)
  })

  it('stays still once it is there', () => {
    expect(springStep(2, 0, 2, 1 / 60, 6)).toEqual({ position: 2, velocity: 0 })
  })
})
