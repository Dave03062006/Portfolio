import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useState, type RefObject } from 'react'
import { Glow } from './Glow'
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
  // Draw nothing until the graphics programs are ready (see CompileThenDraw below), then
  // draw only when something changed: scrolling, the mouse, the startup flicker.
  const [frameloop, setFrameloop] = useState<'never' | 'demand'>('never')

  return (
    <Canvas
      // 25% bigger than the logo frame on every side (CANVAS_MARGIN), so glows never get cut off
      style={{ position: 'absolute', inset: `${-CANVAS_MARGIN * 100}%`, width: 'auto', height: 'auto' }}
      // Measure the frame's size before any CSS scaling. On the cover, the Stage scales the
      // whole frame up, and the drawing surface mustn't grow a second time.
      resize={{ offsetSize: true }}
      frameloop={frameloop}
      // At least 1.5 pixels per CSS pixel, so the logo stays sharp when the cover shows it
      // half as big again; capped at 1.75 so phones don't overwork.
      dpr={[1.5, 1.75]}
      camera={{ fov: CAMERA_FOV, position: [0, 0, CAMERA_DISTANCE], near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true }}
      // Checking shaders for mistakes makes the browser wait on the graphics card; only do it while developing.
      onCreated={({ gl }) => {
        gl.debug.checkShaderErrors = import.meta.env.DEV
      }}
    >
      <Studio />
      <LogoModel stateRef={stateRef} frameRequestRef={frameRequestRef} onReady={onReady} />
      <Glow />
      <CompileThenDraw onCompiled={() => setFrameloop('demand')} />
    </Canvas>
  )
}

/**
 * Prepares the logo's graphics programs ("shaders") in the background before the first frame.
 * Compiling them the usual way freezes the page for a moment, very noticeably on phones.
 * Meanwhile the flat logo stays on screen, so nobody sees the wait.
 */
function CompileThenDraw({ onCompiled }: { onCompiled: () => void }) {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera)
  const frameloop = useThree((state) => state.frameloop)
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    let cancelled = false
    gl.compileAsync(scene, camera).then(() => {
      if (!cancelled) onCompiled()
    })
    return () => {
      cancelled = true
    }
    // Compile once, when the scene first exists.
    // eslint-disable-next-line react/exhaustive-deps
  }, [gl, scene, camera])

  // As soon as drawing is switched on, draw the first frame.
  useEffect(() => {
    if (frameloop === 'demand') invalidate()
  }, [frameloop, invalidate])

  return null
}
