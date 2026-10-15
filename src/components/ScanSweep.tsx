import { useEffect, useRef } from 'react'
import { sweepDirection } from '../lib/sheet'
import { useActiveChapter } from '../motion/chapterContext'
import type { Direction } from '../motion/direction'
import { useReducedMotion } from '../motion/useReducedMotion'
import styles from './ScanSweep.module.css'

// Down: from just above the screen to just below it. (100% is the layer's own height.)
const DOWN = [{ transform: 'translateY(-100%)' }, { transform: 'translateY(100vh)' }]
// Up: from just below the screen to just above it, flipped so the line leads and the red trails behind
const UP = [{ transform: 'translateY(100vh) scaleY(-1)' }, { transform: 'translateY(-100%) scaleY(-1)' }]
const TIMING = { duration: 1500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
/** A link can jump past several chapters at once: waiting this long means it sweeps once, at the end. */
const WAIT_MS = 120

/**
 * The red scan line that sweeps across the whole screen whenever the chapter changes.
 * Everything it passes turns red for a moment, then cools back down. It travels the same
 * way the page did: down the screen when you scroll down, up the screen when you go back up.
 */
export function ScanSweep() {
  const active = useActiveChapter()
  const reduced = useReducedMotion()
  const washRef = useRef<HTMLDivElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)
  // Remembered between renders without causing any: the last chapter, and when the page loaded.
  const memory = useRef({ previous: active, loadedAt: 0 })

  useEffect(() => {
    memory.current.loadedAt = performance.now()
  }, [])

  useEffect(() => {
    const m = memory.current
    const msSinceLoad = performance.now() - m.loadedAt
    const direction = sweepDirection({ from: m.previous, to: active, reduced, msSinceLoad })
    m.previous = active
    if (!direction) return

    const timer = window.setTimeout(() => sweep([washRef.current, lightRef.current], direction), WAIT_MS)
    // If the chapter changes again before the sweep starts, this cancels it (the new change brings its own)
    return () => window.clearTimeout(timer)
  }, [active, reduced])

  return (
    <>
      <div ref={washRef} className={styles.wash} aria-hidden="true" hidden />
      <div ref={lightRef} className={styles.light} aria-hidden="true" hidden />
    </>
  )
}

/** Shows the layers, slides them across the screen, and hides them again at the end. */
function sweep(layers: (HTMLDivElement | null)[], direction: Direction) {
  for (const layer of layers) {
    if (!layer) continue
    // A sweep still running from the last chapter change makes way for this one
    for (const running of layer.getAnimations()) running.cancel()
    layer.hidden = false
    layer.animate(direction === 'down' ? DOWN : UP, TIMING).onfinish = () => {
      layer.hidden = true
    }
  }
}
