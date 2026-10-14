import { describe, expect, it } from 'vitest'
import { KEYFRAMES, TEARDOWN, labelReveal, poseAt, restingTime } from './choreography'
import { CHAPTER_POSES } from './pose'

describe('poseAt', () => {
  it('starts assembled and ends assembled at full glow', () => {
    expect(poseAt(0)).toEqual(CHAPTER_POSES.intro)
    expect(poseAt(4.5)).toEqual(CHAPTER_POSES.contact)
  })

  it('holds the pulled-apart pose when the intro finishes', () => {
    expect(poseAt(1)).toEqual(TEARDOWN)
  })

  it.each([
    [1.5, 'core'],
    [2.5, 'D'],
    [3.5, 'T'],
  ] as const)('at %s the %s is fully in focus', (time, part) => {
    const pose = poseAt(time)
    expect(pose.focus).toBe(part)
    expect(pose.focusAmount).toBe(1)
  })

  it('clears the focus between chapters', () => {
    for (const time of [2, 3, 4]) expect(poseAt(time).focusAmount).toBe(0)
  })

  it('stays inside the timeline for out-of-range times', () => {
    expect(poseAt(-3)).toEqual(KEYFRAMES[0].pose)
    expect(poseAt(99)).toEqual(KEYFRAMES[KEYFRAMES.length - 1].pose)
  })

  it('blends smoothly between keyframes', () => {
    const halfway = poseAt(0.55) // between the turn (0.4) and the teardown (0.7)
    expect(halfway.spread).toBeGreaterThan(0)
    expect(halfway.spread).toBeLessThan(1)
  })

  it('never moves focus straight from one part to another', () => {
    // blendPoses relies on this: every focus change passes through "nothing in focus".
    const jumps = KEYFRAMES.slice(1).filter((keyframe, i) => {
      const before = KEYFRAMES[i].pose.focus
      const after = keyframe.pose.focus
      return before !== null && after !== null && before !== after
    })
    expect(jumps).toEqual([])
  })

  it('keeps keyframes in time order', () => {
    const times = KEYFRAMES.map((keyframe) => keyframe.at)
    expect([...times].sort((a, b) => a - b)).toEqual(times)
  })
})

describe('labelReveal', () => {
  it('is hidden at the start, shown once the logo is apart, hidden again in About', () => {
    expect(labelReveal(0.3)).toEqual({ lines: 0, text: 0 })
    expect(labelReveal(0.95)).toEqual({ lines: 1, text: 1 })
    expect(labelReveal(1.5)).toEqual({ lines: 0, text: 0 })
  })

  it('draws the lines before the text appears', () => {
    const { lines, text } = labelReveal(0.78)
    expect(lines).toBeGreaterThan(text)
  })
})

describe('restingTime', () => {
  it('snaps to the nearest resting moment', () => {
    expect([0.2, 0.8, 1.6, 2.4, 3.9, 4.3].map(restingTime)).toEqual([0, 1, 1.5, 2.5, 3.5, 4.5])
  })

  it('only ever lands on poses with a clear meaning', () => {
    expect(poseAt(restingTime(0.8))).toEqual(TEARDOWN)
    expect(poseAt(restingTime(1.6)).focus).toBe('core')
  })
})
