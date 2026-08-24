// src/components/sections/Testimonials.jsx
// import path: ../../hooks/useBreakpoint
// (this file: src/components/sections/ → up two levels → src/ → hooks/)

import { motion } from 'framer-motion'
import SectionTag from '../ui/SectionTag'
import Icons from '../ui/Icons'
import { TESTIMONIALS } from '../../utils/constants'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'
import { useGetLatestTestimonialsQuery } from '../../redux/api.jsx'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

// ─── Avatars — unchanged ──────────────────────────────────────────────────────
const AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=85&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=85&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=85&fit=crop&crop=face',
]

export default function Testimonials({ testimonials }) {
  const { isMobile, isTablet } = useBreakpoint()
  const { data: latestTestimonialsRes, isLoading } = useGetLatestTestimonialsQuery()

  // Use props if passed, otherwise use API data. Fallback to constants if API has no data.
  const displayTestimonials = testimonials || 
    (latestTestimonialsRes?.data?.length > 0 ? latestTestimonialsRes.data : TESTIMONIALS)

  return (
    <section
      id="testimonials"
      style={{
        padding: isMobile ? '60px 5%' : isTablet ? '60px 6%' : '64px 8%',
        background: 'var(--surface)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background texture */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=50"
          alt="" loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(60px) brightness(0.06) saturate(1.5)', opacity: 0.7 }}
        />
      </div>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      <div className="scroll-reveal" style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 48 : 72 }}>
          <SectionTag>Client Testimonials</SectionTag>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ fontSize: 'clamp(28px,4vw,56px)', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff' }}
          >
            What Our <span className="gt">Clients Say</span>
          </motion.h2>
        </div>

        {/* Swiper Styles */}
        <style>{`
          .testimonials-swiper .swiper-pagination-bullet {
            background: rgba(255, 255, 255, 0.4);
            opacity: 1;
            transition: all 0.3s;
          }
          .testimonials-swiper .swiper-pagination-bullet-active {
            background: var(--accent, #4facfe);
            width: 20px;
            border-radius: 4px;
          }
          .testimonials-swiper .swiper-slide {
            height: auto; /* Forces all slides to be the same height */
          }
          .scrollable-review::-webkit-scrollbar {
            width: 4px;
          }
          .scrollable-review::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
          }
          .scrollable-review::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
          }
          .scrollable-review::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.4);
          }
        `}</style>
        
        {isLoading && !testimonials ? (
          <div style={{ textAlign: 'center', color: '#fff', padding: 40 }}>
            Loading testimonials...
          </div>
        ) : !testimonials ? (
          // Render Swiper for Home Page
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={isMobile ? 20 : 24}
            slidesPerView={isMobile ? 1 : isTablet ? 2 : 3}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            className="testimonials-swiper"
            style={{ paddingBottom: '50px', cursor: 'grab' }}
          >
            {displayTestimonials.map((t, i) => (
              <SwiperSlide key={t.name || i}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={isMobile ? {} : { y: -6, boxShadow: `0 24px 60px ${t.accent || '#4facfe'}20` }}
                  style={{
                    padding: isMobile ? '24px 18px' : '28px 24px',
                    borderRadius: 16,
                    background: 'rgba(12,22,40,0.82)',
                    border: `1px solid ${t.accent || '#4facfe'}20`,
                    backdropFilter: 'blur(20px)',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                  data-hover
                >
                  <div>
                    <div style={{ color: t.accent || '#4facfe', marginBottom: 14, opacity: 0.85 }}>
                      <Icons.Quote />
                    </div>

                    <p className="scrollable-review" style={{ 
                      fontSize: 15, 
                      lineHeight: 1.88, 
                      color: 'rgba(255,255,255,0.88)', 
                      fontFamily: 'var(--font-body)', 
                      marginBottom: 28, 
                      fontStyle: 'italic',
                      maxHeight: '85px',
                      overflowY: 'auto',
                      paddingRight: '8px'
                    }}>
                      {t.content}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${t.accent || '#4facfe'}50`, flexShrink: 0 }}>
                      <img src={t.imageUrl || AVATARS[i % AVATARS.length]} alt={t.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#ffffff' }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: t.accent || '#4facfe', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 3, fontWeight: 500 }}>{t.role}</div>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${t.accent || '#4facfe'},transparent)`, opacity: 0.55 }} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // Render Grid for Subcategories Page
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: isMobile ? 20 : 24,
          }}>
            {displayTestimonials.map((t, i) => (
              <motion.div
                key={t.name || i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                whileHover={isMobile ? {} : { y: -6, boxShadow: `0 24px 60px ${t.accent || '#4facfe'}20` }}
                style={{
                  padding: isMobile ? '28px 22px' : '36px 32px',
                  borderRadius: 16,
                  background: 'rgba(12,22,40,0.82)',
                  border: `1px solid ${t.accent || '#4facfe'}20`,
                  backdropFilter: 'blur(20px)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: isMobile ? 'default' : 'none',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                data-hover
              >
                <div>
                  <div style={{ color: t.accent || '#4facfe', marginBottom: 14, opacity: 0.85 }}>
                    <Icons.Quote />
                  </div>

                  <p className="scrollable-review" style={{ 
                    fontSize: 15, 
                    lineHeight: 1.88, 
                    color: 'rgba(255,255,255,0.88)', 
                    fontFamily: 'var(--font-body)', 
                    marginBottom: 28, 
                    fontStyle: 'italic',
                    maxHeight: '85px',
                    overflowY: 'auto',
                    paddingRight: '8px'
                  }}>
                    {t.content}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${t.accent || '#4facfe'}50`, flexShrink: 0 }}>
                    <img src={t.imageUrl || AVATARS[i % AVATARS.length]} alt={t.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#ffffff' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: t.accent || '#4facfe', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 3, fontWeight: 500 }}>{t.role}</div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${t.accent || '#4facfe'},transparent)`, opacity: 0.55 }} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}