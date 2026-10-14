import type { ReactNode } from 'react'

type ExternalLinkProps = { href: string; className?: string; children: ReactNode }

/**
 * A link that opens another site in a new tab. Screen readers hear "(opens in a new tab)",
 * and sighted visitors see the ↗ arrow.
 */
export function ExternalLink({ href, className, children }: ExternalLinkProps) {
  return (
    <a href={href} className={className} target="_blank" rel="noreferrer">
      {children}
      <span aria-hidden="true"> ↗</span>
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  )
}
