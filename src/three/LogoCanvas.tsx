import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import type { RefObject } from 'react'
import { LogoModel, type StageState } from './LogoModel'
import { CAMERA_DISTANCE, CAMERA_FOV, CANVAS_MARGIN } from './projection'
import { Studio } from './Studio'

type LogoCanvasProps = {
  stateRef: RefObject<StageState>
  /** The 3D logo puts a "draw a new frame" function here, for the Stage to call when the pose changes. */
  frameRequestRef: RefObject<(() => void) | null>
  onReady: () => void
}

/**
 * The 3D scene: camera, studio lighting, the logo, and a bloom effect that makes the
 * red parts glow like neon. This file is loaded separately, after the page's text, because
 * the 3D library is large. Stage.tsx imports it with React.lazy.
 */
export default function LogoCanvas({ stateRef, frameRequestRef, onReady }: LogoCanvasProps) {
  return (
    <Canvas
      // 25% bigger than the logo frame on every side (CANVAS_MARGIN), so glows never get cut off
      style={{ position: 'absolute', inset: `${-CANVAS_MARGIN * 100}%`, width: 'auto', height: 'auto' }}
      // Only draw when something changed (scrolling, the mouse, the startup flicker), instead of
      // 60 times a second forever. An idle tab costs the graphics card nothing.
      frameloop="demand"
      // Sharp on high-resolution screens, but capped so phones don't overwork.
      dpr={[1, 1.75]}
      camera={{ fov: CAMERA_FOV, position: [0, 0, CAMERA_DISTANCE], near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Studio />
      <LogoModel stateRef={stateRef} frameRequestRef={frameRequestRef} onReady={onReady} />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1} intensity={1.1} radius={0.72} />
      </EffectComposer>
    </Canvas>
  )
}
