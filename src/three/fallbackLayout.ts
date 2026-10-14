import type { Pose } from '../motion/pose'

/** Where one piece sits in the flat drawing, and how visible it is. */
export type PieceLayout = {
  x: number
  y: number
  opacity: number
  /** 0 to 1: strength of the red edge light that marks the focused piece. */
  highlight: number
}

export type FallbackLayout = {
  d: PieceLayout
  t: PieceLayout
  core: { opacity: number; glow: number }
  /** Light leaking from the seam. Only visible while the pieces are together. */
  seamGlow: number
  /** The soft red haze behind the whole logo. */
  ambientGlow: number
}

// The logo is drawn on a 200-unit grid. Placed at this offset, it sits in the middle
// of the flat logo's 260 × 220 drawing, which leaves room for the pieces to move apart.
const BASE_X = 30
const BASE_Y = 10

/** Turns a Pose into positions and opacities for the flat SVG logo. */
export function fallbackLayout(pose: Pose): FallbackLayout {
  const { spread, focus, focusAmount, glow } = pose
  // When any part is focused, both letters step further apart to make room.
  const apart = focus ? focusAmount : 0
  const dimmed = (part: Pose['focus']) => (focus && focus !== part ? 1 - 0.75 * focusAmount : 1)

  return {
    d: {
      x: BASE_X - 12 * spread - 14 * apart,
      y: BASE_Y + 4 * spread,
      opacity: dimmed('D'),
      highlight: focus === 'D' ? focusAmount : 0,
    },
    t: {
      x: BASE_X + 16 * spread + 14 * apart,
      y: BASE_Y - 10 * spread - (focus === 'T' ? 6 * focusAmount : 0),
      opacity: dimmed('T'),
      highlight: focus === 'T' ? focusAmount : 0,
    },
    core: {
      opacity: spread * (focus && focus !== 'core' ? 1 - 0.7 * focusAmount : 1),
      glow:
        spread *
        (focus === 'core' ? 0.55 + 0.45 * focusAmount : focus ? 0.55 * (1 - focusAmount) : 0.55),
    },
    seamGlow: (1 - spread) * glow,
    ambientGlow: 0.06 + 0.2 * glow,
  }
}
