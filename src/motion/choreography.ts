import { CHAPTER_POSES, type Pose } from './pose'

// The logo's choreography: which pose it should be in at each moment of story time
// (see storyTime.ts). Between two moments, the pose blends smoothly from one to the next.

type Keyframe = { at: number; pose: Pose }

const ASSEMBLED = CHAPTER_POSES.intro
/** Pulled apart, nothing in focus: the "exploded view" with the three labels. */
export const TEARDOWN: Pose = { spread: 1, focus: null, focusAmount: 0, glow: 0.7, rotX: 4, rotY: -8 }

export const KEYFRAMES: readonly Keyframe[] = [
  { at: 0, pose: ASSEMBLED },
  // The first scroll turns the logo like a turntable, so you see its depth...
  { at: 0.4, pose: { ...ASSEMBLED, glow: 0.7, rotX: 8, rotY: -28 } },
  // ...then it comes apart.
  { at: 0.7, pose: { ...TEARDOWN, rotX: 6, rotY: -12 } },
  { at: 1, pose: TEARDOWN },
  // About: the core lights up.
  { at: 1.2, pose: CHAPTER_POSES.about },
  { at: 1.85, pose: CHAPTER_POSES.about },
  { at: 2, pose: TEARDOWN },
  // Projects: the D comes forward.
  { at: 2.15, pose: CHAPTER_POSES.projects },
  { at: 2.85, pose: CHAPTER_POSES.projects },
  { at: 3, pose: TEARDOWN },
  // Experience: the T comes forward.
  { at: 3.15, pose: CHAPTER_POSES.experience },
  { at: 3.85, pose: CHAPTER_POSES.experience },
  { at: 4, pose: TEARDOWN },
  // Contact: everything comes back together at full glow.
  { at: 4.25, pose: CHAPTER_POSES.contact },
]

/**
 * The intro's second resting place: the logo has come apart and all three labels are showing.
 * Intro.module.css puts a scroll stop here. Keep the two in step.
 */
export const EXPLODED_STOP = 0.95

const lerp = (a: number, b: number, amount: number) => a + (b - a) * amount
/** Eases in and out, so moves start and stop gently instead of jerking. */
const smooth = (x: number) => x * x * (3 - 2 * x)

/** Blends two poses. `amount` 0 gives `a`, 1 gives `b`. */
export function blendPoses(a: Pose, b: Pose, amount: number): Pose {
  const focusAmount = lerp(a.focusAmount, b.focusAmount, amount)
  return {
    spread: lerp(a.spread, b.spread, amount),
    // The choreography only ever moves focus to or from "nothing", never straight
    // from one part to another, so one of the two is always null here.
    focus: focusAmount === 0 ? null : (a.focus ?? b.focus),
    focusAmount,
    glow: lerp(a.glow, b.glow, amount),
    rotX: lerp(a.rotX, b.rotX, amount),
    rotY: lerp(a.rotY, b.rotY, amount),
  }
}

/** The logo's pose at a moment of story time. */
export function poseAt(time: number): Pose {
  const first = KEYFRAMES[0]
  const last = KEYFRAMES[KEYFRAMES.length - 1]
  if (time <= first.at) return first.pose
  if (time >= last.at) return last.pose

  const nextIndex = KEYFRAMES.findIndex((keyframe) => keyframe.at > time)
  const from = KEYFRAMES[nextIndex - 1]
  const to = KEYFRAMES[nextIndex]
  return blendPoses(from.pose, to.pose, smooth((time - from.at) / (to.at - from.at)))
}

const progressBetween = (time: number, start: number, end: number) =>
  Math.min(1, Math.max(0, (time - start) / (end - start)))

/**
 * How far the exploded-view labels have appeared, from 0 (hidden) to 1 (fully shown).
 * `lines` draw in first, then the `text` fades in; both fade out as About begins.
 */
export function labelReveal(time: number): { lines: number; text: number } {
  const fadeOut = 1 - progressBetween(time, 1.05, 1.2)
  return {
    lines: progressBetween(time, 0.7, 0.85) * fadeOut,
    text: progressBetween(time, 0.76, 0.9) * fadeOut,
  }
}

/**
 * For people who've asked their device to reduce motion: instead of moving continuously,
 * the logo jumps between a few resting moments (with a quick crossfade between them).
 */
export function restingTime(time: number): number {
  if (time < 0.55) return 0 // assembled
  if (time < 1.1) return 1 // exploded, with labels
  if (time < 2) return 1.5 // core
  if (time < 3) return 2.5 // D
  if (time < 4) return 3.5 // T
  return 4.5 // back together
}
