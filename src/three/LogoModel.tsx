/* eslint-disable react/immutability --
   In React Three Fiber, 3D objects are changed in place on every frame (inside useFrame).
   That is the intended way to animate at 60 fps without re-rendering, so this rule,
   which is right for ordinary React data, does not apply to this file. */
import { Edges, RoundedBox, type EdgesRef } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import {
  CanvasTexture,
  Color,
  ExtrudeGeometry,
  MathUtils,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  ShapeGeometry,
  SRGBColorSpace,
  Vector3,
  type Group,
  type PointLight,
  type Shape,
} from 'three'
import type { LogoPart } from '../content/types'
import { TEARDOWN } from '../motion/choreography'
import type { Pose } from '../motion/pose'
import { CHIP_CELLS, CHIP_ORIGIN, CHIP_SIZE, CELL_SIZE } from './chip'
import { fallbackLayout } from './fallbackLayout'
import { ignitionLevel } from './ignition'
import { LABEL_LAYOUT, liveAnchors } from './labelLayout'
import { ndcToDrawing } from './projection'
import { DEPTH, createDShape, createSeamGlowShape, createTShape, createWindowShape } from './shapes'

/** What the Stage tells the 3D logo. It's updated on every render and read on every frame. */
export type StageState = {
  pose: Pose
  /** 0 to 1: how visible the exploded-view labels are. The mouse tilt eases off while they show. */
  labels: number
  reduced: boolean
}

const BEVEL = 0.012
const RED = new Color('#ff2d3d')
const HOT = new Color('#ffc2c7')
const scratch = new Vector3()

/** Turns a flat logo shape into a solid 3D piece, centred on depth 0. */
function extrude(shape: Shape, bevelled: boolean): ExtrudeGeometry {
  const depth = bevelled ? DEPTH - 2 * BEVEL : DEPTH
  const geometry = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevelled,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelOffset: -BEVEL, // bevel inwards, so the outline (and the 4-unit seam) stays exact
    bevelSegments: 2,
    curveSegments: 1,
  })
  geometry.translate(0, 0, -depth / 2)
  return geometry
}

/** The glow inside the D's window: bright red in the middle, darker at the edges. */
function createWindowTexture(): CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const context = canvas.getContext('2d')!
  const gradient = context.createRadialGradient(size * 0.42, size / 2, 0, size * 0.42, size / 2, size * 0.75)
  gradient.addColorStop(0, '#ff3a4a')
  gradient.addColorStop(0.55, '#b8001b')
  gradient.addColorStop(1, '#3d0008')
  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

/** Stretches a flat shape's texture coordinates to 0–1, so a texture covers it exactly once. */
function fitUVs(geometry: ShapeGeometry): ShapeGeometry {
  geometry.computeBoundingBox()
  const { min, max } = geometry.boundingBox!
  const position = geometry.attributes.position
  const uv = geometry.attributes.uv
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, (position.getX(i) - min.x) / (max.x - min.x), (position.getY(i) - min.y) / (max.y - min.y))
  }
  uv.needsUpdate = true
  return geometry
}

// Where the chip's centre sits in 3D (the flat drawing's centre, (130, 110), is the 3D origin).
const CHIP_CENTER = {
  x: (CHIP_ORIGIN.x + CHIP_SIZE.width / 2 - 130) / 100,
  y: -(CHIP_ORIGIN.y + CHIP_SIZE.height / 2 - 110) / 100,
}

/** Where each label's anchor sits on its own piece, worked out once from the flat layout. */
function anchorsOnPieces(): Record<LogoPart, Vector3> {
  const apart = fallbackLayout(TEARDOWN)
  const onLetter = (part: 'D' | 'T') => {
    const [x, y] = LABEL_LAYOUT[part].anchor
    const piece = part === 'D' ? apart.d : apart.t
    // Undo the piece's move, then convert from logo-grid units to 3D, on the front face.
    return new Vector3((x - piece.x - 100) / 100, -(y - piece.y - 100) / 100, DEPTH / 2)
  }
  const [cx, cy] = LABEL_LAYOUT.core.anchor
  const chipCenterX = CHIP_ORIGIN.x + CHIP_SIZE.width / 2
  const chipCenterY = CHIP_ORIGIN.y + CHIP_SIZE.height / 2
  return {
    D: onLetter('D'),
    T: onLetter('T'),
    core: new Vector3((cx - chipCenterX) / 100, -(cy - chipCenterY) / 100, 0.05),
  }
}

type LogoModelProps = {
  stateRef: RefObject<StageState>
  /** Filled with this scene's "draw a new frame" function, so the Stage can ask for one. */
  frameRequestRef: RefObject<(() => void) | null>
  /** Called once the first frames have been drawn, so the flat logo can fade out. */
  onReady: () => void
}

/** The DT logo in 3D: two machined metal pieces, the glowing window and seam, and the core chip. */
export function LogoModel({ stateRef, frameRequestRef, onReady }: LogoModelProps) {
  // The canvas only draws when asked (see LogoCanvas). This is how we ask.
  const invalidate = useThree((state) => state.invalidate)

  // Build geometry and materials once. useMemo keeps them between renders.
  const parts = useMemo(() => {
    const metal = () =>
      new MeshPhysicalMaterial({
        color: '#2c2c33',
        metalness: 0.92,
        roughness: 0.32,
        clearcoat: 0.25,
        clearcoatRoughness: 0.4,
      })
    const glow = (color: Color, map?: CanvasTexture) =>
      new MeshBasicMaterial({ color: color.clone(), map, toneMapped: false, transparent: true })
    return {
      dGeometry: extrude(createDShape(), true),
      tGeometry: extrude(createTShape(), true),
      dOutline: extrude(createDShape(), false),
      tOutline: extrude(createTShape(), false),
      windowGeometry: fitUVs(new ShapeGeometry(createWindowShape())),
      seamGeometry: new ShapeGeometry(createSeamGlowShape()),
      dMetal: metal(),
      tMetal: metal(),
      windowGlow: glow(new Color(1, 1, 1), createWindowTexture()),
      seamGlow: glow(RED),
      chipBody: new MeshStandardMaterial({ color: '#1c0508', roughness: 0.55, metalness: 0.3, emissive: RED }),
      cellGlow: glow(RED),
      hotCellGlow: glow(HOT),
    }
  }, [])
  const anchors = useMemo(() => anchorsOnPieces(), [])

  const logo = useRef<Group>(null)
  const d = useRef<Group>(null)
  const t = useRef<Group>(null)
  const chip = useRef<Group>(null)
  const dEdges = useRef<EdgesRef>(null)
  const tEdges = useRef<EdgesRef>(null)
  const spill = useRef<PointLight>(null)
  const tilt = useRef({ x: 0, y: 0 })
  const pointer = useRef({ x: 0, y: 0 })
  const framesDrawn = useRef(0)

  // Let the Stage request a frame whenever the pose changes.
  useEffect(() => {
    frameRequestRef.current = invalidate
    return () => {
      frameRequestRef.current = null
    }
  }, [frameRequestRef, invalidate])

  // Mouse tilt: remember where the pointer is (only for real mice, not touch screens).
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
      invalidate()
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [invalidate])

  // When the 3D logo goes away, the labels should go back to the flat layout.
  useEffect(
    () => () => {
      delete liveAnchors.D
      delete liveAnchors.T
      delete liveAnchors.core
    },
    [],
  )

  // Runs before every frame is drawn. Everything here changes objects directly instead of
  // React state, so it can run 60 times a second without re-rendering anything.
  useFrame(({ camera }, delta) => {
    if (!logo.current || !d.current || !t.current || !chip.current) return
    const { pose, labels, reduced } = stateRef.current
    const layout = fallbackLayout(pose) // the same numbers the flat logo uses, so the two match

    // Pieces: the flat layout's sideways moves, plus depth: the focused piece comes forward.
    d.current.position.set(
      (layout.d.x - 30) / 100,
      -(layout.d.y - 10) / 100,
      0.3 * layout.d.highlight - 0.2 * (1 - layout.d.opacity),
    )
    t.current.position.set(
      (layout.t.x - 30) / 100,
      -(layout.t.y - 10) / 100,
      0.3 * layout.t.highlight - 0.2 * (1 - layout.t.opacity),
    )
    parts.dMetal.envMapIntensity = 0.2 + 0.8 * layout.d.opacity
    parts.tMetal.envMapIntensity = 0.2 + 0.8 * layout.t.opacity
    if (dEdges.current) dEdges.current.material.opacity = layout.d.highlight
    if (tEdges.current) tEdges.current.material.opacity = layout.t.highlight

    // The core: hidden inside while assembled, grows as the pieces part, comes forward in About.
    const coreFocus = pose.focus === 'core' ? pose.focusAmount : 0
    chip.current.scale.setScalar(Math.max(0.001, pose.spread))
    chip.current.position.set(CHIP_CENTER.x, CHIP_CENTER.y, -0.06 + 0.4 * coreFocus)
    const coreGlow = layout.core.glow
    parts.cellGlow.color.copy(RED).multiplyScalar(1 + 2.2 * coreGlow)
    parts.hotCellGlow.color.copy(HOT).multiplyScalar(1.2 + 2.4 * coreGlow)
    parts.chipBody.emissiveIntensity = 0.05 + 0.35 * coreGlow

    // Neon: the window and seam flicker on at page load, then follow the pose's glow.
    const neon = reduced ? 1 : ignitionLevel(performance.now() / 1000)
    parts.windowGlow.color.setScalar(neon * (1.1 + 0.9 * pose.glow))
    parts.seamGlow.opacity = neon * layout.seamGlow
    parts.seamGlow.color.copy(RED).multiplyScalar(2.2)
    if (spill.current) spill.current.intensity = neon * (0.6 + 1.6 * pose.glow)

    // Turn the whole logo, plus a little tilt toward the mouse (eased off while labels show).
    const allowTilt = reduced ? 0 : 1 - labels
    tilt.current.x = MathUtils.damp(tilt.current.x, pointer.current.y * 3 * allowTilt, 4, delta)
    tilt.current.y = MathUtils.damp(tilt.current.y, pointer.current.x * 4 * allowTilt, 4, delta)
    logo.current.rotation.set(
      MathUtils.degToRad(pose.rotX + tilt.current.x),
      MathUtils.degToRad(pose.rotY + tilt.current.y),
      0,
    )

    // Tell the labels where their parts are on screen, so their lines stay attached.
    if (labels > 0) {
      logo.current.updateMatrixWorld()
      const pieces: Record<LogoPart, Group> = { D: d.current, T: t.current, core: chip.current }
      for (const part of ['D', 'T', 'core'] as const) {
        scratch.copy(anchors[part])
        pieces[part].localToWorld(scratch).project(camera)
        liveAnchors[part] = ndcToDrawing(scratch.x, scratch.y)
      }
    }

    // A couple of frames in, the 3D logo is definitely on screen: let the flat one fade out.
    framesDrawn.current += 1
    if (framesDrawn.current === 3) onReady()

    // Keep drawing while something is still moving on its own: the first few frames,
    // the startup flicker, or the tilt easing toward the mouse.
    const tiltSettling =
      Math.abs(tilt.current.x - pointer.current.y * 3 * allowTilt) > 0.01 ||
      Math.abs(tilt.current.y - pointer.current.x * 4 * allowTilt) > 0.01
    if (framesDrawn.current < 3 || neon < 1 || tiltSettling) invalidate()
  })

  return (
    <group ref={logo}>
      <pointLight ref={spill} color={RED} position={[0.12, 0, 0.9]} distance={3} decay={1.5} />

      {/* The D, with its window glowing from inside */}
      <group ref={d}>
        <mesh geometry={parts.dGeometry} material={parts.dMetal} />
        <mesh geometry={parts.windowGeometry} material={parts.windowGlow} position-z={-DEPTH / 2 + 0.006} />
        <Edges ref={dEdges} geometry={parts.dOutline} threshold={20} lineWidth={1.6} color={RED.clone().multiplyScalar(3)} toneMapped={false} transparent opacity={0} />
      </group>

      {/* The T */}
      <group ref={t}>
        <mesh geometry={parts.tGeometry} material={parts.tMetal} />
        <Edges ref={tEdges} geometry={parts.tOutline} threshold={20} lineWidth={1.6} color={RED.clone().multiplyScalar(3)} toneMapped={false} transparent opacity={0} />
      </group>

      {/* Light in the seam: it sits between the pieces, so it only shows through the gap */}
      <mesh geometry={parts.seamGeometry} material={parts.seamGlow} position-z={0} />

      {/* The core chip */}
      <group ref={chip}>
        <RoundedBox args={[CHIP_SIZE.width / 100, CHIP_SIZE.height / 100, 0.1]} radius={0.03} smoothness={3} material={parts.chipBody} />
        {CHIP_CELLS.map((cell) => (
          <mesh
            key={`${cell.x}-${cell.y}`}
            position={[
              (cell.x + CELL_SIZE / 2 - CHIP_SIZE.width / 2) / 100,
              -(cell.y + CELL_SIZE / 2 - CHIP_SIZE.height / 2) / 100,
              0.056,
            ]}
            material={cell.hot ? parts.hotCellGlow : parts.cellGlow}
          >
            <boxGeometry args={[CELL_SIZE / 100, CELL_SIZE / 100, 0.012]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
