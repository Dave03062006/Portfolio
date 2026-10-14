import { useId } from 'react'
import { D_OUTER, D_WINDOW, SEAM, T_OUTER, toPathData } from '../brand/logoPaths'
import type { Pose } from '../motion/pose'
import { fallbackLayout } from './fallbackLayout'
import styles from './FallbackLogo.module.css'

const D_SHAPE = toPathData(D_OUTER) + toPathData(D_WINDOW) // the window becomes a hole (evenodd)
const D_EDGE = toPathData(D_OUTER)
const D_HOLE = toPathData(D_WINDOW)
const T_SHAPE = toPathData(T_OUTER)
const SEAM_LINE = toPathData(SEAM, false)

// The 3 × 4 grid of glowing squares on the core chip. The middle one burns hottest.
const CHIP_CELLS = [0, 1, 2, 3].flatMap((row) =>
  [0, 1, 2].map((col) => ({ x: 20 + col * 9, y: 8 + row * 9, hot: row === 1 && col === 1 })),
)

type FallbackLogoProps = { pose: Pose; className?: string }

/**
 * The flat SVG version of the logo, drawn from a Pose. It shows while the 3D logo loads,
 * and replaces it entirely on devices without 3D support.
 */
export function FallbackLogo({ pose, className }: FallbackLogoProps) {
  // SVG gradients need unique ids. useId gives one; the replace keeps it safe inside url(#…).
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const layout = fallbackLayout(pose)
  const { d, t, core } = layout

  return (
    <svg viewBox="0 0 260 220" className={`${styles.logo} ${className ?? ''}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#55555e" />
          <stop offset="0.18" stopColor="#34343b" />
          <stop offset="0.7" stopColor="#1d1d22" />
          <stop offset="1" stopColor="#141418" />
        </linearGradient>
        <radialGradient id={`${id}-window`} cx="0.42" cy="0.5" r="0.75">
          <stop offset="0" stopColor="#ff3a4a" />
          <stop offset="0.55" stopColor="#b8001b" />
          <stop offset="1" stopColor="#3d0008" />
        </radialGradient>
        <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="near" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="far" />
          <feMerge>
            <feMergeNode in="far" />
            <feMergeNode in="near" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${id}-haze`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      {/* Soft red haze behind everything */}
      <ellipse
        cx="130" cy="110" rx="110" ry="80"
        fill="#ff1f35"
        filter={`url(#${id}-haze)`}
        className={styles.fade}
        style={{ opacity: layout.ambientGlow }}
      />

      {/* Light inside the seam. The pieces cover it, so it only shows through the gap. */}
      <g className={styles.fade} style={{ opacity: layout.seamGlow, transform: 'translate(30px, 10px)' }}>
        <path d={SEAM_LINE} fill="none" stroke="#ff1f35" strokeWidth="6" filter={`url(#${id}-glow)`} />
        <path d={SEAM_LINE} fill="none" stroke="#ff8a95" strokeWidth="3" />
      </g>

      {/* The core chip, hidden between the pieces until they move apart */}
      <g className={styles.piece} style={{ opacity: core.opacity, transform: 'translate(122px, 82px)' }}>
        <rect width="64" height="56" rx="4" fill="#ff1f35" filter={`url(#${id}-glow)`} className={styles.fade} style={{ opacity: core.glow }} />
        <rect x="0.8" y="0.8" width="62.4" height="54.4" rx="4" fill="#24060a" stroke="#ff3a4a" strokeWidth="1.6" />
        {CHIP_CELLS.map((cell) => (
          <rect
            key={`${cell.x}-${cell.y}`}
            x={cell.x} y={cell.y} width="6" height="6" rx="1"
            fill={cell.hot ? '#ffc2c7' : '#ff3a4a'}
            opacity="0.85"
          />
        ))}
      </g>

      {/* D */}
      <g className={styles.piece} style={{ opacity: d.opacity, transform: `translate(${d.x}px, ${d.y}px)` }}>
        <path d={D_EDGE} fill="none" stroke="#ff1f35" strokeWidth="3" filter={`url(#${id}-glow)`} className={styles.fade} style={{ opacity: d.highlight }} />
        <path d={D_HOLE} fill={`url(#${id}-window)`} />
        <path d={D_SHAPE} fillRule="evenodd" fill={`url(#${id}-metal)`} stroke="#ffffff" strokeOpacity="0.12" />
        <path d={D_EDGE} fill="none" stroke="#ff4d5b" strokeWidth="1.5" className={styles.fade} style={{ opacity: d.highlight }} />
      </g>

      {/* T */}
      <g className={styles.piece} style={{ opacity: t.opacity, transform: `translate(${t.x}px, ${t.y}px)` }}>
        <path d={T_SHAPE} fill="none" stroke="#ff1f35" strokeWidth="3" filter={`url(#${id}-glow)`} className={styles.fade} style={{ opacity: t.highlight }} />
        <path d={T_SHAPE} fill={`url(#${id}-metal)`} stroke="#ffffff" strokeOpacity="0.12" />
        <path d={T_SHAPE} fill="none" stroke="#ff4d5b" strokeWidth="1.5" className={styles.fade} style={{ opacity: t.highlight }} />
      </g>

      {/* Red light spilling onto the metal around the seam */}
      <g className={styles.fade} style={{ opacity: layout.seamGlow * 0.22, transform: 'translate(30px, 10px)' }}>
        <path d={SEAM_LINE} fill="none" stroke="#ff1f35" strokeWidth="10" filter={`url(#${id}-glow)`} />
      </g>
    </svg>
  )
}
