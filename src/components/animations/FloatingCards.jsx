// src/components/animations/FloatingCards.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionTag from '../ui/SectionTag'
import Icons from '../ui/Icons'
import { FLOATING_CARDS } from '../../utils/constants'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'

// ─── Card Data with Imagery & Evidence ─────────────────────────────────────────
const CARD_DATA = {
  'ISO Certified': {
    cardImg: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=85',
    workImg: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&q=90',
    workLabel: 'ISO 9001:2015 Certified Quality Management',
    desc: 'Adhering to rigorous international standards for software quality, security, and process delivery.'
  },
  'Startup India': {
    cardImg: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&q=85',
    workImg: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=90',
    workLabel: 'Recognised by Startup India, DPIIT',
    desc: 'Officially certified by the Government of India for innovative technology products and scalable digital infrastructure.'
  },
  '500+ Projects': {
    cardImg: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=85',
    workImg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=90',
    workLabel: '500+ Projects Delivered Pan-India',
    desc: 'High-impact solutions delivered across government, fintech, healthtech, real estate, and enterprise sectors.'
  },
  '7+ Years': {
    cardImg: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&q=85',
    workImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=90',
    workLabel: '7+ Years of Digital Excellence',
    desc: 'A proven track record of architectural longevity, continuous innovation, and cutting-edge engineering.'
  },
  '24/7 Support': {
    cardImg: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&q=85',
    workImg: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=900&q=90',
    workLabel: 'Round-the-Clock Dedicated Support',
    desc: 'Always-on DevOps monitoring, zero downtime SLAs, and rapid incident response teams.'
  },
  '100+ Team': {
    cardImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=85',
    workImg: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=90',
    workLabel: '100+ Expert Developers & Designers',
    desc: 'Elite cross-functional teams specializing in AI, full-stack, cloud computing, and UI/UX design systems.'
  },
}

// ─── 3D Flip Card Component ──────────────────────────────────────────────────
function FlipCard({ title, sub, iconKey, accent, i, isTouch }) {
  const Icon = Icons[iconKey]
  const data = CARD_DATA[title] || {}
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => !isTouch && setIsFlipped(true)}
      onMouseLeave={() => !isTouch && setIsFlipped(false)}
      onClick={() => setIsFlipped((prev) => !prev)}
      style={{
        perspective: 1200,
        width: '100%',
        height: 250,
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      {/* Flipping Container */}
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ─── FRONT FACE (0deg) ─── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 18,
            overflow: 'hidden',
            background: 'linear-gradient(160deg, rgba(14, 25, 48, 0.85) 0%, rgba(6, 12, 26, 0.95) 100%)',
            border: `1px solid ${isFlipped ? accent + '60' : 'rgba(255, 255, 255, 0.08)'}`,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: `0 14px 40px -10px rgba(0,0,0,0.6), 0 0 20px ${accent}0d`,
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          {/* Background Image with Dark Mask */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img
              src={data.cardImg}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.28,
                filter: 'saturate(1.2) brightness(0.7)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(180deg, ${accent}12 0%, rgba(6,12,28,0.92) 80%)`,
              }}
            />
          </div>

          {/* Top Beam Accent */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              zIndex: 2,
            }}
          />

          {/* Front Header: Icon + Badge */}
          <div style={{ position: 'relative', zIndex: 1, padding: '22px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${accent}25, ${accent}0a)`,
                border: `1px solid ${accent}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: accent,
                boxShadow: `0 0 20px ${accent}25`,
              }}
            >
              {Icon ? <Icon /> : null}
            </div>

            <div
              style={{
                fontSize: 10.5,
                fontFamily: 'var(--font-mono)',
                color: accent,
                background: `${accent}15`,
                border: `1px solid ${accent}30`,
                borderRadius: 20,
                padding: '4px 10px',
                letterSpacing: 1,
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              {sub}
            </div>
          </div>

          {/* Front Footer: Title + Flip Prompt */}
          <div style={{ position: 'relative', zIndex: 1, padding: '0 22px 20px' }}>
            <h3
              style={{
                fontSize: 21,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 6px',
                letterSpacing: '-0.3px',
              }}
            >
              {title}
            </h3>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span style={{ color: accent }}>↻</span>
              <span>{isTouch ? 'Tap to view proof' : 'Hover to flip'}</span>
            </div>
          </div>
        </div>

        {/* ─── BACK FACE (180deg) ─── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 18,
            overflow: 'hidden',
            background: 'linear-gradient(160deg, #091328 0%, #050b18 100%)',
            border: `1px solid ${accent}60`,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: `0 24px 60px -12px ${accent}35, 0 0 35px ${accent}20`,
          }}
        >
          {/* Work Image as Rich Hero Header */}
          <div style={{ height: 110, position: 'relative', overflow: 'hidden' }}>
            <img
              src={data.workImg}
              alt={data.workLabel}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.85) saturate(1.15)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(6,12,28,0.1) 0%, rgba(6,12,28,0.95) 100%)',
              }}
            />
            {/* Top Accent Beam */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${accent}, ${accent}44)`,
              }}
            />
            {/* Tag in Image */}
            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 12,
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: '#fff',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${accent}40`,
                padding: '2px 8px',
                borderRadius: 12,
                fontWeight: 600,
              }}
            >
              VERIFIED
            </div>
          </div>

          {/* Back Content Description */}
          <div style={{ padding: '12px 18px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
            <div>
              <div
                style={{
                  fontSize: 13.5,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1.35,
                  marginBottom: 6,
                }}
              >
                {data.workLabel}
              </div>
              <p
                style={{
                  fontSize: 11.5,
                  color: 'rgba(255, 255, 255, 0.65)',
                  lineHeight: 1.5,
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {data.desc}
              </p>
            </div>

            {/* Back Footer Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 8,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                marginTop: 6,
              }}
            >
              <span
                style={{
                  fontSize: 10.5,
                  color: accent,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                ✓ EXCELLENCE STANDARD
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>↺</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function FloatingCards() {
  const { isMobile, isTablet, isMobileOrTablet } = useBreakpoint()

  // Grid columns: 1 on mobile, 2 on tablet, 3 on desktop
  const cols = isMobile ? 1 : isTablet ? 2 : 3

  return (
    <section
      style={{
        padding: isMobile ? '0 5% 60px' : isTablet ? '0 6% 64px' : '0px 8% 72px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Watermark */}
      {!isMobileOrTablet && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            fontSize: 'clamp(80px,15vw,190px)',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            color: 'rgba(96,165,250,0.018)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            letterSpacing: -6,
            userSelect: 'none',
          }}
        >
          RIVEYRA
        </div>
      )}

      {/* Ambient Radial Glows */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '10%',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(96,165,250,0.06),transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(192,132,252,0.06),transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 56 }}>
          <div style={{ marginTop: '30px' }}>
            <SectionTag>Why Choose Us</SectionTag>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(28px,4vw,56px)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              color: '#ffffff',
            }}
          >
            Built on <span className="gt">Trust &amp; Excellence</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.6)',
              marginTop: 14,
              fontFamily: 'var(--font-body)',
              maxWidth: 480,
              margin: '14px auto 0',
            }}
          >
            {isMobileOrTablet ? 'Tap any card to reveal details' : 'Hover over any card to flip and explore our credentials'}
          </motion.p>
        </div>

        {/* Responsive Grid of Flip Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: isMobile ? 18 : 26,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {FLOATING_CARDS.map((card, i) => (
            <FlipCard
              key={card.title}
              {...card}
              i={i}
              isTouch={isMobileOrTablet}
            />
          ))}
        </div>
      </div>
    </section>
  )
}