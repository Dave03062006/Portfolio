import { Environment, Lightformer } from '@react-three/drei'

/**
 * Lighting, set up like a product photo studio. Metal looks like metal because of what it
 * reflects, so the logo sits inside an invisible "environment" of glowing panels: white
 * strips for crisp highlights, and red panels below and behind for neon reflections.
 * It's rendered once at startup (frames={1}) and costs nothing after that.
 */
export function Studio() {
  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight position={[2, 3, 4]} intensity={0.5} />
      <Environment resolution={256} frames={1}>
        {/* big soft box behind the camera: the faces that look at you reflect this one */}
        <Lightformer form="rect" intensity={1.4} position={[0, 2.5, 5]} scale={[10, 5, 1]} target={[0, 0, 0]} />
        {/* soft box above, two thin strip lights left and right */}
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[8, 2, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.6} position={[-4, 0.5, 2]} scale={[0.6, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.6} position={[4, 0.5, 2]} scale={[0.6, 6, 1]} target={[0, 0, 0]} />
        {/* red glow bouncing up from below, and a red ring behind for rim light */}
        <Lightformer form="rect" color="#ff2d3d" intensity={4} position={[0, -3.5, 1.5]} scale={[7, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" color="#ff2d3d" intensity={3} position={[0, 0.5, -4]} scale={3} target={[0, 0, 0]} />
      </Environment>
    </>
  )
}
