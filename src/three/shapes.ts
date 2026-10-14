import { Path, Shape, Vector2 } from 'three'
import { D_OUTER, D_WINDOW, T_OUTER, type Point } from '../brand/logoPaths'

/** 100 logo-grid units make one unit in the 3D world. */
export const GRID_PER_WORLD = 100

/** How thick the 3D letters are, in world units (24 grid units). */
export const DEPTH = 0.24

/**
 * Converts a point on the logo's 200-unit grid into 3D coordinates.
 * The grid's y axis points down (like SVG) and 3D's points up, so y is flipped,
 * and the grid's centre (100, 100) becomes the 3D origin.
 */
export function toWorld([x, y]: Point): Vector2 {
  return new Vector2((x - 100) / GRID_PER_WORLD, -(y - 100) / GRID_PER_WORLD)
}

const outline = (points: readonly Point[]) => new Shape(points.map(toWorld))

/** The D, with its window cut out as a hole. */
export function createDShape(): Shape {
  const shape = outline(D_OUTER)
  shape.holes.push(new Path(D_WINDOW.map(toWorld)))
  return shape
}

/** The T. */
export function createTShape(): Shape {
  return outline(T_OUTER)
}

/** The D's window on its own, for the red light that sits inside it. */
export function createWindowShape(): Shape {
  return outline(D_WINDOW)
}

/**
 * A strip around the seam between the pieces, a little wider than the gap. The light
 * placed here only shows through the gap, so it looks like light leaking out of the seam.
 */
export function createSeamGlowShape(): Shape {
  return outline([
    [95.5, 39],
    [126, 69.5],
    [126, 130],
    [118, 130],
    [118, 72.8],
    [89.5, 44.3],
  ])
}
