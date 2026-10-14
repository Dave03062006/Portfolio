import type { Project } from '../content/types'
import { ExternalLink } from './ExternalLink'
import { ImageSlot } from './ImageSlot'
import styles from './ProjectCard.module.css'

/**
 * One project. Large and medium cards show a screenshot; small cards are text only.
 * Every card says which part Dave built.
 */
export function ProjectCard({ project }: { project: Project }) {
  const { name, tagline, size, course, tags, description, myPart, links, image } = project

  return (
    <article className={`${styles.card} ${styles[size]}`}>
      {size !== 'small' && image && (
        <ImageSlot photo={image} placeholder="Screenshot" className={styles.media} />
      )}

      <div className={styles.body}>
        <h3 className={styles.name}>
          {name} <span className={styles.tagline}>{tagline}</span>
        </h3>
        <p className={styles.course}>{course}</p>

        <ul className={styles.tags} aria-label="Built with">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <p className={styles.description}>{description}</p>

        <div className={styles.part}>
          <p className={styles.partLabel}>My part</p>
          <p>{myPart}</p>
        </div>

        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href}>
              <ExternalLink href={link.href} className={styles.link}>
                {link.label}
              </ExternalLink>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
