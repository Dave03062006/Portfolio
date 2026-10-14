import type { ChapterId, LogoPart } from '../content/types'

/**
 * How the logo looks at one moment. Both the flat SVG logo and the 3D logo are drawn
 * from a Pose, so the two always tell the same story.
 */
export type Pose = {
  /** 0 = assembled, 1 = pieces pulled apart. */
  spread: number
  /** The part brought forward, or null for none. */
  focus: LogoPart | null
  /** 0 to 1: how far the focused part has come forward. */
  focusAmount: number
  /** 0 to 1: how strongly the red light glows. */
  glow: number
  /** Tilt and turn in degrees. Only the 3D logo uses these. */
  rotX: number
  rotY: number
}

/** The resting pose for each chapter: what the logo settles into while you read that section. */
export const CHAPTER_POSES: Record<ChapterId, Pose> = {
  intro: { spread: 0, focus: null, focusAmount: 0, glow: 0.65, rotX: 0, rotY: 0 },
  about: { spread: 1, focus: 'core', focusAmount: 1, glow: 0.7, rotX: 6, rotY: -14 },
  projects: { spread: 1, focus: 'D', focusAmount: 1, glow: 0.7, rotX: 4, rotY: 16 },
  experience: { spread: 1, focus: 'T', focusAmount: 1, glow: 0.7, rotX: 4, rotY: -18 },
  contact: { spread: 0, focus: null, focusAmount: 0, glow: 1, rotX: 0, rotY: 0 },
}
