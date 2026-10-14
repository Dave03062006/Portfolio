import type { Chapter } from './types'

/** The five chapters, in page order. The chapter list, the top bar and the logo all read this. */
export const CHAPTERS: readonly Chapter[] = [
  { id: 'intro', number: '01', label: 'Intro', figure: 'Fig. 01 · Assembled' },
  { id: 'about', number: '02', label: 'About', part: 'core', figure: 'Fig. 02 · Core' },
  { id: 'projects', number: '03', label: 'Projects', part: 'D', figure: 'Fig. 03 · Developer' },
  { id: 'experience', number: '04', label: 'Experience', part: 'T', figure: 'Fig. 04 · Team' },
  { id: 'contact', number: '05', label: 'Contact', figure: 'Fig. 05 · Assembled' },
]
