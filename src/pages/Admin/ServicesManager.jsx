// src/pages/ServicesPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useDeleteServiceMutation, useGetServicesQuery } from '../../redux/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
// import { useBreakpoint } from '../hooks/useBreakpoint.jsx';



const categories = ['All', 'Development', 'Marketing', 'Infrastructure', 'Design'];

function ServiceCard({ svc, i, isMobile }) {
    const [hov, setHov] = useState(false);
    const navigate = useNavigate();

    const [deleteServices] = useDeleteServiceMutation()


    const handleDelete = (id) => {
        // console.log(id)
        deleteServices(id)
    }



    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            // onClick={() => navigate(svc.path)}
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: isMobile ? '24px 20px 28px' : '28px 24px 32px',
                borderRadius: 20,
                background: hov ? `rgba(96,165,250,0.04)` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${hov ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.07)'}`,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                transform: hov ? 'translateY(-6px)' : 'none',
                boxShadow: hov ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${svc.accent}20` : 'none',
                backdropFilter: 'blur(12px)',
            }}
        >
            {/* Top accent bar */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${svc.accent}, transparent)`,
                opacity: hov ? 1 : 0,
                transition: 'opacity 0.3s',
            }} />

            {/* Icon container */}
            <div style={{
                width: isMobile ? 52 : 56,
                height: isMobile ? 52 : 56,
                borderRadius: 14,
                marginBottom: isMobile ? 16 : 20,
                background: `${svc.accent}12`,
                border: `1px solid ${svc.accent}25`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? 28 : 32,
                transform: hov ? 'scale(1.08) rotate(-2deg)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}>
                <img src={svc.icons} alt={svc.title} />
            </div>

            {/* Title */}
            <h3 style={{
                fontSize: isMobile ? 17 : 18,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: '#fff',
                marginBottom: 6,
                letterSpacing: '-0.3px',
            }}>
                {svc.title}
            </h3>

            {/* Tagline */}
            <p style={{
                fontSize: isMobile ? 11 : 12,
                color: svc.accent,
                fontFamily: 'var(--font-mono)',
                letterSpacing: isMobile ? 1 : 1.5,
                textTransform: 'uppercase',
                marginBottom: 12,
                opacity: 0.8,
            }}>
                {svc.tagline}
            </p>

            {/* Description */}
            <p style={{
                fontSize: isMobile ? 13 : 13.5,
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.55)',
                marginBottom: 20,
                fontFamily: 'var(--font-body)',
                flex: 1,
            }}>
                {svc.desc}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: isMobile ? 16 : 20 }}>
                {svc.tags.slice(0, 3)?.map((tag, index) => (
                    <span key={index} style={{
                        fontSize: isMobile ? 9 : 10,
                        fontFamily: 'var(--font-mono)',
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: `${svc.accent}10`,
                        color: svc.accent,
                        border: `1px solid ${svc.accent}20`,
                    }}>{tag}</span>
                ))}
            </div>

            {/* Learn more link */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: svc.accent,
                letterSpacing: 1,
                textTransform: 'uppercase',
                opacity: isMobile ? 1 : hov ? 1 : 0,
                transform: isMobile ? 'none' : hov ? 'translateX(0)' : 'translateX(-8px)',
                transition: 'all 0.25s ease',
            }}>
                Learn More
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
            </div>
            <div style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                zIndex: 10,
                display: 'flex',
                gap: 6
            }}>
                {/* ✏️ EDIT */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/services/${svc?._id}/edit`);
                    }}
                    style={{
                        padding: '6px 12px',
                        background: 'rgba(96,165,250,0.1)',
                        border: '1px solid rgba(96,165,250,0.3)',
                        borderRadius: 6,
                        color: '#60a5fa',
                        fontSize: 11,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                    }}
                >
                    <FaEdit /> Edit
                </button>

                {/* 🗑 DELETE */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(svc?._id);
                    }}
                    style={{
                        padding: '6px 12px',
                        background: 'rgba(248,113,113,0.1)',
                        border: '1px solid rgba(248,113,113,0.3)',
                        borderRadius: 6,
                        color: '#f87171',
                        fontSize: 11,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                    }}
                >
                    <FaTrash /> Delete
                </button>
            </div>
        </motion.div>
    );
}



export default function ServicesPage() {
    const { isMobile, isTablet } = useBreakpoint();
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();

    const { data: serviceData } = useGetServicesQuery()

    let SERVICES = serviceData?.data || []

    const filteredServices = filter === 'All'
        ? SERVICES
        : SERVICES.filter(s => s.category === filter);



    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

            <section id="services-grid" style={{
                padding: isMobile ? '48px 5% 64px' : '60px 8% 80px'
            }}>

                <div style={{ display: 'flex', justifyContent: 'end', width: '100%' }}>
                    <button className='btn-primary' onClick={() => navigate('/admin/services/create')}>Add Services</button>
                </div>

                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    {/* Section header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: 48 }}
                    >
                        <span style={{
                            fontSize: 11,
                            letterSpacing: 3,
                            color: '#60a5fa',
                            // fontFamily: 'var(--font-mono)',
                            textTransform: 'uppercase',
                            display: 'inline-block',
                            marginBottom: 12,
                        }}>What We Offer</span>
                        <h2 style={{
                            fontSize: isMobile ? 'clamp(28px, 7vw, 36px)' : 'clamp(36px, 4vw, 48px)',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            color: '#fff',
                            lineHeight: 1.2,
                        }}>
                            Comprehensive <span className="gt">Digital Solutions</span>
                        </h2>
                    </motion.div>

                    {/* Category filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            display: 'flex',
                            gap: isMobile ? 8 : 12,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            marginBottom: 40,
                        }}
                    >
                        {categories.map((cat, index) => (
                            <button
                                key={index}
                                onClick={() => setFilter(cat)}
                                style={{
                                    padding: isMobile ? '8px 16px' : '10px 24px',
                                    borderRadius: 40,
                                    fontSize: isMobile ? 12 : 13,
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: `1px solid ${filter === cat ? '#60a5fa' : 'rgba(96,165,250,0.2)'}`,
                                    background: filter === cat ? 'rgba(96,165,250,0.12)' : 'transparent',
                                    color: filter === cat ? '#60a5fa' : 'rgba(255,255,255,0.6)',
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>

                    {/* Services grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                        gap: 24,
                        alignItems: 'stretch',
                    }}>
                        {filteredServices.map((service, index) => (
                            <ServiceCard key={index} svc={service} i={index} isMobile={isMobile} />
                        ))}
                    </div>
                </div>

            </section>



        </div>
    );
}