import type { CSSProperties } from 'react'
import type { LogoPart, TeardownLabel } from '../content/types'
import styles from './TeardownLabels.module.css'

type Point = [x: number, y: number]

// Positions in the flat logo's 260 × 220 drawing, matching the pulled-apart pose.
// Each line runs from a point on its part (anchor) to where its label sits (end).
const LAYOUT: Record<LogoPart, { anchor: Point; end: Point; placement: 'above' | 'below' }> = {
  T: { anchor: [214, 50], end: [214, -12], placement: 'above' }, // up from the T's crossbar
  core: { anchor: [154, 122], end: [154, 236], placement: 'below' }, // down through the gap
  D: { anchor: [44, 166], end: [44, 236], placement: 'below' }, // down from the D
}

const toPercent = ([x, y]: Point): CSSProperties => ({
  left: `${(x / 260) * 100}%`,
  top: `${(y / 220) * 100}%`,
})

type TeardownLabelsProps = {
  labels: TeardownLabel[]
  /** 0 to 1 for each: how far the lines have drawn and the text has faded in. */
  reveal: { lines: number; text: number }
}

/**
 * The exploded view's labels, like callouts on a technical drawing. Each one names what its
 * part of the logo stands for. Big screens get leader lines; smaller ones get a compact row.
 */
export function TeardownLabels({ labels, reveal }: TeardownLabelsProps) {
  if (reveal.lines === 0 && reveal.text === 0) return null

  return (
    <>
      <div className={styles.callouts}>
        <svg className={styles.lines} viewBox="0 0 260 220" aria-hidden="true">
          {labels.map(({ part }) => {
            const { anchor, end } = LAYOUT[part]
            return (
              <g key={part}>
                {/* pathLength="1" lets the line "draw in" by sliding a dash along it */}
                <line
                  x1={anchor[0]} y1={anchor[1]} x2={end[0]} y2={end[1]}
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - reveal.lines}
                />
                <circle cx={anchor[0]} cy={anchor[1]} r="2.2" opacity={reveal.lines} />
              </g>
            )
          })}
        </svg>
        {labels.map((label) => (
          <p
            key={label.part}
            className={`${styles.label} ${styles[LAYOUT[label.part].placement]}`}
            style={{ ...toPercent(LAYOUT[label.part].end), opacity: reveal.text }}
          >
            <span className={styles.title}>
              {label.part === 'core' ? 'Core' : label.part} · {label.title}
            </span>
            <span className={styles.detail}>{label.detail}</span>
          </p>
        ))}
      </div>

      <ul className={styles.legend} style={{ opacity: reveal.text }}>
        {labels.map((label) => (
          <li key={label.part}>
            <b>{label.part === 'core' ? 'Core' : label.part}</b> · {label.title}
          </li>
        ))}
      </ul>
    </>
  )
}
