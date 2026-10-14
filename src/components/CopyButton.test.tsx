import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CopyButton } from './CopyButton'

describe('CopyButton', () => {
  const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined)

  beforeEach(() => {
    vi.useFakeTimers()
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    writeText.mockClear()
  })

  it('copies the text and says so, then resets after 1.5 seconds', async () => {
    render(<CopyButton text="dave@example.com" what="email address" />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy email address/i }))
    })

    expect(writeText).toHaveBeenCalledWith('dave@example.com')
    expect(screen.getByRole('button').textContent).toContain('Copied ✓')
    expect(screen.getByRole('status').textContent).toBe('email address copied')

    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(screen.getByRole('button').textContent).toContain('Copy')
    expect(screen.getByRole('button').textContent).not.toContain('Copied')
  })

  it('falls back to a prompt when the clipboard is blocked', async () => {
    writeText.mockRejectedValueOnce(new Error('blocked'))
    const prompt = vi.spyOn(window, 'prompt').mockReturnValue(null)
    render(<CopyButton text="dave@example.com" what="email address" />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
    })

    expect(prompt).toHaveBeenCalledWith('Copy the email address:', 'dave@example.com')
    expect(screen.getByRole('button').textContent).not.toContain('Copied')
    prompt.mockRestore()
  })
})
