// src/pages/AboutPage.jsx
import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import Icons from '../components/ui/Icons'
import { ABOUT_FEATURES } from '../utils/constants'
import { useBreakpoint } from '../hooks/useBreakpoint.jsx'

const IMAGES = [
  { src:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=85', alt:'Team collaboration' },
  { src:'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=85', alt:'Developer coding'   },
  { src:'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=85', alt:'Office meeting'  },
  { src:'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=85', alt:'Strategy session'  },
]

const TIMELINE = [
  { year:'2016', title:'Founded in Kanpur',       desc:'Riveyra Infotech was born with a vision to deliver world-class digital solutions from the heart of India.' },
  { year:'2017', title:'First Enterprise Client', desc:'Secured our first enterprise-scale ERP deployment, marking the shift from startup to serious technology partner.' },
  { year:'2021', title:'AI Practice Launched',    desc:'Built a dedicated AI & ML team, pioneering intelligent automation for mid-market businesses across India.' },
  { year:'2023', title:'ISO 27001 Certified',     desc:'Achieved ISO 27001 certification — validating our commitment to information security at the highest level.' },
  { year:'2024', title:'Pan-India Presence',      desc:'Expanded operations to Lucknow and Delhi, serving 50+ active clients across 12 industry verticals.' },
  { year:'2025', title:'500+ Projects Delivered', desc:'Crossed the landmark of 500 successful project deliveries with a 98% client satisfaction score.' },
]

const STATS = [
  { val:'10+',  lbl:'Years of Excellence', color:'#60a5fa' },
  { val:'50+',  lbl:'Happy Clients',       color:'#34d399' },
  { val:'500+', lbl:'Projects Delivered',  color:'#c084fc' },
  { val:'98%',  lbl:'Satisfaction Rate',   color:'#fbbf24' },
]

const VALUES = [
  { icon:'⚡', title:'Speed Without Compromise', desc:"We move fast — but never at the cost of quality. Rapid delivery and production-grade code are not mutually exclusive." },
  { icon:'🔒', title:'Security First',            desc:'Every system we build is designed with security as a first-class concern, not an afterthought.' },
  { icon:'🎯', title:'Outcome-Driven',            desc:"We measure success by your business results, not just deliverables. If it doesn't move your metrics, it doesn't count." },
  { icon:'🤝', title:'Long-Term Partnership',     desc:"We don't disappear after launch. Our relationships outlast projects — most clients have been with us 3+ years." },
]

function AnimCounter({ val, color }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })
  const suffix = val.replace(/[0-9]/g, '')
  return (
    <span ref={ref} style={{ color }}>
      {inView ? val : '0' + suffix}
    </span>
  )
}

/* ── Hoverable Feature Row ───────────────────────────────────── */
function FeatureRow({ item, i }) {
  const [hov, setHov] = useState(false)
  const Icon = Icons[item.iconKey]
  return (
    <motion.div
      key={i}
      initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      data-hover
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 18px', borderRadius: 12,
        background: hov ? `${item.acc}0d` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hov ? item.acc + '45' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hov ? `0 8px 32px ${item.acc}18, inset 0 1px 0 ${item.acc}12` : 'none',
        transform: hov ? 'translateX(6px)' : 'translateX(0)',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'default',
      }}
    >
      {/* Icon box */}
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: hov ? `${item.acc}25` : `${item.acc}18`,
        border: `1px solid ${hov ? item.acc + '60' : item.acc + '30'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: item.acc,
        boxShadow: hov ? `0 0 16px ${item.acc}40` : 'none',
        transform: hov ? 'scale(1.1) rotate(-4deg)' : 'scale(1) rotate(0deg)',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <Icon />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 14, fontFamily: 'var(--font-display)', fontWeight: 700,
          color: hov ? '#fff' : 'rgba(255,255,255,0.9)',
          marginBottom: 2, transition: 'color 0.2s',
        }}>
          {item.label}
        </div>
        <div style={{ fontSize: 12, color: hov ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)', transition: 'color 0.2s' }}>
          {item.sub}
        </div>
      </div>

      {/* Arrow indicator — slides in on hover */}
      <div style={{
        color: item.acc,
        opacity: hov ? 1 : 0,
        transform: hov ? 'translateX(0)' : 'translateX(-8px)',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        flexShrink: 0,
      }}>
        <Icons.ArrowRight />
      </div>
    </motion.div>
  )
}

/* ── Hoverable Image Card ─────────────────────────────────────── */
function ImageCard({ img, i }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.7 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      data-hover
      style={{
        borderRadius: 14, overflow: 'hidden',
        border: `1px solid ${hov ? 'rgba(96,165,250,0.35)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: hov ? '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(96,165,250,0.15)' : '0 16px 48px rgba(0,0,0,0.5)',
        gridRow: i === 0 ? 'span 2' : undefined,
        position: 'relative',
        transform: hov ? 'scale(1.03) translateY(-4px)' : 'scale(1) translateY(0)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        zIndex: hov ? 2 : 1,
        cursor: 'default',
      }}
    >
      <img
        src={img.src} alt={img.alt} loading="lazy"
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          filter: hov ? 'brightness(0.95) saturate(1.25)' : 'brightness(0.82) saturate(1.05)',
          transform: hov ? 'scale(1.08)' : 'scale(1)',
          transition: 'all 0.55s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* Colour overlay — stronger on hover */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg,rgba(96,165,250,0.12),rgba(192,132,252,0.08))',
        mixBlendMode: 'overlay',
        opacity: hov ? 1 : 0.6,
        transition: 'opacity 0.4s',
      }} />

      {/* Bottom label that slides up on hover */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '20px 16px 14px',
        background: 'linear-gradient(to top, rgba(5,11,24,0.92) 0%, transparent 100%)',
        transform: hov ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {img.alt}
        </div>
      </div>

      {/* Corner glow accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg,#60a5fa,#c084fc,transparent)',
        opacity: hov ? 1 : 0,
        transition: 'opacity 0.3s',
      }} />
    </motion.div>
  )
}

/* ══ PAGE ════════════════════════════════════════════════════════ */
export default function AboutPage() {
  const { isMobile, isTablet } = useBreakpoint()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY       = useSpring(useTransform(scrollYProgress, [0, 1], [0, 120]), { stiffness: 60, damping: 20 })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  /* responsive shorthands */
  const px = isMobile ? '5%' : isTablet ? '6%' : '8%'
  const py = isMobile ? '72px' : '96px'

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', overflow: 'hidden' }}>

      {/* ══ HERO ═════════════════════════════════════════════════ */}
<section ref={heroRef} style={{
  position: 'relative',
  minHeight: isMobile ? 'unset' : '80vh',
  display: 'flex', alignItems: isMobile ? 'flex-start' : 'center',
  padding: isMobile ? `80px ${px} 60px` : `120px ${px} 80px`,
  overflow: 'hidden',
}}>
        <motion.div style={{ y: heroY, position: 'absolute', inset: -80, zIndex: 0 }}>
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=60" alt="" loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.12) saturate(0.8)' }} />
        </motion.div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(135deg,rgba(2,8,18,0.95) 0%,rgba(2,8,18,0.7) 50%,rgba(2,8,18,0.92) 100%)' }} />
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.3 }} />
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: isMobile ? 300 : 500, height: isMobile ? 300 : 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(96,165,250,0.08),transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: isMobile ? 250 : 400, height: isMobile ? 250 : 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,132,252,0.07),transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />

        <motion.div style={{ opacity: heroOpacity, position: 'relative', zIndex: 2, maxWidth: 800, width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}
          >
            <div style={{ width: 28, height: 1, background: '#60a5fa' }} />
            <span style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(96,165,250,0.7)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Our Story</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: isMobile ? 'clamp(36px,11vw,56px)' : 'clamp(48px,6vw,88px)',
              fontFamily: 'var(--font-display)', fontWeight: 800,
              lineHeight: 0.96, letterSpacing: '-2px',
              marginBottom: 28, color: '#fff',
            }}
          >
            Building <span className="gt">Remarkable</span><br />
            Digital Futures
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            style={{
              fontSize: isMobile ? 15 : 18, lineHeight: 1.85,
              color: 'rgba(255,255,255,0.75)',
              maxWidth: 580, fontFamily: 'var(--font-body)',
              marginBottom: isMobile ? 0 : 48,
            }}
          >
            Riveyra Infotech is Kanpur's premier software development company — 10+ years of transforming ambitious ideas into extraordinary digital products across India and beyond.
          </motion.p>

          {!isMobile && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn-primary" data-hover>Our Services <Icons.ArrowRight /></button>
              <button className="btn-ghost" data-hover>View Portfolio</button>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ══ STATS STRIP ══════════════════════════════════════════ */}
      <section style={{
        padding: isMobile ? '48px 5%' : `56px ${px}`,
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(96,165,250,0.08)',
        borderBottom: '1px solid rgba(96,165,250,0.08)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
          gap: isMobile ? '28px 16px' : 0,
        }}>
          {STATS.map((s, i) => (
            <motion.div key={s.lbl}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              style={{
                textAlign: 'center',
                borderRight: !isMobile && i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                padding: isMobile ? '0 8px' : '0 24px',
              }}
            >
              <div style={{ fontSize: isMobile ? 36 : 52, fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1 }}>
                <AnimCounter val={s.val} color={s.color} />
              </div>
              <div style={{ fontSize: isMobile ? 9.5 : 11, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 8 }}>{s.lbl}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ STORY + IMAGE GRID ═══════════════════════════════════ */}
      <section style={{ padding: `${py} ${px}`, maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box', width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr',
          gap: isMobile ? 48 : isTablet ? 56 : 80,
          alignItems: 'center',
        }}>
          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 28, height: 1, background: '#60a5fa' }} />
              <span style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(96,165,250,0.7)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Who We Are</span>
            </div>
            <h2 style={{ fontSize: isMobile ? 'clamp(24px,7vw,36px)' : 'clamp(28px,3.5vw,48px)', fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1.08, marginBottom: 20, color: '#fff' }}>
              More Than an Agency —<br /><span className="gt">A Growth Partner</span>
            </h2>
            <p style={{ fontSize: isMobile ? 14.5 : 16, lineHeight: 1.88, color: 'rgba(255,255,255,0.75)', marginBottom: 16, fontFamily: 'var(--font-body)' }}>
              Founded in 2016 in Kanpur, Riveyra Infotech started with a simple belief: that businesses in tier-2 cities deserve the same quality of technology as those in Mumbai or Bangalore.
            </p>
            <p style={{ fontSize: isMobile ? 14.5 : 16, lineHeight: 1.88, color: 'rgba(255,255,255,0.75)', marginBottom: 28, fontFamily: 'var(--font-body)' }}>
              Today, we're a full-stack technology company serving clients from startups to government enterprises — delivering web, mobile, AI, ERP, and cybersecurity solutions that actually move the needle.
            </p>

            {/* ── Feature rows with hover ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ABOUT_FEATURES.map((item, i) => (
                <FeatureRow key={i} item={item} i={i} />
              ))}
            </div>
          </motion.div>

          {/* ── Image grid with hover ── */}
          <motion.div
            initial={{ opacity: 0, scale: isMobile ? 1 : 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: isMobile ? '160px 160px' : isTablet ? '190px 190px' : '220px 220px',
              gap: isMobile ? 8 : 12,
            }}
          >
            {IMAGES.map((img, i) => (
              <ImageCard key={i} img={img} i={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ TIMELINE ═════════════════════════════════════════════ */}
      <section style={{
        padding: `${py} ${px}`,
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(96,165,250,0.07)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: isMobile ? 48 : 72 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 1, background: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.6))' }} />
              <span style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(96,165,250,0.65)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Our Journey</span>
              <div style={{ width: 32, height: 1, background: 'linear-gradient(90deg,rgba(96,165,250,0.6),transparent)' }} />
            </div>
            <h2 style={{ fontSize: isMobile ? 'clamp(24px,7vw,36px)' : 'clamp(26px,3.5vw,48px)', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', lineHeight: 1.08 }}>
              7 Years of <span className="gt">Building</span>
            </h2>
          </motion.div>

          <div style={{ position: 'relative' }}>
            {!isMobile && (
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom,transparent,rgba(96,165,250,0.2),transparent)', transform: 'translateX(-50%)' }} />
            )}
            {TIMELINE.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: isMobile ? 0 : (i % 2 === 0 ? -40 : 40), y: isMobile ? 24 : 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'row' : (i % 2 === 0 ? 'row' : 'row-reverse'),
                  gap: isMobile ? 16 : 0,
                  marginBottom: isMobile ? 24 : 48,
                  alignItems: 'flex-start',
                }}
              >
                <div style={{
                  flex: isMobile ? 1 : '0 0 calc(50% - 40px)',
                  marginLeft: !isMobile && i % 2 !== 0 ? 'auto' : undefined,
                  padding: isMobile ? '14px' : '24px 28px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(96,165,250,0.1)',
                  backdropFilter: 'blur(8px)',
                }}>
                  <div style={{ fontSize: 10, letterSpacing: 3, color: '#60a5fa', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{item.year}</div>
                  <div style={{ fontSize: isMobile ? 15 : 17, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: isMobile ? 13 : 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)' }}>{item.desc}</div>
                </div>
                {!isMobile && (
                  <div style={{ flex: '0 0 80px', display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#60a5fa', boxShadow: '0 0 16px rgba(96,165,250,0.6)', border: '3px solid rgba(5,11,24,1)' }} />
                  </div>
                )}
                {isMobile && (
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#60a5fa', boxShadow: '0 0 12px rgba(96,165,250,0.5)', border: '2px solid rgba(5,11,24,1)', flexShrink: 0, marginTop: 18 }} />
                )}
                {!isMobile && <div style={{ flex: '0 0 calc(50% - 40px)' }} />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VALUES ═══════════════════════════════════════════════ */}
      <section style={{ padding: `${py} ${px}`, maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 72 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 1, background: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.6))' }} />
            <span style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(96,165,250,0.65)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>What Drives Us</span>
            <div style={{ width: 32, height: 1, background: 'linear-gradient(90deg,rgba(96,165,250,0.6),transparent)' }} />
          </div>
          <h2 style={{ fontSize: isMobile ? 'clamp(24px,7vw,36px)' : 'clamp(26px,3.5vw,48px)', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', lineHeight: 1.08 }}>
            Our Core <span className="gt">Values</span>
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
          gap: isMobile ? 12 : 20,
        }}>
          {VALUES.map((v, i) => {
            const [hov, setHov] = useState(false)
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                data-hover
                style={{
                  padding: isMobile ? '22px 18px' : '28px 24px',
                  borderRadius: 16,
                  background: hov ? 'rgba(96,165,250,0.06)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${hov ? 'rgba(96,165,250,0.3)' : 'rgba(96,165,250,0.1)'}`,
                  backdropFilter: 'blur(8px)',
                  cursor: 'default',
                  transform: hov ? 'translateY(-6px)' : 'translateY(0)',
                  boxShadow: hov ? '0 24px 60px rgba(96,165,250,0.12)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Top accent line on hover */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: 'linear-gradient(90deg,#60a5fa,#c084fc,transparent)',
                  opacity: hov ? 1 : 0,
                  transition: 'opacity 0.3s',
                }} />
                <div style={{
                  fontSize: 32, marginBottom: 18,
                  display: 'inline-block',
                  transform: hov ? 'scale(1.2) rotate(-8deg)' : 'scale(1) rotate(0deg)',
                  transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                }}>
                  {v.icon}
                </div>
                <div style={{ fontSize: isMobile ? 15 : 16, fontFamily: 'var(--font-display)', fontWeight: 700, color: hov ? '#fff' : 'rgba(255,255,255,0.9)', marginBottom: 10, transition: 'color 0.2s' }}>{v.title}</div>
                <div style={{ fontSize: isMobile ? 13 : 14, lineHeight: 1.8, color: hov ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)', transition: 'color 0.2s' }}>{v.desc}</div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ══ BOTTOM CTA ═══════════════════════════════════════════ */}
      <section style={{ padding: `${py} ${px}`, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 style={{ fontSize: isMobile ? 'clamp(26px,8vw,44px)' : 'clamp(28px,4vw,60px)', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', lineHeight: 1.05, marginBottom: 16 }}>
            Ready to Build <span className="gt">Something Great?</span>
          </h2>
          <p style={{ fontSize: isMobile ? 15 : 17, color: 'rgba(255,255,255,0.6)', maxWidth: 480, margin: '0 auto 36px', fontFamily: 'var(--font-body)', lineHeight: 1.8 }}>
            Let's talk about your project. We respond within 2 hours.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center' }}>
            <button className="btn-primary" data-hover style={{ fontSize: isMobile ? 14 : 15, padding: isMobile ? '13px 28px' : '14px 32px', width: isMobile ? '100%' : 'auto' }}
              onClick={() => window.location.href = '/contact'}>
              Start a Project <Icons.ArrowRight />
            </button>
            <button className="btn-ghost" data-hover style={{ fontSize: isMobile ? 14 : 15, padding: isMobile ? '13px 28px' : '14px 32px', width: isMobile ? '100%' : 'auto' }}
              onClick={() => window.location.href = '/#portfolio'}>
              View Our Work
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  )
}