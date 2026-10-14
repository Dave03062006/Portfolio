import { PerspectiveCamera, Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import { CAMERA_DISTANCE, CAMERA_FOV, ndcToDrawing } from './projection'

describe('ndcToDrawing', () => {
  it('maps the middle of the canvas to the middle of the drawing', () => {
    const [x, y] = ndcToDrawing(0, 0)
    expect(x).toBeCloseTo(130)
    expect(y).toBeCloseTo(110)
  })

  it('agrees with the real camera: drawing corners land where the flat logo has them', () => {
    // Same camera as the 3D logo. The drawing's top-left corner is 3D (−1.3, 1.1) at depth 0.
    const camera = new PerspectiveCamera(CAMERA_FOV, 260 / 220, 0.1, 50)
    camera.position.set(0, 0, CAMERA_DISTANCE)
    camera.updateMatrixWorld()

    const topLeft = new Vector3(-1.3, 1.1, 0).project(camera)
    const [x1, y1] = ndcToDrawing(topLeft.x, topLeft.y)
    expect(x1).toBeCloseTo(0)
    expect(y1).toBeCloseTo(0)

    const bottomRight = new Vector3(1.3, -1.1, 0).project(camera)
    const [x2, y2] = ndcToDrawing(bottomRight.x, bottomRight.y)
    expect(x2).toBeCloseTo(260)
    expect(y2).toBeCloseTo(220)
  })
})
