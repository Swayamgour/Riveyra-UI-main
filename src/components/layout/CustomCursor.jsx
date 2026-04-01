
import { useEffect, useState, useRef } from 'react'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'

export default function CustomCursor() {
  const { isMobile, isTablet } = useBreakpoint()

  const [dot,      setDot]      = useState({ x: -200, y: -200 })
  const [ring,     setRing]     = useState({ x: -200, y: -200 })
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)

  const mx = useRef(-200)
  const my = useRef(-200)
  const rx = useRef(-200)
  const ry = useRef(-200)

  useEffect(() => {
 
    if (isMobile || isTablet) return

    let raf

    const lerp = (a, b, t) => a + (b - a) * t

    const onMove = e => { mx.current = e.clientX; my.current = e.clientY; setDot({ x: e.clientX, y: e.clientY }) }
    const onDown = () => setClicking(true)
    const onUp   = () => setClicking(false)
    const onOver = e => { if (e.target.closest('a,button,[data-hover]')) setHovering(true)  }
    const onOut  = e => { if (e.target.closest('a,button,[data-hover]')) setHovering(false) }

    const tick = () => {
      rx.current = lerp(rx.current, mx.current, 0.11)
      ry.current = lerp(ry.current, my.current, 0.11)
      setRing({ x: rx.current, y: ry.current })
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove',   onMove)
    window.addEventListener('mousedown',   onDown)
    window.addEventListener('mouseup',     onUp)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout',  onOut)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove',   onMove)
      window.removeEventListener('mousedown',   onDown)
      window.removeEventListener('mouseup',     onUp)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout',  onOut)
      cancelAnimationFrame(raf)
    }
  }, [isMobile, isTablet])

 
  if (isMobile || isTablet) return null

  const dotSize  = clicking ? 6  : 8
  const ringSize = hovering ? 52 : clicking ? 24 : 36
  const color    = hovering ? '#00e5cc' : '#4f8eff'

  return (
    <>
      {/* Dot */}
      <div style={{
        position: 'fixed', zIndex: 9999,
        left: dot.x, top: dot.y,
        width: dotSize, height: dotSize,
        borderRadius: '50%',
        background: color,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        transition: 'width 0.12s, height 0.12s, background 0.2s',
        boxShadow: `0 0 ${hovering ? 18 : 8}px ${color}`,
      }} />

      {/* Ring */}
      <div style={{
        position: 'fixed', zIndex: 9998,
        left: ring.x, top: ring.y,
        width: ringSize, height: ringSize,
        borderRadius: '50%',
        border: `1.5px solid ${hovering ? 'rgba(0,229,204,0.55)' : 'rgba(79,142,255,0.42)'}`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        transition: 'width 0.22s cubic-bezier(0.16,1,0.3,1), height 0.22s cubic-bezier(0.16,1,0.3,1), border-color 0.2s',
      }} />
    </>
  )
}