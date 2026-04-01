// src/components/sections/Contact.jsx
import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Icons from '../ui/Icons'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'

const INFO = [
  { icon: Icons.Mail, label: 'Email Us', value: 'hello@riveyra.com', sub: 'We reply within 2 hours', color: '#60a5fa' },
  { icon: Icons.Phone, label: 'Call Us', value: '+91 9876 543 210', sub: 'Mon–Fri, 10AM–6:30PM IST', color: '#34d399' },
  { icon: Icons.MapPin, label: 'Visit Us', value: 'Kanpur, Uttar Pradesh', sub: 'Also in Lucknow & Delhi', color: '#c084fc' },
]

const SERVICES = [
  'Web Development', 'Mobile App', 'UI/UX Design',
  'Digital Marketing', 'ERP Solutions', 'AI & Automation', 'Other',
]

const BUDGETS = ['< ₹1 Lakh', '₹1–5 Lakh', '₹5–15 Lakh', '₹15–50 Lakh', '₹50 Lakh+']


function OrbCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf, t = 0
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 80 }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi: Math.random() * Math.PI,
      r: 160 + Math.random() * 40,
      size: 0.8 + Math.random() * 2.2,
      speed: 0.002 + Math.random() * 0.004,
      color: ['#60a5fa', '#c084fc', '#34d399'][Math.floor(Math.random() * 3)],
      opacity: 0.3 + Math.random() * 0.5,
    }))

    const draw = () => {
      const W = canvas.width, H = canvas.height
      const cx = W / 2, cy = H / 2
      ctx.clearRect(0, 0, W, H)
      t += 0.006

      particles.forEach(p => {
        p.theta += p.speed
        const x = cx + p.r * Math.sin(p.phi) * Math.cos(p.theta + t * 0.3)
        const y = cy + p.r * Math.sin(p.phi) * Math.sin(p.theta + t * 0.3) * 0.45
        const z = p.r * Math.cos(p.phi)
        const scale = (z + p.r) / (p.r * 2)
        const alpha = p.opacity * scale
        ctx.beginPath()
        ctx.arc(x, y, Math.max(0.3, p.size * scale), 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.round(alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()
      })

      const gradient = ctx.createRadialGradient(cx, cy, 100, cx, cy, 200)
      gradient.addColorStop(0, 'rgba(96,165,250,0)')
      gradient.addColorStop(0.5, 'rgba(96,165,250,0.04)')
      gradient.addColorStop(1, 'rgba(96,165,250,0)')
      ctx.beginPath()
      ctx.ellipse(cx, cy, 200, 90, 0, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(96,165,250,0.12)'
      ctx.lineWidth = 1
      ctx.stroke()

      const ig = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120)
      ig.addColorStop(0, 'rgba(96,165,250,0.07)')
      ig.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(cx, cy, 120, 0, Math.PI * 2)
      ctx.fillStyle = ig
      ctx.fill()

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}


function Field({ label, type = 'text', name, value, onChange, required }) {
  const [focused, setFocused] = useState(false)
  const filled = value && value.length > 0
  const active = focused || filled

  return (
    <div style={{ position: 'relative', marginBottom: 24 }}>
      <label style={{
        position: 'absolute', left: 16,
        top: active ? -10 : 17,
        fontSize: active ? 10.5 : 14,
        color: active ? '#60a5fa' : 'rgba(255,255,255,0.38)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: active ? 1.5 : 0.3,
        textTransform: active ? 'uppercase' : 'none',
        transition: 'all 0.22s cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: 'none', zIndex: 2,
        background: active ? 'linear-gradient(transparent 50%,rgba(8,15,30,1) 50%)' : 'transparent',
        padding: active ? '0 6px' : '0',
      }}>
        {label}{required && ' *'}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          rows={4}
          style={{
            width: '100%', padding: '16px', borderRadius: 10,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${focused ? '#60a5fa' : 'rgba(255,255,255,0.1)'}`,
            color: '#ffffff', fontFamily: 'var(--font-body)', fontSize: 14.5,
            resize: 'none', outline: 'none', lineHeight: 1.7,
            boxShadow: focused ? '0 0 0 3px rgba(96,165,250,0.1),inset 0 1px 0 rgba(255,255,255,0.03)' : 'inset 0 1px 0 rgba(255,255,255,0.03)',
            transition: 'all 0.22s', boxSizing: 'border-box',
          }}
        />
      ) : (
        <input
          type={type} name={name} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', padding: '16px', borderRadius: 10,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${focused ? '#60a5fa' : 'rgba(255,255,255,0.1)'}`,
            color: '#ffffff', fontFamily: 'var(--font-body)', fontSize: 14.5,
            outline: 'none',
            boxShadow: focused ? '0 0 0 3px rgba(96,165,250,0.1),inset 0 1px 0 rgba(255,255,255,0.03)' : 'inset 0 1px 0 rgba(255,255,255,0.03)',
            transition: 'all 0.22s', boxSizing: 'border-box',
          }}
        />
      )}
    </div>
  )
}


function TagSelect({ options, selected, onToggle, multi = false, color = '#60a5fa' }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => {
        const active = multi ? selected.includes(opt) : selected === opt
        return (
          <button key={opt} type="button" onClick={() => onToggle(opt)}
            style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 12,
              fontFamily: 'var(--font-mono)', fontWeight: 500,
              letterSpacing: 0.5, cursor: 'pointer', transition: 'all 0.2s',
              border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
              background: active ? `${color}18` : 'rgba(255,255,255,0.03)',
              color: active ? color : 'rgba(255,255,255,0.5)',
              boxShadow: active ? `0 0 12px ${color}22` : 'none',
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}


export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { isMobile, isTablet, isMobileOrTablet } = useBreakpoint()

  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' })
  const [services, setServices] = useState([])
  const [budget, setBudget] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleService = s => setServices(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])

  const handleSubmit = e => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => { setSending(false); setSent(true) }, 1800)
  }

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        background: 'var(--bg)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: isMobile ? 80 : 120,
      }}
    >

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(96,165,250,0.055) 0%,transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,132,252,0.045) 0%,transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(52,211,153,0.025) 0%,transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(96,165,250,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,0.025) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: isMobile ? '0 5% 80px' : isTablet ? '0 6% 90px' : '0 6% 100px',
        position: 'relative', zIndex: 1,
      }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: isMobile ? 48 : 80 }}>

          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}
          >
            <div style={{ width: 28, height: 1, background: '#60a5fa' }} />
            <span style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(96,165,250,0.7)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Get In Touch</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: isMobile ? 'clamp(36px,11vw,56px)' : 'clamp(48px,6vw,88px)',
              fontFamily: 'var(--font-display)', fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.08,
              letterSpacing: '-2px',
              marginBottom: 24,
              paddingBottom: '0.08em',
              overflow: 'visible',
            }}
          >
            Let's Build Something <span className="gt">Extraordinary</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.8 }}
            style={{
              fontSize: isMobile ? 16 : 18,
              color: 'rgba(255,255,255,0.75)',
              maxWidth: 580,
              fontFamily: 'var(--font-body)', lineHeight: 1.85,
            }}
          >
            Have a project in mind? Tell us everything. We'll turn your vision into a digital reality that exceeds every expectation.
          </motion.p>
        </div>

        {/* ── 3 INFO CARDS ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
            gap: isMobile ? 12 : 18,
            marginBottom: isMobile ? 40 : 64,
          }}
        >
          {INFO.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5, boxShadow: `0 20px 60px ${item.color}14` }}
              style={{
                padding: isMobile ? '18px 16px' : '28px 24px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${item.color}20`,
                backdropFilter: 'blur(12px)',
                position: 'relative', overflow: 'hidden',
                cursor: 'default',
                display: isMobile ? 'flex' : 'block',
                alignItems: isMobile ? 'center' : 'unset',
                gap: isMobile ? 16 : 0,
              }}
              data-hover
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${item.color},transparent)` }} />
              <div style={{
                width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                background: `${item.color}15`, border: `1px solid ${item.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: item.color,
                marginBottom: isMobile ? 0 : 16,
              }}>
                <item.icon />
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: item.color, fontFamily: 'var(--font-mono)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: isMobile ? 4 : 8, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: isMobile ? 14 : 15.5, color: '#ffffff', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}>{item.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}>{item.sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── FORM + RIGHT PANEL ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobileOrTablet ? '1fr' : '1fr 420px',
          gap: isMobile ? 32 : 48,
          alignItems: 'start',
        }}>

          {/* ── FORM ── */}
          <motion.div
            initial={{ opacity: 0, x: isMobileOrTablet ? 0 : -40, y: isMobileOrTablet ? 30 : 0 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'rgba(8,15,30,0.82)',
              border: '1px solid rgba(96,165,250,0.12)',
              borderRadius: 20,
              padding: isMobile ? '28px 20px' : isTablet ? '36px 32px' : '44px 40px',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', padding: '60px 0' }}
                >
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 14 }}
                    style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', border: '2px solid #34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36, boxShadow: '0 0 40px rgba(52,211,153,0.25)' }}
                  >✓</motion.div>
                  <h3 style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff', marginBottom: 12 }}>Message Sent!</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)', lineHeight: 1.8, marginBottom: 32 }}>
                    Thanks for reaching out. Our team will get back to you within 2 business hours.
                  </p>
                  <button className="btn-ghost" data-hover onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', company: '', message: '' }); setServices([]); setBudget('') }}>
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 32 }}>
                    <div style={{ fontSize: 11, color: '#60a5fa', fontFamily: 'var(--font-mono)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Step 1 of 3</div>
                    <h3 style={{ fontSize: isMobile ? 18 : 22, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Your Details</h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}>Tell us who you are so we can personalise our response.</p>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: isMobile ? 0 : '0 18px',
                  }}>
                    <Field label="Full Name" name="name" value={form.name} onChange={e => set('name', e.target.value)} required />
                    <Field label="Email Address" name="email" type="email" value={form.email} onChange={e => set('email', e.target.value)} required />
                    <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} />
                    <Field label="Company Name" name="company" value={form.company} onChange={e => set('company', e.target.value)} />
                  </div>

                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 11, color: '#60a5fa', fontFamily: 'var(--font-mono)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, marginTop: 8 }}>Step 2 — Services Needed</div>
                    <TagSelect options={SERVICES} selected={services} onToggle={toggleService} multi color="#60a5fa" />
                  </div>

                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 11, color: '#c084fc', fontFamily: 'var(--font-mono)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Step 3 — Estimated Budget</div>
                    <TagSelect options={BUDGETS} selected={budget} onToggle={b => setBudget(prev => prev === b ? '' : b)} color="#c084fc" />
                  </div>

                  <Field label="Tell us about your project" type="textarea" name="message" value={form.message} onChange={e => set('message', e.target.value)} required />

                  <button type="submit" className="btn-primary" data-hover
                    style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 14, letterSpacing: 0.5, position: 'relative', overflow: 'hidden' }}
                  >
                    {sending ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#020b18', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                        Sending…
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                        Send Message <Icons.ArrowRight />
                      </span>
                    )}
                  </button>

                  <p style={{ textAlign: 'center', marginTop: 16, fontSize: 11.5, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>
                    🔒 Your information is 100% confidential. We never share your data.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── RIGHT PANEL — hidden on mobile, shown on tablet & desktop ── */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, x: isTablet ? 0 : 40, y: isTablet ? 30 : 0 }}
              animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              <div style={{
                borderRadius: 20, overflow: 'hidden',
                background: 'rgba(8,15,30,0.7)',
                border: '1px solid rgba(96,165,250,0.12)',
                height: isTablet ? 260 : 340,
                position: 'relative',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.04)',
              }}>
                <OrbCanvas />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <div style={{ fontSize: 11, color: 'rgba(96,165,250,0.6)', fontFamily: 'var(--font-mono)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>Response Time</div>
                  <div style={{ fontSize: isTablet ? 40 : 52, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#60a5fa', lineHeight: 1, textShadow: '0 0 40px rgba(96,165,250,0.5)' }}>~2h</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', marginTop: 8 }}>Average first reply</div>
                </div>
                {[['top:12px', 'left:12px', 'borderTop', 'borderLeft'], ['top:12px', 'right:12px', 'borderTop', 'borderRight'], ['bottom:12px', 'left:12px', 'borderBottom', 'borderLeft'], ['bottom:12px', 'right:12px', 'borderBottom', 'borderRight']].map(([t, s, b1, b2], k) => (
                  <div key={k} style={{ position: 'absolute', [t.split(':')[0]]: t.split(':')[1], [s.split(':')[0]]: s.split(':')[1], width: 16, height: 16, [b1]: '1.5px solid rgba(96,165,250,0.4)', [b2]: '1.5px solid rgba(96,165,250,0.4)' }} />
                ))}
              </div>

              {[
                { val: '< 2 hrs', label: 'First Response', color: '#60a5fa' },
                { val: '500+', label: 'Projects Delivered', color: '#34d399' },
                { val: '98%', label: 'Client Satisfaction', color: '#c084fc' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 5 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: isTablet ? '14px 16px' : '18px 22px',
                    borderRadius: 14,
                    background: 'rgba(8,15,30,0.7)',
                    border: `1px solid ${s.color}18`,
                    backdropFilter: 'blur(12px)',
                    cursor: 'default',
                  }}
                  data-hover
                >
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: `${s.color}14`, border: `1px solid ${s.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, boxShadow: `0 0 10px ${s.color}` }} />
                  </div>
                  <div>
                    <div style={{ fontSize: isTablet ? 18 : 22, fontFamily: 'var(--font-display)', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 3 }}>{s.label}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)' }}><Icons.ArrowRight /></div>
                </motion.div>
              ))}

              <motion.a
                href="https://wa.me/+919919888269"
                target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9, duration: 0.7 }}
                whileHover={{ scale: 1.02 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: isTablet ? '14px 16px' : '18px 22px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg,rgba(37,211,102,0.12),rgba(37,211,102,0.06))',
                  border: '1px solid rgba(37,211,102,0.25)',
                  textDecoration: 'none', cursor: 'default',
                  boxShadow: '0 8px 32px rgba(37,211,102,0.08)',
                }}
                data-hover
              >
                <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>💬</div>
                <div>
                  <div style={{ fontSize: 14, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#ffffff' }}>Chat on WhatsApp</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)', marginTop: 2 }}>Instant reply during business hours</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 11, color: '#25d366', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>OPEN →</div>
              </motion.a>
            </motion.div>
          )}

          {/* ── Mobile-only: WhatsApp + quick stats below form ── */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {[
                  { val: '< 2h', label: 'Response', color: '#60a5fa' },
                  { val: '500+', label: 'Projects', color: '#34d399' },
                  { val: '98%', label: 'Satisfied', color: '#c084fc' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '14px 10px', borderRadius: 12, background: 'rgba(8,15,30,0.7)', border: `1px solid ${s.color}18`, textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontFamily: 'var(--font-display)', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <motion.a
                href="https://wa.me/+919919888269"
                target="_blank" rel="noopener noreferrer"
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 18px', borderRadius: 14,
                  background: 'linear-gradient(135deg,rgba(37,211,102,0.12),rgba(37,211,102,0.06))',
                  border: '1px solid rgba(37,211,102,0.25)',
                  textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(37,211,102,0.08)',
                }}
              >
                <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>💬</div>
                <div>
                  <div style={{ fontSize: 14, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#ffffff' }}>Chat on WhatsApp</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)', marginTop: 2 }}>Instant reply during business hours</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 11, color: '#25d366', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>OPEN →</div>
              </motion.a>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}