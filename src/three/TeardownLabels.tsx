import type { CSSProperties } from 'react'
import type { TeardownLabel } from '../content/types'
import { LABEL_LAYOUT, liveAnchors, type DrawingPoint } from './labelLayout'
import styles from './TeardownLabels.module.css'

const toPercent = ([x, y]: DrawingPoint): CSSProperties => ({
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
            const { end } = LABEL_LAYOUT[part]
            // The 3D logo reports where the part really is; otherwise use the flat layout.
            const anchor = liveAnchors[part] ?? LABEL_LAYOUT[part].anchor
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
            className={`${styles.label} ${styles[LABEL_LAYOUT[label.part].placement]}`}
            style={{ ...toPercent(LABEL_LAYOUT[label.part].end), opacity: reveal.text }}
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
