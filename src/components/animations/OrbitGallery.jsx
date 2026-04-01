// src/components/animations/OrbitGallery.jsx
// import path: ../../hooks/useBreakpoint
// (this file: src/components/animations/ → up two levels → src/ → hooks/)

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SectionTag from '../ui/SectionTag'
import { ORBIT_ITEMS } from '../../utils/constants'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx';

// ─── OrbitRing — unchanged logic, only radius comes from outside ──────────────
function OrbitRing({ items, radius, speed, tiltX, reverse = false }) {
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2)
  const rafRef = useRef()

  useEffect(() => {
    const tick = () => {
      setAngle(a => a + (reverse ? -1 : 1) * speed * 0.011)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [speed, reverse])

  return (
    <>
      {/* Track ring */}
      <div style={{
        position:'absolute',top:'50%',left:'50%',
        width:radius*2, height:radius*2,
        marginLeft:-radius, marginTop:-radius,
        borderRadius:'50%',
        border:'1px solid rgba(79,142,255,0.11)',
        transform:`rotateX(${tiltX}deg)`,
        transformStyle:'preserve-3d',
        pointerEvents:'none',
      }} />

      {items.map((item, i) => {
        const theta  = angle + (i / items.length) * Math.PI * 2
        const x      = Math.cos(theta) * radius
        const zRaw   = Math.sin(theta) * radius
        const tiltRad = (tiltX * Math.PI) / 180
        const y      = zRaw * Math.sin(tiltRad)
        const zFinal = zRaw * Math.cos(tiltRad)
        const norm   = (zFinal + radius) / (radius * 2)
        const scale  = 0.62 + norm * 0.56
        const opacity = 0.38 + norm * 0.62

        return (
          <div key={item.label} style={{
            position:'absolute',top:'50%',left:'50%',
            transform:`translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
            zIndex:Math.round(scale * 12),
          }}>
            <div data-hover style={{
              width:68, height:68, borderRadius:12,
              background:`linear-gradient(135deg,${item.color}22,${item.color}06)`,
              border:`1.5px solid ${item.color}44`,
              display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,
              opacity, transform:`scale(${scale})`,
              backdropFilter:'blur(10px)',
              cursor:'pointer',
              boxShadow:`0 0 18px ${item.color}1a`,
              transition:'transform 0.05s, opacity 0.05s',
            }}>
              <span style={{ fontSize:22,filter:`drop-shadow(0 0 6px ${item.color})` }}>{item.icon}</span>
              <span style={{ fontSize:8.5,color:item.color,fontFamily:'var(--font-display)',letterSpacing:1.5,textTransform:'uppercase' }}>{item.label}</span>
            </div>
          </div>
        )
      })}
    </>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function OrbitGallery() {
  const inner = ORBIT_ITEMS.slice(0, 5)
  const { isMobile, isTablet } = useBreakpoint()

  // Scale down orbit radii on smaller screens so it fits inside the container
  const outerRadius = isMobile ? 120 : isTablet ? 150 : 188
  const innerRadius = isMobile ?  72 : isTablet ?  92 : 115

  // On mobile we stack text above orbit; on desktop side-by-side
  const isStacked = isMobile || isTablet

  // Orbit container height shrinks on mobile
  const orbitHeight = isMobile ? 300 : isTablet ? 360 : 460

  return (
    <section style={{
      padding: isMobile ? '60px 5% 70px' : isTablet ? '60px 6% 70px' : '48px 8% 72px',
      background:'var(--surface)',
      position:'relative',
      overflow:'hidden',
    }}>
      <div style={{
        maxWidth:1200, margin:'0 auto',
        display:'grid',
        // Stack on mobile/tablet, side-by-side on desktop
        gridTemplateColumns: isStacked ? '1fr' : '1fr 1fr',
        gap: isMobile ? 40 : isTablet ? 48 : 80,
        alignItems:'center',
      }}>

        {/* Left text */}
        <div>
          <SectionTag>◉ Our Tech Universe</SectionTag>
          <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.85,ease:[0.16,1,0.3,1]}}
            style={{ fontSize:'clamp(26px,3.6vw,50px)',fontFamily:'var(--font-display)',fontWeight:700,lineHeight:1.1,marginBottom:22 }}
          >
            Technologies That <span className="gt">Power</span> Your Vision
          </motion.h2>
          <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:0.2}}
            style={{ fontSize:15,lineHeight:1.9,color:'var(--muted)',marginBottom:32,fontFamily:'var(--font-alt)',fontWeight:300 }}
          >
            We master the full spectrum of modern technologies — from mobile and cloud to AI and ERP — delivering future-proof solutions every time.
          </motion.p>
          <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:0.35}}
            style={{
              display:'grid',
              // 2-col on desktop/tablet, 1-col on mobile
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap:12,
            }}
          >
            {['React & Next.js','Flutter & Swift','Node & Python','AI & Machine Learning','ERP & CRM','Cloud & DevOps'].map(tech => (
              <div key={tech} style={{ display:'flex',alignItems:'center',gap:10,fontSize:13,color:'var(--muted)',fontFamily:'var(--font-alt)' }}>
                <span style={{ width:6,height:6,borderRadius:'50%',background:'linear-gradient(#4f8eff,#a259ff)',flexShrink:0 }} />
                {tech}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right orbit — same component, just smaller radii on mobile */}
        <motion.div
          initial={{opacity:0,scale:0.75}} whileInView={{opacity:1,scale:1}} viewport={{once:true}}
          transition={{duration:1.1,ease:[0.16,1,0.3,1]}}
          style={{ position:'relative', height:orbitHeight, perspectiveOrigin:'50% 50%', perspective:900 }}
        >
          {/* Centre glow */}
          <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:88,height:88,borderRadius:'50%',background:'radial-gradient(circle,rgba(79,142,255,0.38) 0%,transparent 70%)',animation:'pulse 3s infinite',zIndex:20 }} />

          {/* Centre logo — unchanged path */}
          <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg,#4f8eff,#a259ff)',zIndex:21,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 30px rgba(167,178,199,0.7)',overflow:'hidden',padding:4 }}>
            <img src="/Riveyra white.png" alt="Riveyra Logo" style={{ width:'100%',height:'100%',objectFit:'contain',objectPosition:'center' }} />
          </div>

          <OrbitRing items={ORBIT_ITEMS} radius={outerRadius} speed={0.4}  tiltX={72} />
          <OrbitRing items={inner}       radius={innerRadius} speed={0.68} tiltX={72} reverse />
        </motion.div>
      </div>
    </section>
  )
}