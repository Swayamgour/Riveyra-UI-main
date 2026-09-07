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
import { useEffect } from 'react'

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
        // padding: isMobile ? '60px 5%' : isTablet ? '60px 6%' : '64px 8%',
        background: 'var(--surface)',
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: isMobile ? '60px' : isTablet ? '70px' : '0px',
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

      <div className="scroll-reveal" style={{ margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <SectionTag>Client Testimonials</SectionTag>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ fontSize: 'clamp(28px,4vw,56px)', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff' }}
          >
            What Our <span className="gt">Clients Say</span>
          </motion.h2>
        </div>

        {/* Swiper Styles */}


        <GoogleReviews />


      </div>
    </section>
  )
}



// import { useEffect } from "react";

function GoogleReviews() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widgets.sociablekit.com/google-reviews/widget.js";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="google-reviews-div">
      <div
        className="sk-ww-google-reviews"
        data-embed-id="25710940"
      ></div>
    </div>
  );
}

// export default GoogleReviews;