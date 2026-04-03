import { useState, useEffect } from 'react'

function get(w) {
  if (w < 768) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

export function useBreakpoint() {
  const [bp, setBp] = useState('desktop')

  useEffect(() => {
    const handleResize = () => {
      const next = get(window.innerWidth)
      setBp(prev => (prev !== next ? next : prev))
    }

    handleResize() // initial call

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    bp,
    isMobile: bp === 'mobile',
    isTablet: bp === 'tablet',
    isDesktop: bp === 'desktop',
    isMobileOrTablet: bp !== 'desktop',
  }
}