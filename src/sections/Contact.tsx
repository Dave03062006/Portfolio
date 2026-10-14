import { CopyButton } from '../components/CopyButton'
import { ExternalLink } from '../components/ExternalLink'
import { Section } from '../components/Section'
import { profile } from '../content/profile'
import styles from './Contact.module.css'

/** Chapter 05: how to reach Dave. The logo comes back together here. */
export function Contact() {
  const { contact } = profile
  return (
    <Section
      id="contact"
      copy={{ eyebrow: contact.eyebrow, heading: contact.heading, lead: contact.lead }}
    >
      <dl className={styles.rows}>
        <div className={styles.row}>
          <dt className={styles.label}>Email</dt>
          <dd className={styles.value}>
            <a href={`mailto:${contact.email}`} className={styles.link}>
              {contact.email}
            </a>
            <CopyButton text={contact.email} what="email address" />
          </dd>
        </div>
        {contact.links.map((link) => (
          <div key={link.label} className={styles.row}>
            <dt className={styles.label}>{link.label}</dt>
            <dd className={styles.value}>
              <ExternalLink href={link.href} className={`${styles.link} ${styles.external}`}>
                {link.handle}
              </ExternalLink>
            </dd>
          </div>
        ))}
      </dl>

      {contact.cvUrl && (
        // `download` saves the file under a proper name instead of "cv.pdf".
        <a
          href={contact.cvUrl}
          className={styles.cv}
          download={`${profile.firstName} ${profile.lastName} CV.pdf`}
        >
          Download CV <span aria-hidden="true">↓</span>
        </a>
      )}

      <footer className={styles.footer}>{profile.footer}</footer>
    </Section>
  )
}
