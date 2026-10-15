import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { ChapterId } from '../content/types'
import { ChapterContext } from './chapterContext'
import { useChapterDirection } from './useChapterDirection'

function ShowDirection() {
  return <p>{useChapterDirection()}</p>
}

const page = (chapter: ChapterId) => (
  <ChapterContext.Provider value={chapter}>
    <ShowDirection />
  </ChapterContext.Provider>
)

describe('useChapterDirection', () => {
  afterEach(cleanup)

  it('says "down" as the visitor moves down the page, and "up" when they go back', () => {
    const { container, rerender } = render(page('intro'))
    expect(container.textContent).toBe('down')

    rerender(page('projects'))
    expect(container.textContent).toBe('down')

    rerender(page('about'))
    expect(container.textContent).toBe('up')

    rerender(page('contact'))
    expect(container.textContent).toBe('down')
  })
})
