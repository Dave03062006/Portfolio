import { useEffect } from 'react'
import { CHAPTERS } from '../content/chapters'
import { story } from './story'
import { storyTime, type SectionMetrics } from './storyTime'

/** Keeps `story.time` in step with the scroll position. Call it once, in App. */
export function useScrollStory() {
  useEffect(() => {
    const sections = CHAPTERS.map((chapter) => document.getElementById(chapter.id)).filter(
      (section): section is HTMLElement => section !== null,
    )
    let metrics: SectionMetrics[] = []

    const update = () => {
      story.time = storyTime(window.scrollY, window.innerHeight, metrics)
    }

    // Measure where every section sits on the page. This runs again whenever a section
    // changes size: fonts or images loading, the timeline being filtered, the window resizing.
    const measure = () => {
      metrics = sections.map((section) => {
        const box = section.getBoundingClientRect()
        return { top: box.top + window.scrollY, height: box.height }
      })
      update()
      story.ready = true
    }

    const resizeObserver = new ResizeObserver(measure)
    sections.forEach((section) => resizeObserver.observe(section))
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', measure)
    measure()

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', measure)
    }
  }, [])
}
