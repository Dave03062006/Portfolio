import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { CHAPTERS } from '../content/chapters'
import { profile } from '../content/profile'
import { useActiveChapter } from '../motion/chapterContext'
import { labelReveal, poseAt, restingTime } from '../motion/choreography'
import { COVER_SLOT_ID, coverAmount } from '../motion/cover'
import { useCrossfade } from '../motion/useCrossfade'
import { useReducedMotion } from '../motion/useReducedMotion'
import { useStoryTime } from '../motion/useStoryTime'
import { ChapterNumber } from './ChapterNumber'
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
  // 1 while the logo is on the cover (big, in the middle of the screen), 0 once it's here
  const cover = coverAmount(reduced ? restTime : time)

  // Where the cover's slot is, compared with the logo's usual place. Written straight onto the
  // stage as CSS variables; the CSS moves the logo between the two places as --cover changes.
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current
      const frame = frameRef.current
      const slot = document.getElementById(COVER_SLOT_ID)
      if (!stage || !frame || !slot) return
      const stageBox = stage.getBoundingClientRect()
      const slotBox = slot.getBoundingClientRect()
      // offsetLeft and friends ignore the frame's own movement, so this is its usual place
      const frameX = stageBox.left + frame.offsetLeft + frame.offsetWidth / 2
      const frameY = stageBox.top + frame.offsetTop + frame.offsetHeight / 2
      stage.style.setProperty('--fly-x', `${slotBox.left + slotBox.width / 2 - frameX}px`)
      stage.style.setProperty('--fly-y', `${slotBox.top + slotBox.height / 2 - frameY}px`)
      stage.style.setProperty('--fly-scale', String(slotBox.width / frame.offsetWidth))
    }
    measure()
    // The cover's name can wrap differently once its font has loaded, which moves the slot
    void document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // The 3D logo reads this when it draws, without re-rendering. After every render of the
  // Stage (which happens whenever the pose changes), ask the 3D logo to draw a fresh frame.
  const stateRef = useRef<StageState>({ pose, labels: reveal.text, reduced })
  const frameRequestRef = useRef<(() => void) | null>(null)
  useEffect(() => {
    stateRef.current = { pose, labels: reveal.text, reduced }
    frameRequestRef.current?.()
  })

  const [supports3D] = useState(canUseWebGL)
  const [load3D, setLoad3D] = useState(false)
  const [show3D, setShow3D] = useState(false)
  const [flatRetired, setFlatRetired] = useState(false)

  // Start loading the 3D logo only once the browser is idle, after the page's text is up,
  // so phones show the content as fast as possible. The flat logo covers the wait.
  useEffect(() => {
    if (!supports3D) return
    const start = () => setLoad3D(true)
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start, { timeout: 2500 })
      return () => window.cancelIdleCallback(id)
    }
    const timer = window.setTimeout(start, 1200) // Safari has no requestIdleCallback
    return () => window.clearTimeout(timer)
  }, [supports3D])

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
    <div ref={stageRef} className={styles.stage} aria-hidden="true" style={{ '--cover': cover } as CSSProperties}>
      <div className={styles.grid} />
      <div ref={frameRef} className={styles.frame} style={{ opacity: reduced && !visible ? 0 : 1 }}>
        {/* First, so it sits behind the logo. Not on the cover: it's scanned in as the logo arrives. */}
        {cover < 0.5 && <ChapterNumber number={chapter.number} />}
        {!flatRetired && (
          <div className={styles.layer} style={{ opacity: show3D ? 0 : 1 }}>
            <FallbackLogo pose={pose} ignite={!reduced} />
          </div>
        )}
        {load3D && (
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
