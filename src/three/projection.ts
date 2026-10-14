import type { DrawingPoint } from './labelLayout'

/**
 * The 3D canvas is bigger than the logo's frame by this much on every side (25%), so the
 * glow, turning pieces and pieces coming forward have room without being cut off.
 */
export const CANVAS_MARGIN = 0.25

/** The flat drawing is 260 × 220 units; 100 of them make one 3D unit. */
const DRAWING = { width: 260, height: 220 }

/** The camera's vertical field of view, in degrees. Narrow, like a product-photo lens. */
export const CAMERA_FOV = 30

/**
 * How far back the camera stands. At this distance, the frame shows exactly the flat
 * drawing's area at depth 0, so the 3D logo is the same size and in the same place as
 * the flat one, and the two can swap without a jump.
 */
export const CAMERA_DISTANCE =
  ((DRAWING.height / 100) * (1 + 2 * CANVAS_MARGIN)) / 2 / Math.tan(((CAMERA_FOV / 2) * Math.PI) / 180)

/** Turns a projected 3D point (−1 to 1 across the canvas) into flat-drawing units. */
export function ndcToDrawing(ndcX: number, ndcY: number): DrawingPoint {
  const span = 1 + 2 * CANVAS_MARGIN
  const fractionX = ((ndcX + 1) / 2) * span - CANVAS_MARGIN
  const fractionY = ((1 - ndcY) / 2) * span - CANVAS_MARGIN
  return [fractionX * DRAWING.width, fractionY * DRAWING.height]
}
