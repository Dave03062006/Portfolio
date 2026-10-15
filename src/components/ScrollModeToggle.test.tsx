import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ScrollModeProvider } from '../motion/ScrollModeProvider'
import { ScrollModeToggle } from './ScrollModeToggle'

describe('ScrollModeToggle', () => {
  beforeEach(() => {
    // The test browser (jsdom) has no ResizeObserver, which guided scrolling uses to measure the page
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = () => undefined
        disconnect = () => undefined
      },
    )
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    window.localStorage.clear()
  })

  it('switches between guided and free scrolling, and remembers the choice', () => {
    render(
      <ScrollModeProvider>
        <ScrollModeToggle />
      </ScrollModeProvider>,
    )
    const guided = screen.getByRole('button', { name: 'Guided' })
    const free = screen.getByRole('button', { name: 'Free' })
    expect(guided.getAttribute('aria-pressed')).toBe('true')

    fireEvent.click(free)
    expect(free.getAttribute('aria-pressed')).toBe('true')
    expect(guided.getAttribute('aria-pressed')).toBe('false')
    expect(window.localStorage.getItem('dt-scroll-mode')).toBe('free')
  })

  it('starts with the choice from an earlier visit', () => {
    window.localStorage.setItem('dt-scroll-mode', 'free')
    render(
      <ScrollModeProvider>
        <ScrollModeToggle />
      </ScrollModeProvider>,
    )
    expect(screen.getByRole('button', { name: 'Free' }).getAttribute('aria-pressed')).toBe('true')
  })
})
