// src/pages/PortfolioPage.jsx
import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import Icons from '../components/ui/Icons'
import { useBreakpoint } from '../hooks/useBreakpoint.jsx'

import { useNavigate } from 'react-router-dom'
import { useGetProjectsQuery } from '../redux/api.jsx'





const CATS = ['All', 'Web Redesign', 'ERP System', 'Web Development', 'Mobile App']

const PAGE_STATS = [
  { val: '500+', label: 'Projects', color: '#60a5fa' },
  { val: '98%', label: 'On Time', color: '#34d399' },
  { val: '12+', label: 'Industries', color: '#c084fc' },
  { val: '7+', label: 'Years', color: '#fbbf24' },
]

/* ══════════════════════════════════════════════════════
   FILTER PILL
══════════════════════════════════════════════════════ */
function Pill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      data-hover
      style={{
        padding: '8px 18px',
        borderRadius: 100,
        fontSize: 10.5,
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        cursor: 'pointer',
        flexShrink: 0,
        whiteSpace: 'nowrap',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        border: `1px solid ${active ? 'rgba(96,165,250,0.5)' : 'rgba(255,255,255,0.08)'}`,
        background: active ? 'rgba(96,165,250,0.14)' : 'transparent',
        color: active ? '#60a5fa' : 'rgba(255,255,255,0.4)',
        boxShadow: active ? '0 0 18px rgba(96,165,250,0.12)' : 'none',
      }}
    >
      {label}
    </button>
  )
}

/* ══════════════════════════════════════════════════════
   PROJECT CARD  — hover only, no click/modal
══════════════════════════════════════════════════════ */
function ProjectCard({ project, i }) {
  const [hov, setHov] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.11, duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={()=> window.open(project.link, '_blank')}
      data-hover
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(8,14,28,0.9)',
        border: `1px solid ${hov ? project.color + '55' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hov
          ? `0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px ${project.color}14, 0 0 60px ${project.color}0e`
          : '0 12px 40px rgba(0,0,0,0.35)',
        transform: hov ? 'translateY(-10px)' : 'translateY(0)',
        transition: 'transform 0.38s cubic-bezier(0.16,1,0.3,1), box-shadow 0.38s cubic-bezier(0.16,1,0.3,1), border-color 0.28s',
        backdropFilter: 'blur(14px)',
        cursor: 'default',
      }}
    >
      {/* ── IMAGE ── */}
      <div style={{ position: 'relative', height: 210, overflow: 'hidden', flexShrink: 0 }}>

        {/* top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3, zIndex: 3,
          background: `linear-gradient(90deg, ${project.color}, ${project.color}44)`,
        }} />

        <img
          src={`${project?.workImg}`}
          alt={project.title}
          loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: hov ? 'brightness(0.9) saturate(1.3)' : 'brightness(0.65) saturate(1.0)',
            transform: hov ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform 0.55s cubic-bezier(0.16,1,0.3,1), filter 0.4s',
          }}
          onError={e => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.parentElement.style.background =
              `linear-gradient(135deg,${project.color}1a,rgba(8,14,28,0.95))`
          }}
        />

        {/* gradient to bleed into card body */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 45%,rgba(8,14,28,0.98) 100%)' }} />

        {/* colour tint on hover */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(140deg,${project.color}16,transparent 60%)`,
          opacity: hov ? 1 : 0,
          transition: 'opacity 0.4s',
        }} />

        {/* CAT pill — top left */}
        <div style={{
          position: 'absolute', top: 14, left: 14, zIndex: 4,
          fontSize: 12, padding: '5px 11px', borderRadius: 100,
          background: `${project.color}1a`, border: `1px solid ${project.color}55`,
          color: project.color, fontFamily: 'var(--font-mono)', fontWeight: 600,
          letterSpacing: 1.4, backdropFilter: 'blur(10px)',
        }}>
          {project.category}
        </div>

        {/* YEAR badge — top right */}
        <div style={{
          position: 'absolute', top: 14, right: 14, zIndex: 4,
          fontSize: 12, padding: '5px 10px', borderRadius: 8,
          background: 'rgba(4,9,20,0.8)', color: 'rgba(255,255,255,0.42)',
          fontFamily: 'var(--font-mono)', backdropFilter: 'blur(10px)',
        }}>
          {project.year}
        </div>

        {/* client + duration — bottom left, slides up on hover */}
        <div style={{
          position: 'absolute', bottom: 14, left: 14, zIndex: 4,
          fontSize: 10, color: 'rgba(255,255,255,0.55)',
          fontFamily: 'var(--font-mono)', letterSpacing: 1,
          opacity: hov ? 1 : 0,
          transform: hov ? 'translateY(0)' : 'translateY(6px)',
          transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}>
          {project.client} · {project.duration}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>

        {/* radial glow behind content */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 110%,${project.color}0a,transparent 65%)`,
          opacity: hov ? 1 : 0, transition: 'opacity 0.4s',
        }} />

        {/* title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
          <h3 style={{
            fontSize: 21, fontFamily: 'var(--font-display)', fontWeight: 800,
            color: '#fff', lineHeight: 1.08,
          }}>
            {project.title}
          </h3>
          {/* arrow — slides right on hover */}
          <div style={{
            color: project.color, flexShrink: 0, marginTop: 3,
            opacity: hov ? 1 : 0.2,
            transform: hov ? 'translateX(4px)' : 'translateX(0)',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <Icons.ArrowRight />
          </div>
        </div>

        {/* subtitle */}
        {/* <div style={{
          fontSize: 12, color: project.color, fontFamily: 'var(--font-body)',
          marginBottom: 12, opacity: 0.82, letterSpacing: 0.2,
        }}>
          {project.subtitle}
        </div> */}

        {/* description */}
        <p style={{
          fontSize: 13.5, color: 'rgba(255,255,255,0.58)', lineHeight: 1.78,
          fontFamily: 'var(--font-body)', flex: 1, marginBottom: 16,
        }}>
          {project.description}
        </p>

        {/* impact bullets — appear on hover */}
        {/* <div style={{
          display: 'flex', flexDirection: 'column', gap: 6,
          marginBottom: 16,
          maxHeight: hov ? 80 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.38s cubic-bezier(0.16,1,0.3,1)',
        }}>
          {project.impact?.map((imp , index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                background: project.color, boxShadow: `0 0 7px ${project.color}`,
              }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.62)', fontFamily: 'var(--font-body)' }}>
                {imp}
              </span>
            </div>
          ))}
        </div> */}

        {/* tech tags */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {project.tech.slice(0, 3)?.map((t , index) => (
            <span key={index} style={{
              fontSize: 12, padding: '3px 9px', borderRadius: 5,
              background: `${project.color}10`, color: project.color,
              border: `1px solid ${project.color}28`,
              fontFamily: 'var(--font-mono)', fontWeight: 600,
              transition: 'background 0.2s, border-color 0.2s',
              ...(hov ? { background: `${project.color}1e`, borderColor: `${project.color}45` } : {}),
            }}>
              {t}
            </span>
          ))}
          {project?.tech?.length > 3 && (
            <span style={{
              fontSize: 12, padding: '3px 8px', borderRadius: 5,
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.28)',
              fontFamily: 'var(--font-mono)',
            }}>
              +{project.tech.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* ── BOTTOM COLOUR LINE — grows on hover ── */}
      <div style={{
        height: 2, flexShrink: 0,
        background: `linear-gradient(90deg,${project.color},${project.color}44,transparent)`,
        transform: hov ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.42s cubic-bezier(0.16,1,0.3,1)',
      }} />
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════
   STAT STRIP
══════════════════════════════════════════════════════ */
function StatStrip({ isMobile }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.018)',
      borderTop: '1px solid rgba(96,165,250,0.07)',
      borderBottom: '1px solid rgba(96,165,250,0.07)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: isMobile ? '36px 5%' : '48px 7%',
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
        gap: isMobile ? '24px 16px' : 0,
      }}>
        {PAGE_STATS?.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.65 }}
            style={{
              textAlign: 'center',
              borderRight: !isMobile && i < PAGE_STATS.length - 1
                ? '1px solid rgba(255,255,255,0.05)' : 'none',
              padding: isMobile ? '0' : '0 24px',
            }}
          >
            <div style={{
              fontSize: isMobile ? 34 : 48,
              fontFamily: 'var(--font-display)', fontWeight: 800,
              lineHeight: 1, color: s.color,
              textShadow: `0 0 28px ${s.color}50`,
            }}>
              {s.val}
            </div>
            <div style={{
              fontSize: isMobile ? 9 : 10.5,
              color: 'rgba(255,255,255,0.38)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: 2.5, textTransform: 'uppercase',
              marginTop: 8,
            }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */
export default function PortfolioPage() {
  const { isMobile, isTablet } = useBreakpoint()
  const [activeCat, setActiveCat] = useState('All')

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 90]), { stiffness: 60, damping: 20 })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  const { data } = useGetProjectsQuery()

  let PROJECTS = data?.data || []

  const px = isMobile ? '5%' : isTablet ? '6%' : '7%'

  const filtered = activeCat === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.cat === activeCat)

  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          position: 'relative', overflow: 'hidden',
          minHeight: isMobile ? 'unset' : '72vh',
          display: 'flex', alignItems: 'center',
          padding: isMobile ? '110px 5% 60px' : isTablet ? `130px 6% 72px` : `130px ${px} 80px`,
        }}
      >
        {/* parallax BG */}
        <motion.div style={{ y: heroY, position: 'absolute', inset: -80, zIndex: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=50"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.07) saturate(0.5)' }}
          />
        </motion.div>

        {/* overlays */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(135deg,rgba(2,8,18,0.97) 0%,rgba(2,8,18,0.72) 55%,rgba(2,8,18,0.96) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(96,165,250,0.024) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,0.024) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />

        {/* ambient orbs */}
        <div style={{ position: 'absolute', top: '-20%', right: '-4%', width: isMobile ? 260 : 560, height: isMobile ? 260 : 560, borderRadius: '50%', background: 'radial-gradient(circle,rgba(96,165,250,0.09),transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-4%', width: isMobile ? 200 : 440, height: isMobile ? 200 : 440, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,132,252,0.07),transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />

        <motion.div style={{ opacity: heroOpacity, position: 'relative', zIndex: 2, maxWidth: 780, width: '100%' }}>

          {/* eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}
          >
            <div style={{ width: 28, height: 1, background: '#60a5fa' }} />
            <span style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(96,165,250,0.7)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Case Studies</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: isMobile ? 'clamp(36px,11vw,58px)' : 'clamp(52px,6.5vw,88px)',
              fontFamily: 'var(--font-display)', fontWeight: 800,
              lineHeight: 0.94, letterSpacing: '-2.5px',
              marginBottom: 26, color: '#fff',
            }}
          >
            Work That<br />
            Speaks <span className="gt">Louder</span><br />
            Than Words.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.8 }}
            style={{
              fontSize: isMobile ? 15 : 17,
              color: 'rgba(255,255,255,0.62)',
              maxWidth: 500, lineHeight: 1.85,
              fontFamily: 'var(--font-body)',
            }}
          >
            500+ projects delivered across government, healthcare, real estate, and enterprise.
            Hover any card to explore the details.
          </motion.p>
        </motion.div>
      </section>

      {/* ══ STATS ═══════════════════════════════════════════════ */}
      <StatStrip isMobile={isMobile} />

      {/* ══ FILTER BAR ══════════════════════════════════════════ */}
      <div style={{
        position: 'sticky', top: 64, zIndex: 30,
        padding: `20px ${px} 0`,
        background: 'linear-gradient(to bottom, var(--bg) 70%, transparent)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.65 }}
            style={{
              display: 'flex', gap: isMobile ? 6 : 8,
              overflowX: 'auto', scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
              padding: isMobile ? '10px 12px' : '11px 18px',
              borderRadius: 100,
              background: 'rgba(8,14,28,0.88)',
              border: '1px solid rgba(96,165,250,0.1)',
              backdropFilter: 'blur(20px)',
              width: 'fit-content', maxWidth: '100%',
            }}
          >
            {CATS?.map((cat , index) => (
              <Pill key={index} label={cat} active={activeCat === cat} onClick={() => setActiveCat(cat)} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══ PROJECTS GRID ═══════════════════════════════════════ */}
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: isMobile ? `36px 5% 80px` : isTablet ? `44px 6% 90px` : `48px ${px} 100px`,
        boxSizing: 'border-box', width: '100%',
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {filtered.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '100px 0',
                color: 'rgba(255,255,255,0.2)',
                fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: 3,
              }}>
                NO PROJECTS IN THIS CATEGORY
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : isTablet
                    ? 'repeat(2, 1fr)'
                    : 'repeat(3, 1fr)',
                gap: isMobile ? 16 : isTablet ? 20 : 24,
              }}>
                {filtered?.map((p, i) => (
                  <ProjectCard key={i} project={p} i={i} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ══ BOTTOM CTA ══════════════════════════════════════════ */}
      <section style={{
        padding: isMobile ? '64px 5%' : isTablet ? '80px 6%' : `88px ${px}`,
        borderTop: '1px solid rgba(96,165,250,0.07)',
        background: 'rgba(5,10,22,0.96)',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%,rgba(96,165,250,0.06),transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(96,165,250,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,0.02) 1px,transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.6))' }} />
            <span style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(96,165,250,0.65)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Start Your Project</span>
            <div style={{ width: 32, height: 1, background: 'linear-gradient(90deg,rgba(96,165,250,0.6),transparent)' }} />
          </div>

          <h2 style={{
            fontSize: isMobile ? 'clamp(26px,8vw,40px)' : 'clamp(34px,4.2vw,60px)',
            fontFamily: 'var(--font-display)', fontWeight: 800,
            lineHeight: 1.02, letterSpacing: '-1.5px', marginBottom: 16,
          }}>
            Your Project Could Be <span className="gt">Next.</span>
          </h2>

          <p style={{
            fontSize: isMobile ? 14.5 : 17,
            color: 'rgba(255,255,255,0.5)',
            maxWidth: 460, margin: '0 auto 36px',
            fontFamily: 'var(--font-body)', lineHeight: 1.8,
          }}>
            Let's build something that makes the list. We respond within 2 hours.
          </p>

          <div style={{
            display: 'flex', gap: 14, justifyContent: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
          }}>
            <button
              className="btn-primary" data-hover
              style={{
                fontSize: isMobile ? 14 : 15,
                padding: isMobile ? '14px 28px' : '15px 36px',
                width: isMobile ? '100%' : 'auto',
              }}
              onClick={() => navigate('/contact')}
            >
              Start a Project <Icons.ArrowRight />
            </button>
            <button
              className="btn-ghost" data-hover
              style={{
                fontSize: isMobile ? 14 : 15,
                padding: isMobile ? '14px 28px' : '15px 36px',
                width: isMobile ? '100%' : 'auto',
              }}
              // onClick={() => window.location.href = '/about'}
              onClick={() => navigate('/about')}

            >
              About Us
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  )
}