// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../ui/Logo'
import { NAV_LINKS } from '../../utils/constants'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'


const PAGE_ROUTES = {
  contact:   '/contact',
  about:     '/about',
  services:  '/services',
  portfolio: '/portfolio',
  career: '/career',
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isMobile, isTablet }  = useBreakpoint()
  const navigate  = useNavigate()
  const location  = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { if (!isMobile) setMenuOpen(false) }, [isMobile])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

 const handleLogoClick = () => {
  setMenuOpen(false)                                         
  if (location.pathname === '/') window.scrollTo({ top:0, behavior:'smooth' })
  else navigate('/')
}

  const handleNavClick = (link) => {
    setMenuOpen(false)
    const key = link.toLowerCase()
    if (PAGE_ROUTES[key]) {
      navigate(PAGE_ROUTES[key])
      return
    }
    if (location.pathname !== '/') {
      navigate('/', { state:{ scrollTo: key } })
    } else {
      const el = document.getElementById(key)
      if (el) el.scrollIntoView({ behavior:'smooth' })
    }
  }

  useEffect(() => {
    if (location.state?.scrollTo) {
      const anchor = location.state.scrollTo
      setTimeout(() => {
        const el = document.getElementById(anchor)
        if (el) el.scrollIntoView({ behavior:'smooth' })
      }, 300)
    }
  }, [location])

  const isActivePage = (link) => {
    const route = PAGE_ROUTES[link.toLowerCase()]
    return route ? location.pathname === route : false
  }

  return (
    <>
      <motion.nav
        initial={{ y:-80, opacity:0 }}
        animate={{ y:0, opacity:1 }}
        transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
        style={{
          position:'fixed', top:0, left:0, right:0, zIndex:900,
          height:     scrolled ? 60 : 78,
          display:    'flex', alignItems:'center', justifyContent:'space-between',
          padding:    '0 5%',
          background: scrolled ? 'rgba(5,11,24,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(1.6)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(96,165,250,0.09)' : 'none',
          transition: 'height 0.4s, background 0.4s',
        }}
      >
        <div onClick={handleLogoClick} style={{ cursor:'pointer', zIndex:1001 }} data-hover>
          <Logo height={scrolled ? 28 : 34} animate />
        </div>

        {!isMobile && (
          <div style={{ display:'flex', gap: isTablet ? 24 : 38, alignItems:'center' }}>
            {NAV_LINKS.map((link, i) => {
              const active = isActivePage(link)
              return (
                <motion.a key={link}
                  href="#"
                  onClick={e => { e.preventDefault(); handleNavClick(link) }}
                  initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.1 + i*0.07 }}
                  style={{
                    fontSize:12.5, letterSpacing:1.5, textTransform:'uppercase',
                    fontFamily:'var(--font-body)', fontWeight:600,
                    color: active ? 'var(--accent)' : 'var(--text-sub)',
                    transition:'color 0.2s', cursor:'pointer',
                    borderBottom: active ? '1px solid var(--accent)' : '1px solid transparent',
                    paddingBottom:2,
                  }}
                  data-hover
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                  onMouseLeave={e => e.currentTarget.style.color = active ? 'var(--accent)' : 'var(--text-sub)'}
                >
                  {link}
                </motion.a>
              )
            })}
          </div>
        )}

        {!isMobile && (
          <motion.button className="btn-primary"
            initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
            transition={{ delay:0.55 }}
            style={{ fontSize:11.5, padding:'10px 24px' }}
            data-hover
            onClick={() => navigate('/contact')}
          >
            Get Started
          </motion.button>
        )}

        {isMobile && (
          <button onClick={() => setMenuOpen(o => !o)}
            style={{ background:'none', border:'none', cursor:'pointer', padding:8, zIndex:1001, display:'flex', flexDirection:'column', gap:5 }}
            aria-label="Toggle menu"
          >
            <span style={{ display:'block',width:24,height:2,background:'#ffffff',borderRadius:2,transition:'all 0.3s',transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
            <span style={{ display:'block',width:24,height:2,background:'#fff',borderRadius:2,transition:'all 0.3s',opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display:'block',width:24,height:2,background:'#fff',borderRadius:2,transition:'all 0.3s',transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
          </button>
        )}
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity:0, y:-20 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-20 }}
            transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
            style={{
              position:'fixed', inset:0, zIndex:899,
              background:'rgba(2,8,18,0.97)',
              backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
              display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', gap:36,
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a key={link}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:i*0.07 }}
                onClick={() => handleNavClick(link)}
                style={{
                  fontSize:28, fontFamily:'var(--font-display)', fontWeight:700,
                  color: isActivePage(link) ? 'var(--accent)' : '#ffffff',
                  letterSpacing:'-0.5px', cursor:'pointer', textDecoration:'none',
                }}
              >{link}</motion.a>
            ))}
            <motion.button
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
              className="btn-primary"
              onClick={() => { setMenuOpen(false); navigate('/contact') }}
              style={{ fontSize:14, padding:'14px 40px', marginTop:8 }}
            >Get Started</motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}