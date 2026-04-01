// src/components/ui/ScrollToTop.jsx
// Fixed bottom-right button — appears after scrolling 300px, hides at top.
// Clicking scrolls smoothly back to the top.

import { useState, useEffect } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover
      aria-label="Scroll to top"
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 990,
        width: 46,
        height: 46,
        borderRadius: '50%',
        border: '1px solid rgba(96,165,250,0.35)',
        background: hovered
          ? 'rgba(96,165,250,0.18)'
          : 'rgba(5,11,24,0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: hovered
          ? '0 0 24px rgba(96,165,250,0.35), 0 8px 32px rgba(0,0,0,0.5)'
          : '0 4px 20px rgba(0,0,0,0.5)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Fade + slide in/out
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.88)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.3s ease, transform 0.3s ease, background 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Arrow up */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke={hovered ? '#93c5fd' : 'rgba(96,165,250,0.8)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: 'stroke 0.2s ease, transform 0.2s ease', transform: hovered ? 'translateY(-1px)' : 'translateY(0)' }}
      >
        <path d="M8 12V4M4 7l4-4 4 4" />
      </svg>

      {/* Pulse ring — shows only when hovered */}
      {hovered && (
        <span style={{
          position: 'absolute',
          inset: -4,
          borderRadius: '50%',
          border: '1px solid rgba(96,165,250,0.25)',
          animation: 'pulse 1.5s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}
    </button>
  )
}