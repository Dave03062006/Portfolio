import { useFrame, useThree } from '@react-three/fiber'
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing'
import { useEffect, useMemo } from 'react'
import { HalfFloatType } from 'three'

/**
 * The neon glow ("bloom"). Anything brighter than pure white, which here means only the
 * emissive red parts, bleeds soft light around itself, like a real neon tube.
 *
 * It works by drawing the scene into an off-screen image first, then running a glow
 * filter over that image before showing it.
 */
export function Glow() {
  const { gl, scene, camera, size } = useThree()

  const composer = useMemo(() => {
    // Smooth edges cost extra memory and time; phones and tablets (touch screens) skip them.
    const touchScreen = window.matchMedia('(pointer: coarse)').matches
    const effects = new EffectComposer(gl, { frameBufferType: HalfFloatType, multisampling: touchScreen ? 0 : 4 })
    effects.addPass(new RenderPass(scene, camera))
    effects.addPass(
      new EffectPass(
        camera,
        new BloomEffect({ mipmapBlur: true, luminanceThreshold: 1, intensity: 1.1, radius: 0.72 }),
      ),
    )
    return effects
  }, [gl, scene, camera])

  useEffect(() => composer.setSize(size.width, size.height), [composer, size])
  useEffect(() => () => composer.dispose(), [composer])

  // A priority of 1 tells React Three Fiber "I'll draw the frame myself": the composer
  // renders the scene plus the glow, instead of the plain scene.
  useFrame((_, delta) => composer.render(delta), 1)
  return null
}
