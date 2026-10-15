import { describe, expect, it } from 'vitest'
import { FLICKERS, FlashBudget, STUTTER_ON, SWITCH_ON, nextFlicker, powerOn, snap, type SignEvent } from './neonSign'

/** A repeatable stand-in for Math.random, so a test always sees the same "random" sign. */
function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

/** Every flash in a list of events, at the moment its flicker ends (the latest it could happen). */
const flashTimes = (events: SignEvent[]) =>
  events.flatMap((event) => Array.from({ length: event.flicker.flashes }, () => event.at + event.flicker.duration))

/** The most flashes found in any one-second stretch. */
function mostFlashesInASecond(events: SignEvent[]) {
  // A flash happens somewhere between its flicker's start and end; count it if either end is in the window
  const spans = events.flatMap((event) =>
    Array.from({ length: event.flicker.flashes }, () => [event.at, event.at + event.flicker.duration] as const),
  )
  let most = 0
  for (const [start] of spans) {
    const inWindow = spans.filter(([from, to]) => to >= start && from < start + 1000).length
    most = Math.max(most, inWindow)
  }
  return most
}

describe('snap', () => {
  it('holds each level, then jumps to the next almost instantly', () => {
    expect(snap([[0, 1], [0.5, 0]])).toEqual([
      { offset: 0, opacity: 1 },
      { offset: 0.5, opacity: 1 },
      { offset: 0.51, opacity: 0 },
      { offset: 1, opacity: 0 },
    ])
  })
})

describe('the flickers', () => {
  it('all start and end fully on, so a flicker never leaves a letter dark', () => {
    for (const flicker of FLICKERS) {
      expect(flicker.keyframes[0].opacity).toBe(1)
      expect(flicker.keyframes.at(-1)?.opacity).toBe(1)
    }
  })

  it('switch a letter on from dark', () => {
    for (const flicker of [SWITCH_ON, STUTTER_ON]) {
      expect(flicker.keyframes[0].opacity).toBe(0)
      expect(flicker.keyframes.at(-1)?.opacity).toBe(1)
    }
  })

  it('are short: at most 2 flashes, within a second', () => {
    for (const flicker of [...FLICKERS, STUTTER_ON]) {
      expect(flicker.flashes).toBeLessThanOrEqual(2)
      expect(flicker.duration).toBeLessThanOrEqual(1000)
    }
  })
})

describe('FlashBudget', () => {
  it('allows up to 3 flashes in a second, then waits', () => {
    const budget = new FlashBudget()
    const blink = FLICKERS[0]
    for (const at of [0, 300, 600]) {
      expect(budget.allows(at, 1)).toBe(true)
      budget.record(at, blink)
    }
    expect(budget.allows(900, 1)).toBe(false)
    expect(budget.allows(2000, 1)).toBe(true)
  })
})

describe('powerOn', () => {
  const lines = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17, 18, 19],
  ]

  it('switches every letter on exactly once, the first line before the second', () => {
    const events = powerOn(lines, 1000, new FlashBudget(), seeded(1))
    expect(events.map((event) => event.letter).sort((a, b) => a - b)).toEqual(lines.flat())
    const lastOfFirstLine = Math.max(...events.filter((event) => event.letter < 12).map((event) => event.at))
    const firstOfSecondLine = Math.min(...events.filter((event) => event.letter >= 12).map((event) => event.at))
    expect(firstOfSecondLine).toBeGreaterThan(lastOfFirstLine)
  })

  it('lights the letters in a different order each time', () => {
    const order = (seed: number) => powerOn(lines, 0, new FlashBudget(), seeded(seed)).map((event) => event.letter)
    expect(order(1)).not.toEqual(order(2))
  })
})

describe('the random flickers', () => {
  // Plays the sign for a minute and a half: switching on, then a flicker after a flicker
  function simulate(seed: number) {
    const random = seeded(seed)
    const state = { budget: new FlashBudget(), bag: [], previous: -1 }
    const events = powerOn([[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [12, 13, 14, 15, 16, 17, 18, 19]], 1200, state.budget, random)
    let last = events.at(-1)!
    let end = last.at + last.flicker.duration
    while (end < 90_000) {
      last = nextFlicker(end, 20, state, random)
      events.push(last)
      end = last.at + last.flicker.duration
    }
    return events
  }

  it.each([1, 2, 3, 4, 5])('never passes 3 flashes in any second (run %i)', (seed) => {
    expect(mostFlashesInASecond(simulate(seed))).toBeLessThanOrEqual(3)
  })

  it('flickers one letter at a time', () => {
    const flashing = simulate(7).filter((event) => event.flicker.flashes > 0)
    const overlaps = flashing.filter((event, i) => i > 0 && event.at < flashing[i - 1].at + flashing[i - 1].flicker.duration)
    expect(overlaps).toEqual([])
  })

  it('gives every letter a turn, in a random order, before any letter goes again', () => {
    const later = simulate(3).filter((event) => event.flicker !== SWITCH_ON && event.flicker !== STUTTER_ON)
    const firstRound = later.slice(0, 20).map((event) => event.letter)
    expect([...firstRound].sort((a, b) => a - b)).toEqual(Array.from({ length: 20 }, (_, i) => i))
    expect(firstRound).not.toEqual([...firstRound].sort((a, b) => a - b))
  })

  it('never flickers the same letter twice in a row', () => {
    const later = simulate(4).filter((event) => event.flicker !== SWITCH_ON && event.flicker !== STUTTER_ON)
    const repeats = later.filter((event, i) => i > 0 && event.letter === later[i - 1].letter)
    expect(repeats).toEqual([])
  })

  it('uses every kind of flicker over time', () => {
    const later = simulate(3).filter((event) => event.flicker !== SWITCH_ON && event.flicker !== STUTTER_ON)
    expect(new Set(later.map((event) => event.flicker.name)).size).toBe(FLICKERS.length)
    expect(flashTimes(later).length).toBeGreaterThan(0)
  })
})
