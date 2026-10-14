import { ProjectCard } from '../components/ProjectCard'
import { Section } from '../components/Section'
import { projects, projectsCopy } from '../content/projects'
import styles from './Projects.module.css'

/** Chapter 03, the D for Developer: what Dave has built. */
export function Projects() {
  return (
    <Section id="projects" copy={projectsCopy}>
      <ul className={styles.list}>
        {/* `key` lets React tell the cards apart if the list ever changes order. */}
        {projects.map((project) => (
          <li key={project.slug} className={styles[project.size]}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
