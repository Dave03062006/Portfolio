import { D_OUTER, D_WINDOW, LOGO_VIEWBOX, T_OUTER, toPathData } from './logoPaths'

type FlatLogoProps = {
  /** Width and height in pixels. */
  size?: number
  /** Read aloud by screen readers. Pass an empty string when the logo is decoration next to text that says the same thing. */
  label?: string
  className?: string
}

/**
 * The one-color DT logo used in the top bar. It's drawn in `currentColor`, so CSS decides
 * the color, and the D's window is cut out so the background shows through.
 */
export function FlatLogo({ size = 24, label = 'DT logo', className }: FlatLogoProps) {
  const decorative = label === ''
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      width={size}
      height={size}
      className={className}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
    >
      {/* Drawing the window inside the D with "evenodd" turns it into a hole. */}
      <path fill="currentColor" fillRule="evenodd" d={toPathData(D_OUTER) + toPathData(D_WINDOW)} />
      <path fill="currentColor" d={toPathData(T_OUTER)} />
    </svg>
  )
}
