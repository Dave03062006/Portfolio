import { CurvePath, LineCurve3, Path, QuadraticBezierCurve3, Shape, Vector2, Vector3 } from 'three'
import { D_OUTER, D_WINDOW, SEAM, T_OUTER, type Point } from '../brand/logoPaths'

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

/** The point `distance` along the straight line from `from` towards `to`. */
const along = (from: Vector3, to: Vector3, distance: number) =>
  from.clone().add(to.clone().sub(from).setLength(distance))

/**
 * The path of the neon tube inside the seam: along the middle of the gap between the pieces,
 * bent round the corner like real glass tubing. It starts a little below the logo's top edge,
 * so the tube's rounded end never pokes out. `z` is how far in front of the pieces' middle it sits.
 */
export function createSeamTubePath(z: number): CurvePath<Vector3> {
  const [start, corner, end] = SEAM.map((point) => {
    const { x, y } = toWorld(point)
    return new Vector3(x, y, z)
  })
  const bend = 0.04 // how far from the corner the bend begins, in world units (4 grid units)
  const path = new CurvePath<Vector3>()
  path.add(new LineCurve3(along(start, corner, 0.025), along(corner, start, bend)))
  path.add(new QuadraticBezierCurve3(along(corner, start, bend), corner, along(corner, end, bend)))
  path.add(new LineCurve3(along(corner, end, bend), end))
  return path
}
