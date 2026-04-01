// src/hooks/useBreakpoint.js
import { useState, useEffect } from 'react'

function get(w) {
  if (w < 768)  return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

export function useBreakpoint() {
  const [bp, setBp] = useState(() => get(window.innerWidth))

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      const next = get(window.innerWidth)
      setBp(prev => prev !== next ? next : prev)
    })
    ro.observe(document.documentElement)
    return () => ro.disconnect()
  }, [])

  return {
    bp,
    isMobile:         bp === 'mobile',
    isTablet:         bp === 'tablet',
    isDesktop:        bp === 'desktop',
    isMobileOrTablet: bp !== 'desktop',
  }
}