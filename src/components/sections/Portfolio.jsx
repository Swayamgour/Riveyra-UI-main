import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion, useInView } from 'framer-motion';
// import { EffectCreative } from 'swiper/modules';
import SectionTag from '../ui/SectionTag';
import Icons from '../ui/Icons';
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx';
import { useGetProjectsQuery } from '../../redux/api.jsx';
import { EffectCreative, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-creative';
import { useNavigate } from 'react-router-dom';

// ─── All project data — paths unchanged ───────────────────────────────────────
const PROJECT_DATA = {
  'DGFASLI': {
    workImg: './DGFASLI.png',
    detailImgs: ['./DGFASSLI1.png', './DGFASLI2.png'],
    year: '2023', tech: ['React', 'Node.js', 'AWS'],
  },
  'SDRF': {
    workImg: './SDRF.png',
    detailImgs: ['./SDRF1.png', './SDRF2.png'],
    year: '2023', tech: ['Custom ERP', 'PHP', 'MySQL'],
  },
  'NIEDO': {
    workImg: './NEIDO.png',
    detailImgs: ['./NEIDO1.png', './NEIDO2.png'],
    year: '2022', tech: ['Next.js', 'TailwindCSS', 'CMS'],
  },
  'Martolia Group': {
    workImg: './MARTOLIA.png',
    detailImgs: ['./Martolia1.png', './Martolia2.png'],
    year: '2024', tech: ['Flutter', 'Firebase', 'Maps API'],
  },
};

// ─── 3D Flip Card Component (Reused in both Grid and Swiper) ───────────────────
function ProjectCard({ item, i, totalInView, isMobile, isInSwiper, onCardClick }) {
  const [flipped, setFlipped] = useState(false);
  const data = PROJECT_DATA[item.title] || {};

  // Handle flip when clicking on card (but not on buttons)
  const handleCardClick = (e) => {
    // Don't flip if clicking on buttons or interactive elements
    if (e.target.closest('button') || e.target.closest('.no-flip')) return;
    setFlipped(!flipped);
    if (onCardClick) onCardClick();
  };

  const fallVariants = {
    hidden: {
      opacity: 0,
      y: isMobile ? -60 : -180,
      rotateX: isMobile ? -20 : -65,
      rotateZ: isMobile ? 0 : (i % 2 === 0 ? -12 : 12),
      scale: isMobile ? 0.92 : 0.75,
      z: isMobile ? -60 : -200,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      rotateZ: 0,
      scale: 1,
      z: 0,
      transition: {
        delay: i * 0.18,
        duration: 0.9,
        ease: [0.22, 1.2, 0.36, 1],
        opacity: { duration: 0.4, delay: i * 0.18 },
      },
    },
  };

  const cardHeight = isMobile ? 380 : 420;

  const cardContent = (
    <motion.div
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', position: 'relative' }}
    >
      {/* FRONT */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          borderRadius: 18, overflow: 'hidden',
          background: 'var(--card)', border: `1px solid ${item.color}22`,
          boxShadow: `0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)`,
          display: 'flex', flexDirection: 'column',
          cursor: 'pointer',
        }}
      >
        <div style={{ flex: `0 0 ${isMobile ? 180 : 220}px`, position: 'relative', overflow: 'hidden' }}>
          <img
            src={item?.workImg || data.workImg} alt={item.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.78) saturate(1.15)', transition: 'transform 0.5s' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 45%, rgba(6,12,28,0.92) 100%)` }} />
          <div style={{ position: 'absolute', top: 14, left: 14, fontSize: 10, padding: '4px 12px', borderRadius: 100, background: 'rgba(5,11,24,0.75)', border: `1px solid ${item.color}50`, color: item.color, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: 1.5, backdropFilter: 'blur(8px)' }}>
            {item.cat}
          </div>
          <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 10, padding: '4px 10px', borderRadius: 4, background: 'rgba(5,11,24,0.75)', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', backdropFilter: 'blur(8px)' }}>
            {item.year || data.year}
          </div>
          <div style={{ position: 'absolute', bottom: 14, right: 14, fontSize: 12, padding: '4px 10px', borderRadius: 4, background: `${item.color}18`, border: `1px solid ${item.color}35`, color: item.color, fontFamily: 'var(--font-mono)', letterSpacing: 1.5, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ display: 'inline-block', animation: 'pulse 1.5s infinite' }}>↻</span>
            {isMobile ? 'TAP' : 'FLIP'}
          </div>
        </div>
        <div style={{ flex: 1, padding: isMobile ? '16px 18px 18px' : '20px 22px 22px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: isMobile ? 19 : 22, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff', marginBottom: 8, lineHeight: 1.1 }}>
            {item.title}
          </h3>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.68)', lineHeight: 1.75, fontFamily: 'var(--font-body)', flex: 1 }}>
            {item.description}
          </p>
          <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
            {(item.tech || data.tech || []).map(t => (
              <span key={t} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 4, background: `${item.color}10`, color: item.color, border: `1px solid ${item.color}25`, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* BACK */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 18, overflow: 'hidden',
          background: `linear-gradient(145deg, rgba(8,15,30,0.98), rgba(12,22,44,0.96))`,
          border: `1px solid ${item.color}35`,
          boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 60px ${item.color}12`,
          display: 'flex', flexDirection: 'column',
          padding: isMobile ? '18px' : '24px',
          cursor: 'pointer',
        }}
      >
        <div style={{ fontSize: 10, color: item.color, fontFamily: 'var(--font-mono)', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 6 }}>Project Details</div>
        <h3 style={{ fontSize: isMobile ? 20 : 24, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff', marginBottom: 14 }}>{item.title}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          {(data.detailImgs || []).map((src, k) => (
            <div key={k} style={{ height: isMobile ? 80 : 100, borderRadius: 8, overflow: 'hidden', border: `1px solid ${item.color}20` }}>
              <img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8) saturate(1.2)' }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { val: item.year || data.year, lbl: 'Year' },
            { val: (item.tech || data.tech || []).length + '+', lbl: 'Tech Stack' },
            { val: '100%', lbl: 'On Time' },
          ].map(s => (
            <div key={s.lbl} style={{ textAlign: 'center', padding: isMobile ? '8px 4px' : '10px 8px', borderRadius: 8, background: `${item.color}0c`, border: `1px solid ${item.color}18` }}>
              <div style={{ fontSize: isMobile ? 15 : 18, fontFamily: 'var(--font-display)', fontWeight: 800, color: item.color }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 3 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
          <button
            className="no-flip"
            onClick={(e) => {
              e.stopPropagation();
              if (!item?.link) return;
              const newTab = window.open(item?.link, '_blank', 'noopener,noreferrer');
              if (newTab) newTab.opener = null;
            }}
            style={{ flex: 1, padding: '10px', borderRadius: 8, background: `linear-gradient(135deg, ${item.color}, ${item.color}88)`, border: 'none', color: '#050b18', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            View Project <Icons.ArrowRight />
          </button>
          <button
            className="no-flip"
            onClick={e => { e.stopPropagation(); setFlipped(false); }}
            style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer', letterSpacing: 1 }}
          >
            ↩ BACK
          </button>
        </div>
      </div>
    </motion.div>
  );

  // For swiper mode: no fall animation, direct render
  if (isInSwiper) {
    return (
      <div
        onClick={handleCardClick}
        style={{
          perspective: 1000,
          cursor: 'pointer',
          height: cardHeight,
        }}
      >
        {cardContent}
      </div>
    );
  }

  // For grid mode: with fall animation
  return (
    <motion.div
      variants={fallVariants}
      initial="hidden"
      animate={totalInView ? 'visible' : 'hidden'}
      onClick={handleCardClick}
      style={{
        perspective: 1000,
        cursor: isMobile ? 'default' : 'pointer',
        height: cardHeight,
      }}
      data-hover
    >
      {cardContent}
    </motion.div>
  );
}

// ─── Desktop Swiper Carousel Component (uses same ProjectCard styling) ─────────
function CurvedSwiperCarousel({ projects, isMobile }) {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState('none');
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        background: 'transparent',
        padding: '20px 0 40px',
        position: 'relative',
        overflow: 'hidden',
        color: '#fff'
      }}
    >
      {/* Custom Mouse Cursor */}
      {cursorType !== 'none' && (
        <motion.div
          style={{
            position: 'absolute', left: mousePos.x, top: mousePos.y,
            pointerEvents: 'none', zIndex: 50, width: 100, height: 100, borderRadius: '50%',
            backgroundColor: cursorType === 'view' ? '#fff' : 'rgba(255,255,255,0.15)',
            color: cursorType === 'view' ? '#000' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 'bold', translateX: '-50%', translateY: '-50%'
          }}
          animate={{ scale: 1 }} initial={{ scale: 0 }}
        >
          {cursorType === 'view' ? 'View' : 'DRAG'}
        </motion.div>
      )}

      {/* Top Tabs */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '50px', flexWrap: 'wrap' }}>
        {projects.map((item, idx) => (
          <button
            key={item.title}
            onClick={() => swiperInstance?.slideToLoop(idx, 600)}
            style={{
              padding: '10px 20px', borderRadius: '30px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: activeIndex === idx ? item.color : 'transparent',
              color: activeIndex === idx ? '#000' : '#fff',
              cursor: 'pointer', transition: 'all 0.3s ease'
            }}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Half Circle Swiper Wrapper */}
      <div
        onMouseEnter={() => setCursorType('drag')}
        onMouseLeave={() => setCursorType('none')}
        style={{
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto',
          cursor: 'none'
        }}
      >
        <Swiper
          modules={[EffectCreative, Autoplay]}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          centeredSlides={true}
          loop={true}
          effect="creative"

          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}

          speed={1200}

          slidesPerView={1.8}
          breakpoints={{
            768: { slidesPerView: 2.2 },
            1024: { slidesPerView: 2.5 },
          }}

          creativeEffect={{
            prev: {
              shadow: false,
              translate: ['-130%', '25%', -24],
              rotate: [0, 0, -28],
            },
            next: {
              shadow: false,
              translate: ['130%', '25%', -25],
              rotate: [0, 0, 28],
            },
          }}

          style={{ overflow: 'visible' }}
        >

          {console.log(projects)}
          {projects.map((item, idx) => (
            <SwiperSlide key={item.title} style={{ overflow: 'visible' }}>
              <ProjectCard
                item={item}
                i={idx}
                isMobile={isMobile}
                isInSwiper={true}
                totalInView={true}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

// ─── Main Portfolio Section ──────────────────────────────────────────────────
export default function Portfolio() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { isMobile, isTablet } = useBreakpoint();
  const { data } = useGetProjectsQuery();
   const navigate = useNavigate()

  // Use desktop swiper mode only on non-mobile devices (tablet & desktop)
  const useDesktopSwiper = !isMobile;

  // If data is loading or empty, show nothing
  if (!data?.data?.length) {
    return null;
  }

  const projects = data.data;

 

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      style={{
        padding: isMobile ? '60px 5% 70px' : '70px 0% 80px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=50"
          alt="" loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(90px) brightness(0.05) saturate(2)', opacity: 0.8 }}
        />
      </div>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4 }} />

      <div className="scroll-reveal" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 48 : 40 }}>
          <SectionTag>Case Studies</SectionTag>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(28px,4vw,56px)', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff' }}
          >
            Our <span className="gt">Finest Work</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginTop: 16, maxWidth: 480, margin: '16px auto 0', fontFamily: 'var(--font-body)', lineHeight: 1.7 }}
          >
            {isMobile
              ? 'Tap any card to flip it and see full project details.'
              : 'Drag or click the arrows — cards rotate into view. Click any card to flip it and see full project details.'}
          </motion.p>
        </div>

        {/* Conditional Rendering: Swiper for Desktop, Grid for Mobile */}
        {useDesktopSwiper ? (
          <CurvedSwiperCarousel projects={projects} isMobile={isMobile} />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 20,
          }}>
            {projects.map((item, i) => (
              <ProjectCard
                key={item.title}
                item={item}
                i={i}
                totalInView={inView}
                isMobile={isMobile}
                isInSwiper={false}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          style={{ textAlign: 'center', marginTop: 60 }}
        >
          <button onClick={()=>navigate('/portfolio')} className="btn-ghost" data-hover style={{ fontSize: 13 }}>
            View All Projects <Icons.ArrowRight />
          </button>
        </motion.div>
      </div>
    </section>
  );
}