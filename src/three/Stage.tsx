import { CHAPTERS } from '../content/chapters'
import { profile } from '../content/profile'
import { useActiveChapter } from '../motion/chapterContext'
import { labelReveal, poseAt, restingTime } from '../motion/choreography'
import { useCrossfade } from '../motion/useCrossfade'
import { useReducedMotion } from '../motion/useReducedMotion'
import { useStoryTime } from '../motion/useStoryTime'
import { FallbackLogo } from './FallbackLogo'
import styles from './Stage.module.css'
import { TeardownLabels } from './TeardownLabels'

const LABELS_SHOWN = { lines: 1, text: 1 }
const LABELS_HIDDEN = { lines: 0, text: 0 }

/**
 * The fixed area where the logo lives while the content scrolls past.
 * Laptop and tablet: the right side of the screen. Phone: the top of the screen.
 * It's decoration (everything it shows is also written in the page), so screen readers skip it.
 */
export function Stage() {
  const active = useActiveChapter()
  const time = useStoryTime()
  const reduced = useReducedMotion()

  // With reduced motion, the logo jumps between a few resting poses with a crossfade
  // instead of moving. (Both hooks always run; React needs hooks called the same way every time.)
  const { shown: restTime, visible } = useCrossfade(restingTime(time))
  const displayTime = reduced ? restTime : time
  const reveal = reduced ? (restTime === 1 ? LABELS_SHOWN : LABELS_HIDDEN) : labelReveal(time)

  const chapter = CHAPTERS.find((c) => c.id === active) ?? CHAPTERS[0]
  const figure = active === 'intro' && reveal.text > 0.5 ? 'Fig. 01 · Exploded view' : chapter.figure

  return (
    <div className={styles.stage} aria-hidden="true">
      <div className={styles.grid} />
      <div className={styles.frame} style={{ opacity: reduced && !visible ? 0 : 1 }}>
        <FallbackLogo pose={poseAt(displayTime)} ignite={!reduced} />
        <TeardownLabels labels={profile.teardown} reveal={reveal} />
      </div>
      <p className={styles.figure}>{figure}</p>
    </div>
  )
}
