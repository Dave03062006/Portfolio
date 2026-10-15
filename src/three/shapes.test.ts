import { describe, expect, it } from 'vitest'
import { createDShape, createSeamTubePath, createTShape, createWindowShape, toWorld } from './shapes'

const bounds = (points: { x: number; y: number }[]) => ({
  minX: Math.min(...points.map((p) => p.x)),
  maxX: Math.max(...points.map((p) => p.x)),
  minY: Math.min(...points.map((p) => p.y)),
  maxY: Math.max(...points.map((p) => p.y)),
})

describe('toWorld', () => {
  it('puts the middle of the logo grid at the 3D origin', () => {
    const origin = toWorld([100, 100])
    expect(origin.x).toBeCloseTo(0)
    expect(origin.y).toBeCloseTo(0) // flipping 0 gives -0, which is the same position
  })

  it('flips y, because the grid points down and 3D points up', () => {
    expect(toWorld([100, 0]).y).toBe(1)
    expect(toWorld([200, 100]).x).toBe(1)
  })
})

describe('logo shapes', () => {
  it('gives the D exactly one hole: its window', () => {
    expect(createDShape().holes).toHaveLength(1)
  })

  it('makes the D 96 grid units wide and 112 tall', () => {
    const box = bounds(createDShape().getPoints())
    expect(box.maxX - box.minX).toBeCloseTo(0.96)
    expect(box.maxY - box.minY).toBeCloseTo(1.12)
  })

  it('keeps a 4-unit gap between the D and the T stem', () => {
    const d = bounds(createDShape().getPoints())
    const tStemLeft = toWorld([124, 100]).x
    expect(tStemLeft - d.maxX).toBeCloseTo(0.04)
  })

  it('fits the window inside the D', () => {
    const d = bounds(createDShape().getPoints())
    const w = bounds(createWindowShape().getPoints())
    expect(w.minX).toBeGreaterThan(d.minX)
    expect(w.maxX).toBeLessThan(d.maxX)
    expect(w.minY).toBeGreaterThan(d.minY)
    expect(w.maxY).toBeLessThan(d.maxY)
  })

  it('lines the T up with the top of the D', () => {
    const d = bounds(createDShape().getPoints())
    const t = bounds(createTShape().getPoints())
    expect(t.maxY).toBeCloseTo(d.maxY)
    expect(t.minY).toBeCloseTo(d.minY)
  })
})

describe('the seam neon tube', () => {
  const points = createSeamTubePath(0).getSpacedPoints(80)

  it('stays below the top edge of the logo, so nothing pokes out', () => {
    const top = toWorld([0, 44]).y
    expect(Math.max(...points.map((p) => p.y))).toBeLessThan(top)
  })

  it('stays in the middle of the 4-unit gap, bend included', () => {
    // Distance from the gap's centre line, in grid units: the diagonal x - y = 50.83, then x = 122
    const offCentre = points.map((p) => {
      const x = p.x * 100 + 100
      const y = 100 - p.y * 100
      return y < 71.17 ? Math.abs(x - y - 50.83) / Math.SQRT2 : Math.abs(x - 122)
    })
    expect(Math.max(...offCentre)).toBeLessThan(1.5)
  })
})
