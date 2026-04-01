import { useState, useEffect } from 'react'

/**
 * TypeWriter — types text letter by letter, optionally loops.
 * Props:
 *   text      string|string[]  — single string or array of strings to cycle through
 *   delay     number           — ms before first start (default 0)
 *   speed     number           — ms per letter while typing (default 52)
 *   deleteSpeed number         — ms per letter while deleting (default 28)
 *   pauseEnd  number           — ms to pause when fully typed before deleting (default 1400)
 *   pauseStart number          — ms to pause after fully deleted before next word (default 380)
 *   loop      boolean          — whether to loop forever (default false)
 *   style     object
 *   className string
 */
export default function TypeWriter({
  text      = '',
  delay     = 0,
  speed     = 52,
  deleteSpeed = 28,
  pauseEnd  = 1400,
  pauseStart = 380,
  loop      = false,
  style     = {},
  className = '',
}) {
  /* Normalise: always an array of phrases */
  const phrases = Array.isArray(text) ? text : [text]

  const [phraseIdx, setPhraseIdx] = useState(0)
  const [count,     setCount]     = useState(0)
  const [deleting,  setDeleting]  = useState(false)
  const [started,   setStarted]   = useState(delay === 0)
  const [pausing,   setPausing]   = useState(false)

  const current = phrases[phraseIdx] ?? ''

  /* Initial delay before first character */
  useEffect(() => {
    if (delay > 0) {
      const t = setTimeout(() => setStarted(true), delay)
      return () => clearTimeout(t)
    }
  }, [delay])

  useEffect(() => {
    if (!started || pausing) return

    /* ── TYPING forward ── */
    if (!deleting) {
      if (count < current.length) {
        const t = setTimeout(() => setCount(c => c + 1), speed)
        return () => clearTimeout(t)
      }
      /* Finished typing — pause then start deleting (only if loop) */
      if (loop) {
        setPausing(true)
        const t = setTimeout(() => {
          setPausing(false)
          setDeleting(true)
        }, pauseEnd)
        return () => clearTimeout(t)
      }
      /* No loop — stay fully typed */
      return
    }

    /* ── DELETING backward ── */
    if (count > 0) {
      const t = setTimeout(() => setCount(c => c - 1), deleteSpeed)
      return () => clearTimeout(t)
    }
    /* Finished deleting — brief pause then move to next phrase */
    setPausing(true)
    const t = setTimeout(() => {
      setPausing(false)
      setDeleting(false)
      setPhraseIdx(p => (p + 1) % phrases.length)
    }, pauseStart)
    return () => clearTimeout(t)

  }, [started, count, deleting, pausing, current, speed, deleteSpeed, pauseEnd, pauseStart, loop, phrases.length])

  /* When phrase changes, reset count */
  useEffect(() => { setCount(0) }, [phraseIdx])

  const showCursor = loop || count < current.length

  return (
    <span className={className} style={style}>
      {current.slice(0, count)}
      {showCursor && (
        <span style={{
          display:     'inline-block',
          width:       '2px',
          height:      '0.88em',
          background:  'currentColor',
          marginLeft:  '3px',
          verticalAlign:'middle',
          animation:   'pulse 0.75s ease-in-out infinite',
          opacity:     0.85,
          borderRadius: 1,
        }} />
      )}
    </span>
  )
}