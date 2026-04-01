// src/components/animations/FloatingCards.jsx
// import path: ../../hooks/useBreakpoint
// (this file: src/components/animations/ → up two levels → src/ → hooks/)

import { useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import SectionTag from '../ui/SectionTag'
import Icons from '../ui/Icons'
import { FLOATING_CARDS } from '../../utils/constants'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx';

// ─── All original CARD_DATA — unchanged ───────────────────────────────────────
const CARD_DATA = {
  'ISO Certified': {
    cardImg:  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=85',
    workImg:  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&q=90',
    workLabel:'ISO 9001:2015 Certified Quality Management',
  },
  'Startup India': {
    cardImg:  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&q=85',
    workImg:  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=90',
    workLabel:'Recognised by Startup India, DPIIT',
  },
  '500+ Projects': {
    cardImg:  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=85',
    workImg:  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=90',
    workLabel:'500+ Projects Delivered Pan-India',
  },
  '7+ Years': {
    cardImg:  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&q=85',
    workImg:  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=90',
    workLabel:'7+ Years of Digital Excellence',
  },
  '24/7 Support': {
    cardImg:  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&q=85',
    workImg:  'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=900&q=90',
    workLabel:'Round-the-Clock Dedicated Support',
  },
  '100+ Team': {
    cardImg:  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=85',
    workImg:  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=90',
    workLabel:'100+ Expert Developers & Designers',
  },
}

// ─── WorkPopup — unchanged visually, just not rendered on mobile ──────────────
function WorkPopup({ card, data, accent, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity:0, y:16, scale:0.9 }}
          animate={{ opacity:1, y:0,  scale:1   }}
          exit={{    opacity:0, y:12, scale:0.94 }}
          transition={{ duration:0.32, ease:[0.16,1,0.3,1] }}
          style={{
            position:'absolute', bottom:'calc(100% + 16px)', left:'50%',
            transform:'translateX(-50%)', width:340, borderRadius:14,
            overflow:'hidden', zIndex:50, pointerEvents:'none',
            boxShadow:`0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${accent}30`,
          }}
        >
          <div style={{ height:200, position:'relative', overflow:'hidden' }}>
            <img src={data.workImg} alt={data.workLabel}
              style={{ width:'100%',height:'100%',objectFit:'cover',filter:'brightness(0.82) saturate(1.2)' }}
            />
            <div style={{ position:'absolute',inset:0,background:`linear-gradient(to bottom,transparent 40%,rgba(6,12,28,0.95) 100%)` }} />
            <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${accent},${accent}44)` }} />
            <div style={{ position:'absolute',bottom:14,left:16,right:16,fontSize:13,fontFamily:'var(--font-display)',fontWeight:700,color:'#ffffff',lineHeight:1.3 }}>
              {data.workLabel}
            </div>
          </div>
          <div style={{ padding:'12px 16px',background:'rgba(6,12,28,0.97)',backdropFilter:'blur(20px)',display:'flex',alignItems:'center',gap:8 }}>
            <div style={{ width:7,height:7,borderRadius:'50%',background:accent,boxShadow:`0 0 8px ${accent}` }} />
            <span style={{ fontSize:11,color:'rgba(255,255,255,0.6)',fontFamily:'var(--font-mono)',letterSpacing:1.5,textTransform:'uppercase' }}>{card.sub}</span>
            <div style={{ marginLeft:'auto',fontSize:11,color:accent,fontFamily:'var(--font-mono)',fontWeight:600 }}>VIEW →</div>
          </div>
          <div style={{ position:'absolute',bottom:-8,left:'50%',transform:'translateX(-50%)',width:0,height:0,borderLeft:'8px solid transparent',borderRight:'8px solid transparent',borderTop:`8px solid rgba(6,12,28,0.97)` }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── MagCard — 3D tilt & float disabled on mobile/tablet ─────────────────────
function MagCard({ title, sub, iconKey, accent, i, isTouch }) {
  const Icon  = Icons[iconKey]
  const data  = CARD_DATA[title] || {}
  const [hov, setHov] = useState(false)

  const x    = useMotionValue(0)
  const y    = useMotionValue(0)
  const rotX = useSpring(useTransform(y, [-60,60], [10,-10]), { stiffness:180, damping:22 })
  const rotY = useSpring(useTransform(x, [-60,60], [-10,10]), { stiffness:180, damping:22 })
  const gx   = useTransform(x, [-60,60], ['20%','80%'])
  const gy   = useTransform(y, [-60,60], ['20%','80%'])

  const onMove  = e => { const r=e.currentTarget.getBoundingClientRect(); x.set(e.clientX-r.left-r.width/2); y.set(e.clientY-r.top-r.height/2) }
  const onEnter = e => { setHov(true);  onMove(e) }
  const onLeave = () => { setHov(false); x.set(0); y.set(0) }

  return (
    <motion.div
      initial={{ opacity:0, y:50, scale:0.88 }}
      whileInView={{ opacity:1, y:0, scale:1 }}
      viewport={{ once:true }}
      transition={{ delay:i*0.08, duration:0.75, ease:[0.16,1,0.3,1] }}
      // Mouse events only on desktop
      onMouseMove={isTouch ? undefined : onMove}
      onMouseEnter={isTouch ? undefined : onEnter}
      onMouseLeave={isTouch ? undefined : onLeave}
      style={{
        // 3D tilt only on desktop
        rotateX: isTouch ? 0 : rotX,
        rotateY: isTouch ? 0 : rotY,
        transformStyle: 'preserve-3d',
        // Float animation disabled on mobile — saves battery, avoids scroll jank
        animation: isTouch ? 'none' : `${i%2===0?'float':'floatReverse'} ${3.6+i*0.3}s ease-in-out ${i*0.25}s infinite`,
        cursor: isTouch ? 'default' : 'none',
        width: '100%',
        position: 'relative',
        marginTop: 12,
      }}
      data-hover
    >
      {/* Popup — desktop only (would overflow on mobile) */}
      {!isTouch && <WorkPopup card={{ sub }} data={data} accent={accent} visible={hov} />}

      <motion.div
        animate={{ boxShadow: hov
          ? `0 28px 72px rgba(0,0,0,0.65),0 0 48px ${accent}28,inset 0 1px 0 rgba(255,255,255,0.1)`
          : `0 16px 48px rgba(0,0,0,0.45),0 0 24px ${accent}0a,inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
        transition={{ duration:0.3 }}
        style={{ width:'100%',borderRadius:16,overflow:'hidden',position:'relative',border:`1px solid ${hov?accent+'55':accent+'22'}`,transition:'border-color 0.3s' }}
      >
        {/* Card image */}
        <div style={{ height:148, overflow:'hidden', position:'relative' }}>
          <motion.img src={data.cardImg} alt={title}
            animate={{ scale:hov?1.08:1, filter:hov?'brightness(0.55) saturate(1.4)':'brightness(0.4) saturate(1.2)' }}
            transition={{ duration:0.45 }}
            style={{ width:'100%',height:'100%',objectFit:'cover' }}
          />
          <div style={{ position:'absolute',inset:0,background:`linear-gradient(160deg,${accent}18 0%,rgba(6,12,28,0.95) 100%)` }} />
          <motion.div animate={{ scaleX:hov?1:0.4, opacity:hov?1:0.6 }}
            style={{ position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${accent},transparent)`,transformOrigin:'left' }}
          />
          <motion.div animate={{ scale:hov?1.12:1, background:hov?`${accent}30`:`${accent}18` }} transition={{ duration:0.3 }}
            style={{ position:'absolute',bottom:12,left:14,width:42,height:42,borderRadius:10,border:`1.5px solid ${accent}50`,display:'flex',alignItems:'center',justifyContent:'center',color:accent,backdropFilter:'blur(10px)' }}
          >
            {Icon && <Icon />}
          </motion.div>
          {/* HOVER badge — desktop only */}
          {!isTouch && (
            <motion.div animate={{ opacity:hov?1:0 }}
              style={{ position:'absolute',top:12,right:12,fontSize:10,color:accent,fontFamily:'var(--font-mono)',fontWeight:700,letterSpacing:1.5,background:`${accent}14`,padding:'4px 9px',borderRadius:4,border:`1px solid ${accent}30` }}
            >HOVER</motion.div>
          )}
        </div>

        {/* Text area */}
        <motion.div animate={{ background:hov?'rgba(8,16,36,0.97)':'rgba(11,20,38,0.94)' }}
          style={{ padding:'16px 18px 20px', backdropFilter:'blur(20px)' }}
        >
          <div style={{ fontSize:15,fontFamily:'var(--font-display)',fontWeight:700,color:'#ffffff',marginBottom:5,lineHeight:1.2 }}>{title}</div>
          <div style={{ fontSize:10.5,color:accent,fontFamily:'var(--font-mono)',letterSpacing:2,textTransform:'uppercase',fontWeight:600 }}>{sub}</div>
          <div style={{ marginTop:12,height:2,borderRadius:2,background:'rgba(255,255,255,0.07)',overflow:'hidden' }}>
            <motion.div animate={{ width:hov?'100%':'0%' }} transition={{ duration:0.6,ease:[0.16,1,0.3,1] }}
              style={{ height:'100%',background:`linear-gradient(90deg,${accent},${accent}66)`,borderRadius:2 }}
            />
          </div>
        </motion.div>

        {/* Glare — desktop only */}
        {!isTouch && (
          <motion.div style={{
            position:'absolute',inset:0,pointerEvents:'none',borderRadius:16,
            background: useTransform([gx,gy], ([a,b]) => `radial-gradient(circle at ${a} ${b},rgba(255,255,255,0.07) 0%,transparent 55%)`),
            opacity:hov?1:0, transition:'opacity 0.3s',
          }} />
        )}

        {/* Corner brackets */}
        <div style={{ position:'absolute',top:9,left:9,width:14,height:14,borderTop:`1.5px solid ${accent}70`,borderLeft:`1.5px solid ${accent}70` }} />
        <div style={{ position:'absolute',top:9,right:9,width:14,height:14,borderTop:`1.5px solid ${accent}70`,borderRight:`1.5px solid ${accent}70` }} />
        <motion.div animate={{ opacity:hov?1:0 }}
          style={{ position:'absolute',bottom:9,left:9,width:14,height:14,borderBottom:`1.5px solid ${accent}70`,borderLeft:`1.5px solid ${accent}70` }}
        />
        <motion.div animate={{ opacity:hov?1:0 }}
          style={{ position:'absolute',bottom:9,right:9,width:14,height:14,borderBottom:`1.5px solid ${accent}70`,borderRight:`1.5px solid ${accent}70` }}
        />
      </motion.div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function FloatingCards() {
  const { isMobile, isTablet, isMobileOrTablet } = useBreakpoint()

  // Grid columns: 1 on mobile, 2 on tablet, 3 on desktop
  const cols = isMobile ? 1 : isTablet ? 2 : 3

  return (
    <section style={{
      padding: isMobile ? '0 5% 60px' : isTablet ? '0 6% 64px' : '0px 8% 72px',
      background: 'var(--bg)',
      position: 'relative',
      // overflow:visible needed for popup on desktop; hidden on mobile prevents horizontal scroll
      overflow: isMobileOrTablet ? 'hidden' : 'visible',
    }}>

      {/* Watermark — desktop only, would overflow on mobile */}
      {!isMobileOrTablet && (
        <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:'clamp(80px,15vw,190px)',fontFamily:'var(--font-display)',fontWeight:900,color:'rgba(96,165,250,0.018)',whiteSpace:'nowrap',pointerEvents:'none',letterSpacing:-6,userSelect:'none' }}>
          RIVEYRA
        </div>
      )}

      {/* Ambient glows */}
      <div style={{ position:'absolute',top:'30%',left:'10%',width:380,height:380,borderRadius:'50%',background:'radial-gradient(circle,rgba(96,165,250,0.06),transparent 70%)',pointerEvents:'none',animation:'pulse 8s infinite' }} />
      <div style={{ position:'absolute',bottom:'20%',right:'10%',width:320,height:320,borderRadius:'50%',background:'radial-gradient(circle,rgba(192,132,252,0.06),transparent 70%)',pointerEvents:'none',animation:'pulse 10s 2s infinite' }} />

      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom: isMobile ? 40 : 64 }}>
          <SectionTag>Why Choose Us</SectionTag>
          <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.8,ease:[0.16,1,0.3,1]}}
            style={{ fontSize:'clamp(28px,4vw,56px)',fontFamily:'var(--font-display)',fontWeight:800,color:'#ffffff' }}
          >
            Built on <span className="gt">Trust &amp; Excellence</span>
          </motion.h2>
          <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:0.2}}
            style={{ fontSize:16,color:'rgba(255,255,255,0.6)',marginTop:14,fontFamily:'var(--font-body)',maxWidth:440,margin:'14px auto 0' }}
          >
            {isMobileOrTablet ? 'What makes us stand out' : "Hover over each card to see what we've achieved"}
          </motion.p>
        </div>

        {/* KEY CHANGE: gridTemplateColumns driven by breakpoint */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: isMobile ? 16 : 24,
          perspective: isMobileOrTablet ? 'none' : 1400,
          overflow: 'visible',
          position: 'relative',
          zIndex: 1,
        }}>
          {FLOATING_CARDS.map((card, i) => (
            <MagCard key={card.title} {...card} i={i} isTouch={isMobileOrTablet} />
          ))}
        </div>
      </div>
    </section>
  )
}