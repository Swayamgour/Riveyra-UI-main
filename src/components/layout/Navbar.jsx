// src/components/layout/Navbar.jsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../ui/Logo'
import { NAV_LINKS } from '../../utils/constants'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'
import { useGetNavDropdownItemsQuery } from '../../redux/api.jsx'

const PAGE_ROUTES = {
  contact: '/contact',
  about: '/about',
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
  const [expandedItem, setExpandedItem] = useState(null)
  const dropdownRef = useRef(null)
  const hoverTimeout = useRef(null)

  const { isMobile, isTablet } = useBreakpoint()
  const navigate = useNavigate()
  const location = useLocation()

  const { data } = useGetNavDropdownItemsQuery()
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

  // Reset mobile services state whenever the mobile menu closes
  useEffect(() => {
    if (!menuOpen) {
      setMobileServicesOpen(false)
      setExpandedItem(null)
    }
  }, [menuOpen])

  // Close desktop dropdown on outside click (helps touch/tablet + keyboard users)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const navHeight = scrolled ? 66 : 78

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

        /* Mega dropdown - responsive grid */
        .mega-dropdown-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px 40px;
        }
        @media (max-width: 1200px) {
          .mega-dropdown-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 18px 28px;
          }
        }
        @media (max-width: 900px) {
          .mega-dropdown-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px 22px;
          }
        }

        /* Prevent any accidental horizontal overflow on small screens */
        html, body {
          max-width: 100%;
          overflow-x: hidden;
        }
      `}</style>

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
          height: navHeight,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 4%',
          background: '#05070d',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          transition: 'height 0.3s ease',
        }}
      >
        <div onClick={handleLogoClick} style={{ cursor: 'pointer', zIndex: 1001, flexShrink: 0 }} data-hover>
          <Logo height={isMobile ? 46 : isTablet ? 56 : 65} animate />
        </div>

        {/* ── Desktop / Tablet Nav ── */}
        {!isMobile && (
          <div style={{
            display: 'flex',
            gap: isTablet ? 16 : 34,
            alignItems: 'center',
            flexWrap: 'nowrap',
            overflow: 'hidden',
          }}>
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
                      onClick={e => { e.preventDefault(); setServicesOpen(o => !o) }}
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.07 }}
                      style={{
                        fontSize: isTablet ? 'clamp(13px, 1.4vw, 14.5px)' : 'clamp(14px, 1vw, 15.5px)',
                        fontFamily: 'var(--font-body)', fontWeight: 500,
                        color: '#ffffff',
                        transition: 'all 0.2s', cursor: 'pointer',
                        borderBottom: active || servicesOpen ? '2px solid var(--accent)' : '2px solid transparent',
                        paddingBottom: 6,
                        display: 'flex', alignItems: 'center', gap: 5,
                        whiteSpace: 'nowrap',
                      }}
                      data-hover
                    >
                      {link}
                      <motion.svg
                        width="12" height="12" viewBox="0 0 10 10" fill="none"
                        animate={{ rotate: servicesOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ opacity: 0.8, flexShrink: 0 }}
                      >
                        <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    </motion.a>

                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          onMouseEnter={openDropdown}
                          onMouseLeave={closeDropdown}
                          style={{
                            position: 'fixed',
                            top: navHeight,
                            left: 0,
                            right: 0,
                            width: '100vw',
                            maxHeight: `calc(100vh - ${navHeight}px)`,
                            overflowY: 'auto',
                            background: '#0a0d16',
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            borderBottom: '1px solid rgba(96,165,250,0.15)',
                            padding: '36px 6% 40px',
                            boxShadow: '0 40px 60px rgba(0,0,0,0.5)',
                          }}
                        >
                          <div className="mega-dropdown-grid">
                            {services.map((item, idx) => (
                              <motion.div
                                key={item._id || idx}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.02 }}
                                style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}
                              >
                                <div
                                  onClick={() => { setServicesOpen(false); navigate(`/ServiceCategories/${item.categorySlug}`) }}
                                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                                  style={{
                                    fontSize: 'clamp(15px, 1.3vw, 18px)',
                                    fontWeight: 600,
                                    fontFamily: 'var(--font-body)',
                                    color: '#ffffff',
                                    marginBottom: 14,
                                    cursor: 'pointer',
                                    transition: 'color 0.2s ease',
                                    lineHeight: 1.3,
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    gap: 8,
                                  }}
                                >
                                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                                    {item.categories}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                  {item?.subcategories?.length > 0 ? (
                                    item.subcategories.map((sub, i) => (
                                      <span
                                        key={i}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setServicesOpen(false);
                                          navigate(`/services/${encodeURIComponent(item.categorySlug)}/${encodeURIComponent(typeof sub === 'string' ? sub : sub.slug)}`);
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
                                          fontSize: 'clamp(13px, 1vw, 16px)',
                                          color: 'rgba(148,163,184,0.85)',
                                          cursor: 'pointer',
                                          transition: 'all 0.2s ease',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 6,
                                          lineHeight: 1.4,
                                          textTransform: 'capitalize',
                                        }}
                                      >
                                        {typeof sub === 'string' ? sub : sub.name}
                                      </span>
                                    ))
                                  ) : null}
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
                    fontSize: isTablet ? 'clamp(13px, 1.4vw, 14.5px)' : 'clamp(14px, 1vw, 15.5px)',
                    fontFamily: 'var(--font-body)', fontWeight: 500,
                    color: '#ffffff',
                    transition: 'color 0.2s', cursor: 'pointer',
                    borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                    paddingBottom: 6, position: 'relative',
                    whiteSpace: 'nowrap',
                  }}
                  data-hover
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
                >
                  {link}
                </motion.a>
              )
            })}
          </div>
        )}

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: isTablet ? 14 : 26, flexShrink: 0 }}>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 }}
              data-hover
              onClick={() => navigate('/contact')}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-body)', fontWeight: 600,
                fontSize: isTablet ? 13 : 14,
                color: '#05070d', background: 'var(--accent)',
                border: 'none', borderRadius: 100,
                padding: isTablet ? '9px 16px' : '11px 22px',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z" fill="currentColor"/></svg>
              Contact Us
            </motion.button>
          </div>
        )}

        {/* Mobile Hamburger Trigger */}
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
              overflowX: 'hidden',
              padding: 'calc(90px + env(safe-area-inset-top)) 6vw calc(40px + env(safe-area-inset-bottom)) 6vw',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 }}>
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
                          fontSize: 'clamp(15px, 4vw, 16px)',
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
                          style={{ color: 'var(--accent)', flexShrink: 0 }}
                        >
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      </motion.div>

                      {/* Categories list */}
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
                              maxHeight: '360px',
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid rgba(96, 165, 250, 0.1)',
                              borderRadius: '16px',
                              padding: '6px'
                            }}
                          >
                            {services.map((item, idx) => (
                              <div key={item._id || idx} style={{ marginBottom: idx === services.length - 1 ? 0 : 4 }}>
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.04 }}
                                  onClick={() => {
                                    if (item?.subcategories?.length > 0) {
                                      setExpandedItem(expandedItem === idx ? null : idx)
                                    } else {
                                      setMenuOpen(false)
                                      setMobileServicesOpen(false)
                                      navigate(`/ServiceCategories/${item.categorySlug}`)
                                    }
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    minWidth: 0,
                                  }}
                                  whileTap={{ background: 'rgba(96,165,250,0.12)' }}
                                >
                                  <div style={{
                                    width: 36, height: 36, borderRadius: '10px',
                                    background: `linear-gradient(135deg, ${item.accent || '#4facfe'}20, ${item.accent || '#00f2fe'}10)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: `1px solid ${item.accent || '#4facfe'}30`,
                                    flexShrink: 0
                                  }}>
                                    {item.icons && (
                                      <img src={item.icons} alt={item.categories} style={{ width: 18, height: 18, objectFit: 'contain' }} />
                                    )}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                      color: '#fff', fontSize: 14, fontWeight: 600,
                                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                                    }}>
                                      <span style={{
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0,
                                      }}>
                                        {item.categories}
                                      </span>
                                      {item?.subcategories?.length > 0 && (
                                        <motion.svg
                                          width="14" height="14" viewBox="0 0 20 20" fill="none"
                                          animate={{ rotate: expandedItem === idx ? 180 : 0 }}
                                          transition={{ duration: 0.2 }}
                                          style={{ color: 'var(--accent)', flexShrink: 0 }}
                                        >
                                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </motion.svg>
                                      )}
                                    </div>
                                    {item.desc && (
                                      <div style={{
                                        fontSize: 11, color: 'rgba(148,163,184,0.6)', marginTop: 2, lineHeight: 1.3,
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                      }}>
                                        {item.desc.substring(0, 50)}...
                                      </div>
                                    )}
                                  </div>
                                </motion.div>

                                {/* Subcategories */}
                                <AnimatePresence initial={false}>
                                  {expandedItem === idx && item?.subcategories?.length > 0 && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                      style={{ overflow: 'hidden', paddingLeft: 48, paddingRight: 8 }}
                                    >
                                      {item.subcategories.map((sub, i) => (
                                        <div
                                          key={i}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setMenuOpen(false)
                                            setMobileServicesOpen(false)
                                            setExpandedItem(null)
                                            navigate(`/services/${encodeURIComponent(item.categorySlug)}/${encodeURIComponent(typeof sub === 'string' ? sub : sub.slug)}`)
                                          }}
                                          style={{
                                            fontSize: 13,
                                            color: 'rgba(148,163,184,0.85)',
                                            padding: '9px 4px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                                          }}
                                        >
                                          {typeof sub === 'string' ? sub : sub.name}
                                        </div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
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
                      fontSize: 'clamp(15px, 4vw, 16px)',
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