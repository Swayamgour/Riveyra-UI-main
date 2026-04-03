import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'
import { SERVICES } from '../data.jsx'
import { useNavigate } from 'react-router-dom'

// ─── Service data ─────────────────────────────────────────────────────────────
// {SERVICES}

const STYLE = `
  .srv-section {
    padding: 80px 6% 96px;
    background: #050B18;
    position: relative;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
  }
  @media (max-width: 1023px) {
    .srv-section { padding: 64px 6% 80px; }
  }
  @media (max-width: 767px) {
    .srv-section { padding: 60px 5% 72px; }
  }

  .srv-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0);
    background-size: 36px 36px;
    pointer-events: none;
  }

  /* ── GRID ── */
  .srv-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 2px;
    overflow: hidden;
  }
  @media (max-width: 900px) { .srv-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px) { .srv-grid { grid-template-columns: 1fr; } }

  /* ── CARD ── */
  .srv-card {
    padding: 36px 32px 40px;
    border-right: 1px solid rgba(255,255,255,0.07);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    cursor: default;
    position: relative;
    transition: background 0.35s ease;
    background: transparent;
    /* Ensure content never clips on scroll */
    overflow: visible;
    box-sizing: border-box;
  }
  @media (max-width: 767px) {
    .srv-card { padding: 24px 18px 30px; }
  }
  @media (max-width: 400px) {
    .srv-card { padding: 20px 14px 26px; }
  }

  /* ── BORDER RULES: 3-col desktop ── */
  .srv-card:nth-child(3n)         { border-right: none; }
  .srv-card:nth-last-child(-n+3)  { border-bottom: none; }

  /* ── BORDER RULES: 2-col tablet ── */
  @media (max-width: 900px) and (min-width: 561px) {
    .srv-card:nth-child(3n)        { border-right: 1px solid rgba(255,255,255,0.07); }
    .srv-card:nth-last-child(-n+3) { border-bottom: 1px solid rgba(255,255,255,0.07); }
    .srv-card:nth-child(2n)        { border-right: none; }
    .srv-card:nth-last-child(-n+2) { border-bottom: none; }
  }

  /* ── BORDER RULES: 1-col mobile ── */
  @media (max-width: 560px) {
    .srv-card:nth-child(3n),
    .srv-card:nth-child(2n)        { border-right: none; }
    .srv-card:nth-last-child(-n+3),
    .srv-card:nth-last-child(-n+2) { border-bottom: 1px solid rgba(255,255,255,0.07); }
    .srv-card:last-child           { border-bottom: none; }
    .srv-card                      { border-right: none; }
  }

  .srv-card:hover { background: rgba(255,255,255,0.03); }

  /* On touch/mobile — always show accent bar, remove hover bg flash */
  @media (hover: none) {
    .srv-card-top-bar { opacity: 1 !important; }
    .srv-card:hover   { background: transparent; }
  }

  .srv-card-top-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .srv-card:hover .srv-card-top-bar { opacity: 1; }

  .srv-icon-wrap {
    width: 48px; height: 48px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
    transition: transform 0.3s ease;
  }
  @media (max-width: 560px) {
    .srv-icon-wrap { width: 40px; height: 40px; margin-bottom: 14px; }
  }
  .srv-card:hover .srv-icon-wrap { transform: scale(1.08); }

  .srv-title {
    font-family: 'Plus Jakarta Sans';
    font-size: clamp(15px, 4vw, 18px);
    font-weight: 700;
    color: #fff;
    margin: 0 0 12px;
    letter-spacing: -0.2px;
  }

  .srv-desc {
    font-size: clamp(13px, 3.2vw, 14px);
    line-height: 1.75;
    color: rgba(255,255,255,0.55);
    margin: 0 0 20px;
  }

  .srv-tags { display: flex; flex-wrap: wrap; gap: 6px; }

  .srv-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(9px, 2.4vw, 10.5px);
    font-weight: 500;
    padding: 3px 8px;
    border-radius: 3px;
    transition: background 0.2s;
    /* Prevent tags from overflowing card on tiny screens */
    white-space: nowrap;
  }

  .srv-arrow {
    margin-top: 20px;
    display: flex; align-items: center; gap: 6px;
    font-family: 'Syne', sans-serif;
    font-size: 12.5px; font-weight: 700;
    letter-spacing: 0.3px;
    transition: opacity 0.3s, transform 0.3s;
  }
  /* Always show arrow on touch devices — framer opacity is overridden via isMobile prop in JSX */
  @media (hover: none) {
    .srv-arrow { opacity: 1 !important; transform: none !important; }
  }

  .srv-section-label {
    display: inline-flex; align-items: center; gap: 8px;
    // font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 500;
    color: #4F8EF7;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 16px;
    text-align: center;
  }
  @media (max-width: 560px) {
    .srv-section-label { font-size: 10px; letter-spacing: 1px; }
  }
  .srv-section-label::before {
    padding: 0 4px;
    content: '';
    width: 20px; height: 1.5px;
    background: #4F8EF7;
  }

  .srv-h2 {
    font-family: 'Plus Jakarta Sans';
    font-size: clamp(24px, 6vw, 48px);
    font-weight: 700;
    letter-spacing: -0.5px;
    line-height: 1.15;
  }
  .srv-h2 span { color: transparent; -webkit-text-stroke: 1.5px rgba(255,255,255,0.35); }

  .srv-sub {
    font-size: clamp(13.5px, 3.5vw, 16px);
    color: rgba(255,255,255,0.5);
    line-height: 1.8;
    max-width: 500px;
    margin: 0 0 56px;
    padding: 48px 8px;
    text-align: center;
  }
  @media (max-width: 767px) {
    .srv-sub { padding: 32px 8px; margin: 0 0 40px; }
  }
`

// Inject once
if (typeof document !== 'undefined' && !document.getElementById('srv-styles')) {
  const el = document.createElement('style')
  el.id = 'srv-styles'
  el.textContent = STYLE
  document.head.appendChild(el)
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Services() {
  const [hovered, setHovered] = useState(null)
  const { isMobile } = useBreakpoint()

  const navigate = useNavigate()

  return (
    <section id="services" className="srv-section">
      <div className="scroll-reveal" style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 8px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <p className="srv-section-label">What We Offer</p>

          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(28px,4vw,56px)', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff' }}
          >
            Deep Technical Expertise, <span className="gt">Supporting Modern Systems</span>
          </motion.h2>


          <p className="srv-sub">
            End-to-end solutions across AI, blockchain, cloud, and security — engineered to scale with your ambitions.
          </p>
        </motion.div>

        {/* Grid */}
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
                onClick={() => navigate(s.path)}
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
      </div>
    </section>
  )
}