import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetNavDropdownItemByCategoryQuery } from '../redux/api';
import Loader from '../components/Loader';

// Magnetic Button Component
const MagneticButton = ({ children, onClick, style }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden'
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      <motion.div
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', x: '-100%' }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
      />
    </motion.button>
  );
};

// 3D Tilt Card Component
const TiltCard = ({ sub, serviceCategory, onClick, delay }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -10);
    setRotateY(((x - centerX) / centerX) * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
        }}
        whileHover={{
          borderColor: 'rgba(79, 142, 247, 0.5)',
          boxShadow: '0 20px 40px -10px rgba(79, 142, 247, 0.2)'
        }}
      >
        {/* Animated Gradient Glow on Hover */}
        <motion.div 
          style={{
            position: 'absolute',
            inset: '-1px',
            background: 'linear-gradient(45deg, transparent, rgba(79, 142, 247, 0.2), transparent)',
            opacity: 0,
            zIndex: 0
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        <div style={{ transform: 'translateZ(30px)', position: 'relative', zIndex: 1 }}>
          <h5 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
            {typeof sub === 'string' ? sub : sub.name}
          </h5>
          {sub.desc && (
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              {sub.desc}
            </p>
          )}
          <div style={{ fontSize: '11px', color: '#4F8EF7', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '32px' }}>
            {serviceCategory}
          </div>
        </div>
        
        <div style={{ marginTop: 'auto', transform: 'translateZ(20px)', position: 'relative', zIndex: 1 }}>
          <div style={{
            background: 'rgba(79, 142, 247, 0.1)',
            color: '#4F8EF7',
            border: '1px solid rgba(79, 142, 247, 0.2)',
            padding: '12px 24px',
            borderRadius: '40px',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
          className="discover-btn"
          >
            Discover 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s' }}>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>

        {/* Global style for hover effect on the button inside the card */}
        <style>{`
          div:hover > div > .discover-btn {
            background: #4F8EF7 !important;
            color: #fff !important;
          }
          div:hover > div > .discover-btn svg {
            transform: translateX(4px);
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
};

const ServicesCategoriesSkeleton = () => {
  const { slug: categoryName } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useGetNavDropdownItemByCategoryQuery(categoryName);
  
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const service = response?.data;
  const currentTechTools = service?.techTools || [];

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveCategoryIndex(0);
  }, [categoryName]);

  if (isLoading) return <Loader />;
  
  if (error || !service) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#050B18' }}>
        <h2>Service not found</h2>
        <button onClick={() => navigate('/')} style={{ marginLeft: '20px', padding: '10px 20px', background: '#4F8EF7', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Go Home</button>
      </div>
    );
  }

  return (
    <div style={{ background: '#030712', minHeight: '100vh', paddingTop: '100px', color: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
      
      {/* Immersive Animated Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {/* Glow Orbs */}
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(79, 142, 247, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `, 
          backgroundSize: '50px 50px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
        }} />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%', position: 'relative', zIndex: 1 }}>
        
        {/* Hero Section */}
        <section style={{ textAlign: 'center', position: 'relative', padding: '0 0 40px 0' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(79, 142, 247, 0.1)', border: '1px solid rgba(79, 142, 247, 0.2)', borderRadius: '30px', color: '#4F8EF7', fontSize: '13px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '24px' }}
            >
              Expertise
            </motion.div>

            <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800, margin: '0 0 24px', letterSpacing: '-1px', lineHeight: 1.1 }}>
              <span style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {service.categories}
              </span>
            </h1>
            {service.desc && (
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(18px, 2.5vw, 22px)', maxWidth: '700px', margin: '0 auto 32px', lineHeight: 1.6, fontWeight: 400 }}>
                {service.desc}
              </p>
            )}
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
              <li><Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>Home</Link></li>
              <li>/</li>
              <li>Services</li>
              <li>/</li>
              <li style={{ color: '#fff', fontWeight: 500 }}>{service.categories}</li>
            </ul>
          </motion.div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', width: '80%', margin: '0 auto' }} />

        {/* 3D Glassmorphism Categories Section */}
        <section style={{ padding: '60px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, marginBottom: '16px', letterSpacing: '-0.5px' }}
            >
              Explore <span style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{service.categories}</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}
            >
              Discover our specialized services tailored to elevate your business.
            </motion.p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {service.subcategories && service.subcategories.length > 0 ? (
              service.subcategories.map((sub, idx) => (
                <TiltCard 
                  key={idx} 
                  sub={sub} 
                  serviceCategory={service.categories}
                  onClick={() => navigate(`/services/${encodeURIComponent(service.categories)}/${encodeURIComponent(typeof sub === 'string' ? sub : sub.name)}`)}
                  delay={0.1 * idx}
                />
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '40px' }}>
                No categories available.
              </div>
            )}
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', width: '80%', margin: '0 auto' }} />

        {/* Interactive Tech Stack Section */}
        <section style={{ padding: '60px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, marginBottom: '16px', letterSpacing: '-0.5px' }}
            >
              Powered by <span style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Next-Gen Tech</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}
            >
              We leverage the most advanced tools and frameworks to build scalable {service.categories.toLowerCase()} solutions.
            </motion.p>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '20px',
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '32px',
            padding: '12px',
            overflow: 'hidden',
          }}>
            {/* Animated Tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '12px', paddingBottom: '20px' }} className="hide-scrollbar">
              {currentTechTools.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategoryIndex(idx)}
                  style={{
                    position: 'relative',
                    padding: '12px 24px',
                    background: 'transparent',
                    border: 'none',
                    color: activeCategoryIndex === idx ? '#fff' : 'rgba(255,255,255,0.5)',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.3s ease',
                    zIndex: 1
                  }}
                >
                  {activeCategoryIndex === idx && (
                    <motion.div
                      layoutId="activeTab"
                      style={{ position: 'absolute', inset: 0, background: 'rgba(79, 142, 247, 0.15)', border: '1px solid rgba(79, 142, 247, 0.3)', borderRadius: '100px', zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {cat.category}
                </button>
              ))}
            </div>

            {/* Content Area with Marquee/Grid */}
            <div style={{ 
              padding: '24px 12px 40px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'center',
              minHeight: '200px'
            }}>
              <AnimatePresence mode="popLayout">
                {currentTechTools[activeCategoryIndex]?.tools.map((tool, idx) => (
                  <motion.div
                    key={`${activeCategoryIndex}-${tool.name}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20, delay: idx * 0.05 }}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '20px',
                      padding: '16px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'default'
                    }}
                    whileHover={{
                      y: -5,
                      background: 'rgba(255,255,255,0.06)',
                      borderColor: 'rgba(255,255,255,0.15)'
                    }}
                  >
                    <img 
                      src={tool.icon} 
                      alt={tool.name} 
                      style={{ width: '32px', height: '32px', objectFit: 'contain', filter: tool.icon.includes('ffffff') ? 'none' : 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }} 
                    />
                    <span style={{ fontSize: '16px', fontWeight: 600, color: '#e2e8f0' }}>{tool.name}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

      </div>

      {/* Premium CTA Section */}
      <section style={{ position: 'relative', padding: '60px 5%', background: '#050B18', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Glowing Background for CTA */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '300px', background: 'radial-gradient(ellipse at center, rgba(79,142,247,0.15) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 800, margin: '0 0 24px', letterSpacing: '-1px', lineHeight: 1.1 }}
          >
            Ready to Build Something <span style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Amazing?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', marginBottom: '40px' }}
          >
            Let's transform your vision into reality with our expert {service.categories.toLowerCase()} solutions.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <MagneticButton 
              onClick={() => navigate('/contact')}
              style={{
                background: '#4F8EF7',
                color: '#fff',
                border: 'none',
                padding: '16px 40px',
                borderRadius: '40px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 10px 30px -10px rgba(79, 142, 247, 0.5)'
              }}
            >
              Get in Touch
            </MagneticButton>
          </motion.div>
        </div>
      </section>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ServicesCategoriesSkeleton;
