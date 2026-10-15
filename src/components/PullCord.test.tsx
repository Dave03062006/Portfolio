import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PullCord } from './PullCord'

describe('PullCord', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('is a switch that screen readers hear by its label and state', () => {
    render(<PullCord on label="Flicker" onChange={() => undefined} />)
    expect(screen.getByRole('switch', { name: 'Flicker' }).getAttribute('aria-checked')).toBe('true')
  })

  it('switches the other way once it has been pulled', () => {
    const onChange = vi.fn<(on: boolean) => void>()
    render(<PullCord on={false} label="Flicker" onChange={onChange} />)
    fireEvent.click(screen.getByRole('switch', { name: 'Flicker' }))
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
