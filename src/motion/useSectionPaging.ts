import { useEffect } from 'react'
import { CHAPTERS } from '../content/chapters'
import type { Direction } from './direction'
import { easeInOut, glideDuration, pageLayout, planScroll, settleTarget, type PageLayout } from './paging'
import { useReducedMotion } from './useReducedMotion'

/** Wheel events closer together than this belong to one gesture (including a touchpad's coasting). */
const GESTURE_GAP_MS = 200
/** In browsers without the `scrollend` event, scrolling counts as finished after this long without movement. */
const SCROLL_END_MS = 150

/**
 * Moves the page from chapter to chapter: one scroll gesture glides it to the next resting
 * place (see paging.ts), and it never comes to rest halfway between two chapters. Inside
 * chapters taller than the screen, scrolling works normally. Call it once, in App.
 *
 * - Mouse wheels, touchpads and the keyboard start a glide straight away.
 * - Swipes on a phone and the scrollbar scroll as usual; if the page stops between two
 *   chapters, it glides on in the direction it was going.
 * - With reduced motion turned on, it does nothing: plain scrolling, no glides.
 */
export function useSectionPaging() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const sections = CHAPTERS.map((chapter) => document.getElementById(chapter.id)).filter(
      (section): section is HTMLElement => section !== null,
    )
    let layout: PageLayout = { stops: [0], free: [] }
    let glideFrame = 0
    let gliding = false
    let lastWheelAt = 0
    let ignoreRestOfGesture = false
    let lastY = window.scrollY
    let direction: Direction = 'down'
    let fingersDown = 0
    let settleTimer = 0

    const measure = () => {
      const topBar = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const metrics = sections.map((section) => {
        const box = section.getBoundingClientRect()
        return { top: box.top + window.scrollY, height: box.height }
      })
      layout = pageLayout(metrics, window.innerHeight, topBar, maxScroll)
    }

    const stopGlide = () => {
      cancelAnimationFrame(glideFrame)
      gliding = false
    }

    // Moves the page to `to` over a moment, easing in and out. The logo follows on its own,
    // because it follows the scroll position.
    const glideTo = (to: number) => {
      stopGlide()
      const from = window.scrollY
      const distance = to - from
      if (Math.abs(distance) < 1) return
      const duration = glideDuration(distance)
      const start = performance.now()
      gliding = true
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        // 'instant': this code does the smoothing, frame by frame
        window.scrollTo({ top: from + distance * easeInOut(t), behavior: 'instant' })
        if (t < 1) {
          glideFrame = requestAnimationFrame(step)
        } else {
          gliding = false
          lastY = window.scrollY
        }
      }
      glideFrame = requestAnimationFrame(step)
    }

    // The phone's chapter menu is open: the page underneath shouldn't move
    const menuOpen = () => document.querySelector('dialog[open]') !== null

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || menuOpen() || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return // zooming, or sideways
      const now = performance.now()
      const sameGesture = now - lastWheelAt < GESTURE_GAP_MS
      lastWheelAt = now
      // Mid-glide, or the rest of a gesture that already moved the page: swallow it
      if (gliding || (ignoreRestOfGesture && sameGesture)) {
        event.preventDefault()
        return
      }
      ignoreRestOfGesture = false
      const move = planScroll(window.scrollY, wheelPixels(event), layout)
      if (move.kind === 'native') return
      event.preventDefault()
      ignoreRestOfGesture = true
      glideTo(move.to)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const delta = keyPixels(event)
      if (delta === 0 || event.defaultPrevented || menuOpen()) return
      if (gliding) {
        event.preventDefault()
        return
      }
      const move = planScroll(window.scrollY, delta, layout)
      if (move.kind === 'native') return
      event.preventDefault()
      glideTo(move.to)
    }

    // Scrolling the browser did itself has finished: if it stopped between chapters, carry on
    const settle = () => {
      if (gliding || fingersDown > 0 || menuOpen()) return
      const to = settleTarget(window.scrollY, direction, layout)
      if (to !== null) glideTo(to)
    }
    const hasScrollEnd = 'onscrollend' in window
    const settleSoon = () => {
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(settle, SCROLL_END_MS)
    }

    const onScroll = () => {
      const y = window.scrollY
      if (y !== lastY) direction = y > lastY ? 'down' : 'up'
      lastY = y
      if (!hasScrollEnd && !gliding) settleSoon()
    }

    const onTouch = (event: TouchEvent) => {
      fingersDown = event.touches.length
      if (event.type === 'touchstart') stopGlide() // a finger on the screen takes over from a glide
      else if (!hasScrollEnd) settleSoon()
    }

    const resizeObserver = new ResizeObserver(measure)
    sections.forEach((section) => resizeObserver.observe(section))
    window.addEventListener('resize', measure)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    if (hasScrollEnd) window.addEventListener('scrollend', settle)
    for (const type of ['touchstart', 'touchend', 'touchcancel'] as const) {
      window.addEventListener(type, onTouch, { passive: true })
    }
    measure()

    return () => {
      stopGlide()
      window.clearTimeout(settleTimer)
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', settle)
      for (const type of ['touchstart', 'touchend', 'touchcancel'] as const) {
        window.removeEventListener(type, onTouch)
      }
    }
  }, [reduced])
}

/** A wheel event's movement in pixels. Some browsers report lines or pages instead. */
function wheelPixels(event: WheelEvent): number {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 40
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * window.innerHeight
  return event.deltaY
}

/**
 * How far a key would scroll the page, in pixels (positive is down), or 0 for keys we leave
 * alone: anything typed into a form field, and Space on a button or link, which presses it.
 */
function keyPixels(event: KeyboardEvent): number {
  if (event.altKey || event.ctrlKey || event.metaKey) return 0
  const target = event.target instanceof Element ? event.target : null
  if (target?.closest('input, textarea, select, [contenteditable]')) return 0
  const page = window.innerHeight * 0.9
  switch (event.key) {
    case 'ArrowDown':
      return 40
    case 'ArrowUp':
      return -40
    case 'PageDown':
      return page
    case 'PageUp':
      return -page
    case ' ':
      if (target?.closest('button, a, summary, [role="button"]')) return 0
      return event.shiftKey ? -page : page
    default:
      return 0
  }
}
