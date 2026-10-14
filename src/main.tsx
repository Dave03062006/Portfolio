import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Fonts, served from our own site instead of Google Fonts.
// `wdth.css` includes Archivo's width axis, which the expanded headings need.
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/jetbrains-mono'

import './styles/tokens.css'
import './styles/global.css'
import App from './App.tsx'

// Find the empty <div id="root"> in index.html and let React draw the whole site inside it.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
