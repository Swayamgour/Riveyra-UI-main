// src/pages/CareerPage.jsx
import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import Icons from '../components/ui/Icons'
import { useBreakpoint } from '../hooks/useBreakpoint.jsx'
import { useGetCareersQuery, useGetPageSeoQuery } from '../redux/api.jsx'
import { useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet-async";
import SEO from '../components/SEO.jsx'

/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */

const OPENINGS = [
  {
    id: 'fe-dev',
    title: 'Frontend Developer',
    dept: 'Engineering',
    type: 'Full-Time',
    mode: 'Hybrid',
    location: 'Kanpur, India',
    exp: '1–3 Years',
    color: '#60a5fa',
    skills: ['React', 'JavaScript', 'CSS', 'Figma'],
    desc: "Build pixel-perfect, high-performance web interfaces for government and enterprise clients. You'll work directly with our design team to ship products used by millions.",
    perks: ['Flexible hours', 'MacBook Pro', 'Health cover'],
  },
  {
    id: 'be-dev',
    title: 'Backend Developer',
    dept: 'Engineering',
    type: 'Full-Time',
    mode: 'On-site',
    location: 'Kanpur, India',
    exp: '2–4 Years',
    color: '#34d399',
    skills: ['Node.js', 'PHP', 'MySQL', 'AWS'],
    desc: 'Architect and build scalable APIs, ERP systems, and cloud infrastructure powering mission-critical government and enterprise platforms.',
    perks: ['Competitive pay', 'Annual bonus', 'Learning budget'],
  },
  {
    id: 'flutter-dev',
    title: 'Flutter Developer',
    dept: 'Mobile',
    type: 'Full-Time',
    mode: 'Hybrid',
    location: 'Kanpur, India',
    exp: '1–3 Years',
    color: '#c084fc',
    skills: ['Flutter', 'Dart', 'Firebase', 'REST APIs'],
    desc: 'Craft beautiful, performant cross-platform apps for Android and iOS. Our mobile products are used by thousands of users every day.',
    perks: ['Remote-friendly', 'Stock options', 'Gym allowance'],
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Designer',
    dept: 'Design',
    type: 'Full-Time',
    mode: 'Hybrid',
    location: 'Kanpur, India',
    exp: '1–3 Years',
    color: '#fbbf24',
    skills: ['Figma', 'Prototyping', 'Research', 'Motion'],
    desc: "Design intuitive experiences for complex government and enterprise products. You'll own full design flows from user research through to polished handoff.",
    perks: ['Creative freedom', 'Conf tickets', 'MacBook Pro'],
  },
  {
    id: 'seo',
    title: 'SEO & Growth Specialist',
    dept: 'Marketing',
    type: 'Full-Time',
    mode: 'On-site',
    location: 'Kanpur, India',
    exp: '1–2 Years',
    color: '#f87171',
    skills: ['SEO', 'Google Ads', 'Analytics', 'Content'],
    desc: 'Drive organic growth and digital visibility for Riveyra and our clients. Combine technical SEO, content strategy, and paid media to deliver measurable ROI.',
    perks: ['Performance bonus', 'Flexible hours', 'Health cover'],
  },
  {
    id: 'pm',
    title: 'Project Manager',
    dept: 'Operations',
    type: 'Full-Time',
    mode: 'On-site',
    location: 'Kanpur, India',
    exp: '3–5 Years',
    color: '#38bdf8',
    skills: ['Agile', 'JIRA', 'Client Mgmt', 'Risk Mgmt'],
    desc: "Lead cross-functional teams to deliver complex technology projects on time and on budget. You'll be the bridge between clients, designers, and developers.",
    perks: ['Leadership track', 'Annual bonus', 'Laptop provided'],
  },
]





const DEPTS = ['All', 'Engineering', 'Mobile', 'Design', 'Marketing', 'Operations']

const CULTURE_ITEMS = [
  { icon: 'Rocket', title: 'Move Fast', desc: 'We ship real products to real users. Speed + quality, not excuses.', color: '#60a5fa' },
  { icon: 'Star', title: 'Own Your Work', desc: 'No micromanagement. You own your domain and your outcomes.', color: '#fbbf24' },
  { icon: 'Team', title: 'Grow Together', desc: 'Monthly learning sessions, mentorship, and dedicated L&D budgets.', color: '#34d399' },
  { icon: 'Trophy', title: 'Be Recognised', desc: 'Outstanding work is celebrated loudly — bonuses, shoutouts, and more.', color: '#c084fc' },
]

const BENEFITS = [
  { icon: '💻', label: 'MacBook / Device', sub: 'Latest hardware for every team member' },
  { icon: '🏥', label: 'Health Insurance', sub: 'Full family cover from day one' },
  { icon: '📚', label: 'Learning Budget', sub: '₹15,000/year for courses & conferences' },
  { icon: '⏰', label: 'Flexible Hours', sub: 'Async-friendly, results-driven culture' },
  { icon: '🚀', label: 'Annual Bonus', sub: 'Performance-linked incentives every year' },
  { icon: '🤝', label: 'Team Offsites', sub: 'Quarterly retreats to recharge and bond' },
]

const PROCESS = [
  { num: '01', title: 'Apply Online', desc: 'Send us your resume and a short note about why you want to join.' },
  { num: '02', title: 'Screening Call', desc: 'A 20-min chat with HR to learn about you and answer your questions.' },
  { num: '03', title: 'Tech Round', desc: 'A practical task or technical interview relevant to your role.' },
  { num: '04', title: 'Final Interview', desc: 'Meet the team lead and founder. Culture fit, vision, and offer.' },
]

/* ══════════════════════════════════════════════════════
   FILTER PILL
══════════════════════════════════════════════════════ */
function Pill({ label, active, onClick }) {
  return (
    <button onClick={onClick} data-hover style={{
      padding: '8px 18px', borderRadius: 100, fontSize: 10.5,
      fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: 1.2,
      textTransform: 'uppercase', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
      transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
      border: `1px solid ${active ? 'rgba(96,165,250,0.5)' : 'rgba(255,255,255,0.08)'}`,
      background: active ? 'rgba(96,165,250,0.14)' : 'transparent',
      color: active ? '#60a5fa' : 'rgba(255,255,255,0.4)',
      boxShadow: active ? '0 0 18px rgba(96,165,250,0.12)' : 'none',
    }}>
      {label}
    </button>
  )
}

/* ══════════════════════════════════════════════════════
   JOB CARD
══════════════════════════════════════════════════════ */
function JobCard({ job, i }) {
  const [hov, setHov] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const navigate = useNavigate()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.1, duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      data-hover
      style={{
        borderRadius: 20, overflow: 'hidden',
        background: 'rgba(8,14,28,0.9)',
        border: `1px solid ${hov ? job?.accent + '55' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hov
          ? `0 32px 80px rgba(0,0,0,0.55), 0 0 60px ${job?.accent}0e`
          : '0 12px 40px rgba(0,0,0,0.35)',
        transform: hov ? 'translateY(-10px)' : 'translateY(0)',
        transition: 'transform 0.38s cubic-bezier(0.16,1,0.3,1), box-shadow 0.38s, border-color 0.28s',
        backdropFilter: 'blur(14px)',
        display: 'flex', flexDirection: 'column',
        cursor: 'default',
        position: 'relative',
      }}
    >
      {/* top accent bar — grows on hover */}
      <div style={{
        height: 3, flexShrink: 0,
        background: `linear-gradient(90deg,${job?.accent},${job?.accent}44,transparent)`,
        transform: hov ? 'scaleX(1)' : 'scaleX(0.35)',
        transformOrigin: 'left',
        transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
      }} />

      {/* radial bg glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 0% 0%,${job?.accent}0a,transparent 60%)`,
        opacity: hov ? 1 : 0, transition: 'opacity 0.4s',
      }} />

      <div style={{ padding: '22px 24px 26px', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>

        {/* dept badge + mode badge */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          {/* <span style={{
            fontSize: 9.5, padding: '4px 11px', borderRadius: 100,
            background: `${job?.accent}1a`, border: `1px solid ${job?.accent}50`,
            color: job?.accent, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: 1.4,
          }}>{job?.description}</span> */}
          {/* <span style={{
            fontSize: 9.5, padding: '4px 11px', borderRadius: 100,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)', letterSpacing: 1.2,
          }}>{job?.mode}</span> */}
          <span style={{
            fontSize: 9.5, padding: '4px 11px', borderRadius: 100,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)', letterSpacing: 1.2,
          }}>{job?.type}</span>
        </div>

        {/* title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
          <h3 style={{ fontSize: 20, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
            {job?.title}
          </h3>
          <div style={{
            color: job?.accent, flexShrink: 0, marginTop: 4,
            opacity: hov ? 1 : 0.2,
            transform: hov ? 'translateX(4px)' : 'translateX(0)',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <Icons.ArrowRight />
          </div>
        </div>

        {/* meta line */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.42)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {job?.location}
          </span>
          <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.42)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            {job?.experience}
          </span>
        </div>

        <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.58)', lineHeight: 1.78, fontFamily: 'var(--font-body)', flex: 1, marginBottom: 16 }}>
          {job?.description}
        </p>

        {/* perks — slide in on hover */}
        <div style={{
          maxHeight: hov ? 72 : 0, overflow: 'hidden',
          transition: 'max-height 0.38s cubic-bezier(0.16,1,0.3,1)',
          marginBottom: hov ? 16 : 0,
        }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {job?.benefits?.map((p, i) => (
              <span key={i} style={{
                fontSize: 10.5, padding: '4px 10px', borderRadius: 6,
                background: `${job?.accent}12`, color: job?.accent,
                border: `1px solid ${job?.accent}30`,
                fontFamily: 'var(--font-body)', fontWeight: 600,
              }}>✓ {p}</span>
            ))}
          </div>
        </div>

        {/* skills + apply */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', flex: 1 }}>
            {job?.requirements?.map((s, i) => (
              <span key={i} style={{
                fontSize: 9.5, padding: '3px 9px', borderRadius: 5,
                background: hov ? `${job?.accent}1e` : `${job?.accent}10`,
                color: job?.accent,
                border: `1px solid ${hov ? job?.accent + '45' : job?.accent + '28'}`,
                fontFamily: 'var(--font-mono)', fontWeight: 600,
                transition: 'all 0.25s',
              }}>{s}</span>
            ))}
          </div>
          <button
            className="btn-primary"
            data-hover
            onClick={() => navigate('/Apply', {
              state: {
                job: {
                  id: job?._id,   // ✅ FIX
                  title: job?.title,
                  location: job?.location,
                  dept: job?.dept,
                }
              }
            })}
            // onClick={() => window.location.href = '/contact'}
            style={{
              fontSize: 11.5, padding: '8px 16px', flexShrink: 0,
              background: `linear-gradient(135deg,${job?.accent},${job?.accent}99)`,
              color: '#050b18',
              opacity: hov ? 1 : 0.7,
              transform: hov ? 'scale(1.04)' : 'scale(1)',
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            Apply Now
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════
   CULTURE CARD
══════════════════════════════════════════════════════ */
function CultureCard({ item, i }) {
  const [hov, setHov] = useState(false)
  const IconComp = Icons[item.icon] || Icons.Star

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: i * 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      data-hover
      style={{
        padding: '28px 24px', borderRadius: 18,
        background: 'rgba(8,14,28,0.88)',
        border: `1px solid ${hov ? item.color + '50' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hov ? `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${item.color}0e` : '0 8px 28px rgba(0,0,0,0.3)',
        transform: hov ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.38s cubic-bezier(0.16,1,0.3,1)',
        position: 'relative', overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* top line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${item.color},${item.color}44)`, opacity: hov ? 1 : 0, transition: 'opacity 0.3s' }} />
      {/* radial glow */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 0% 0%,${item.color}09,transparent 60%)`, opacity: hov ? 1 : 0, transition: 'opacity 0.4s', pointerEvents: 'none' }} />

      <div style={{
        width: 48, height: 48, borderRadius: 14, marginBottom: 18,
        background: hov ? `${item.color}22` : `${item.color}12`,
        border: `1px solid ${hov ? item.color + '55' : item.color + '25'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: item.color,
        transform: hov ? 'scale(1.1) rotate(-4deg)' : 'scale(1) rotate(0)',
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <IconComp />
      </div>
      <h3 style={{ fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{item.title}</h3>
      <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.58)', lineHeight: 1.75, fontFamily: 'var(--font-body)' }}>{item.desc}</p>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════
   BENEFIT ITEM
══════════════════════════════════════════════════════ */
function BenefitItem({ item, i }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: i * 0.08, duration: 0.7 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 16,
        padding: '18px 20px', borderRadius: 14,
        background: hov ? 'rgba(96,165,250,0.06)' : 'rgba(8,14,28,0.6)',
        border: `1px solid ${hov ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateX(6px)' : 'translateX(0)',
        cursor: 'default',
      }}
    >
      <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
      <div>
        <div style={{ fontSize: 14, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', marginBottom: 3 }}>{item.label}</div>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>{item.sub}</div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */
export default function CareerPage() {
  const { isMobile, isTablet } = useBreakpoint()
  const [activeDept, setActiveDept] = useState('All')

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 90]), { stiffness: 60, damping: 20 })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  const { data: career } = useGetCareersQuery()

  const { data, isLoading } = useGetPageSeoQuery("career")
  let seo = data?.data?.seo

  let OPENINGS = career?.data || []

  // console.log(OPENINGS)

  const px = isMobile ? '5%' : isTablet ? '6%' : '7%'

  const filtered = activeDept === 'All'
    ? OPENINGS
    : OPENINGS?.filter(j => j.dept === activeDept)

  return (
    <>
      {!isLoading &&
        (<SEO
          title={seo?.metaTitle}
          description={seo?.metaDescription}
          keywords={seo?.keywords}
          canonical={seo?.canonical}
          robots={seo?.robots}

          openGraph={seo?.openGraph}
          twitter={seo?.twitter}

          schema={seo?.schema}
        />)
      }




      <div style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>

        {/* ══ HERO ════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          style={{
            position: 'relative', overflow: 'hidden',
            minHeight: isMobile ? 'unset' : '72vh',
            display: 'flex', alignItems: 'center',
            padding: isMobile ? '110px 5% 64px' : isTablet ? `130px 6% 72px` : `130px ${px} 80px`,
          }}
        >
          {/* parallax BG */}
          <motion.div style={{ y: heroY, position: 'absolute', inset: -80, zIndex: 0 }}>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=50"
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.07) saturate(0.5)' }}
            />
          </motion.div>

          {/* overlays */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(135deg,rgba(2,8,18,0.97) 0%,rgba(2,8,18,0.72) 55%,rgba(2,8,18,0.96) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(96,165,250,0.024) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,0.024) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />

          {/* ambient orbs */}
          <div style={{ position: 'absolute', top: '-20%', right: '-4%', width: isMobile ? 260 : 560, height: isMobile ? 260 : 560, borderRadius: '50%', background: 'radial-gradient(circle,rgba(96,165,250,0.09),transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-10%', left: '-4%', width: isMobile ? 200 : 440, height: isMobile ? 200 : 440, borderRadius: '50%', background: 'radial-gradient(circle,rgba(52,211,153,0.07),transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />

          <motion.div style={{ opacity: heroOpacity, position: 'relative', zIndex: 2, maxWidth: 780, width: '100%' }}>

            {/* eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}
            >
              <div style={{ width: 28, height: 1, background: '#60a5fa' }} />
              <span style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(96,165,250,0.7)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Join Our Team</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: isMobile ? 'clamp(36px,11vw,58px)' : 'clamp(52px,6.5vw,88px)',
                fontFamily: 'var(--font-display)', fontWeight: 800,
                lineHeight: 1.1, letterSpacing: '-2.5px',
                marginBottom: 26,
                paddingBottom: '0.1em',
              }}
            >
              Build The Future<br />
              With <span className="gt">Riveyra.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.8 }}
              style={{ fontSize: isMobile ? 15 : 17, color: 'rgba(255,255,255,0.62)', maxWidth: 500, lineHeight: 1.85, fontFamily: 'var(--font-body)', marginBottom: isMobile ? 28 : 36 }}
            >
              We're a fast-growing tech company building real products for real impact. We hire curious, passionate people who want to do the best work of their lives.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              style={{ display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row' }}
            >
              <button
                className="btn-primary" data-hover
                style={{ fontSize: 14, padding: '13px 28px', width: isMobile ? '100%' : 'auto' }}
                onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See Open Roles <Icons.ArrowRight />
              </button>
              <button
                className="btn-ghost" data-hover
                style={{ fontSize: 14, padding: '13px 28px', width: isMobile ? '100%' : 'auto' }}
                onClick={() => window.location.href = '/about'}
              >
                About Riveyra
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* ══ CULTURE ═════════════════════════════════════════════ */}
        <section style={{
          padding: isMobile ? '64px 5%' : isTablet ? '72px 6%' : `80px ${px}`,
          background: 'rgba(255,255,255,0.016)',
          borderTop: '1px solid rgba(96,165,250,0.07)',
          borderBottom: '1px solid rgba(96,165,250,0.07)',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>

            {/* section header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}
            >
              <div style={{ width: 28, height: 1, background: '#34d399' }} />
              <span style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(52,211,153,0.7)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Life at Riveyra</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: isMobile ? 'clamp(26px,8vw,38px)' : 'clamp(30px,3.5vw,50px)',
                fontFamily: 'var(--font-display)', fontWeight: 800,
                lineHeight: 1.05, letterSpacing: '-1.5px',
                maxWidth: 560, marginBottom: 48,
              }}
            >
              A Culture Built for <span className="gt2">Builders.</span>
            </motion.h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
              gap: isMobile ? 14 : 20,
            }}>
              {CULTURE_ITEMS?.map((item, i) => <CultureCard key={i} item={item} i={i} />)}
            </div>
          </div>
        </section>

        {/* ══ BENEFITS ════════════════════════════════════════════ */}
        <section style={{ padding: isMobile ? '64px 5%' : isTablet ? '72px 6%' : `80px ${px}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 72, alignItems: 'center' }}>

              {/* left — copy */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}
                >
                  <div style={{ width: 28, height: 1, background: '#c084fc' }} />
                  <span style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(192,132,252,0.7)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Perks & Benefits</span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontSize: isMobile ? 'clamp(26px,8vw,38px)' : 'clamp(28px,3.2vw,46px)',
                    fontFamily: 'var(--font-display)', fontWeight: 800,
                    lineHeight: 1.05, letterSpacing: '-1.5px', marginBottom: 20,
                  }}
                >
                  We Take Care of <span className="gt3">Our People.</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  style={{ fontSize: isMobile ? 14.5 : 16, color: 'rgba(255,255,255,0.58)', lineHeight: 1.85, fontFamily: 'var(--font-body)', maxWidth: 420 }}
                >
                  From day one you get everything you need to do your best work — no bureaucracy, no compromise.
                </motion.p>
              </div>

              {/* right — benefits grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: isMobile ? 10 : 12 }}>
                {BENEFITS.map((b, i) => <BenefitItem key={i} item={b} i={i} />)}
              </div>
            </div>
          </div>
        </section>

        {/* ══ OPENINGS ════════════════════════════════════════════ */}
        <section
          id="openings"
          style={{
            padding: isMobile ? '0 0 80px' : `0 0 100px`,
            background: 'rgba(5,10,22,0.96)',
            borderTop: '1px solid rgba(96,165,250,0.07)',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '64px 5% 0' : isTablet ? '72px 6% 0' : `80px ${px} 0` }}>

            {/* header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}
            >
              <div style={{ width: 28, height: 1, background: '#60a5fa' }} />
              <span style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(96,165,250,0.7)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Open Positions</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'flex-end',
                justifyContent: 'space-between', gap: 16, marginBottom: 36,
              }}
            >
              <h2 style={{
                fontSize: isMobile ? 'clamp(26px,8vw,38px)' : 'clamp(30px,3.5vw,50px)',
                fontFamily: 'var(--font-display)', fontWeight: 800,
                lineHeight: 1.05, letterSpacing: '-1.5px',
              }}>
                {filtered.length} Role{filtered.length !== 1 ? 's' : ''}{' '}
                <span className="gt">Available</span>
              </h2>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.42)', fontFamily: 'var(--font-mono)', letterSpacing: 1, flexShrink: 0 }}>
                {activeDept === 'All' ? 'All departments' : activeDept}
              </p>
            </motion.div>

            {/* filter bar — centered */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
              <motion.div
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.65 }}
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
                {DEPTS.map((d, index) => (
                  <Pill key={index} label={d} active={activeDept === d} onClick={() => setActiveDept(d)} />
                ))}
              </motion.div>
            </div>

            {/* job cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDept}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {filtered.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: 3 }}>
                    NO OPENINGS IN THIS DEPARTMENT
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
                    gap: isMobile ? 16 : isTablet ? 20 : 24,
                  }}>
                    {filtered?.map((job, i) => <JobCard key={i} job={job} i={i} />)}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ══ PROCESS ═════════════════════════════════════════════ */}
        <section style={{
          padding: isMobile ? '64px 5%' : isTablet ? '72px 6%' : `80px ${px}`,
          borderTop: '1px solid rgba(96,165,250,0.07)',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>

            <div style={{ textAlign: 'center', marginBottom: isMobile ? 44 : 56 }}>
              <motion.div
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}
              >
                <div style={{ width: 32, height: 1, background: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.6))' }} />
                <span style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(96,165,250,0.65)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Hiring Process</span>
                <div style={{ width: 32, height: 1, background: 'linear-gradient(90deg,rgba(96,165,250,0.6),transparent)' }} />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontSize: isMobile ? 'clamp(24px,7vw,36px)' : 'clamp(28px,3.2vw,46px)',
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  lineHeight: 1.05, letterSpacing: '-1.5px',
                }}
              >
                Simple. Fast. <span className="gt">Transparent.</span>
              </motion.h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
              gap: isMobile ? 16 : 20, position: 'relative',
            }}>
              {/* connector line — desktop only */}
              {!isMobile && !isTablet && (
                <div style={{ position: 'absolute', top: 32, left: '12.5%', right: '12.5%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.2),rgba(96,165,250,0.2),transparent)', zIndex: 0 }} />
              )}
              {PROCESS.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    padding: isMobile ? '20px 18px' : '24px 20px',
                    borderRadius: 16,
                    background: 'rgba(8,14,28,0.88)',
                    border: '1px solid rgba(96,165,250,0.1)',
                    textAlign: 'center', position: 'relative', zIndex: 1,
                  }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%', margin: '0 auto 16px',
                    background: 'rgba(96,165,250,0.1)',
                    border: '1px solid rgba(96,165,250,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 700,
                    color: '#60a5fa', letterSpacing: 1,
                  }}>
                    {step.num}
                  </div>
                  <h3 style={{ fontSize: 16, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.52)', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BOTTOM CTA ══════════════════════════════════════════ */}
        <section style={{
          padding: isMobile ? '64px 5%' : isTablet ? '80px 6%' : `88px ${px}`,
          borderTop: '1px solid rgba(96,165,250,0.07)',
          background: 'rgba(5,10,22,0.98)',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
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
              <span style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(96,165,250,0.65)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Don't See Your Role?</span>
              <div style={{ width: 32, height: 1, background: 'linear-gradient(90deg,rgba(96,165,250,0.6),transparent)' }} />
            </div>

            <h2 style={{
              fontSize: isMobile ? 'clamp(26px,8vw,40px)' : 'clamp(34px,4.2vw,60px)',
              fontFamily: 'var(--font-display)', fontWeight: 800,
              lineHeight: 1.02, letterSpacing: '-1.5px', marginBottom: 16,
            }}>
              We're Always Looking for <span className="gt">Great People.</span>
            </h2>

            <p style={{
              fontSize: isMobile ? 14.5 : 17, color: 'rgba(255,255,255,0.5)',
              maxWidth: 480, margin: '0 auto 36px',
              fontFamily: 'var(--font-body)', lineHeight: 1.8,
            }}>
              Send us your resume and what you're great at. If there's a fit, we'll reach out.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center' }}>
              <button
                className="btn-primary" data-hover
                style={{ fontSize: isMobile ? 14 : 15, padding: isMobile ? '14px 28px' : '15px 36px', width: isMobile ? '100%' : 'auto' }}
                onClick={() => window.location.href = '/contact'}
              >
                Send Your Resume <Icons.ArrowRight />
              </button>
              <button
                className="btn-ghost" data-hover
                style={{ fontSize: isMobile ? 14 : 15, padding: isMobile ? '14px 28px' : '15px 36px', width: isMobile ? '100%' : 'auto' }}
                onClick={() => window.location.href = '/about'}
              >
                About Riveyra
              </button>
            </div>
          </motion.div>
        </section>

      </div>
    </>
  )
}