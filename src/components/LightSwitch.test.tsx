import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LightSwitch } from './LightSwitch'

describe('LightSwitch', () => {
  afterEach(cleanup)

  it('is a switch that screen readers hear by its label and state', () => {
    render(<LightSwitch on label="Flicker" onChange={() => undefined} />)
    const flick = screen.getByRole('switch', { name: 'Flicker' })
    expect(flick.getAttribute('aria-checked')).toBe('true')
  })

  it('asks to be flipped the other way when clicked', () => {
    const onChange = vi.fn<(on: boolean) => void>()
    render(<LightSwitch on={false} label="Flicker" onChange={onChange} />)
    fireEvent.click(screen.getByRole('switch', { name: 'Flicker' }))
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
