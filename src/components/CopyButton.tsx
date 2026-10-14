import { useEffect, useState } from 'react'
import styles from './CopyButton.module.css'

type CopyButtonProps = {
  /** The text that gets copied. */
  text: string
  /** What the text is, for screen readers, e.g. "email address". */
  what: string
  className?: string
}

/** Copies some text, then shows "Copied ✓" for a moment. */
export function CopyButton({ text, what, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  // After a successful copy, switch the label back to "Copy" 1.5 seconds later.
  // The cleanup function cancels the timer if the button disappears first.
  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      // Some browsers block the clipboard. Fall back to showing the text, already selected, ready to copy.
      window.prompt(`Copy the ${what}:`, text)
    }
  }

  return (
    <>
      <button
        type="button"
        className={`${styles.button} ${className ?? ''}`}
        onClick={copy}
        aria-label={copied ? `${what} copied` : `Copy ${what}`}
      >
        {copied ? 'Copied ✓' : 'Copy'}
      </button>
      {/* <output> is read out by screen readers when it changes, so they hear the result too. */}
      <output className="visually-hidden">{copied ? `${what} copied` : ''}</output>
    </>
  )
}
