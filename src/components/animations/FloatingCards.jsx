// src/components/animations/FloatingCards.jsx
// import path: ../../hooks/useBreakpoint
// (this file: src/components/animations/ → up two levels → src/ → hooks/)

import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionTag from '../ui/SectionTag'
import Icons from '../ui/Icons'
import { FLOATING_CARDS } from '../../utils/constants'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx';

// ─── All original CARD_DATA — unchanged ───────────────────────────────────────
const CARD_DATA = {
  'ISO Certified': {
    cardImg: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=85',
    workImg: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&q=90',
    workLabel: 'Quality You Can Trust',
    workDesc: 'Our ISO-certified processes reflect our commitment to quality, security, consistency, and reliable delivery across every digital project.',
  },
  'Startup India': {
    cardImg: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&q=85',
    workImg: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=90',
    workLabel: 'Recognised for Innovation',
    workDesc: 'As a Startup India-recognised technology company, we combine innovation and practical expertise to create solutions that solve real business challenges.',
  },
  '500+ Projects': {
    cardImg: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=85',
    workImg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=90',
    workLabel: 'Proven Delivery Experience',
    workDesc: 'Our experience across 500+ projects gives us the expertise to handle diverse digital requirements while maintaining a strong focus on quality and timely delivery.',
  },
  '10+ Years': {
    cardImg: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&q=85',
    workImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=90',
    workLabel: 'Years of IT Excellence',
    workDesc: 'With 10+ years of experience in technology and digital solutions, we bring proven expertise, industry knowledge, and a growth-focused approach to every project.',
  },
  '24/7 Support': {
    cardImg: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&q=85',
    workImg: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=900&q=90',
    workLabel: 'Support When You Need It',
    workDesc: 'Our dedicated support approach helps businesses keep their digital products, applications, and technology solutions running smoothly whenever assistance is needed.',
  },
  '100+ Team': {
    cardImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=85',
    workImg: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=90',
    workLabel: 'Experts Behind Every Solution',
    workDesc: 'Our diverse team of developers, designers, marketers, and technology specialists brings together the skills needed to turn complex ideas into high-quality digital solutions.',
  },
}

const CARD_HEIGHT = 320

// ─── FlipCard — hover-to-flip on desktop, tap-to-flip on touch ───────────────
function MagCard({ title, sub, iconKey, accent, i, isTouch }) {
  const Icon = Icons[iconKey]
  const data = CARD_DATA[title] || {}
  const [flipped, setFlipped] = useState(false)

  const openFront = () => setFlipped(true)
  const closeFront = () => setFlipped(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={isTouch ? undefined : openFront}
      onMouseLeave={isTouch ? undefined : closeFront}
      onClick={isTouch ? () => setFlipped(f => !f) : undefined}
      style={{
        width: '100%',
        height: CARD_HEIGHT,
        position: 'relative',
        perspective: 1400,
        cursor: 'pointer',
        marginTop: 12,
      }}
    >
      {/* Inner rotating shell — front & back are its two faces */}
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ── FRONT FACE ── */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: 16,
            overflow: 'hidden',
            border: `1px solid ${accent}28`,
            boxShadow: flipped ? 'none' : `0 16px 48px rgba(0,0,0,0.45), 0 0 24px ${accent}0a`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ height: 148, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
            <img
              src={data.cardImg}
              alt={title}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.42) saturate(1.2)' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${accent}22 0%, transparent 60%)` }} />
            {Icon && (
              <div style={{
                position: 'absolute', top: 14, right: 14, width: 38, height: 38, borderRadius: 10,
                background: 'rgba(6,12,28,0.6)', border: `1px solid ${accent}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent,
                backdropFilter: 'blur(6px)',
              }}>
                <Icon />
              </div>
            )}
          </div>

          <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, fontFamily: 'var(--font-display)' }}>{title}</div>
            <p style={{ color: accent, fontSize: 13, fontFamily: 'var(--font-body)', margin: '6px 0 0' }}>{sub}</p>
          </div>

          <div style={{ padding: '0 18px 16px', fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            {isTouch ? 'Tap to flip' : 'Hover to flip'}
          </div>
        </div>

        {/* ── BACK FACE ── */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 16,
            overflow: 'hidden',
            border: `1px solid ${accent}55`,
            boxShadow: flipped ? `0 28px 72px rgba(0,0,0,0.65), 0 0 48px ${accent}28` : 'none',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ height: 110, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
            <img
              src={data.workImg}
              alt={data.workLabel}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5) saturate(1.2)' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(6,12,28,0.95) 100%)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${accent},${accent}44)` }} />
          </div>

          <div style={{ padding: '16px 18px', background: 'rgba(6,12,28,0.97)', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 15.5, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#ffffff', lineHeight: 1.3, marginBottom: 8 }}>
              {data.workLabel}
            </div>
            <p style={{ fontSize: 12.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.72)', fontFamily: 'var(--font-body)', margin: 0, flex: 1 }}>
              {data.workDesc}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: accent, boxShadow: `0 0 8px ${accent}` }} />
              <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase' }}>{sub}</span>
            </div>
          </div>
        </div>
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
      overflow: 'hidden',
    }}>

      {/* Watermark — desktop only, would overflow on mobile */}
      {!isMobileOrTablet && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 'clamp(80px,15vw,190px)', fontFamily: 'var(--font-display)', fontWeight: 900, color: 'rgba(96,165,250,0.018)', whiteSpace: 'nowrap', pointerEvents: 'none', letterSpacing: -6, userSelect: 'none' }}>
          RIVEYRA
        </div>
      )}

      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '30%', left: '10%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(96,165,250,0.06),transparent 70%)', pointerEvents: 'none', animation: 'pulse 8s infinite' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,132,252,0.06),transparent 70%)', pointerEvents: 'none', animation: 'pulse 10s 2s infinite' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 64 }}>
          <div style={{ marginTop: '30px' }}>
            <SectionTag>Why Choose Us</SectionTag>
          </div>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(28px,4vw,56px)', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff' }}
          >
            Built on <span className="gt">Trust &amp; Excellence</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginTop: 14, fontFamily: 'var(--font-body)', maxWidth: 440, margin: '14px auto 0' }}
          >
            {isMobileOrTablet ? 'Tap each card to see what we\'ve achieved' : "Hover over each card to see what we've achieved"}
          </motion.p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: isMobile ? 16 : 24,
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