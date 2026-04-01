

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionTag from '../ui/SectionTag'
import Icons from '../ui/Icons'
import { PORTFOLIO } from '../../utils/constants'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'

// ─── All project data — paths unchanged ───────────────────────────────────────
const PROJECT_DATA = {
  'DGFASLI': {
    workImg: './DGFASLI.png',
    detailImgs: ['./DGFASSLI1.png', './DGFASLI2.png'],
    year: '2023', tech: ['React', 'Node.js', 'AWS'],
  },
  'SDRF': {
    workImg: './SDRF.png',
    detailImgs: ['./SDRF1.png', './SDRF2.png'],
    year: '2023', tech: ['Custom ERP', 'PHP', 'MySQL'],
  },
  'NIEDO': {
    workImg: './NEIDO.png',
    detailImgs: ['./NEIDO1.png', './NEIDO2.png'],
    year: '2022', tech: ['Next.js', 'TailwindCSS', 'CMS'],
  },
  'Martolia Group': {
    workImg: './MARTOLIA.png',
    detailImgs: ['./Martolia1.png', './Martolia2.png'],
    year: '2024', tech: ['Flutter', 'Firebase', 'Maps API'],
  },
}

// ─── 3D Flip Card ─────────────────────────────────────────────────────────────
function ProjectCard({ item, i, totalInView, isMobile }) {
  const [flipped, setFlipped] = useState(false)
  const data = PROJECT_DATA[item.title] || {}

  // On mobile: reduce the dramatic fall — y:-180 looks fine on desktop
  // but causes visible top overflow on small screens
  const fallVariants = {
    hidden: {
      opacity: 0,
      y: isMobile ? -60 : -180,
      rotateX: isMobile ? -20 : -65,
      rotateZ: isMobile ? 0 : (i % 2 === 0 ? -12 : 12),
      scale: isMobile ? 0.92 : 0.75,
      z: isMobile ? -60 : -200,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      rotateZ: 0,
      scale: 1,
      z: 0,
      transition: {
        delay: i * 0.18,
        duration: 0.9,
        ease: [0.22, 1.2, 0.36, 1],
        opacity: { duration: 0.4, delay: i * 0.18 },
      },
    },
  }

  // Card height: shorter on mobile so it fits without scrolling too far
  const cardHeight = isMobile ? 380 : 420

  return (
    <motion.div
      variants={fallVariants}
      initial="hidden"
      animate={totalInView ? 'visible' : 'hidden'}
      style={{
        perspective: 1000,
        cursor: isMobile ? 'default' : 'none',
        height: cardHeight,
      }}
      data-hover
    >
      {/* Flip container */}
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', position: 'relative' }}
      >

        {/* ── FRONT ── */}
        <div
          onClick={() => setFlipped(true)}
          style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            borderRadius: 18, overflow: 'hidden',
            background: 'var(--card)', border: `1px solid ${item.color}22`,
            boxShadow: `0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)`,
            display: 'flex', flexDirection: 'column',
            cursor: 'pointer',
          }}
        >
          {/* Image — slightly shorter on mobile */}
          <div style={{ flex: `0 0 ${isMobile ? 180 : 220}px`, position: 'relative', overflow: 'hidden' }}>
            <img
              src={data.workImg} alt={item.title}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.78) saturate(1.15)', transition: 'transform 0.5s' }}
              onMouseEnter={e => !isMobile && (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseLeave={e => !isMobile && (e.currentTarget.style.transform = 'scale(1)')}
            />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 45%, rgba(6,12,28,0.92) 100%)` }} />

            {/* Category pill */}
            <div style={{ position: 'absolute', top: 14, left: 14, fontSize: 10, padding: '4px 12px', borderRadius: 100, background: 'rgba(5,11,24,0.75)', border: `1px solid ${item.color}50`, color: item.color, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: 1.5, backdropFilter: 'blur(8px)' }}>
              {item.cat}
            </div>

            {/* Year badge */}
            <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 10, padding: '4px 10px', borderRadius: 4, background: 'rgba(5,11,24,0.75)', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', backdropFilter: 'blur(8px)' }}>
              {data.year}
            </div>

            {/* Flip hint */}
            <div style={{ position: 'absolute', bottom: 14, right: 14, fontSize: 9.5, padding: '4px 10px', borderRadius: 4, background: `${item.color}18`, border: `1px solid ${item.color}35`, color: item.color, fontFamily: 'var(--font-mono)', letterSpacing: 1.5, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ display: 'inline-block', animation: 'pulse 1.5s infinite' }}>↻</span>
              {isMobile ? 'TAP' : 'FLIP'}
            </div>
          </div>

          {/* Text */}
          <div style={{ flex: 1, padding: isMobile ? '16px 18px 18px' : '20px 22px 22px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: isMobile ? 19 : 22, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff', marginBottom: 8, lineHeight: 1.1 }}>
              {item.title}
            </h3>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.68)', lineHeight: 1.75, fontFamily: 'var(--font-body)', flex: 1 }}>
              {item.desc}
            </p>
            <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
              {(data.tech || []).map(t => (
                <span key={t} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 4, background: `${item.color}10`, color: item.color, border: `1px solid ${item.color}25`, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          onClick={() => setFlipped(false)}
          style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 18, overflow: 'hidden',
            background: `linear-gradient(145deg, rgba(8,15,30,0.98), rgba(12,22,44,0.96))`,
            border: `1px solid ${item.color}35`,
            boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 60px ${item.color}12`,
            display: 'flex', flexDirection: 'column',
            padding: isMobile ? '18px' : '24px',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 10, color: item.color, fontFamily: 'var(--font-mono)', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 6 }}>Project Details</div>
          <h3 style={{ fontSize: isMobile ? 20 : 24, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff', marginBottom: 14 }}>{item.title}</h3>

          {/* 2 detail images */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {(data.detailImgs || []).map((src, k) => (
              <div key={k} style={{ height: isMobile ? 80 : 100, borderRadius: 8, overflow: 'hidden', border: `1px solid ${item.color}20` }}>
                <img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8) saturate(1.2)' }} />
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
            {[
              { val: data.year, lbl: 'Year' },
              { val: (data.tech || []).length + '+', lbl: 'Tech Stack' },
              { val: '100%', lbl: 'On Time' },
            ].map(s => (
              <div key={s.lbl} style={{ textAlign: 'center', padding: isMobile ? '8px 4px' : '10px 8px', borderRadius: 8, background: `${item.color}0c`, border: `1px solid ${item.color}18` }}>
                <div style={{ fontSize: isMobile ? 15 : 18, fontFamily: 'var(--font-display)', fontWeight: 800, color: item.color }}>{s.val}</div>
                <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 3 }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
            <button style={{ flex: 1, padding: '10px', borderRadius: 8, background: `linear-gradient(135deg, ${item.color}, ${item.color}88)`, border: 'none', color: '#050b18', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              View Project <Icons.ArrowRight />
            </button>
            <button
              onClick={e => { e.stopPropagation(); setFlipped(false) }}
              style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer', letterSpacing: 1 }}
            >
              ↩ BACK
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })
  const { isMobile, isTablet } = useBreakpoint()

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      style={{
        padding: isMobile ? '60px 5% 70px' : isTablet ? '70px 6% 80px' : '90px 8% 100px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=50"
          alt="" loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(90px) brightness(0.05) saturate(2)', opacity: 0.8 }}
        />
      </div>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4 }} />


      <div className="scroll-reveal" style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 48 : 80 }}>
          <SectionTag>Case Studies</SectionTag>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(28px,4vw,56px)', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff' }}
          >
            Our <span className="gt">Finest Work</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginTop: 16, maxWidth: 480, margin: '16px auto 0', fontFamily: 'var(--font-body)', lineHeight: 1.7 }}
          >
            {isMobile
              ? 'Tap any card to flip it and see full project details.'
              : 'Scroll down — cards fall into view. Click any card to flip it and see full project details.'}
          </motion.p>
        </div>

        {/* Cards grid
            KEY CHANGE: 1-col on mobile, 2-col on tablet/desktop
            perspective disabled on mobile — avoids overflow & 3D jank */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: isMobile ? 20 : 28,
          perspective: isMobile ? 'none' : 1400,
          perspectiveOrigin: '50% -20%',
        }}>
          {PORTFOLIO.map((item, i) => (
            <ProjectCard key={item.title} item={item} i={i} totalInView={inView} isMobile={isMobile} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          style={{ textAlign: 'center', marginTop: 60 }}
        >
          <button className="btn-ghost" data-hover style={{ fontSize: 13 }}>
            View All Projects <Icons.ArrowRight />
          </button>
        </motion.div>
      </div>
    </section>
  )
}