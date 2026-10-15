import { useEffect, useRef } from 'react'
import { shouldSweep } from '../lib/sheet'
import { useActiveChapter } from '../motion/chapterContext'
import { useReducedMotion } from '../motion/useReducedMotion'
import styles from './ScanSweep.module.css'

// From just above the screen to just below it. (100% is the layer's own height.)
const KEYFRAMES = [{ transform: 'translateY(-100%)' }, { transform: 'translateY(100vh)' }]
const TIMING = { duration: 1800, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }

/**
 * The red scan line that sweeps down the whole screen the first time you scroll out of the
 * intro. Everything it passes turns red for a moment, then cools back down.
 *
 * It plays once per visit. Later chapter changes get a small version of it instead, on the
 * big chapter number behind the logo (see ChapterNumber).
 */
export function ScanSweep() {
  const active = useActiveChapter()
  const reduced = useReducedMotion()
  const washRef = useRef<HTMLDivElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)
  // Remembered between renders without causing any: the last chapter, whether the sweep
  // has played yet, and when the page loaded.
  const memory = useRef({ previous: active, played: false, loadedAt: 0 })

  useEffect(() => {
    memory.current.loadedAt = performance.now()
  }, [])

  useEffect(() => {
    const m = memory.current
    const from = m.previous
    m.previous = active
    const msSinceLoad = performance.now() - m.loadedAt
    if (!shouldSweep({ from, to: active, played: m.played, reduced, msSinceLoad })) return
    m.played = true

    // Show both layers, slide them down the screen, and hide them again at the end.
    for (const layer of [washRef.current, lightRef.current]) {
      if (!layer) continue
      layer.hidden = false
      layer.animate(KEYFRAMES, TIMING).onfinish = () => {
        layer.hidden = true
      }
    }
  }, [active, reduced])

  return (
    <>
      <div ref={washRef} className={styles.wash} aria-hidden="true" hidden />
      <div ref={lightRef} className={styles.light} aria-hidden="true" hidden />
    </>
  )
}
