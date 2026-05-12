// src/pages/ServicesPage.jsx
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Icons from '../components/ui/Icons'
import { useBreakpoint } from '../hooks/useBreakpoint.jsx'
import { SERVICES } from '../components/data.jsx'
import { useNavigate } from 'react-router-dom'
import { useGetServicesQuery  , useGetServiceBySlugQuery} from '../redux/api.jsx'

// {SERVICES}

const PROCESS = [
  { num: '01', title: 'Discovery', desc: 'We learn your business, goals, constraints, and users before writing a single line of code.' },
  { num: '02', title: 'Strategy', desc: 'We define the technical approach, architecture, and delivery roadmap — aligned to your timeline and budget.' },
  { num: '03', title: 'Design', desc: 'Wireframes, prototypes, and design systems that are validated before development begins.' },
  { num: '04', title: 'Build', desc: 'Agile sprints with weekly demos. You see progress every week, not just at the end.' },
  { num: '05', title: 'Launch', desc: 'Deployment, QA, performance testing, and go-live support — we don\'t disappear at handoff.' },
  { num: '06', title: 'Grow', desc: 'Post-launch monitoring, iteration, and support. Most clients stay with us for 3+ years.' },
]

// ─── Service Card — equal height via flex column + push footer to bottom ──────
function ServiceCard({ svc, i, onSelect, isSelected, isMobile }) {
  const [hov, setHov] = useState(false)
  const active = hov || isSelected

  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.06, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      // onClick={() => onSelect(svc)}
      // onClick={() => navigate(svc.path)}

      style={{
        // ── KEY: fill the grid cell height so all cards in a row are equal ──
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: isMobile ? '24px 20px 28px' : '32px 28px 36px',
        borderRadius: 16,
        background: active ? `${svc.accent}08` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${active ? svc.accent + '50' : 'rgba(255,255,255,0.07)'}`,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: active ? 'translateY(-4px)' : 'none',
        boxShadow: active ? `0 20px 60px ${svc.accent}14, 0 0 0 1px ${svc.accent}20` : 'none',
        boxSizing: 'border-box',
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'rgba(8,14,28,0.9)',
        opacity: active ? 1 : 0,
        transition: 'opacity 0.3s',
      }} />

      {/* Always-on accent bar on touch devices */}
      <style>{`@media (hover: none) { .svc-top-bar { opacity: 1 !important; } }`}</style>

      {/* Icon */}
      <div style={{
        width: isMobile ? 44 : 52,
        height: isMobile ? 44 : 52,
        borderRadius: 12, marginBottom: isMobile ? 16 : 20,
        background: `${svc.accent}15`,
        border: `1px solid ${svc.accent}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: svc.accent, flexShrink: 0,
        boxShadow: active ? `0 0 24px ${svc.accent}30` : 'none',
        transform: active ? 'scale(1.08) rotate(-3deg)' : 'scale(1)',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {svc.icon}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: isMobile ? 'clamp(15px,4.5vw,17px)' : 17,
        fontFamily: 'var(--font-display)', fontWeight: 700,
        color: '#fff', marginBottom: 8, letterSpacing: '-0.2px',
        lineHeight: 1.3,
        flexShrink: 0,
      }}>
        {svc.title}
      </h3>

      {/* Tagline */}
      <p style={{
        fontSize: isMobile ? 11 : 12.5,
        color: svc.accent, fontFamily: 'var(--font-mono)',
        letterSpacing: isMobile ? 1 : 1.5,
        textTransform: 'uppercase', marginBottom: 12, opacity: 0.8,
        flexShrink: 0,
      }}>
        {svc.tagline}
      </p>

      {/* Desc — grows to fill available space so tags/CTA stay at bottom */}
      <p style={{
        fontSize: isMobile ? 'clamp(13px,3.5vw,13.5px)' : 13.5,
        lineHeight: 1.75,
        color: 'rgba(255,255,255,0.55)',
        marginBottom: 20,
        fontFamily: 'var(--font-body)',
        flex: 1,   // ← pushes everything below to card bottom
      }}>
        {svc.desc}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: isMobile ? 16 : 20, flexShrink: 0 }}>
        {svc.tags.map(t => (
          <span key={t} style={{
            fontSize: isMobile ? 'clamp(9px,2.4vw,10px)' : 10.5,
            fontFamily: 'var(--font-mono)', fontWeight: 500,
            padding: '3px 8px', borderRadius: 4,
            background: `${svc.accent}10`, color: svc.accent,
            border: `1px solid ${svc.accent}22`,
            whiteSpace: 'nowrap',
          }}>{t}</span>
        ))}
      </div>

      {/* Learn more — always visible on mobile */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600,
        color: svc.accent, letterSpacing: 1, textTransform: 'uppercase',
        opacity: isMobile ? 1 : active ? 1 : 0,
        transform: isMobile ? 'none' : active ? 'translateX(0)' : 'translateX(-8px)',
        transition: 'all 0.25s ease',
        flexShrink: 0,
        marginTop: isMobile ? 4 : 0,
      }}>
        Learn More
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </div>
    </motion.div>
  )
}

// ─── Service Detail Modal ─────────────────────────────────────────────────────
function ServiceModal({ svc, onClose }) {
  const { isMobile } = useBreakpoint()
  if (!svc) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(2,8,18,0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '20px' : '40px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 32 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(8,15,30,0.98)',
          border: `1px solid ${svc.accent}30`,
          borderRadius: 20,
          padding: isMobile ? '28px 24px' : '44px 40px',
          maxWidth: 640, width: '100%',
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px ${svc.accent}15`,
          position: 'relative',
        }}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: 20, right: 20,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 18,
        }}>×</button>

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '20px 20px 0 0', background: `linear-gradient(90deg,${svc.accent},transparent)` }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: `${svc.accent}15`, border: `1px solid ${svc.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: svc.accent, flexShrink: 0 }}>
            {svc.icon}
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', marginBottom: 4 }}>{svc.title}</h2>
            <span style={{ fontSize: 11, color: svc.accent, fontFamily: 'var(--font-mono)', letterSpacing: 2, textTransform: 'uppercase' }}>{svc.tagline}</span>
          </div>
        </div>

        <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(255,255,255,0.75)', marginBottom: 28, fontFamily: 'var(--font-body)' }}>{svc.longDesc}</p>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 28 }}>
          <div style={{ padding: '18px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 10, letterSpacing: 2.5, color: svc.accent, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 12 }}>Deliverables</div>
            {svc.deliverables.map(d => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: svc.accent, flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)' }}>{d}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '18px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 10, letterSpacing: 2.5, color: svc.accent, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 12 }}>Timeline</div>
            <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 800, color: svc.accent }}>{svc.timeline}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)', marginTop: 4 }}>Typical engagement</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
          {svc.tags.map(t => (
            <span key={t} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '5px 12px', borderRadius: 6, background: `${svc.accent}12`, color: svc.accent, border: `1px solid ${svc.accent}25` }}>{t}</span>
          ))}
        </div>

        <button className="btn-primary" data-hover style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
          Start This Project
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 8 }}>
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Process Step ─────────────────────────────────────────────────────────────
function ProcessStep({ step, i, total }) {
  const { isMobile } = useBreakpoint()
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.7 }}
      style={{ position: 'relative', display: 'flex', gap: isMobile ? 16 : 24, alignItems: 'flex-start' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(96,165,250,0.1)',
          border: '1px solid rgba(96,165,250,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: '#60a5fa', letterSpacing: 1,
        }}>{step.num}</div>
        {i < total - 1 && <div style={{ width: 1, flex: 1, minHeight: 40, background: 'linear-gradient(to bottom,rgba(96,165,250,0.2),transparent)', marginTop: 8 }} />}
      </div>
      <div style={{ paddingBottom: i < total - 1 ? (isMobile ? 32 : 40) : 0, flex: 1 }}>
        <div style={{ fontSize: 17, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>{step.title}</div>
        <div style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)' }}>{step.desc}</div>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const { isMobile, isTablet } = useBreakpoint()
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')
  const [hovered, setHovered] = useState(null)

  // const { data } = useGetServicesQuery()
  // const { data:slug } = useGetServiceBySlugQuery('')



  const categories = ['All', 'AI & Data', 'Development', 'Infrastructure', 'Design']
  const categoryMap = {
    'AI & Data': ['Artificial Intelligence & ML', 'Generative AI', 'Agentic AI Systems'],
    'Development': ['Web Development', 'Mobile Apps', 'Blockchain & Web3', 'ERP Solutions'],
    'Infrastructure': ['Cloud & DevOps', 'Cybersecurity'],
    'Design': ['UI/UX Design'],
  }

  const filtered = filter === 'All'
    ? SERVICES
    : SERVICES.filter(s => (categoryMap[filter] || []).includes(s.title))


  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ══════════════════════════════════════════
          HERO
          — reduced bottom padding to close gap to filter row
      ══════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        padding: isMobile
          ? '80px 5% 40px'
          : isTablet
            ? '120px 6% 52px'
            : '120px 8% 60px',         // ← was 96px bottom, now 60px
        overflow: 'hidden',
        background: 'rgba(8,14,28,0.9)',
      }}>
        {/* BG grid */}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4 }} />

        {/* Orbs */}
        <div style={{ position: 'absolute', top: '-5%', right: '5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(96,165,250,0.07),transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,0.06),transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}
          >
            <div style={{ width: 28, height: 1, background: '#60a5fa' }} />
            <span style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(96,165,250,0.7)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>What We Do</span>
          </motion.div>

          {/* ── HEADING: fixed lineHeight for mobile to stop overlap ── */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: isMobile ? 'clamp(32px,10vw,52px)' : 'clamp(48px,6vw,88px)',
              fontFamily: 'var(--font-display)', fontWeight: 800,
              // ── FIX: 0.96 causes overlap on mobile — use 1.1 for mobile ──
              lineHeight: isMobile ? 1.1 : 0.96,
              letterSpacing: isMobile ? '-1px' : '-2px',
              marginBottom: isMobile ? 16 : 20,
              color: '#fff',
            }}
          >
            Deep Expertise,<br /><span className="gt">Real Results</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            style={{
              fontSize: isMobile ? 14 : 18,
              lineHeight: 1.85,
              color: 'rgba(255,255,255,0.65)',
              maxWidth: 560, fontFamily: 'var(--font-body)',
              marginBottom: isMobile ? 28 : 36,
            }}
          >
            Nine specialisations. One unified team. We combine technical depth with strategic thinking to build digital products that move the needle.
          </motion.p>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', gap: isMobile ? 20 : 40, flexWrap: 'wrap' }}
          >
            {[
              { val: '9+', lbl: 'Services' },
              { val: '500+', lbl: 'Projects' },
              { val: '7+', lbl: 'Years' },
              { val: '98%', lbl: 'Satisfaction' },
            ].map(s => (
              <div key={s.lbl}>
                <div style={{ fontSize: isMobile ? 24 : 36, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#60a5fa', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>{s.lbl}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FILTER + SERVICE GRID
          — reduced top padding to close gap from hero
      ══════════════════════════════════════════ */}
      <section style={{
        padding: isMobile ? '32px 5% 64px' : '44px 8% 80px',  // ← top was 64/80, now 32/44
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>



          {/* Grid — align-items stretch so all cards in a row share the same height */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >


            <div className="srv-grid">
              {SERVICES?.map((s, i) => {
                const isHov = hovered === i
                return (
                  <motion.div
                    key={s.title}
                    className="srv-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    // onClick={() => navigate(s.path)}
                  >
                    {/* Top accent bar — always visible on mobile via CSS, hover-only on desktop */}
                    <div
                      className="srv-card-top-bar"
                      style={{ background: `linear-gradient(90deg, ${s.accent}, transparent)` }}
                    />

                    <div
                      className="srv-icon-wrap"
                      style={{
                        background: `${s.accent}14`,
                        border: `1px solid ${s.accent}30`,
                        color: s.accent,
                        boxShadow: isHov ? `0 0 20px ${s.accent}22` : 'none',
                      }}
                    >
                      {s.icon}
                    </div>

                    <h3 className="srv-title">{s.title}</h3>
                    <p className="srv-desc">{s.desc}</p>

                    <div className="srv-tags">
                      {s.tags.map(t => (
                        <span key={t} className="srv-tag" style={{ background: `${s.accent}10`, color: s.accent, border: `1px solid ${s.accent}22` }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Arrow — always visible on mobile (isMobile bypasses framer opacity:0),
                    hover-animated on desktop */}
                    <motion.div
                      className="srv-arrow"
                      animate={{
                        opacity: isMobile ? 1 : isHov ? 1 : 0,
                        x: isMobile ? 0 : isHov ? 0 : -8,
                      }}
                      transition={{ duration: 0.25 }}
                      style={{ color: s.accent, marginTop: isMobile ? 16 : 20 }}
                    >
                      Explore Service
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 8h10M9 4l4 4-4 4" />
                      </svg>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROCESS
      ══════════════════════════════════════════ */}
      <section style={{
        padding: isMobile ? '72px 5%' : '96px 8%',
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(96,165,250,0.07)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr',
            gap: isMobile ? 48 : 80,
            alignItems: 'start',
          }}>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 28, height: 1, background: '#60a5fa' }} />
                  <span style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(96,165,250,0.7)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>How We Work</span>
                </div>
                <h2 style={{ fontSize: 'clamp(28px,3.5vw,48px)', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', lineHeight: 1.08, marginBottom: 20 }}>
                  Our <span className="gt">Delivery</span><br />Process
                </h2>
                <p style={{ fontSize: 15.5, lineHeight: 1.85, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)' }}>
                  Every engagement follows the same disciplined process — from discovery to post-launch growth. No surprises, no handoff chaos.
                </p>
              </motion.div>
            </div>
            <div>
              {PROCESS.map((step, i) => (
                <ProcessStep key={i} step={step} i={i} total={PROCESS.length} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '72px 5%' : '96px 8%', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 style={{ fontSize: 'clamp(28px,4vw,60px)', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', lineHeight: 1.05, marginBottom: 20 }}>
            Not Sure Where to <span className="gt">Start?</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', maxWidth: 480, margin: '0 auto 40px', fontFamily: 'var(--font-body)', lineHeight: 1.8 }}>
            Book a free 30-minute discovery call. We'll help you figure out exactly what you need.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center' }}>
            <button className="btn-primary" data-hover style={{ fontSize: 15, padding: '14px 32px' }}>
              Book a Free Call
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 8 }}>
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
            <button className="btn-ghost" data-hover style={{ fontSize: 15, padding: '14px 32px' }}>
              View Our Work
            </button>
          </div>
        </motion.div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && <ServiceModal svc={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}