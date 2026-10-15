/**
 * One step of a "critically damped" spring: the motion of something pulled toward a target
 * that speeds up smoothly, then settles without overshooting or wobbling. The logo follows
 * the scroll position this way (see useStoryTime.ts).
 *
 * The step is worked out exactly instead of approximated, so a slow frame can't make it
 * wobble. `stiffness` sets how snappy it is: it settles in about 6 ÷ stiffness seconds.
 */
export function springStep(
  position: number,
  velocity: number,
  target: number,
  seconds: number,
  stiffness: number,
): { position: number; velocity: number } {
  const offset = position - target
  const drift = velocity + stiffness * offset
  const decay = Math.exp(-stiffness * seconds)
  return {
    position: target + (offset + drift * seconds) * decay,
    velocity: (velocity - stiffness * drift * seconds) * decay,
  }
}
