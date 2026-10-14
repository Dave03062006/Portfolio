/**
 * The brand's reds, for code that can't use the CSS variables in src/styles/tokens.css:
 * the flat SVG logo and the 3D logo. If you change the brand color, change it here AND in
 * tokens.css (`--red`, `--red-label`, `--red-hot`), then in public/favicon.svg and design/.
 */
export const BRAND = {
  /** The brand red. Same as --red. */
  red: '#ff2d3d',
  /** A slightly deeper red, used for glows. */
  glow: '#ff1f35',
  /** Labels and focus outlines. Same as --red-label. */
  label: '#ff4d5b',
  /** The bright middle of a neon line. */
  neonCore: '#ff8a95',
  /** The hottest square on the core chip. */
  hot: '#ffc2c7',
  /** The chip's face, and its lit squares. */
  chipFace: '#24060a',
  chipCell: '#ff3a4a',
  /** The light inside the D's window, from the middle out to the edge. */
  window: ['#ff3a4a', '#b8001b', '#3d0008'],
} as const
