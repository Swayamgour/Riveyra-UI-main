// src/components/sections/Contact.jsx
import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Icons from '../ui/Icons'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'
import ContactForm from '../ContactForm.jsx'

const INFO = [
  { icon: Icons.Mail, label: 'Email Us', value: 'hr@riveyrainfotech.com ,   sales@riveyrainfotech.com', sub: 'We reply within 2 hours', color: '#60a5fa' },
  { icon: Icons.Phone, label: 'Call Us', value: '+91 9919888269', sub: 'Mon–Fri, 10AM–6:30PM IST', color: '#34d399' },
  { icon: Icons.MapPin, label: 'Visit Us', value: 'Kanpur, Uttar Pradesh STPI,8th floor, A-1/4 UPSIDC Complex, Lakhanpur, 208024.', sub: 'Also in Lucknow & Delhi', color: '#c084fc' },
]




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


          <ContactForm />
          
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