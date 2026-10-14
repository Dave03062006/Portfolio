import type { LogoPart } from '../content/types'

/** A point in the flat logo's drawing, which is 260 × 220 units. */
export type DrawingPoint = [x: number, y: number]

/**
 * Where each exploded-view label goes. Each leader line runs from a point on its part
 * (`anchor`, measured with the logo pulled apart) to where the label text sits (`end`).
 */
export const LABEL_LAYOUT: Record<
  LogoPart,
  { anchor: DrawingPoint; end: DrawingPoint; placement: 'above' | 'below' }
> = {
  T: { anchor: [214, 50], end: [214, -12], placement: 'above' }, // up from the T's crossbar
  core: { anchor: [154, 122], end: [154, 236], placement: 'below' }, // down through the gap
  D: { anchor: [44, 166], end: [44, 236], placement: 'below' }, // down from the D
}

/**
 * Where the anchors really are on screen right now. The 3D logo turns and tilts, so it
 * works these out on every frame and writes them here; the labels read them so their
 * lines stay attached. Empty when the flat logo is showing (the layout above is exact then).
 */
export const liveAnchors: Partial<Record<LogoPart, DrawingPoint>> = {}
