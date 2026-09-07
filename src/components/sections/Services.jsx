import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'
import { useNavigate } from 'react-router-dom'
import { useGetNavDropdownItemsQuery } from '../../redux/api.jsx'
import * as LucideIcons from 'lucide-react'
import { 
  FiTrendingUp, 
  FiMonitor, 
  FiSmartphone, 
  FiShield, 
  FiCpu, 
  FiCloud, 
  FiLayers, 
  FiActivity, 
  FiArrowRight, 
  FiCode,
  FiZap,
  FiDatabase
} from 'react-icons/fi'

import { resolveLucideIcon } from '../../utils/resolveLucideIcon'

// ─── Category Visual Matcher ──────────────────────────────────────────────────
const CATEGORY_STYLES = {
  "Digital Marketing": { icon: <FiTrendingUp size={24} />, accent: '#f43f5e', tag: 'Growth' },
  "Web Development":   { icon: <FiMonitor size={24} />, accent: '#3b82f6', tag: 'Core Tech' },
  "App Development":   { icon: <FiSmartphone size={24} />, accent: '#a855f7', tag: 'Mobile' },
  "Cyber Security":    { icon: <FiShield size={24} />, accent: '#10b981', tag: 'Security' },
}

const getCategoryStyle = (item = {}) => {
  const category = typeof item === 'string' ? item : item?.categories || '';
  const customIconName = typeof item === 'object' ? item?.iconName : null;
  const customColor = typeof item === 'object' ? (item?.color || item?.accent) : null;
  const customTag = typeof item === 'object' ? item?.tag : null;

  // Resolve dynamic icon from admin if provided
  const dynamicIcon = resolveLucideIcon(customIconName, 24);

  // Fallback defaults
  let baseStyle = CATEGORY_STYLES[category];
  
  if (!baseStyle) {
    const lower = category.toLowerCase();
    if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('ml')) {
      baseStyle = { icon: <FiCpu size={24} />, accent: '#06b6d4', tag: 'Intelligence' };
    } else if (lower.includes('cloud') || lower.includes('devops') || lower.includes('infra')) {
      baseStyle = { icon: <FiCloud size={24} />, accent: '#6366f1', tag: 'Cloud' };
    } else if (lower.includes('data') || lower.includes('analytics') || lower.includes('bi')) {
      baseStyle = { icon: <FiActivity size={24} />, accent: '#10b981', tag: 'Analytics' };
    } else if (lower.includes('marketing') || lower.includes('seo') || lower.includes('aeo') || lower.includes('geo')) {
      baseStyle = { icon: <FiTrendingUp size={24} />, accent: '#f43f5e', tag: 'Strategy' };
    } else if (lower.includes('security') || lower.includes('cyber')) {
      baseStyle = { icon: <FiShield size={24} />, accent: '#10b981', tag: 'Security' };
    } else if (lower.includes('app') || lower.includes('mobile') || lower.includes('ios') || lower.includes('android')) {
      baseStyle = { icon: <FiSmartphone size={24} />, accent: '#a855f7', tag: 'Mobile' };
    } else if (lower.includes('database') || lower.includes('sql') || lower.includes('erp')) {
      baseStyle = { icon: <FiDatabase size={24} />, accent: '#f59e0b', tag: 'Enterprise' };
    } else {
      baseStyle = { icon: <FiCode size={24} />, accent: '#3b82f6', tag: 'Engineering' };
    }
  }

  const validColor = customColor && typeof customColor === 'string' && customColor.trim() !== '' ? customColor.trim() : null;
  const validTag = customTag && typeof customTag === 'string' && customTag.trim() !== '' ? customTag.trim() : null;

  return {
    icon: dynamicIcon || baseStyle.icon,
    accent: validColor || baseStyle.accent,
    tag: validTag || baseStyle.tag
  };
};

const STYLE = `
  .srv-section {
    padding: 100px 6% 120px;
    background: #050B18;
    position: relative;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
  }
  @media (max-width: 1023px) {
    .srv-section { padding: 80px 5% 96px; }
  }
  @media (max-width: 767px) {
    .srv-section { padding: 60px 4% 80px; }
  }

  .srv-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at 1px 1px, rgba(255,255,255,0.035) 1px, transparent 0),
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.12), transparent);
    background-size: 36px 36px, 100% 100%;
    pointer-events: none;
  }

  /* ── GRID ── */
  .srv-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    position: relative;
    z-index: 2;
  }
  @media (max-width: 1100px) {
    .srv-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
  }
  @media (max-width: 680px) {
    .srv-grid { grid-template-columns: 1fr; gap: 20px; }
  }

  /* ── MODERN SERVICE CARD ── */
  .srv-card-new {
    background: linear-gradient(160deg, rgba(15, 23, 42, 0.65) 0%, rgba(7, 13, 27, 0.85) 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 34px 30px 30px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                border-color 0.35s ease,
                box-shadow 0.4s ease,
                background 0.35s ease;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  }
  @media (max-width: 767px) {
    .srv-card-new { padding: 26px 22px 24px; border-radius: 16px; }
  }

  .srv-card-new:hover {
    transform: translateY(-7px);
  }

  /* Ambient Glow Layer */
  .srv-card-glow {
    position: absolute;
    top: -50px;
    right: -50px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    filter: blur(45px);
    opacity: 0.15;
    transition: opacity 0.4s ease, transform 0.4s ease;
    pointer-events: none;
  }
  .srv-card-new:hover .srv-card-glow {
    opacity: 0.35;
    transform: scale(1.2);
  }

  /* Top Linear Indicator */
  .srv-card-top-beam {
    position: absolute;
    top: 0;
    left: 20px;
    right: 20px;
    height: 2px;
    border-radius: 0 0 4px 4px;
    opacity: 0.3;
    transition: opacity 0.35s ease, left 0.35s ease, right 0.35s ease;
  }
  .srv-card-new:hover .srv-card-top-beam {
    opacity: 1;
    left: 0;
    right: 0;
  }

  /* Top Row (Icon + Track Tag) */
  .srv-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .srv-icon-box {
    width: 54px;
    height: 54px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
    position: relative;
    z-index: 1;
  }
  @media (max-width: 767px) {
    .srv-icon-box { width: 48px; height: 48px; border-radius: 12px; }
  }
  .srv-card-new:hover .srv-icon-box {
    transform: scale(1.08) rotate(2deg);
  }

  .srv-track-pill {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .srv-track-pill::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.8;
  }

  /* Title & Description */
  .srv-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(18px, 2.5vw, 21px);
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 12px;
    line-height: 1.35;
    letter-spacing: -0.3px;
    transition: color 0.3s ease;
  }

  .srv-desc {
    font-size: 14px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.65);
    margin: 0 0 24px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Subcategories Tags */
  .srv-tags-container {
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-top: 6px;
    margin-bottom: 24px;
  }

  .srv-tag-pill {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.8);
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: all 0.25s ease;
    white-space: nowrap;
    text-decoration: none;
  }
  .srv-tag-pill:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .srv-tag-more {
    font-family: 'Inter', sans-serif;
    font-size: 11.5px;
    font-weight: 600;
    padding: 6px 10px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px dashed rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.5);
  }

  /* Footer / Action Area */
  .srv-card-footer {
    padding-top: 18px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: border-color 0.35s ease;
  }

  .srv-action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13.5px;
    font-weight: 700;
    letter-spacing: 0.3px;
    transition: transform 0.3s ease;
  }

  .srv-action-arrow {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease;
  }
  .srv-card-new:hover .srv-action-arrow {
    transform: translateX(4px);
  }

  /* Section Header */
  .srv-section-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    font-weight: 600;
    color: #60a5fa;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 16px;
    background: rgba(96, 165, 250, 0.1);
    border: 1px solid rgba(96, 165, 250, 0.2);
    padding: 6px 14px;
    border-radius: 30px;
  }

  .srv-sub {
    font-size: clamp(14px, 3.5vw, 16.5px);
    color: rgba(255, 255, 255, 0.65);
    line-height: 1.8;
    max-width: 620px;
    margin: 16px auto 56px;
    text-align: center;
  }
  @media (max-width: 767px) {
    .srv-sub { margin: 12px auto 40px; }
  }
`

// Inject once
if (typeof document !== 'undefined' && !document.getElementById('srv-styles-redesign')) {
  const el = document.createElement('style')
  el.id = 'srv-styles-redesign'
  el.textContent = STYLE
  document.head.appendChild(el)
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Services() {
  const [hovered, setHovered] = useState(null)
  const { isMobile } = useBreakpoint()
  const { data } = useGetNavDropdownItemsQuery()
  const navigate = useNavigate()

  const items = data?.data || data || []

  return (
    <section id="services" className="srv-section">
      <div className="scroll-reveal" style={{ maxWidth: 1240, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div className="srv-section-label">
            <span>What We Offer</span>
          </div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              fontSize: 'clamp(28px, 4.5vw, 54px)', 
              fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)', 
              fontWeight: 800, 
              color: '#ffffff',
              letterSpacing: '-1px',
              maxWidth: 900
            }}
          >
            Deep Technical Expertise, <span className="gt">Supporting Modern Systems</span>
          </motion.h2>

          <p className="srv-sub">
            End-to-end solutions across AI, blockchain, cloud, and security — engineered to scale with your ambitions.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="srv-grid">
          {items.map((item, i) => {
            const isHov = hovered === i
            const catStyle = getCategoryStyle(item)
            const accent = catStyle.accent
            const itemIndex = String(i + 1).padStart(2, '0')

            return (
              <motion.div
                key={item._id || i}
                className="srv-card-new"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  const slug = (item.categories || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                  navigate(`/${slug}`);
                }}
                style={{
                  borderColor: isHov ? `${accent}60` : 'rgba(255, 255, 255, 0.08)',
                  boxShadow: isHov 
                    ? `0 25px 50px -15px ${accent}25, 0 0 0 1px ${accent}30` 
                    : '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Glowing Aura Orb */}
                <motion.div 
                  className="srv-card-glow" 
                  style={{ background: accent }}
                  animate={{
                    scale: isHov ? 1.45 : 1,
                    opacity: isHov ? 0.38 : 0.12,
                  }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />

                {/* Top Accent Beam */}
                <motion.div
                  className="srv-card-top-beam"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                  animate={{
                    opacity: isHov ? 1 : 0.25,
                    left: isHov ? '0%' : '15%',
                    right: isHov ? '0%' : '15%',
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />

                {/* Card Header: Icon + Track Badge */}
                <div className="srv-card-header">
                  <motion.div
                    className="srv-icon-box"
                    style={{
                      background: `linear-gradient(135deg, ${accent}22, ${accent}08)`,
                      border: `1px solid ${accent}40`,
                      color: accent,
                      boxShadow: isHov ? `0 0 25px ${accent}40` : 'none',
                    }}
                    animate={{
                      scale: isHov ? 1.12 : 1,
                      rotate: isHov ? [0, -6, 6, 0] : 0,
                    }}
                    transition={{
                      scale: { type: 'spring', stiffness: 400, damping: 20 },
                      rotate: { duration: 0.45, ease: 'easeInOut' }
                    }}
                  >
                    {catStyle.icon}
                  </motion.div>

                  <motion.div 
                    className="srv-track-pill"
                    style={{
                      background: `${accent}12`,
                      color: accent,
                      border: `1px solid ${accent}30`
                    }}
                    animate={{
                      scale: isHov ? 1.05 : 1,
                      borderColor: isHov ? `${accent}60` : `${accent}30`
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    <span>{itemIndex}</span>
                    <span style={{ opacity: 0.4 }}>/</span>
                    <span>{catStyle.tag}</span>
                  </motion.div>
                </div>

                {/* Title & Description */}
                <motion.h3 
                  className="srv-title"
                  animate={{
                    x: isHov ? 3 : 0,
                    color: isHov ? accent : '#ffffff'
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {item.categories}
                </motion.h3>
                
                <p className="srv-desc">
                  {item.desc || 'Comprehensive enterprise solutions tailored for high performance, security, and scalable infrastructure.'}
                </p>

                {/* Subcategory Pills */}
                <div className="srv-tags-container">
                  {item.subcategories?.slice(0, 3).map((sub, idx) => {
                    const subName = typeof sub === 'string' ? sub : sub.name;
                    return (
                      <motion.span 
                        key={idx} 
                        className="srv-tag-pill" 
                        whileHover={{ 
                          scale: 1.06, 
                          y: -3, 
                          backgroundColor: `${accent}20`,
                          borderColor: `${accent}50`,
                          color: '#ffffff'
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                        style={{ 
                          borderColor: isHov ? `${accent}25` : 'rgba(255,255,255,0.08)',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const catSlug = (item.categories || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                          const subSlug = (subName || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                          navigate(`/${catSlug}/${subSlug}`);
                        }}
                      >
                        <span style={{ color: accent, fontSize: '10px' }}>•</span>
                        {subName}
                      </motion.span>
                    )
                  })}
                  {item.subcategories?.length > 3 && (
                    <motion.span 
                      className="srv-tag-more"
                      whileHover={{ scale: 1.05 }}
                      style={{
                        borderColor: isHov ? `${accent}40` : 'rgba(255,255,255,0.15)',
                        color: isHov ? accent : 'rgba(255,255,255,0.6)'
                      }}
                    >
                      +{item.subcategories.length - 3} more
                    </motion.span>
                  )}
                </div>

                {/* Footer Action */}
                <div 
                  className="srv-card-footer"
                  style={{
                    borderColor: isHov ? `${accent}25` : 'rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <motion.div 
                    className="srv-action-btn" 
                    style={{ color: accent }}
                    animate={{ x: isHov ? 4 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <span>Explore Service</span>
                  </motion.div>

                  <motion.div 
                    className="srv-action-arrow"
                    style={{
                      background: isHov ? `${accent}25` : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${isHov ? `${accent}60` : 'rgba(255, 255, 255, 0.08)'}`,
                      color: accent
                    }}
                    animate={{
                      x: isHov ? 6 : 0,
                      scale: isHov ? 1.12 : 1
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <FiArrowRight size={14} />
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}