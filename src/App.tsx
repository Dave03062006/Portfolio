import styles from './App.module.css'
import { ChapterRail } from './components/ChapterRail'
import { TopBar } from './components/TopBar'
import { ChapterProvider } from './motion/ChapterProvider'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Intro } from './sections/Intro'
import { Projects } from './sections/Projects'
import { Stage } from './three/Stage'

/**
 * The whole site. Fixed parts (top bar, chapter list, logo stage) sit around <main>,
 * and the five chapters scroll inside it.
 */
export default function App() {
  return (
    <ChapterProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <TopBar />
      <ChapterRail />
      <Stage />
      <main id="main" className={styles.main} tabIndex={-1}>
        <Intro />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </ChapterProvider>
  )
}
