import { useEffect, useState, type ReactNode } from 'react'
import { CHAPTERS } from '../content/chapters'
import type { ChapterId } from '../content/types'
import { ChapterContext } from './chapterContext'

/** Watches the page and works out which chapter is on screen. Wrap the whole site in it. */
export function ChapterProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ChapterId>('intro')

  useEffect(() => {
    // A section is "active" while it crosses an invisible line through the middle of the screen.
    // The rootMargin shrinks the browser's viewport down to exactly that line.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as ChapterId)
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    for (const chapter of CHAPTERS) {
      const section = document.getElementById(chapter.id)
      if (section) observer.observe(section)
    }
    // Clean up when the component goes away, so the observer doesn't keep running.
    return () => observer.disconnect()
  }, [])

  return <ChapterContext.Provider value={active}>{children}</ChapterContext.Provider>
}
