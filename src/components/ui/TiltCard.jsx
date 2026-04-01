import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

/**
 * TiltCard — 3-D tilt + magnetic gradient on hover.
 * Wrap any children in this to get the effect.
 */
export default function TiltCard({ children, style = {}, strength = 14, glare = true, className = '' }) {
  const ref = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotX = useSpring(useTransform(y, [-80, 80], [ strength, -strength]), { stiffness: 160, damping: 20 })
  const rotY = useSpring(useTransform(x, [-80, 80], [-strength,  strength]), { stiffness: 160, damping: 20 })

  const glareX = useTransform(x, [-80, 80], ['0%',   '100%'])
  const glareY = useTransform(y, [-80, 80], ['0%',   '100%'])

  const onMove = e => {
    const rect = ref.current.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width  / 2)
    y.set(e.clientY - rect.top  - rect.height / 2)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformStyle: 'preserve-3d',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      data-hover
    >
      {children}

      {/* Glare overlay */}
      {glare && (
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.07) 0%, transparent 60%)`,
            ),
            pointerEvents: 'none',
            borderRadius: 'inherit',
          }}
        />
      )}
    </motion.div>
  )
}