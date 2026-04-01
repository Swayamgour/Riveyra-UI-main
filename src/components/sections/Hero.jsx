// src/components/sections/Hero.jsx
import TypeWriter from '../ui/TypeWriter'
import Icons from '../ui/Icons'
import { useState, useCallback, useRef } from 'react'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'

const CERTS = [
  { src: './startupindia.png', alt: 'Startup India' },
  { src: './iso2700.png',      alt: 'ISO 27001'     },
  { src: './iso-c.png',        alt: 'ISO Certified' },
  { src: './cmi.png',          alt: 'CMI Certified' },
]

// ─── 3D Badge ─────────────────────────────────────────────────────────────────
function Badge3D({ cert, compact = false }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hov, setHov]   = useState(false)
  const frameRef        = useRef(null)

  const w  = compact ? 108 : 128
  const h  = compact ?  58 :  68
  const iw = compact ?  54 :  66
  const ih = compact ?  38 :  46

  const onMove = useCallback(e => {
    if (frameRef.current) return
    const t = e.currentTarget
    frameRef.current = requestAnimationFrame(() => {
      const r  = t.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)
      const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2)
      setTilt({ x: dy * -14, y: dx * 14 })
      frameRef.current = null
    })
  }, [])

  const onLeave = () => {
    if (frameRef.current) { cancelAnimationFrame(frameRef.current); frameRef.current = null }
    setTilt({ x: 0, y: 0 })
    setHov(false)
  }

  return (
    <div style={{ perspective: 500, width: w, height: h, flexShrink: 0 }}>
      <div
        onMouseMove={onMove}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={onLeave}
        style={{
          width: '100%', height: '100%', borderRadius: 12, position: 'relative',
          cursor: 'default', transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hov ? 'translateZ(8px) scale(1.06)' : 'scale(1)'}`,
          transition: hov ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
          background: hov
            ? 'linear-gradient(145deg,rgba(96,165,250,0.18),rgba(14,22,40,0.92))'
            : 'linear-gradient(145deg,rgba(255,255,255,0.07),rgba(14,22,40,0.85))',
          border: `1px solid ${hov ? 'rgba(96,165,250,0.45)' : 'rgba(96,165,250,0.15)'}`,
          boxShadow: hov
            ? '0 16px 40px rgba(0,0,0,0.6),0 4px 16px rgba(96,165,250,0.2),inset 0 1px 0 rgba(255,255,255,0.15)'
            : '0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}
      >
        <div style={{ position:'absolute',inset:0,borderRadius:12,background:`radial-gradient(circle at ${50+tilt.y*2.5}% ${50+tilt.x*2.5}%,rgba(255,255,255,0.12) 0%,transparent 65%)`,pointerEvents:'none',zIndex:2 }} />
        <div style={{ position:'absolute',bottom:0,left:0,right:0,height:2,borderRadius:'0 0 12px 12px',background:hov?'linear-gradient(90deg,transparent,rgba(96,165,250,0.6),transparent)':'linear-gradient(90deg,transparent,rgba(96,165,250,0.2),transparent)',transition:'background 0.3s',zIndex:3 }} />
        <img
          src={cert.src} alt={cert.alt} loading="lazy"
          style={{
            width: iw, height: ih, objectFit: 'contain', position: 'relative', zIndex: 1,
            filter: hov
              ? 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(96,165,250,0.9))'
              : 'brightness(0) invert(1) drop-shadow(0 1px 4px rgba(0,0,0,0.6))',
            opacity: hov ? 1 : 0.72,
            transition: 'opacity 0.3s, filter 0.3s',
            transform: 'translateZ(6px)',
          }}
        />
      </div>
    </div>
  )
}

// ─── Mobile Cert Strip ────────────────────────────────────────────────────────
function MobileCertStrip() {
  return (
    <>
      <style>{`
        @keyframes certScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div style={{
        borderRadius: 12, overflow: 'hidden',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(96,165,250,0.14)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
        animation: 'fadeUp 0.9s 1.8s both',
        padding: '10px 0',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          animation: 'certScroll 9s linear infinite',
          width: 'max-content', whiteSpace: 'nowrap',
        }}>
          {[...CERTS, ...CERTS].map((cert, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:16, flexShrink:0, paddingLeft: i === 0 ? 16 : 0 }}>
              <img src={cert.src} alt={cert.alt} loading="lazy"
                style={{ width:64, height:38, objectFit:'contain', filter:'brightness(0) invert(1)', opacity:0.75, flexShrink:0 }}
              />
              <div style={{ width:1, height:20, background:'rgba(255,255,255,0.08)', flexShrink:0 }} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── Cert Panel ───────────────────────────────────────────────────────────────
function CertPanel({ compact }) {
  return (
    <div style={{
      flexShrink: 0,
      flexGrow: 0,
      alignSelf: 'center',
      animation: 'fadeUp 0.9s 2s both',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: compact ? 10 : 14,
        padding: compact ? '18px 14px' : '24px 18px',
        borderRadius: 20,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(96,165,250,0.12)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}>
        <p style={{
          fontSize: 8, letterSpacing: 3, textTransform: 'uppercase',
          color: 'rgba(96,165,250,0.45)', fontFamily: 'var(--font-mono)',
          textAlign: 'center', whiteSpace: 'nowrap', margin: 0,
        }}>
          Certified By
        </p>

        {CERTS.map((cert, i) => (
          <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
            {i !== 0 && (
              <div style={{
                width: '60%', height: 1,
                marginBottom: compact ? 10 : 14,
                background: 'linear-gradient(90deg,transparent,rgba(96,165,250,0.1),transparent)',
              }} />
            )}
            <Badge3D cert={cert} compact={compact} />
          </div>
        ))}

        <div style={{
          width: 5, height: 5, borderRadius: '50%', marginTop: 2,
          background: 'rgba(96,165,250,0.5)',
          boxShadow: '0 0 8px rgba(96,165,250,0.7)',
          animation: 'floatY 2.5s ease-in-out infinite',
        }} />
      </div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const { isMobile, isTablet } = useBreakpoint()

  return (
    <section
      id="hero"
      style={{
        // ── FIX: mobile wraps to content height; desktop keeps full-screen ──
        minHeight: isMobile ? 'unset' : '100svh',
        position: 'relative',
        overflow: 'visible',
        background: '#020812',
      }}
    >
      {/* VIDEO BG */}
      <div style={{ position:'absolute', inset:0, zIndex:0, overflow:'hidden' }}>
        <video autoPlay muted loop playsInline
          style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%) scale(1.4)',width:'100vw',height:'56.25vw',minHeight:'100vh',minWidth:'177.78vh',objectFit:'cover' }}
        >
          <source src="/RivHero.mp4" type="video/mp4" />
        </video>
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(2,8,18,0.96) 0%,rgba(2,8,18,0.72) 40%,rgba(2,8,18,0.52) 65%,rgba(2,8,18,0.88) 100%)' }} />
        <div style={{ position:'absolute',bottom:0,left:0,right:0,height:240,background:'linear-gradient(to top,#050b18,transparent)' }} />
      </div>

      <div className="grid-bg" style={{ position:'absolute',inset:0,zIndex:2,pointerEvents:'none',opacity:0.35 }} />

      {/* ── CONTENT WRAPPER ── */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        minHeight: isMobile ? 'unset' : '100svh',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: isMobile ? 'flex-start' : 'space-between',
        padding: isMobile
          ? '82px 5% 56px'
          : isTablet
          ? '100px 4% 48px 5%'
          : '100px 5% 56px 8%',
        gap: isMobile ? 28 : isTablet ? 24 : 40,
        boxSizing: 'border-box',
      }}>

        {/* ── TEXT COLUMN ── */}
        <div style={{
          flex: '1 1 0',
          minWidth: 0,
          maxWidth: isMobile ? '100%' : isTablet ? '55%' : 620,
        }}>

          <h1 style={{
            fontSize: isMobile
              ? 'clamp(36px,11vw,54px)'
              : isTablet
              ? 'clamp(34px,5vw,58px)'
              : 'clamp(42px,5.8vw,84px)',
            fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: isMobile ? 1.15 : 0.98,
            marginBottom: isMobile ? 20 : 22,
            letterSpacing: isMobile ? '-1px' : '-2px',
          }}>
            <div style={{ animation:'heroLine 0.9s 0.35s both', overflow:'hidden' }}>
              <TypeWriter text={['We Shape','We Build','We Launch','We Grow']} delay={400} speed={65} deleteSpeed={32} pauseEnd={1600} pauseStart={380} loop className="gt" />
            </div>
            <div style={{ animation:'heroLine 0.9s 0.55s both', overflow:'hidden' }}>
              <span style={{ color:'#ffffff' }}>
                <TypeWriter text={['Digital Futures','Bold Products','Real Results','Your Vision']} delay={900} speed={65} deleteSpeed={32} pauseEnd={1600} pauseStart={380} loop />
              </span>
            </div>
            <div style={{ animation:'heroLine 0.9s 0.75s both', overflow:'hidden' }}>
              <TypeWriter text={['Together.','That Last.','That Scale.','That Win.']} delay={1600} speed={65} deleteSpeed={32} pauseEnd={1600} pauseStart={380} loop className="gt2" />
            </div>
          </h1>

          <p style={{
            // AFTER
fontSize: isMobile ? 'clamp(14.5px,3.8vw,17px)' : 'clamp(13px,1.35vw,16px)', lineHeight: 1.85,
            color: 'rgba(255,255,255,0.88)',
            maxWidth: isMobile ? '100%' : 460,
            marginBottom: isMobile ? 26 : 32,
            animation: 'fadeUp 0.9s 1.2s both',
            fontFamily: 'var(--font-body)', fontWeight: 400,
          }}>
            Leveraging innovation, technology &amp; consumer-centric strategies to build
            extraordinary digital products that define tomorrow's businesses.
          </p>

          {isMobile && (
            <div style={{ marginBottom: 28 }}>
              <MobileCertStrip />
            </div>
          )}

          <div style={{
            display: 'flex', // AFTER
gap: isMobile ? 14 : 12, flexWrap: 'wrap',
            animation: 'fadeUp 0.9s 1.5s both', alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
          }}>
            <button className="btn-primary" data-hover
              style={{ width: isMobile ? '100%' : 'auto', fontSize: isTablet ? 13 : 14 }}
            >
              Consult Our Experts <Icons.ArrowRight />
            </button>
            <button className="btn-ghost" data-hover
              style={{ width: isMobile ? '100%' : 'auto', fontSize: isTablet ? 13 : 14 }}
            >
              View Our Work
            </button>
          </div>
        </div>

        {/* ── CERT PANEL — tablet & desktop only ── */}
        {!isMobile && <CertPanel compact={isTablet} />}
      </div>

      {/* SCROLL INDICATOR */}
      {!isMobile && (
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          animation: 'floatY 2.5s ease-in-out infinite',
        }}>
          <span style={{ fontSize:9.5,letterSpacing:3,color:'rgba(96,165,250,0.5)',textTransform:'uppercase',fontFamily:'var(--font-mono)' }}>Scroll</span>
          <div style={{ width:1,height:40,background:'linear-gradient(180deg,#60a5fa,transparent)' }} />
        </div>
      )}
    </section>
  )
}