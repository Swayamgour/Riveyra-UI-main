// src/components/layout/Footer.jsx
import Logo from '../ui/Logo'
import Icons from '../ui/Icons'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'
import { Link, useNavigate } from 'react-router-dom'

const cols = [
  {
    title: 'Services',
    links: [
      { name: 'Web Development', path: '/services' },
      { name: 'Mobile Apps', path: '/services' },
      { name: 'UI/UX Design', path: '/services' },
      { name: 'Digital Marketing', path: '/services' },
      { name: 'ERP Solutions', path: '/services' },
      { name: 'AI & Automation', path: '/services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about' },
      { name: 'Our Services', path: '/services' },
      { name: 'Portfolio', path: '/portfolio' },
      { name: 'Careers', path: '/career' },
      { name: 'Contact', path: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', path: '#' },
      { name: 'Terms of Service', path: '#' },
      { name: 'Cookie Policy', path: '#' },
      { name: 'Disclaimer', path: '#' },
    ],
  },
]











const socials = [
  { url: "https://x.com/RiveyraInfotech", Icon: Icons.Twitter, label: 'Twitter' },
  { url: "https://www.linkedin.com/company/riveyrainfotechp/", Icon: Icons.LinkedIn, label: 'LinkedIn' },
  { url: "https://www.facebook.com/RiveyraInfotech/", Icon: Icons.Facebook, label: 'Facebook' },
  { url: "https://www.instagram.com/RiveyraInfotech/", Icon: Icons.Instagram, label: 'Instagram' },
]

export default function Footer() {

  const { isMobile, isTablet } = useBreakpoint()


  const navigate = useNavigate()

  return (
    <footer style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=40" alt="" loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(40px) brightness(0.06)', opacity: 0.9 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(3,8,16,0.97),rgba(3,8,16,0.99))' }} />
      </div>

      <div style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(96,165,250,0.09)',
        padding: isMobile ? '48px 6% 32px' : isTablet ? '72px 6% 36px' : '88px 8% 42px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* ── BRAND + SOCIALS — mobile only, sits above the grid ── */}
          {isMobile && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 20,
              marginBottom: 40,
            }}>
              <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }} data-hover>
                <Logo height={30} />
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)', maxWidth: 280 }}>
                Kanpur's premier IT company delivering innovative digital solutions across India and beyond.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                {socials.map(({ Icon, label, url }) => (
                  <div key={label} data-hover
                    // onClick={() => window.open(Icon?.path, target)}
                    onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                    style={{ width: 38, height: 38, borderRadius: 8, border: '1px solid rgba(96,165,250,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#60a5fa'; e.currentTarget.style.color = '#93c5fd'; e.currentTarget.style.background = 'rgba(96,165,250,0.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.16)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent' }}
                  >
                    <Icon />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MAIN GRID ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? '1.6fr 1fr 1fr' : '2fr 1fr 1fr 1fr',
            gap: isMobile ? '32px 24px' : isTablet ? '40px 32px' : 60,
            marginBottom: isMobile ? 36 : 68,
          }}>

            {/* Brand col — desktop/tablet only */}
            {!isMobile && (
              <div>
                <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer', marginBottom: 22 }} data-hover>
                  <Logo height={34} />
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.88, color: 'rgba(255,255,255,0.6)', marginBottom: 30, fontFamily: 'var(--font-body)', maxWidth: 310 }}>
                  Kanpur's premier IT company delivering innovative digital solutions across India and beyond.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  {socials.map(({ Icon, label, url }) => (
                    <div key={label} data-hover
                      // onClick={() => window.open(Icon?.path, target)}
                      onClick={() => window.open(url, "_blank", "noopener,noreferrer")}

                      style={{ width: 40, height: 40, borderRadius: 8, border: '1px solid rgba(96,165,250,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#60a5fa'; e.currentTarget.style.color = '#93c5fd'; e.currentTarget.style.background = 'rgba(96,165,250,0.1)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.16)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent' }}
                    >
                      <Icon />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Link cols */}
            {cols.map((col) => (
              <div key={col.title}>
                <h4 style={{ color: '#60a5fa', marginBottom: 16 }}>
                  {col.title}
                </h4>

                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {col.links.map((link) => (
                    <li key={link.name} style={{ marginBottom: 10 }}>

                      {link.path !== '#' ? (
                        <span
                          onClick={() => navigate(link.path)}

                          style={{
                            color: 'rgba(255,255,255,0.4)',
                            textDecoration: 'none',
                          }}
                        >
                          {link.name}

                        </span>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                          {link.name}
                        </span>
                      )}

                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── BOTTOM BAR ── */}
          <div style={{
            borderTop: '1px solid rgba(96,165,250,0.07)',
            paddingTop: isMobile ? 24 : 30,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 8 : 0,
          }}>
            <p style={{ fontSize: isMobile ? 12 : 13, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)', textAlign: 'center' }}>
              © {new Date().getFullYear()} Riveyra Infotech Pvt. Ltd. All rights reserved.
            </p>
            <p style={{ fontSize: isMobile ? 12 : 13, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>
              Made with ♥ in India
            </p>
          </div>

        </div>
      </div>
    </footer>
  )
}







