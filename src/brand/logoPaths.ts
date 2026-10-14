// The DT logo's geometry, drawn on a 200 × 200 design grid (y grows downward, like SVG).
//
// This is the ONLY place the logo's shape is defined. The flat SVG logo and the 3D logo
// both read these points, so the two versions can never drift apart.

/** One corner of a shape: [x, y]. */
export type Point = readonly [x: number, y: number]

/** Outer outline of the D. */
export const D_OUTER: readonly Point[] = [
  [24, 44],
  [92, 44],
  [120, 72], // top-right chamfer ends here
  [120, 128],
  [92, 156], // bottom-right chamfer
  [24, 156],
]

/** The window cut into the D. The red light shines through it. */
export const D_WINDOW: readonly Point[] = [
  [48, 68],
  [48, 132],
  [84, 132],
  [96, 120],
  [96, 80],
  [84, 68],
]

/**
 * Outline of the T. Its left edge runs parallel to the D's top-right chamfer,
 * and its stem starts 4 units right of the D. That 4-unit gap is the seam.
 */
export const T_OUTER: readonly Point[] = [
  [97.66, 44],
  [174.34, 44],
  [174.34, 68],
  [148, 68],
  [148, 156],
  [124, 156],
  [124, 68],
  [121.66, 68],
]

/** The centre line of the seam between the D and the T, where red light leaks out. */
export const SEAM: readonly Point[] = [
  [94.83, 44],
  [122, 71.17],
  [122, 128],
]

/** Width of the gap between the two pieces, in grid units. */
export const SEAM_WIDTH = 4

/** The smallest box that contains the whole logo. */
export const LOGO_BOUNDS = { minX: 24, minY: 44, maxX: 174.34, maxY: 156 } as const

/** A square SVG viewBox around the logo, with a little breathing room. */
export const LOGO_VIEWBOX = '21 22 156 156'

/**
 * Turns a list of points into SVG path data, e.g. "M24 44L92 44L120 72Z".
 * Set `closed` to false for open lines like the seam.
 */
export function toPathData(points: readonly Point[], closed = true): string {
  const commands = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`)
  return commands.join('') + (closed ? 'Z' : '')
}
