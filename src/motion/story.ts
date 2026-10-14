/**
 * The current story time (see storyTime.ts), shared by everything that moves with the page.
 * `useScrollStory` writes it whenever the page scrolls; the logo reads it on every frame.
 *
 * It's a plain object, not React state, on purpose: it changes dozens of times a second,
 * and putting it in state would redraw the whole page each time.
 */
export const story = {
  time: 0,
  /** False until the page has been measured once, so readers don't animate from 0 on load. */
  ready: false,
}
