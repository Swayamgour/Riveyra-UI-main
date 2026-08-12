// src/components/sections/Testimonials.jsx
// import path: ../../hooks/useBreakpoint
// (this file: src/components/sections/ → up two levels → src/ → hooks/)

import { motion } from 'framer-motion'
import SectionTag from '../ui/SectionTag'
import Icons from '../ui/Icons'
import { TESTIMONIALS } from '../../utils/constants'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'

// ─── Avatars — unchanged ──────────────────────────────────────────────────────
const AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=85&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=85&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=85&fit=crop&crop=face',
]

export default function Testimonials({ testimonials }) {
  const { isMobile, isTablet } = useBreakpoint()

  return (
    <section
      id="testimonials"
      style={{
        padding: isMobile ? '60px 5%' : isTablet ? '60px 6%' : '64px 8%',
        background: 'var(--surface)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background texture */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=50"
          alt="" loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(60px) brightness(0.06) saturate(1.5)', opacity: 0.7 }}
        />
      </div>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      <div className="scroll-reveal" style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 48 : 72 }}>
          <SectionTag>Client Testimonials</SectionTag>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ fontSize: 'clamp(28px,4vw,56px)', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff' }}
          >
            What Our <span className="gt">Clients Say</span>
          </motion.h2>
        </div>

        {/* Cards grid
            KEY CHANGE: auto-fit with minmax naturally wraps on desktop/tablet.
            On mobile we force 1-col so cards are full-width and readable.
            whileHover lift disabled on mobile (no hover state on touch). */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: isMobile ? 20 : 24,
        }}>
          {(testimonials || TESTIMONIALS).map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              // Lift on hover only makes sense on desktop — skip on mobile
              whileHover={isMobile ? {} : { y: -6, boxShadow: `0 24px 60px ${t.accent}20` }}
              style={{
                padding: isMobile ? '28px 22px' : '36px 32px',
                borderRadius: 16,
                background: 'rgba(12,22,40,0.82)',
                border: `1px solid ${t.accent}20`,
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
                cursor: isMobile ? 'default' : 'none',
              }}
              data-hover
            >
              {/* Big quote bg mark */}
              {/* <div style={{ position: 'absolute', top: -10, right: 20, fontSize: 120, fontFamily: 'serif', color: `${t.accent}08`, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>"</div> */}

              {/* Stars */}
             {/*  <div style={{ display: 'flex', gap: 3, marginBottom: 18 }}>
                {[...Array(5)].map((_, k) => (
                  <svg key={k} width="14" height="14" viewBox="0 0 24 24" fill={t.accent}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div> */}

              <div style={{ color: t.accent, marginBottom: 14, opacity: 0.85 }}>
                <Icons.Quote />
              </div>

              <p style={{ fontSize: 15, lineHeight: 1.88, color: 'rgba(255,255,255,0.88)', fontFamily: 'var(--font-body)', marginBottom: 28, fontStyle: 'italic' }}>
                {t.content}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${t.accent}50`, flexShrink: 0 }}>
                  <img src={AVATARS[i]} alt={t.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#ffffff' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: t.accent, fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 3, fontWeight: 500 }}>{t.role}</div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${t.accent},transparent)`, opacity: 0.55 }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}