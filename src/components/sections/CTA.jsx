

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Icons from '../ui/Icons'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx';
import ContactForm from '../ContactForm.jsx';

// ─── Field wrapper — unchanged ────────────────────────────────────────────────
function Field({ label, children, focused, id }) {
  return (
    <div style={{ position: 'relative' }}>
      <label
        htmlFor={id}
        style={{
          display: 'block', fontSize: 10.5, letterSpacing: 2.5,
          textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
          color: focused ? 'rgba(96,165,250,0.85)' : 'rgba(255,255,255,0.38)',
          marginBottom: 8, transition: 'color 0.25s'
        }}
      >
        {label}
      </label>
      {children}
      {/* Animated underline */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, height: 1,
        width: focused ? '100%' : '0%',
        background: 'linear-gradient(90deg,#60a5fa,#a78bfa)',
        transition: 'width 0.35s cubic-bezier(0.16,1,0.3,1)'
      }} />
    </div>
  )
}

const inputBase = {
  width: '100%', background: 'transparent',
  border: 'none', borderBottom: '1px solid rgba(255,255,255,0.12)',
  padding: '10px 0 12px', color: '#fff', fontSize: 14,
  fontFamily: 'var(--font-body)', outline: 'none',
  caretColor: '#60a5fa', transition: 'border-color 0.25s', boxSizing: 'border-box'
}

export default function CTA() {
  const [form, setForm] = useState({ name: '', email: '', budget: '', message: '' })
  const [focused, setFocused] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { isMobile, isTablet } = useBreakpoint()

  const isStacked = isMobile || isTablet

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setSubmitted(true)
  }

  const contacts = [
    { Icon: Icons.Mail, label: 'hello@riveyra.com' },
    { Icon: Icons.Phone, label: '+91 9876 543 210' },
    { Icon: Icons.MapPin, label: 'Kanpur, India' },
  ]

  return (
    <section style={{ padding: 0, background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

      {/* ── Background — unchanged ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src="../../public/DGFASLI.png" alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.14) saturate(1.4) blur(3px)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(2,8,18,0.97) 0%,rgba(2,8,18,0.82) 50%,rgba(2,8,18,0.96) 100%)' }} />
      </div>

      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(96,165,250,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,0.025) 1px,transparent 1px)',
        backgroundSize: '64px 64px'
      }} />

      {/* Orbs */}
      <div style={{ position: 'absolute', top: '15%', left: '-2%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle,rgba(96,165,250,0.09),transparent 70%)', animation: 'pulse 7s infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', right: '8%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,132,252,0.09),transparent 70%)', animation: 'pulse 9s 1.5s infinite', pointerEvents: 'none' }} />

      {/* ── Layout grid — stacks on mobile/tablet ── */}
      <div className="scroll-reveal" style={{
        maxWidth: 1240, margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 8px',
        display: 'grid',
        gridTemplateColumns: isStacked ? '1fr' : '1fr 1fr',
        alignItems: 'stretch',
      }}>

        {/* ══ LEFT: CTA Content ══ */}
        <motion.div
          initial={{ opacity: 0, x: isStacked ? 0 : -36, y: isStacked ? 20 : 0 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            padding: isMobile ? '60px 5% 48px' : isTablet ? '64px 6% 48px' : '88px 60px 88px 8%',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            // Border between columns on desktop; horizontal divider when stacked
            borderRight: isStacked ? 'none' : '1px solid rgba(255,255,255,0.055)',
            borderBottom: isStacked ? '1px solid rgba(255,255,255,0.055)' : 'none',
          }}
        >
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
            <div style={{ width: 28, height: 1, background: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.7))' }} />
            <span style={{ fontSize: 10, letterSpacing: 5, color: 'rgba(96,165,250,0.65)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              Ready to Start?
            </span>
          </div>

          {/* Heading */}
          <h2 style={{
            fontSize: 'clamp(32px,4vw,64px)', fontFamily: 'var(--font-display)',
            fontWeight: 800, lineHeight: 1.05, marginBottom: 24, color: '#fff'
          }}>
            Let's Build<br />
            Something{' '}
            <span className="gt">Extraordinary</span>
          </h2>

          <p style={{
            fontSize: 15.5, lineHeight: 1.88, color: 'rgba(255,255,255,0.58)',
            marginBottom: 48, fontFamily: 'var(--font-body)', maxWidth: 400
          }}>
            Have a project in mind? Get in touch and let's turn your vision into a digital reality that exceeds every expectation.
          </p>

          {/* CTA Buttons — stack to full-width on mobile */}
          <div style={{
            display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 52,
            flexDirection: isMobile ? 'column' : 'row',
          }}>
            <button className="btn-primary" data-hover
              style={{ fontSize: 13.5, padding: '15px 44px', width: isMobile ? '100%' : 'auto' }}
            >
              Start Your Project <Icons.ArrowRight />
            </button>
            <button className="btn-ghost" data-hover
              style={{ fontSize: 13.5, padding: '14px 38px', width: isMobile ? '100%' : 'auto' }}
            >
              <Icons.Phone />&nbsp; Schedule a Call
            </button>
          </div>

          {/* Divider */}
          <div style={{ width: 48, height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 32 }} />

          {/* Contact chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {contacts.map(({ Icon, label }) => (
              <div
                key={label}
                data-hover
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 12,
                  fontSize: 13, padding: '10px 18px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(8px)',
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  transition: 'all 0.22s', width: isMobile ? '100%' : 'fit-content',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.08)'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.35)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
              >
                <span style={{ color: '#60a5fa', display: 'flex' }}><Icon /></span>
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ══ RIGHT: Query Form ══ */}
        <ContactForm />
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}