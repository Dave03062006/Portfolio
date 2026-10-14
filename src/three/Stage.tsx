import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { CHAPTERS } from '../content/chapters'
import { profile } from '../content/profile'
import { useActiveChapter } from '../motion/chapterContext'
import { labelReveal, poseAt, restingTime } from '../motion/choreography'
import { useCrossfade } from '../motion/useCrossfade'
import { useReducedMotion } from '../motion/useReducedMotion'
import { useStoryTime } from '../motion/useStoryTime'
import { FallbackLogo } from './FallbackLogo'
import type { StageState } from './LogoModel'
import styles from './Stage.module.css'
import { TeardownLabels } from './TeardownLabels'
import { canUseWebGL } from './webgl'

// The 3D logo lives in its own file, loaded only after the page is up (the 3D library is big).
// `memo` stops it re-rendering when the Stage does: everything it needs arrives through stateRef.
const LogoCanvas = memo(lazy(() => import('./LogoCanvas')))

const LABELS_SHOWN = { lines: 1, text: 1 }
const LABELS_HIDDEN = { lines: 0, text: 0 }

/**
 * The fixed area where the logo lives while the content scrolls past.
 * Laptop and tablet: the right side of the screen. Phone: the top of the screen.
 * It's decoration (everything it shows is also written in the page), so screen readers skip it.
 *
 * The flat logo shows first. Once the 3D logo has drawn its first frames, they crossfade.
 * If the browser can't do 3D, or the 3D logo hits an error, the flat logo simply stays.
 */
export function Stage() {
  const active = useActiveChapter()
  const time = useStoryTime()
  const reduced = useReducedMotion()

  // With reduced motion, the logo jumps between a few resting poses with a crossfade
  // instead of moving. (Both hooks always run; React needs hooks called the same way every time.)
  const { shown: restTime, visible } = useCrossfade(restingTime(time))
  const pose = poseAt(reduced ? restTime : time)
  const reveal = reduced ? (restTime === 1 ? LABELS_SHOWN : LABELS_HIDDEN) : labelReveal(time)

  // The 3D logo reads this when it draws, without re-rendering. After every render of the
  // Stage (which happens whenever the pose changes), ask the 3D logo to draw a fresh frame.
  const stateRef = useRef<StageState>({ pose, labels: reveal.text, reduced })
  const frameRequestRef = useRef<(() => void) | null>(null)
  useEffect(() => {
    stateRef.current = { pose, labels: reveal.text, reduced }
    frameRequestRef.current?.()
  })

  const [supports3D] = useState(canUseWebGL)
  const [show3D, setShow3D] = useState(false)
  const [flatRetired, setFlatRetired] = useState(false)
  const onReady = useCallback(() => setShow3D(true), [])
  const on3DError = useCallback(() => {
    setShow3D(false)
    setFlatRetired(false)
  }, [])

  // Once the crossfade to 3D has finished, stop drawing the hidden flat logo.
  useEffect(() => {
    if (!show3D) return
    const timer = window.setTimeout(() => setFlatRetired(true), 700)
    return () => window.clearTimeout(timer)
  }, [show3D])

  const chapter = CHAPTERS.find((c) => c.id === active) ?? CHAPTERS[0]
  const figure = active === 'intro' && reveal.text > 0.5 ? 'Fig. 01 · Exploded view' : chapter.figure

  return (
    <div className={styles.stage} aria-hidden="true">
      <div className={styles.grid} />
      <div className={styles.frame} style={{ opacity: reduced && !visible ? 0 : 1 }}>
        {!flatRetired && (
          <div className={styles.layer} style={{ opacity: show3D ? 0 : 1 }}>
            <FallbackLogo pose={pose} ignite={!reduced} />
          </div>
        )}
        {supports3D && (
          <ErrorBoundary fallback={null} onError={on3DError}>
            <Suspense fallback={null}>
              <div className={styles.layer} style={{ opacity: show3D ? 1 : 0 }}>
                <div className={styles.haze} style={{ opacity: 0.35 + 0.65 * pose.glow }} />
                <LogoCanvas stateRef={stateRef} frameRequestRef={frameRequestRef} onReady={onReady} />
              </div>
            </Suspense>
          </ErrorBoundary>
        )}
        <TeardownLabels labels={profile.teardown} reveal={reveal} />
      </div>
      <p className={styles.figure}>{figure}</p>
    </div>
  )
}
