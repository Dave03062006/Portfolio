import { BRAND } from '../brand/colors'

type Lamp = {
  color: string
  intensity: number
  position: [number, number, number]
}

// Lamps placed where a product photographer would put soft boxes. Point lights are the
// cheapest kind for the graphics card to draw, which keeps the page from stuttering while
// the 3D logo starts up (fancier "environment" and "area" lights made phones freeze).
const LAMPS: Lamp[] = [
  // behind the camera: lights the faces that look at you, and puts a soft sheen on them
  { color: '#ffffff', intensity: 2.4, position: [0, 2.2, 5] },
  // left and right: crisp highlights along the bevelled edges
  { color: '#ffffff', intensity: 1.8, position: [-4, 0.8, 2] },
  { color: '#ffffff', intensity: 1.8, position: [4, 0.8, 2] },
  // red from below and behind: the neon bounce and rim on every edge
  { color: BRAND.red, intensity: 7, position: [0, -3.2, 1.5] },
  { color: BRAND.red, intensity: 9, position: [0, 0.6, -3] },
]

/**
 * Lighting, set up like a product photo studio: white lamps for shape and shine, red lamps
 * for the neon glow on the edges. `decay={0}` means a lamp is equally bright at any distance,
 * which makes the brightness numbers above easy to tune by eye.
 */
export function Studio() {
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[1, 3, 4]} intensity={0.6} />
      {LAMPS.map((lamp, i) => (
        <pointLight key={i} color={lamp.color} intensity={lamp.intensity} position={lamp.position} decay={0} />
      ))}
    </>
  )
}
