import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Counter from '../ui/Counter'
import { STATS } from '../../utils/constants'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx';

export default function ParallaxSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y     = useSpring(useTransform(scrollYProgress, [0,1], [-40,40]), { stiffness:60, damping:15 })
  const scale = useTransform(scrollYProgress, [0,0.5,1], [0.92,1,0.92])
  const rot   = useTransform(scrollYProgress, [0,1], [-1.5,1.5])
  
  const { isMobile, isTablet } = useBreakpoint()

  return (
    
    <section ref={ref} style={{
      padding: isMobile ? '32px 5% 48px' : isTablet ? '40px 6% 60px' : '48px 8% 72px',
      background: 'var(--surface)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <motion.div style={{
        y, rotate:rot, scale,
        position:'absolute', inset:-60,
        backgroundImage:'linear-gradient(rgba(96,165,250,0.028) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,0.028) 1px,transparent 1px)',
        backgroundSize:'70px 70px',
        pointerEvents:'none',
      }} />

      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        {/* ── STATS ────────────────────────────────────────────────────── */}
        <div style={{ 
          display:'grid', 
          gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)', 
          gap: isMobile ? '16px' : isTablet ? '24px' : 0 
        }}>
          {STATS.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
              transition={{delay:i*0.1,duration:0.75,ease:[0.16,1,0.3,1]}}
              style={{
                padding: isMobile ? '32px 12px' : isTablet ? '38px 18px' : '44px 24px', 
                textAlign:'center', position:'relative',
                borderRight: !isMobile && !isTablet && i<3 ? '1px solid rgba(96,165,250,0.10)' : 'none',
              }}
            >
              <div style={{position:'absolute',top:0,left:0,width: isMobile ? 14 : 18,height: isMobile ? 14 : 18,borderTop:`2px solid ${stat.accent}`,borderLeft:`2px solid ${stat.accent}`}} />
              <div style={{position:'absolute',bottom:0,right:0,width: isMobile ? 14 : 18,height: isMobile ? 14 : 18,borderBottom:`2px solid ${stat.accent}`,borderRight:`2px solid ${stat.accept}`}} />

              <div style={{
                fontSize: isMobile ? 'clamp(32px,8vw,44px)' : isTablet ? 'clamp(38px,6vw,55px)' : 'clamp(44px,5.5vw,70px)', 
                fontFamily:'var(--font-display)', fontWeight:800, lineHeight:1,
                background:`linear-gradient(135deg,${stat.accent},#f0f6ff)`,
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              }}>
                <Counter end={stat.value} suffix={stat.suffix} triggerOnce={false} />
              </div>
              <div style={{
                color:'rgba(255,255,255,0.65)', 
                fontSize: isMobile ? 9 : isTablet ? 10.5 : 11.5, 
                marginTop: isMobile ? 10 : 14,
                fontFamily:'var(--font-mono)', letterSpacing: isMobile ? 2 : 3, textTransform:'uppercase', fontWeight:500,
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}