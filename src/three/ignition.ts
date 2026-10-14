// The neon flicker when the page loads, like a tube striking: a few stuttering flashes,
// then a steady glow. Same rhythm as the flat logo's CSS animation (FallbackLogo.module.css).

const DELAY = 0.25 // seconds before it starts
const DURATION = 0.9 // seconds

/** [moment (0 to 1 through the flicker), brightness (0 to 1)] */
const STEPS: [at: number, level: number][] = [
  [0, 0],
  [0.08, 0.85],
  [0.12, 0.1],
  [0.2, 0.95],
  [0.24, 0.25],
  [0.38, 1],
  [0.44, 0.55],
  [0.6, 1],
]

/** Brightness of the neon (0 to 1), `seconds` after the logo first appeared. */
export function ignitionLevel(seconds: number): number {
  const progress = (seconds - DELAY) / DURATION
  if (progress <= 0) return 0
  const next = STEPS.findIndex(([at]) => at > progress)
  if (next === -1) return 1
  const [fromAt, fromLevel] = STEPS[next - 1]
  const [toAt, toLevel] = STEPS[next]
  return fromLevel + ((progress - fromAt) / (toAt - fromAt)) * (toLevel - fromLevel)
}
