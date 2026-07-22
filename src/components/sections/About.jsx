// src/components/sections/About.jsx
import { useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import SectionTag from '../ui/SectionTag'
import Icons from '../ui/Icons'
import { ABOUT_FEATURES } from '../../utils/constants'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'
import { Helmet } from "react-helmet-async";
import { useGetPageSeoQuery } from '../../redux/api.jsx'

// ─── Image definitions ────────────────────────────────────────────────────────
const IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=85',
    alt: 'Team collaboration',
  },
  {
    src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=85',
    alt: 'Developer coding',
  },
  {
    src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=85',
    alt: 'Office meeting',
  },
]

const STATS = [
  { val: '50+', lbl: 'Projects' },
  { val: '30+', lbl: 'Clients' },
  { val: '100%', lbl: 'On Time' },
]

// ─── Per-breakpoint collage layout ───────────────────────────────────────────
function getImageStyle(i, bp) {
  const r = bp === 'desktop' ? 16 : 12
  const gap = bp === 'desktop' ? 6 : 5
  return [
    { top: 0, left: 0, width: `calc(52% - ${gap}px)`, height: '100%', borderRadius: r },
    { top: 0, right: 0, width: `calc(48% - ${gap}px)`, height: `calc(55% - ${gap}px)`, borderRadius: r },
    { bottom: 0, right: 0, width: `calc(48% - ${gap}px)`, height: `calc(45% - ${gap}px)`, borderRadius: r },
  ][i]
}

// ─── Collage image card (desktop / tablet) ────────────────────────────────────
function HoverImage({ img, i, imgStyle }) {
  const [hov, setHov] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const frameRef = useRef(null)

  const onMove = e => {
    if (frameRef.current) return
    const t = e.currentTarget
    frameRef.current = requestAnimationFrame(() => {
      const r = t.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
      setTilt({ x: dy * -5, y: dx * 5 })
      frameRef.current = null
    })
  }
  const onLeave = () => {
    if (frameRef.current) { cancelAnimationFrame(frameRef.current); frameRef.current = null }
    setTilt({ x: 0, y: 0 })
    setHov(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.12 * i, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onLeave}
      style={{
        position: 'absolute', ...imgStyle, overflow: 'hidden',
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hov ? 'scale(1.03) translateZ(14px)' : 'scale(1)'}`,
        transformStyle: 'preserve-3d',
        transition: hov
          ? 'transform 0.1s ease-out, box-shadow 0.3s ease'
          : 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s ease',
        boxShadow: hov
          ? '0 24px 64px rgba(0,0,0,0.7), 0 0 32px rgba(96,165,250,0.16)'
          : '0 16px 48px rgba(0,0,0,0.5)',
        border: `1px solid ${hov ? 'rgba(96,165,250,0.35)' : 'rgba(255,255,255,0.08)'}`,
        cursor: 'default', zIndex: hov ? 9 : i + 1,
      }}
    >
      <motion.img
        src={img.src} alt={img.alt} loading="lazy"
        animate={{ scale: hov ? 1.08 : 1, filter: hov ? 'brightness(0.68) saturate(1.3)' : 'brightness(0.85) saturate(1.1)' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(96,165,250,0.14),rgba(192,132,252,0.09))', mixBlendMode: 'overlay', opacity: hov ? 1 : 0.55, transition: 'opacity 0.3s' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(5,11,24,0.88) 0%,rgba(5,11,24,0.3) 50%,transparent 100%)', opacity: hov ? 1 : 0, transition: 'opacity 0.35s ease' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 12px', transform: hov ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{img.alt}</span>
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,rgba(96,165,250,0.8),transparent)', opacity: hov ? 1 : 0, transition: 'opacity 0.3s' }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at ${50 + tilt.y * 8}% ${50 + tilt.x * 8}%,rgba(255,255,255,0.07) 0%,transparent 60%)`, opacity: hov ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: 'none' }} />
    </motion.div>
  )
}

// ─── Mobile image slider ──────────────────────────────────────────────────────
function MobileSlider() {
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)       // 1 = forward, -1 = backward
  const dragStart = useRef(null)

  const goTo = useCallback((idx) => {
    setDir(idx > active ? 1 : -1)
    setActive(idx)
  }, [active])

  const prev = () => goTo(active === 0 ? IMAGES.length - 1 : active - 1)
  const next = () => goTo(active === IMAGES.length - 1 ? 0 : active + 1)

  // Touch swipe
  const onTouchStart = e => { dragStart.current = e.touches[0].clientX }
  const onTouchEnd = e => {
    if (dragStart.current === null) return
    const diff = dragStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    dragStart.current = null
  }

  const variants = {
    enter: d => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: d => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65 }}
      style={{ width: '100%', marginBottom: 24 }}
    >
      {/* Slide area */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          position: 'relative', width: '100%', height: 220,
          borderRadius: 16, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 12px 48px rgba(0,0,0,0.55)',
        }}
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={active}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <img
              src={IMAGES[active].src}
              alt={IMAGES[active].alt}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85) saturate(1.1)', display: 'block' }}
            />
            {/* Tint overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(96,165,250,0.14),rgba(192,132,252,0.09))', mixBlendMode: 'overlay' }} />
            {/* Bottom gradient + label */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 16px 14px', background: 'linear-gradient(to top,rgba(5,11,24,0.82),transparent)' }}>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                {IMAGES[active].alt}
              </span>
            </div>
            {/* Top accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,rgba(96,165,250,0.7),transparent)' }} />
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next buttons */}
        <button
          onClick={prev}
          style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(5,11,24,0.72)', backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.9)', fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 5, WebkitTapHighlightColor: 'transparent',
          }}
        >‹</button>
        <button
          onClick={next}
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(5,11,24,0.72)', backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.9)', fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 5, WebkitTapHighlightColor: 'transparent',
          }}
        >›</button>
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginTop: 12 }}>
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === active ? 22 : 7,
              height: 7, borderRadius: 4,
              background: i === active ? '#60a5fa' : 'rgba(255,255,255,0.2)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              WebkitTapHighlightColor: 'transparent',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ─── Feature box — supports both hover (desktop) and tap (mobile) ─────────────
function FeatureBox({ item, i, isMobile }) {
  const Icon = Icons[item.iconKey]
  const [hov, setHov] = useState(false)

  // Mobile: tap toggles the highlight; second tap elsewhere dismisses
  const handleTap = () => {
    if (isMobile) setHov(h => !h)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 + i * 0.08 }}
      // Desktop: hover events
      onMouseEnter={() => !isMobile && setHov(true)}
      onMouseLeave={() => !isMobile && setHov(false)}
      // Mobile: tap to activate
      onClick={handleTap}
      // Touch feedback
      whileTap={isMobile ? { scale: 0.97 } : {}}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: isMobile ? '11px 13px' : '14px 18px',
        borderRadius: 10,
        background: hov ? `${item.acc}12` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hov ? item.acc + '50' : 'rgba(255,255,255,0.07)'}`,
        backdropFilter: 'blur(8px)',
        boxShadow: hov ? `0 8px 32px ${item.acc}18, inset 0 1px 0 ${item.acc}20` : 'none',
        transform: hov && !isMobile ? 'translateX(6px)' : 'translateX(0)',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        cursor: isMobile ? 'pointer' : 'default',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      }}
    >
      {/* Icon box */}
      <div style={{
        width: isMobile ? 36 : 40, height: isMobile ? 36 : 40,
        borderRadius: 9, flexShrink: 0,
        background: hov ? `${item.acc}30` : `${item.acc}18`,
        border: `1px solid ${hov ? item.acc + '70' : item.acc + '30'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: item.acc,
        boxShadow: hov ? `0 0 18px ${item.acc}50` : 'none',
        transform: hov ? 'scale(1.1) rotate(-4deg)' : 'scale(1) rotate(0deg)',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <Icon />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: isMobile ? 13.5 : 14.5,
          fontFamily: 'var(--font-display)', fontWeight: 700,
          color: hov ? '#ffffff' : 'rgba(255,255,255,0.92)',
          marginBottom: 2, transition: 'color 0.2s',
        }}>{item.label}</div>
        <div style={{
          fontSize: isMobile ? 11.5 : 12.5,
          color: hov ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.55)',
          fontFamily: 'var(--font-body)', transition: 'color 0.2s',
        }}>{item.sub}</div>
      </div>

      {/* Arrow — desktop hover / mobile active */}
      <div style={{
        color: item.acc, fontSize: 15,
        opacity: hov ? 1 : 0,
        transform: hov ? 'translateX(0)' : 'translateX(-8px)',
        transition: 'all 0.25s ease', flexShrink: 0,
      }}>→</div>
    </motion.div>
  )
}


export default function About() {
  const ref = useRef(null)
  const { bp, isMobile, isTablet, isDesktop } = useBreakpoint()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [-60, 60]), { stiffness: 80, damping: 20 })
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [60, -60]), { stiffness: 80, damping: 20 })

  const sectionPadding = isMobile ? '52px 5%' : isTablet ? '60px 6%' : '48px 8% 72px'
  const collageHeight = isTablet ? 370 : 500

  const { data, isLoading } = useGetPageSeoQuery("about")
  let seo = data?.data

  return (
    <section id="about" ref={ref} style={{
      padding: sectionPadding,
      background: 'var(--bg)', position: 'relative', overflow: 'hidden',
    }}>
      <motion.div style={{ y: y1, position: 'absolute', top: -200, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(96,165,250,0.08),transparent 70%)', pointerEvents: 'none' }} />
      <motion.div style={{ y: y2, position: 'absolute', bottom: -150, left: -80, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,132,252,0.07),transparent 70%)', pointerEvents: 'none' }} />

      <div className="scroll-reveal" style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
        gap: isMobile ? 0 : isTablet ? 56 : 90,
        alignItems: 'center',
      }}>

        {/* ── LEFT — text ── */}
        <div>
          <SectionTag>About Riveyra</SectionTag>

          <motion.h2
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: isMobile ? 'clamp(26px,7vw,34px)' : isTablet ? 'clamp(28px,4vw,42px)' : 'clamp(32px,3.8vw,54px)',
              fontFamily: 'var(--font-display)', fontWeight: 800,
              lineHeight: 1.08, marginBottom: isMobile ? 16 : 24, color: '#ffffff',
            }}
          >
            We Build <span className="gt">Remarkable</span> Digital Experiences
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            style={{ fontSize: isMobile ? 14.5 : 16, lineHeight: 1.85, color: 'rgba(255,255,255,0.82)', marginBottom: 14, fontFamily: 'var(--font-body)' }}
          >
            Riveyra Infotech is Kanpur's premier software development company with over 7 years of proven excellence, delivering reliable and innovative digital solutions across India and beyond.
          </motion.p>

          {/* <motion.p
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.3 }}
            style={{ fontSize: isMobile ? 14.5 : 16, lineHeight:1.85, color:'rgba(255,255,255,0.82)', marginBottom: isMobile ? 24 : 40, fontFamily:'var(--font-body)' }}
          >
            From web and mobile to digital marketing and enterprise ERP — we are your all-in-one technology partner engineered for sustainable, measurable growth.
          </motion.p> */}

          {/* Mobile: image slider */}
          {isMobile && <MobileSlider />}

          {/* Feature boxes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 9 : 12, marginBottom: isMobile ? 24 : 42 }}>
            {ABOUT_FEATURES.map((item, i) => (
              <FeatureBox key={i} item={item} i={i} isMobile={isMobile} />
            ))}
          </div>

          {/* Mobile: stats grid */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 28 }}
            >
              {STATS.map(s => (
                <motion.div
                  key={s.lbl}
                  whileTap={{ scale: 0.95 }}
                  style={{ padding: '16px 6px', borderRadius: 12, textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(96,165,250,0.15)' }}
                >
                  <div style={{ fontSize: 24, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#60a5fa', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 5 }}>{s.lbl}</div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA buttons */}
          {/* <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row' }}
          >
            <button className="btn-primary" data-hover style={{ width: isMobile ? '100%' : 'auto' }}>
              Our Story <Icons.ArrowRight />
            </button>
            <button className="btn-ghost" data-hover style={{ width: isMobile ? '100%' : 'auto' }}>
              Watch Intro
            </button>
          </motion.div> */}
        </div>

        {/* ── RIGHT — image collage (tablet + desktop) ── */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              height: collageHeight,
              marginBottom: isTablet ? 64 : 0,
              perspective: 900,
            }}
          >
            {IMAGES.map((img, i) => (
              <HoverImage key={i} img={img} i={i} imgStyle={getImageStyle(i, bp)} />
            ))}

            {/* Pan-India tag */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.85, duration: 0.6 }}
              style={{
                position: 'absolute', top: '4%', right: '2%',
                padding: '7px 13px', borderRadius: 8,
                background: 'rgba(192,132,252,0.1)',
                border: '1px solid rgba(192,132,252,0.25)',
                backdropFilter: 'blur(12px)',
                zIndex: 10,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c084fc', boxShadow: '0 0 8px rgba(192,132,252,0.8)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 10, color: 'rgba(192,132,252,0.9)', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase' }}>Pan-India</span>
            </motion.div>

            {/* Tablet stats strip */}
            {isTablet && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                style={{ position: 'absolute', bottom: -56, left: 0, right: 0, display: 'flex', gap: 10 }}
              >
                {STATS.map(s => (
                  <div key={s.lbl} style={{ flex: 1, padding: '12px 8px', borderRadius: 10, textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(96,165,250,0.14)', backdropFilter: 'blur(8px)' }}>
                    <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#60a5fa', lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 4 }}>{s.lbl}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}