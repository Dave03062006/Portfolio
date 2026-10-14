import type { SpecRow } from '../content/types'
import styles from './SpecSheet.module.css'

/** A two-column list of facts, like the tech specs on a product page. */
export function SpecSheet({ rows }: { rows: SpecRow[] }) {
  return (
    <dl className={styles.sheet}>
      {rows.map((row) => (
        <div key={row.label} className={styles.row}>
          <dt className={styles.label}>{row.label}</dt>
          <dd className={styles.value}>{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
