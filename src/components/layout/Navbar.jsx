// src/components/layout/Navbar.jsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../ui/Logo'
import { NAV_LINKS } from '../../utils/constants'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'
import { useGetServicesQuery } from '../../redux/api.jsx'

const PAGE_ROUTES = {
  contact: '/contact',
  about: '/about',
  services: '/services',
  portfolio: '/portfolio',
  career: '/career',
  blogs: '/blogs',
  home: '/'
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [expandedItem, setExpandedItem] = useState(null)
  const dropdownRef = useRef(null)
  const hoverTimeout = useRef(null)

  const { isMobile, isTablet } = useBreakpoint()
  const navigate = useNavigate()
  const location = useLocation()

  const { data } = useGetServicesQuery()
  const services = data?.data || []

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { if (!isMobile) setMenuOpen(false) }, [isMobile])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleLogoClick = () => {
    setMenuOpen(false)
    if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' })
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
      navigate('/', { state: { scrollTo: key } })
    } else {
      const el = document.getElementById(key)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (location.state?.scrollTo) {
      const anchor = location.state.scrollTo
      setTimeout(() => {
        const el = document.getElementById(anchor)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }, [location])

  const isActivePage = (link) => {
    const route = PAGE_ROUTES[link.toLowerCase()]
    return route ? location.pathname === route : false
  }

  const openDropdown = () => { clearTimeout(hoverTimeout.current); setServicesOpen(true) }
  const closeDropdown = () => { hoverTimeout.current = setTimeout(() => setServicesOpen(false), 150) }

  return (
    <>
      <style>{`
        /* Dropdown animations */
        .dropdown-item {
          position: relative;
          overflow: hidden;
        }
        
        .dropdown-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(96,165,250,0.1), transparent);
          transition: left 0.5s ease;
          pointer-events: none;
        }
        
        .dropdown-item:hover::before {
          left: 100%;
        }
        
        @keyframes dropdownGlow {
          0% { box-shadow: 0 0 0 0 rgba(96,165,250,0); }
          50% { box-shadow: 0 0 20px 0 rgba(96,165,250,0.15); }
          100% { box-shadow: 0 0 0 0 rgba(96,165,250,0); }
        }
        
        .dropdown-glow {
          animation: dropdownGlow 2s ease-in-out infinite;
        }
        
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .dropdown-item:hover .dropdown-icon {
          animation: iconPulse 0.4s ease;
        }

        /* Custom subtle scrollbar for mobile dropdown wrapper if needed */
        .mobile-scroll-container::-webkit-scrollbar {
          width: 4px;
        }
        .mobile-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(96, 165, 250, 0.2);
          border-radius: 10px;
        }
      `}</style>

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
          height: scrolled ? 60 : 78,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 5%',
          background: scrolled ? 'rgba(5,11,24,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(1.8)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(96,165,250,0.12)' : 'none',
          transition: 'height 0.4s, background 0.4s',
        }}
      >
        <div onClick={handleLogoClick} style={{ cursor: 'pointer', zIndex: 1001 }} data-hover>
          <Logo height={52} animate />
        </div>

        {/* ── Desktop Nav ── */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: isTablet ? 24 : 38, alignItems: 'center' }}>
            {NAV_LINKS.map((link, i) => {
              const active = isActivePage(link)
              const isServices = link.toLowerCase() === 'services'

              if (isServices) {
                return (
                  <div
                    key={link}
                    ref={dropdownRef}
                    onMouseEnter={openDropdown}
                    onMouseLeave={closeDropdown}
                  >
                    <motion.a
                      href="#"
                      onClick={e => { e.preventDefault(); handleNavClick(link) }}
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.07 }}
                      style={{
                        fontSize: 12.5, letterSpacing: 1.5, textTransform: 'uppercase',
                        fontFamily: 'var(--font-body)', fontWeight: 600,
                        color: active || servicesOpen ? 'var(--accent)' : 'var(--text-sub)',
                        transition: 'all 0.2s', cursor: 'pointer',
                        borderBottom: active ? '1px solid var(--accent)' : '1px solid transparent',
                        paddingBottom: 2,
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}
                      data-hover
                    >
                      {link}
                      <motion.svg
                        width="10" height="10" viewBox="0 0 10 10" fill="none"
                        animate={{ rotate: servicesOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ opacity: 0.7 }}
                      >
                        <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    </motion.a>

                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          onMouseEnter={openDropdown}
                          onMouseLeave={closeDropdown}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            margin: '0 auto',
                            width: 900,
                            background: 'linear-gradient(135deg, rgba(8,18,38,0.98) 0%, rgba(5,11,24,0.98) 100%)',
                            backdropFilter: 'blur(32px) saturate(1.8)',
                            border: '1px solid rgba(96,165,250,0.15)',
                            borderRadius: 20,
                            padding: '24px 32px',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 0.5px rgba(96,165,250,0.1), 0 20px 40px -12px rgba(0,0,0,0.5)',
                            overflow: 'hidden',
                          }}
                        >
                          <div style={{
                            paddingBottom: 16,
                            borderBottom: '1px solid rgba(96,165,250,0.15)',
                            marginBottom: 20,
                          }}>
                            <span style={{
                              fontSize: 11,
                              letterSpacing: 2,
                              color: 'rgba(96,165,250,0.8)',
                              textTransform: 'uppercase',
                              fontFamily: 'monospace',
                              fontWeight: 600
                            }}>✦ Our Expertise</span>
                          </div>

                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '30px 24px',
                          }}>
                            {services.map((item, idx) => (
                              <motion.div
                                key={item._id || idx}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.02 }}
                                style={{ display: 'flex', flexDirection: 'column' }}
                              >
                                <div
                                  onClick={() => { setServicesOpen(false); navigate(`/Service/${item.slug}`) }}
                                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 700,
                                    fontFamily: 'var(--font-body)',
                                    color: '#ffffff',
                                    marginBottom: 12,
                                    cursor: 'pointer',
                                    transition: 'color 0.2s ease',
                                    lineHeight: 1.3
                                  }}
                                >
                                  {item.title}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                  {item?.subcategories?.length > 0 ? (
                                    item.subcategories.map((sub, i) => (
                                      <span
                                        key={i}
                                        onClick={(e) => { 
                                          e.stopPropagation(); 
                                          setServicesOpen(false); 
                                          navigate(`/Service/${item.slug}`);
                                        }}
                                        onMouseEnter={(e) => { 
                                          e.currentTarget.style.color = 'var(--accent)'; 
                                          e.currentTarget.style.transform = 'translateX(4px)';
                                        }}
                                        onMouseLeave={(e) => { 
                                          e.currentTarget.style.color = 'rgba(148,163,184,0.8)'; 
                                          e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                        style={{
                                          fontSize: 12.5,
                                          color: 'rgba(148,163,184,0.8)',
                                          cursor: 'pointer',
                                          transition: 'all 0.2s ease',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 6
                                        }}
                                      >
                                        <span style={{ fontSize: 8, opacity: 0.5 }}>▹</span> {sub}
                                      </span>
                                    ))
                                  ) : (
                                    <span style={{ color: 'rgba(148,163,184,0.4)', fontSize: 12, fontStyle: 'italic' }}>
                                      No categories available
                                    </span>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              return (
                <motion.a key={link}
                  href="#"
                  onClick={e => { e.preventDefault(); handleNavClick(link) }}
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  style={{
                    fontSize: 12.5, letterSpacing: 1.5, textTransform: 'uppercase',
                    fontFamily: 'var(--font-body)', fontWeight: 600,
                    color: active ? 'var(--accent)' : 'var(--text-sub)',
                    transition: 'color 0.2s', cursor: 'pointer',
                    borderBottom: active ? '1px solid var(--accent)' : '1px solid transparent',
                    paddingBottom: 2, position: 'relative',
                  }}
                  data-hover
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                  onMouseLeave={e => e.currentTarget.style.color = active ? 'var(--accent)' : 'var(--text-sub)'}
                >
                  {link}
                  {!active && (
                    <motion.div
                      initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        position: 'absolute', bottom: -2, left: 0, right: 0, height: 1,
                        background: 'var(--accent)', transformOrigin: 'left',
                      }}
                    />
                  )}
                </motion.a>
              )
            })}
          </div>
        )}

        {!isMobile && (
          <motion.button className="btn-primary"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 }}
            style={{ fontSize: 11.5, padding: '10px 24px', position: 'relative', overflow: 'hidden' }}
            data-hover
            onClick={() => navigate('/contact')}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>Get Started</span>
            <motion.div
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', x: '-100%' }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          </motion.button>
        )}

        {/* Mobile Hamburguer Trigger */}
        {isMobile && (
          <button onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, zIndex: 1001, display: 'flex', flexDirection: 'column', gap: 5 }}
            aria-label="Toggle menu"
          >
            <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }} style={{ display: 'block', width: 24, height: 2, background: '#ffffff', borderRadius: 2 }} />
            <motion.span animate={{ opacity: menuOpen ? 0 : 1 }} style={{ display: 'block', width: 24, height: 2, background: '#fff', borderRadius: 2 }} />
            <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }} style={{ display: 'block', width: 24, height: 2, background: '#fff', borderRadius: 2 }} />
          </button>
        )}
      </motion.nav>

      {/* ── Mobile Menu overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 899,
              background: 'rgba(3, 8, 20, 0.98)',
              backdropFilter: 'blur(32px)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'stretch', justifyContent: 'flex-start',
              overflowY: 'auto',
              padding: '100px 6vw 40px 6vw',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column',  width: '100%' }}>
              {NAV_LINKS.map((link, i) => {
                const isServices = link.toLowerCase() === 'services'
                const active = isActivePage(link)

                if (isServices) {
                  return (
                    <div key={link} style={{ width: '100%' }}>
                      <motion.div
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setMobileServicesOpen(o => !o)}
                        style={{
                          fontSize: 16,
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          color: active || mobileServicesOpen ? 'var(--accent)' : '#ffffff',
                          letterSpacing: '-0.5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 0',
                        }}
                      >
                        <span>{link}</span>
                        <motion.svg
                          width="20" height="20" viewBox="0 0 20 20" fill="none"
                          animate={{ rotate: mobileServicesOpen ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ color: 'var(--accent)' }}
                        >
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      </motion.div>

                      {/* Dynamic Expandable Services List */}
                      <AnimatePresence initial={false}>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginBottom: 15 }}
                            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="mobile-scroll-container"
                            style={{
                              overflowX: 'hidden',
                              overflowY: 'auto',
                              maxHeight: '320px',
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid rgba(96, 165, 250, 0.1)',
                              borderRadius: '16px',
                              padding: '6px'
                            }}
                          >
                            {services.map((item, idx) => (
                              <motion.div
                                key={item._id || idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.04 }}
                                onClick={() => { setMenuOpen(false); setMobileServicesOpen(false); navigate(`/Service/${item.slug}`) }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 12,
                                  padding: '12px',
                                  borderRadius: '12px',
                                  cursor: 'pointer',
                                  marginBottom: idx === services.length - 1 ? 0 : 4,
                                }}
                                whileTap={{ background: 'rgba(96,165,250,0.12)', x: 4 }}
                              >
                                <div style={{
                                  width: 36, height: 36, borderRadius: '10px',
                                  background: `linear-gradient(135deg, ${item.accent || '#4facfe'}20, ${item.accent || '#00f2fe'}10)`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  border: `1px solid ${item.accent || '#4facfe'}30`,
                                  flexShrink: 0
                                }}>
                                  <img src={item.icons} alt={item.title} style={{ width: 18, height: 18, objectFit: 'contain' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
                                    {item.title}
                                  </div>
                                  {item.desc && (
                                    <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.6)', marginTop: 2, lineHeight: 1.3 }}>
                                      {item.desc.substring(0, 50)}...
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                return (
                  <motion.a
                    key={link}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleNavClick(link)}
                    style={{
                      fontSize: 16,
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      color: active ? 'var(--accent)' : '#ffffff',
                      letterSpacing: '-0.5px',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      padding: '10px 0',
                      display: 'block'
                    }}
                  >
                    {link}
                  </motion.a>
                )
              })}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="btn-primary"
              onClick={() => { setMenuOpen(false); navigate('/contact') }}
              style={{ fontSize: 14, padding: '14px 0px', marginTop: 24, width: '100%', textAlign: 'center' }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}