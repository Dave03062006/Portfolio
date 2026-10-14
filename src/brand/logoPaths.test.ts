import { describe, expect, it } from 'vitest'
import { D_OUTER, LOGO_BOUNDS, SEAM_WIDTH, T_OUTER, toPathData } from './logoPaths'

/** Distance between two parallel lines of the form x - y = c. */
function gapBetweenDiagonals(c1: number, c2: number) {
  return Math.abs(c2 - c1) / Math.SQRT2
}

describe('logo geometry', () => {
  it('keeps the angled seam exactly one seam-width wide', () => {
    // The D's top-right chamfer runs from [92, 44] to [120, 72], so every point on it has x - y = 48.
    const [dx, dy] = D_OUTER[1]
    // The T's angled left edge starts at its first point.
    const [tx, ty] = T_OUTER[0]
    expect(gapBetweenDiagonals(dx - dy, tx - ty)).toBeCloseTo(SEAM_WIDTH, 1)
  })

  it('keeps the vertical seam exactly one seam-width wide', () => {
    const dRightEdge = D_OUTER[2][0] // x = 120
    const tStemLeftEdge = T_OUTER[6][0] // x = 124
    expect(tStemLeftEdge - dRightEdge).toBe(SEAM_WIDTH)
  })

  it('fits every point inside the published bounds', () => {
    for (const [x, y] of [...D_OUTER, ...T_OUTER]) {
      expect(x).toBeGreaterThanOrEqual(LOGO_BOUNDS.minX)
      expect(x).toBeLessThanOrEqual(LOGO_BOUNDS.maxX)
      expect(y).toBeGreaterThanOrEqual(LOGO_BOUNDS.minY)
      expect(y).toBeLessThanOrEqual(LOGO_BOUNDS.maxY)
    }
  })
})

describe('toPathData', () => {
  it('builds a closed SVG path by default', () => {
    expect(toPathData([[0, 0], [10, 0], [10, 10]])).toBe('M0 0L10 0L10 10Z')
  })

  it('leaves the path open when asked', () => {
    expect(toPathData([[0, 0], [5, 5]], false)).toBe('M0 0L5 5')
  })
})
