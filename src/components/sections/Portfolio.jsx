import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SectionTag from '../ui/SectionTag';
import Icons from '../ui/Icons';
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx';
import { useGetProjectsQuery } from '../../redux/api.jsx';

// ─── Fallback project meta — paths unchanged ───────────────────────────────
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
  'DGHRD': {
    // TODO: swap for the real DGHRD screenshot once uploaded via the admin panel
    workImg: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    detailImgs: [],
    year: '2023', tech: ['React', 'Node.js', 'AWS'],
  },
};

// ─── One editorial-style case-study row ────────────────────────────────────
function CaseStudyRow({ item, index, isMobile }) {
  const rowRef = useRef(null);
  const inView = useInView(rowRef, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState(false);
  const data = PROJECT_DATA[item.title] || {};
  const reversed = !isMobile && index % 2 === 1;
  const num = String(index + 1).padStart(2, '0');

  const openLink = () => {
    if (!item?.link) return;
    const newTab = window.open(item.link, '_blank', 'noopener,noreferrer');
    if (newTab) newTab.opener = null;
  };

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : (reversed ? 'row-reverse' : 'row'),
        alignItems: 'center',
        gap: isMobile ? 28 : 60,
        padding: isMobile ? '40px 0' : '64px 0',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Image panel */}
      <div
        onClick={openLink}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-hover
        style={{
          flex: isMobile ? 'none' : '0 0 56%',
          width: isMobile ? '100%' : undefined,
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          cursor: item?.link ? 'pointer' : 'default',
          border: `1px solid ${item.color}30`,
          aspectRatio: isMobile ? '4 / 3' : '16 / 10',
        }}
      >
        <motion.img
          src={item?.workImg || data.workImg}
          alt={item.title}
          loading="lazy"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.82) saturate(1.1)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, transparent 40%, rgba(4,8,18,0.85) 100%)` }} />

        {/* <div style={{
          position: 'absolute', top: 18, left: 18, fontSize: 11, padding: '5px 14px', borderRadius: 100,
          background: 'rgba(5,11,24,0.7)', border: `1px solid ${item.color}55`, color: item.color,
          fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: 1.5, backdropFilter: 'blur(8px)',
        }}>
          {item.cat}
        </div> */}

        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute', bottom: 18, right: 18,
            width: 46, height: 46, borderRadius: '50%',
            background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#05070d',
          }}
        >
          <Icons.ArrowRight />
        </motion.div>
      </div>

      {/* Content panel */}
      <div style={{ flex: isMobile ? 'none' : '1 1 44%', width: isMobile ? '100%' : undefined }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: isMobile ? 34 : 44, color: 'transparent',
            WebkitTextStroke: `1px ${item.color}70`, lineHeight: 1,
          }}>{num}</span>
          <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${item.color}60, transparent)` }} />
          <span style={{ fontSize: 12.5, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.45)' }}>
            {item.year || data.year}
          </span>
        </div>

        <h3 style={{
          fontSize: isMobile ? 26 : 34, fontFamily: 'var(--font-display)', fontWeight: 800,
          color: '#ffffff', marginBottom: 14, lineHeight: 1.15,
        }}>
          {item.title}
        </h3>

        <p style={{
          fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8,
          fontFamily: 'var(--font-body)', marginBottom: 22, maxWidth: 460,
        }}>
          {item.description}
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 26 }}>
          {(item.tech || data.tech || []).map(t => (
            <span key={t} style={{
              fontSize: 11.5, padding: '5px 12px', borderRadius: 100,
              background: `${item.color}12`, color: item.color, border: `1px solid ${item.color}30`,
              fontFamily: 'var(--font-mono)', fontWeight: 500,
            }}>{t}</span>
          ))}
        </div>

        <button
          onClick={openLink}
          data-hover
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'transparent', border: 'none', cursor: item?.link ? 'pointer' : 'default',
            color: '#ffffff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5,
            padding: 0, borderBottom: `1px solid ${item.color}`, paddingBottom: 4,
          }}
        >
          View Case Study <Icons.ArrowRight />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Portfolio / Case Studies Section ─────────────────────────────────
export default function Portfolio() {
  const { isMobile } = useBreakpoint();
  const { data } = useGetProjectsQuery();
  const navigate = useNavigate();

  if (!data?.data?.length) return null;
  const projects = data.data;

  return (
    <section
      id="portfolio"
      style={{
        padding: isMobile ? '60px 5% 70px' : '70px 6% 90px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=50"
          alt="" loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(90px) brightness(0.05) saturate(2)', opacity: 0.8 }}
        />
      </div>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4 }} />

      <div className="scroll-reveal" style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: isMobile ? 'center' : 'left', marginBottom: isMobile ? 20 : 10, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'center' : 'flex-end', gap: 20 }}>
          <div>
            <SectionTag>Case Studies</SectionTag>
            <motion.h2
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: 'clamp(28px,4vw,52px)', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff' }}
            >
              Our <span className="gt">Finest Work</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', maxWidth: 360, fontFamily: 'var(--font-body)', lineHeight: 1.7 }}
          >
            A closer look at the products we've engineered — real problems, real outcomes.
          </motion.p>
        </div>

        {/* Rows */}
        <div>
          {projects.map((item, i) => (
            <CaseStudyRow key={item.title} item={item} index={i} isMobile={isMobile} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: 'center', marginTop: 50 }}
        >
          <button onClick={() => navigate('/portfolio')} className="btn-ghost" data-hover style={{ fontSize: 13 }}>
            View All Projects <Icons.ArrowRight />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
