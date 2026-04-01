// src/components/sections/Clients.jsx
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'

const CLIENTS = [
  { name: 'Client One',    logo: './logo1.png'   },
  { name: 'Client Two',    logo: './logo2.jpg'   },
  { name: 'Client Three',  logo: './logo3.jpeg'  },
  { name: 'Client Four',   logo: './logo6.png'   },
  { name: 'Client Five',   logo: './logo5.png'   },
  { name: 'Client Six',    logo: './logo7.png'   },
  { name: 'Client Seven',  logo: './logo8.png'   },
  { name: 'Client Eight',  logo: './logo9.png'   },
  { name: 'Client Nine',   logo: './logo10.png'  },
  { name: 'Client Ten',    logo: './logo11.png'  },
  { name: 'Client Eleven', logo: './logo12.webp' },
]

// Split 11 logos into two rows — each duplicated ONCE for seamless loop
// Row A: logos 1–6  (6 unique, 12 total)
// Row B: logos 7–11 (5 unique, 10 total)
const ROW_A = [...CLIENTS.slice(0, 6),  ...CLIENTS.slice(0, 6)]
const ROW_B = [...CLIENTS.slice(6, 11), ...CLIENTS.slice(6, 11)]

// ─── Single logo pill ─────────────────────────────────────────────────────────
function LogoPill({ client, pillW, pillH }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: pillW,
        height: pillH,
        borderRadius: 16,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.09)',
        backdropFilter: 'blur(6px)',
        transition: 'background 0.3s, border-color 0.3s, transform 0.3s, box-shadow 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        boxSizing: 'border-box',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.11)'
        e.currentTarget.style.borderColor = 'rgba(96,165,250,0.4)'
        e.currentTarget.style.transform = 'scale(1.07) translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4), 0 0 20px rgba(96,165,250,0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'
        e.currentTarget.style.transform = 'scale(1) translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <img
        src={client.logo}
        alt={client.name}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          opacity: 0.85,
          transition: 'opacity 0.3s, filter 0.3s',
          display: 'block',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(96,165,250,0.5))'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.opacity = '0.85'
          e.currentTarget.style.filter = 'none'
        }}
      />
    </div>
  )
}

// ─── Marquee row ──────────────────────────────────────────────────────────────
function MarqueeRow({ track, direction, duration, pillW, pillH, gap }) {
  // Half the track = one full set of unique logos = scroll distance before loop
  const setW = (track.length / 2) * (pillW + gap)

  return (
    <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
      <div style={{ position:'absolute',top:0,left:0,width:120,height:'100%',background:'linear-gradient(to right,var(--bg),transparent)',zIndex:2,pointerEvents:'none' }} />
      <div style={{ position:'absolute',top:0,right:0,width:120,height:'100%',background:'linear-gradient(to left,var(--bg),transparent)',zIndex:2,pointerEvents:'none' }} />

      <motion.div
        style={{ display:'flex', gap, width:'max-content' }}
        animate={{ x: direction === 'left' ? [0, -setW] : [-setW, 0] }}
        transition={{ duration, ease:'linear', repeat:Infinity, repeatType:'loop' }}
      >
        {track.map((client, i) => (
          <LogoPill key={`${client.logo}-${i}`} client={client} pillW={pillW} pillH={pillH} />
        ))}
      </motion.div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Clients() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-80px' })
  const { isMobile, isTablet } = useBreakpoint()

  const pillW = isMobile ? 110 : isTablet ? 140 : 168
  const pillH = isMobile ?  90 : isTablet ? 112 : 128
  const gap   = isMobile ?  14 : 20

  return (
    <section
      ref={ref}
      style={{
        padding: isMobile ? '60px 0 70px' : isTablet ? '72px 0 80px' : '80px 0 96px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient orbs */}
      <div style={{ position:'absolute',top:'20%',left:'5%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(96,165,250,0.05),transparent 70%)',pointerEvents:'none',animation:'pulse 8s infinite' }} />
      <div style={{ position:'absolute',bottom:'10%',right:'5%',width:360,height:360,borderRadius:'50%',background:'radial-gradient(circle,rgba(192,132,252,0.05),transparent 70%)',pointerEvents:'none',animation:'pulse 10s 2s infinite' }} />

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom: isMobile ? 40 : 56, padding: isMobile ? '0 5%' : '0 8%' }}>
        <motion.div
          initial={{ opacity:0, y:16 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
          style={{ display:'inline-flex', alignItems:'center', gap:12, marginBottom:18 }}
        >
          <div style={{ width:32,height:1,background:'linear-gradient(90deg,transparent,rgba(96,165,250,0.6))' }} />
          <span style={{ fontSize:10,letterSpacing:4,color:'rgba(96,165,250,0.65)',fontFamily:'var(--font-mono)',textTransform:'uppercase' }}>Trusted By</span>
          <div style={{ width:32,height:1,background:'linear-gradient(90deg,rgba(96,165,250,0.6),transparent)' }} />
        </motion.div>

        <motion.h2
          initial={{ opacity:0, y:28 }} animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.85, delay:0.1, ease:[0.16,1,0.3,1] }}
          style={{ fontSize:'clamp(26px,3.8vw,52px)',fontFamily:'var(--font-display)',fontWeight:800,color:'#ffffff',lineHeight:1.08,marginBottom:16 }}
        >
          Organizations that <span className="gt">Trust Us</span>
        </motion.h2>

        <motion.p
          initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}}
          transition={{ duration:0.7, delay:0.25 }}
          style={{ fontSize:15.5,color:'rgba(255,255,255,0.55)',fontFamily:'var(--font-body)',maxWidth:480,margin:'0 auto',lineHeight:1.8 }}
        >
          From Government Organizations to Private Enterprises — we've helped businesses across India build remarkable digital products.
        </motion.p>
      </div>

      {/* Two rows — different logos, different directions */}
      <motion.div
        initial={{ opacity:0, y:32 }} animate={inView ? { opacity:1, y:0 } : {}}
        transition={{ duration:0.9, delay:0.3, ease:[0.16,1,0.3,1] }}
        style={{ display:'flex', flexDirection:'column', gap: isMobile ? 14 : 18 }}
      >
        <MarqueeRow track={ROW_A} direction="left"  duration={32} pillW={pillW} pillH={pillH} gap={gap} />
        <MarqueeRow track={ROW_B} direction="right" duration={26} pillW={pillW} pillH={pillH} gap={gap} />
      </motion.div>

      {/* Bottom stats */}
      <motion.div
        initial={{ opacity:0, y:20 }} animate={inView ? { opacity:1, y:0 } : {}}
        transition={{ duration:0.8, delay:0.5 }}
        style={{ display:'flex', justifyContent:'center', gap: isMobile ? 32 : 64, marginTop: isMobile ? 44 : 60, padding: isMobile ? '0 5%' : '0 8%', flexWrap:'wrap' }}
      >
        {[
          { val:'50+',  lbl:'Happy Clients'    },
          { val:'7+',   lbl:'Years Experience' },
          { val:'100%', lbl:'Retention Rate'   },
        ].map(s => (
          <div key={s.lbl} style={{ textAlign:'center' }}>
            <div style={{ fontSize: isMobile ? 28 : 38, fontFamily:'var(--font-display)', fontWeight:800, color:'#60a5fa', lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', fontFamily:'var(--font-mono)', letterSpacing:2, textTransform:'uppercase', marginTop:6 }}>{s.lbl}</div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}