import { useState } from 'react'
import type { Photo } from '../content/types'
import styles from './ImageSlot.module.css'

type ImageSlotProps = {
  photo: Photo
  /** Shown in the empty frame until the image file exists, e.g. "Screenshot". */
  placeholder: string
  className?: string
}

/**
 * An image that may not exist yet. It shows a striped placeholder until the image loads,
 * and keeps the placeholder if the file is missing, so there's never a broken-image icon.
 */
export function ImageSlot({ photo, placeholder, className }: ImageSlotProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'missing'>('loading')

  return (
    <div className={`${styles.slot} ${className ?? ''}`} data-status={status}>
      {status !== 'loaded' && (
        <span className={styles.placeholder} aria-hidden="true">
          {placeholder}
        </span>
      )}
      {status !== 'missing' && (
        <img
          className={styles.image}
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('missing')}
        />
      )}
    </div>
  )
}
