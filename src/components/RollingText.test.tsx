import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RollingText } from './RollingText'

const texts = (container: HTMLElement) => [...container.querySelectorAll('span > span')].map((span) => span.textContent)

describe('RollingText', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('shows the old and the new text while they roll, then only the new one', () => {
    const { container, rerender } = render(<RollingText text="02" />)
    expect(texts(container)).toEqual(['02'])

    rerender(<RollingText text="03" />)
    expect(texts(container)).toEqual(['02', '03'])

    act(() => {
      vi.advanceTimersByTime(450)
    })
    expect(texts(container)).toEqual(['03'])
  })

  it('keeps up when the text changes again mid-roll', () => {
    const { container, rerender } = render(<RollingText text="02" />)
    rerender(<RollingText text="03" />)
    rerender(<RollingText text="04" />)
    expect(texts(container)).toEqual(['03', '04'])
  })
})
