import type { ReactNode } from 'react'
import type { ChapterId, SectionCopy } from '../content/types'
import text from '../styles/text.module.css'
import styles from './Section.module.css'

type SectionProps = {
  id: ChapterId
  copy: SectionCopy
  children: ReactNode
}

/**
 * The frame every chapter after the intro shares: the red eyebrow, the big heading,
 * an optional lead line, then the chapter's own content.
 *
 * On phones it also adds a see-through gap at the top, where the logo shows before the
 * section's content scrolls up over it.
 */
export function Section({ id, copy, children }: SectionProps) {
  const titleId = `${id}-title`
  return (
    <section id={id} aria-labelledby={titleId} className={styles.section}>
      <div className={styles.window} aria-hidden="true" />
      <div className={styles.content}>
        <p className={text.eyebrow}>{copy.eyebrow}</p>
        <h2 id={titleId} className={`${text.display} ${styles.title}`}>
          {copy.heading}
        </h2>
        {copy.lead && <p className={styles.lead}>{copy.lead}</p>}
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  )
}
