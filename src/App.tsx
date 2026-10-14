import { FlatLogo } from './brand/FlatLogo'

// Temporary shell for step 1. Step 2 replaces this with the real sections.
export default function App() {
  return (
    <main style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', gap: '1rem' }}>
      <FlatLogo size={96} label="" className="logo" />
      <h1 style={{ fontStretch: '125%', fontWeight: 800 }}>DAVE TRISTIAN</h1>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>FOUNDATION READY</p>
      <style>{'.logo{color:var(--red)}'}</style>
    </main>
  )
}
