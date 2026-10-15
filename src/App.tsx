import styles from './App.module.css'
import { ChapterRail } from './components/ChapterRail'
import { ScanSweep } from './components/ScanSweep'
import { SheetFrame, SheetRulers } from './components/SheetFrame'
import { TopBar } from './components/TopBar'
import { ChapterProvider } from './motion/ChapterProvider'
import { useScrollStory } from './motion/useScrollStory'
import { useSectionPaging } from './motion/useSectionPaging'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Intro } from './sections/Intro'
import { Projects } from './sections/Projects'
import { Stage } from './three/Stage'

/**
 * The whole site. Fixed parts (top bar, chapter list, logo stage, drawing sheet) sit
 * around <main>, and the five chapters scroll inside it.
 */
export default function App() {
  // Turns scrolling into "story time", which the logo follows (see src/motion/storyTime.ts).
  useScrollStory()
  // Scrolling glides from chapter to chapter, never stopping halfway (see src/motion/paging.ts).
  useSectionPaging()

  return (
    <ChapterProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <TopBar />
      <ChapterRail />
      <Stage />
      <SheetFrame />
      <ScanSweep />
      <main id="main" className={styles.main} tabIndex={-1}>
        <SheetRulers />
        <Intro />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </ChapterProvider>
  )
}
