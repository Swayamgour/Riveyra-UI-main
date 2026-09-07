import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'
// import { SERVICES } from '../data.jsx'
import { useNavigate } from 'react-router-dom'
import { useGetNavDropdownItemsQuery } from '../../redux/api.jsx'
import { FiTrendingUp, FiMonitor, FiSmartphone, FiShield, FiSearch, FiPenTool } from 'react-icons/fi'

const CATEGORY_STYLES = {
  "Digital Marketing": { icon: <FiTrendingUp size={22} />, accent: '#f87171' },
  "Web Development": { icon: <FiMonitor size={22} />, accent: '#60a5fa' },
  "App Development": { icon: <FiSmartphone size={22} />, accent: '#c084fc' },
  "Cyber Security": { icon: <FiShield size={22} />, accent: '#34d399' },
  "Cybersecurity": { icon: <FiShield size={22} />, accent: '#34d399' },
  "SEO": { icon: <FiSearch size={22} />, accent: '#fbbf24' },
  "Graphic Designing": { icon: <FiPenTool size={22} />, accent: '#818cf8' },
  "Graphic Design": { icon: <FiPenTool size={22} />, accent: '#818cf8' },
}

// ─── Service data ─────────────────────────────────────────────────────────────
// {SERVICES}

const STYLE = `
  .srv-section {
    padding: 80px 6% 96px;
    background: #050B18;
    position: relative;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
  }
  @media (max-width: 1023px) {
    .srv-section { padding: 64px 6% 80px; }
  }
  @media (max-width: 767px) {
    .srv-section { padding: 60px 5% 72px; }
  }

  .srv-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0);
    background-size: 36px 36px;
    pointer-events: none;
  }

  /* ── GRID ── */
  .srv-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 2px;
    overflow: hidden;
  }
  @media (max-width: 900px) { .srv-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px) { .srv-grid { grid-template-columns: 1fr; } }

  /* ── CARD ── */
  .srv-card {
    padding: 36px 32px 40px;
    border-right: 1px solid rgba(255,255,255,0.07);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    cursor: default;
    position: relative;
    transition: background 0.35s ease;
    background: transparent;
    /* Ensure content never clips on scroll */
    overflow: visible;
    box-sizing: border-box;
  }
  @media (max-width: 767px) {
    .srv-card { padding: 24px 18px 30px; }
  }
  @media (max-width: 400px) {
    .srv-card { padding: 20px 14px 26px; }
  }

  /* ── BORDER RULES: 3-col desktop ── */
  .srv-card:nth-child(3n)         { border-right: none; }
  .srv-card:nth-last-child(-n+3)  { border-bottom: none; }

  /* ── BORDER RULES: 2-col tablet ── */
  @media (max-width: 900px) and (min-width: 561px) {
    .srv-card:nth-child(3n)        { border-right: 1px solid rgba(255,255,255,0.07); }
    .srv-card:nth-last-child(-n+3) { border-bottom: 1px solid rgba(255,255,255,0.07); }
    .srv-card:nth-child(2n)        { border-right: none; }
    .srv-card:nth-last-child(-n+2) { border-bottom: none; }
  }

  /* ── BORDER RULES: 1-col mobile ── */
  @media (max-width: 560px) {
    .srv-card:nth-child(3n),
    .srv-card:nth-child(2n)        { border-right: none; }
    .srv-card:nth-last-child(-n+3),
    .srv-card:nth-last-child(-n+2) { border-bottom: 1px solid rgba(255,255,255,0.07); }
    .srv-card:last-child           { border-bottom: none; }
    .srv-card                      { border-right: none; }
  }

  .srv-card:hover { background: rgba(255,255,255,0.03); }

  /* On touch/mobile — always show accent bar, remove hover bg flash */
  @media (hover: none) {
    .srv-card-top-bar { opacity: 1 !important; }
    .srv-card:hover   { background: transparent; }
  }

  .srv-card-top-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .srv-card:hover .srv-card-top-bar { opacity: 1; }

  .srv-icon-wrap {
    width: 48px; 
    height: 48px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
    transition: transform 0.3s ease;
  }
  @media (max-width: 560px) {
    .srv-icon-wrap { width: 48px; height: 40px; margin-bottom: 14px; }
  }
  .srv-card:hover .srv-icon-wrap { transform: scale(1.08); }

  .srv-title {
    font-family: 'Plus Jakarta Sans';
    font-size: clamp(15px, 4vw, 18px);
    font-weight: 700;
    color: #fff;
    margin: 0 0 12px;
    letter-spacing: -0.2px;
  }

  .srv-desc {
    font-size: clamp(13px, 3.2vw, 14px);
    line-height: 1.75;
    color: rgba(255,255,255,0.55);
    margin: 0 0 20px;
  }

  .srv-tags { display: flex; flex-wrap: wrap; gap: 6px; }

  .srv-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: clamp(9px, 2.4vw, 15px);
    font-weight: 500;
    padding: 3px 8px;
    border-radius: 3px;
    transition: background 0.2s;
    /* Prevent tags from overflowing card on tiny screens */
    white-space: nowrap;
  }

  .srv-arrow {
    margin-top: 20px;
    display: flex; align-items: center; gap: 6px;
    font-family: 'Syne', sans-serif;
    font-size: 12.5px; font-weight: 700;
    letter-spacing: 0.3px;
    transition: opacity 0.3s, transform 0.3s;
  }
  /* Always show arrow on touch devices — framer opacity is overridden via isMobile prop in JSX */
  @media (hover: none) {
    .srv-arrow { opacity: 1 !important; transform: none !important; }
  }

  .srv-section-label {
    display: inline-flex; align-items: center; gap: 8px;
    // font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 500;
    color: #4F8EF7;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 16px;
    text-align: center;
  }
  @media (max-width: 560px) {
    .srv-section-label { font-size: 10px; letter-spacing: 1px; }
  }
  .srv-section-label::before {
    padding: 0 4px;
    content: '';
    width: 20px; height: 1.5px;
    background: #4F8EF7;
  }

  .srv-h2 {
    font-family: 'Plus Jakarta Sans';
    font-size: clamp(24px, 6vw, 48px);
    font-weight: 700;
    letter-spacing: -0.5px;
    line-height: 1.15;
  }
  .srv-h2 span { color: transparent; -webkit-text-stroke: 1.5px rgba(255,255,255,0.35); }

  .srv-sub {
    font-size: clamp(13.5px, 3.5vw, 16px);
    color: rgba(255,255,255,0.5);
    line-height: 1.8;
    max-width: 500px;
    margin: 0 0 56px;
    padding: 48px 8px;
    text-align: center;
  }
  @media (max-width: 767px) {
    .srv-sub { padding: 32px 8px; margin: 0 0 40px; }
  }
`

// Inject once
if (typeof document !== 'undefined' && !document.getElementById('srv-styles')) {
  const el = document.createElement('style')
  el.id = 'srv-styles'
  el.textContent = STYLE
  document.head.appendChild(el)
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Services() {
  const [hovered, setHovered] = useState(null)
  const { isMobile } = useBreakpoint()

  const { data } = useGetNavDropdownItemsQuery()

  const navigate = useNavigate()

  const services = [
    {
      id: 1,
      title: "Web Development",
      description:
        "Build powerful, responsive, and scalable websites and web applications tailored to your business goals. Our development team combines modern technologies, intuitive experiences, and performance-focused architecture to create digital platforms that are secure, fast, and ready to grow with your business.",
      cta: "Explore Web Development",
    },
    {
      id: 2,
      title: "App Development",
      description:
        "Turn your ideas into engaging and high-performance mobile applications for iOS and Android. We create user-friendly, scalable apps with seamless functionality and modern interfaces that help businesses connect with their customers and deliver exceptional mobile experiences.",
      cta: "Explore App Development",
    },
    {
      id: 3,
      title: "Digital Marketing",
      description:
        "Grow your brand and reach the right audience with data-driven digital marketing strategies. From building your online presence to generating qualified leads, we combine creative campaigns, performance insights, and targeted strategies to help your business achieve measurable digital growth.",
      cta: "Explore Digital Marketing",
    },
    {
      id: 4,
      title: "Cybersecurity",
      description:
        "Protect your digital assets, applications, and business infrastructure with robust cybersecurity solutions. Our security-focused approach helps identify vulnerabilities, strengthen protection, and reduce digital risks so your business can operate with greater confidence.",
      cta: "Explore Cybersecurity",
    },
    {
      id: 5,
      title: "SEO",
      description:
        "Improve your search visibility and attract more qualified customers with strategic SEO solutions. We optimize your website, content, technical foundation, and overall search presence to build sustainable organic traffic and help your business compete more effectively in search results.",
      cta: "Explore SEO Services",
    },
    {
      id: 6,
      title: "Graphic Designing",
      description:
        "Create a memorable brand presence with professional and visually engaging graphic design. From brand identity and social media creatives to marketing materials and digital assets, we combine creativity and strategy to ensure your brand communicates clearly and consistently across every platform.",
      cta: "Explore Graphic Design",
    },
  ];

  // Depend on how your API returns the data, it might be in `data.data` or `data` directly
  // const items = data?.data || data || []
  const items = services

  return (
    <section id="services" className="srv-section">
      <div className="scroll-reveal" style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 8px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <p className="srv-section-label">What We Offer</p>

          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(28px,4vw,56px)', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff' }}
          >
            Complete IT & Digital Solutions <span className="gt">for Modern Businesses</span>
          </motion.h2>

          <p className="srv-sub">
            From software development and cybersecurity to SEO and creative design, we deliver end-to-end digital solutions built to strengthen your online presence, streamline operations, and accelerate business growth.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="srv-grid">
          {items.map((item, i) => {
            const isHov = hovered === i
            const catStyle = CATEGORY_STYLES[item.categories] || { icon: <FiMonitor size={22} />, accent: '#60a5fa' }
            const accent = catStyle.accent

            return (
              <motion.div
                key={item._id || i}
                className="srv-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => navigate(`/ServiceCategories/${item.categorySlug}`)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="srv-card-top-bar"
                  style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
                />

                <div
                  className="srv-icon-wrap"
                  style={{
                    background: `${accent}14`,
                    border: `1px solid ${accent}30`,
                    color: accent,
                    boxShadow: isHov ? `0 0 20px ${accent}22` : 'none',
                  }}
                >
                  {catStyle.icon}
                </div>

                <h3 className="srv-title">{item.title}</h3>
                <p className="srv-desc">{item.description}</p>

                {/* <div className="srv-tags">
                  {item.subcategories?.slice(0, 3).map((sub, idx) => {
                    const subName = typeof sub === 'string' ? sub : sub.name;
                    const subSlug = typeof sub === 'string' ? sub : sub.slug;
                    return (
                      <span
                        key={idx}
                        className="srv-tag"
                        style={{ background: `${accent}10`, color: accent, border: `1px solid ${accent}22`, cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/services/${encodeURIComponent(item.categorySlug)}/${encodeURIComponent(subSlug)}`);
                        }}
                      >
                        {subName}
                      </span>
                    )
                  })}
                  {item.subcategories?.length > 3 && (
                    <span className="srv-tag" style={{ background: `${accent}10`, color: accent, border: `1px solid ${accent}22` }}>
                      +{item.subcategories.length - 3} more
                    </span>
                  )}
                </div> */}

                <motion.div
                  className="srv-arrow"
                  // animate={{
                  //   opacity: isMobile ? 1 : isHov ? 1 : 0,
                  //   x: isMobile ? 0 : isHov ? 0 : -8,
                  // }}
                  transition={{ duration: 0.25 }}
                  style={{ color: accent, marginTop: isMobile ? 16 : 20 }}
                >
                  {item?.cta}
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}