// src/components/layout/Footer.jsx
import Logo from '../ui/Logo'
import Icons from '../ui/Icons'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'

const cols = [
  { title:'Services', links:['Web Development','Mobile Apps','UI/UX Design','Digital Marketing','ERP Solutions','AI & Automation'] },
  { title:'Company',  links:['About Us','Our Team','Careers','Blog','Press Kit','Contact'] },
  { title:'Legal',    links:['Privacy Policy','Terms of Service','Cookie Policy','Disclaimer'] },
]

const socials = [
  { Icon:Icons.Twitter,   label:'Twitter'   },
  { Icon:Icons.LinkedIn,  label:'LinkedIn'  },
  { Icon:Icons.Facebook,  label:'Facebook'  },
  { Icon:Icons.Instagram, label:'Instagram' },
]

export default function Footer() {
  const { isMobile, isTablet } = useBreakpoint()

  return (
    <footer style={{ position:'relative', overflow:'hidden' }}>
      {/* Background */}
      <div style={{ position:'absolute', inset:0 }}>
        <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=40" alt="" loading="lazy"
          style={{ width:'100%', height:'100%', objectFit:'cover', filter:'blur(40px) brightness(0.06)', opacity:0.9 }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(3,8,16,0.97),rgba(3,8,16,0.99))' }} />
      </div>

      <div style={{
        position:'relative', zIndex:1,
        borderTop:'1px solid rgba(96,165,250,0.09)',
        padding: isMobile ? '48px 6% 32px' : isTablet ? '72px 6% 36px' : '88px 8% 42px',
      }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>

          {/* ── BRAND + SOCIALS — mobile only, sits above the grid ── */}
          {isMobile && (
            <div style={{
              display:'flex',
              flexDirection:'column',
              alignItems:'center',
              textAlign:'center',
              gap:20,
              marginBottom:40,
            }}>
              <div onClick={() => window.scrollTo({ top:0, behavior:'smooth' })} style={{ cursor:'pointer' }} data-hover>
                <Logo height={30} />
              </div>
              <p style={{ fontSize:14, lineHeight:1.8, color:'rgba(255,255,255,0.55)', fontFamily:'var(--font-body)', maxWidth:280 }}>
                Kanpur's premier IT company delivering innovative digital solutions across India and beyond.
              </p>
              <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                {socials.map(({Icon, label}) => (
                  <div key={label} data-hover
                    style={{ width:38, height:38, borderRadius:8, border:'1px solid rgba(96,165,250,0.16)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', cursor:'pointer', transition:'all 0.2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='#60a5fa';e.currentTarget.style.color='#93c5fd';e.currentTarget.style.background='rgba(96,165,250,0.1)'}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(96,165,250,0.16)';e.currentTarget.style.color='rgba(255,255,255,0.5)';e.currentTarget.style.background='transparent'}}
                  >
                    <Icon />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MAIN GRID ── */}
          <div style={{
            display:'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? '1.6fr 1fr 1fr' : '2fr 1fr 1fr 1fr',
            gap: isMobile ? '32px 24px' : isTablet ? '40px 32px' : 60,
            marginBottom: isMobile ? 36 : 68,
          }}>

            {/* Brand col — desktop/tablet only */}
            {!isMobile && (
              <div>
                <div onClick={() => window.scrollTo({ top:0, behavior:'smooth' })} style={{ cursor:'pointer', marginBottom:22 }} data-hover>
                  <Logo height={34} />
                </div>
                <p style={{ fontSize:14.5, lineHeight:1.88, color:'rgba(255,255,255,0.6)', marginBottom:30, fontFamily:'var(--font-body)', maxWidth:310 }}>
                  Kanpur's premier IT company delivering innovative digital solutions across India and beyond.
                </p>
                <div style={{ display:'flex', gap:10 }}>
                  {socials.map(({Icon, label}) => (
                    <div key={label} data-hover
                      style={{ width:40, height:40, borderRadius:8, border:'1px solid rgba(96,165,250,0.16)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', cursor:'pointer', transition:'all 0.2s' }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='#60a5fa';e.currentTarget.style.color='#93c5fd';e.currentTarget.style.background='rgba(96,165,250,0.1)'}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(96,165,250,0.16)';e.currentTarget.style.color='rgba(255,255,255,0.5)';e.currentTarget.style.background='transparent'}}
                    >
                      <Icon />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Link cols */}
            {cols.map((col, idx) => (
              <div key={col.title} style={{
                gridColumn: isMobile && idx === 2 ? '1 / -1' : undefined,
              }}>
                <div style={{
                  fontSize:10, letterSpacing:3, textTransform:'uppercase',
                  color:'#60a5fa', fontFamily:'var(--font-mono)', fontWeight:600,
                  marginBottom: isMobile ? 14 : 24,
                }}>
                  {col.title}
                </div>
                <ul style={{
                  listStyle:'none',
                  display: isMobile && idx === 2 ? 'grid' : 'flex',
                  gridTemplateColumns: isMobile && idx === 2 ? 'repeat(2, 1fr)' : undefined,
                  flexDirection:'column',
                  gap: isMobile ? 10 : 12,
                }}>
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" data-hover
                        style={{ fontSize: isMobile ? 13 : 14, color:'rgba(255,255,255,0.55)', fontFamily:'var(--font-body)', transition:'color 0.2s', cursor:'pointer' }}
                        onMouseEnter={e=>e.currentTarget.style.color='#ffffff'}
                        onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.55)'}
                      >{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── BOTTOM BAR ── */}
          <div style={{
            borderTop:'1px solid rgba(96,165,250,0.07)',
            paddingTop: isMobile ? 24 : 30,
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 8 : 0,
          }}>
            <p style={{ fontSize: isMobile ? 12 : 13, color:'rgba(255,255,255,0.3)', fontFamily:'var(--font-body)', textAlign:'center' }}>
              © {new Date().getFullYear()} Riveyra Infotech Pvt. Ltd. All rights reserved.
            </p>
            <p style={{ fontSize: isMobile ? 12 : 13, color:'rgba(255,255,255,0.3)', fontFamily:'var(--font-body)' }}>
              Made with ♥ in India
            </p>
          </div>

        </div>
      </div>
    </footer>
  )
}