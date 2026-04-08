// src/pages/PortfolioPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useDeleteProjectMutation, useGetProjectsQuery } from '../../redux/api';





function PortfolioCard({ item, i, isMobile }) {
    const [hov, setHov] = useState(false);

    const [deleteProject] = useDeleteProjectMutation();

    const navigate = useNavigate();
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this project?");
        if (!confirmDelete) return;

        try {
            await deleteProject(id).unwrap();
            alert("Project deleted successfully");
        } catch (error) {
            console.error(error);
            alert(error?.data?.message || "Delete failed");
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            // onClick={() => navigate(`/portfolio/${item?.id}`)}
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 20,
                background: hov ? `rgba(96,165,250,0.04)` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${hov ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.07)'}`,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                transform: hov ? 'translateY(-6px)' : 'none',
                boxShadow: hov ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${item?.accent}20` : 'none',
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
                background: `linear-gradient(90deg, ${item?.accent}, transparent)`,
                opacity: hov ? 1 : 0,
                transition: 'opacity 0.3s',
                zIndex: 2,
            }} />

            {/* Image Container */}
            <div style={{
                position: 'relative',
                height: isMobile ? 200 : 220,
                overflow: 'hidden',
            }}>
                {/* {console.log(item)} */}
                <img
                    src={item?.workImg}
                    alt={item?.title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        transform: hov ? 'scale(1.08)' : 'scale(1)',
                    }}
                />
                {/* Overlay gradient */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(to top, rgba(2,8,18,0.9) 0%, rgba(2,8,18,0.3) 50%, transparent 100%)`,
                }} />

                {/* Category badge */}
                <div style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    padding: '4px 12px',
                    borderRadius: 20,
                    background: `${item?.accent}20`,
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${item?.accent}30`,
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    color: item?.accent,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                }}>
                    {item?.category}
                </div>

                {/* Year badge */}
                <div style={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: 'rgba(255,255,255,0.8)',
                }}>
                    {item?.year}
                </div>
            </div>

            {/* Content */}
            <div style={{
                padding: isMobile ? '20px 16px 24px' : '24px 20px 28px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/* Title */}
                <h3 style={{
                    fontSize: isMobile ? 17 : 18,
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: 8,
                    letterSpacing: '-0.3px',
                }}>
                    {item?.title}
                </h3>

                {/* Client */}
                <p style={{
                    fontSize: isMobile ? 11 : 12,
                    color: item?.accent,
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: isMobile ? 0.5 : 1,
                    marginBottom: 12,
                    opacity: 0.8,
                }}>
                    {item?.client}
                </p>

                {/* Description */}
                <p style={{
                    fontSize: isMobile ? 13 : 13.5,
                    lineHeight: 1.65,
                    color: 'rgba(255,255,255,0.55)',
                    marginBottom: 20,
                    fontFamily: 'var(--font-body)',
                    flex: 1,
                }}>
                    {item?.description}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: isMobile ? 16 : 20 }}>
                    {item?.tags?.slice(0, 3)?.map((tag, index) => (
                        <span key={index} style={{
                            fontSize: isMobile ? 9 : 10,
                            fontFamily: 'var(--font-mono)',
                            padding: '4px 10px',
                            borderRadius: 6,
                            background: `${item?.accent}10`,
                            color: item?.accent,
                            border: `1px solid ${item?.accent}20`,
                        }}>{tag}</span>
                    ))}
                    {item?.tags?.length > 3 && (
                        <span style={{
                            fontSize: isMobile ? 9 : 10,
                            fontFamily: 'var(--font-mono)',
                            padding: '4px 10px',
                            borderRadius: 6,
                            background: 'rgba(255,255,255,0.05)',
                            color: 'rgba(255,255,255,0.5)',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}>+{item?.tags.length - 3}</span>
                    )}
                </div>

                {/* View project link */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    color: item?.accent,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    opacity: isMobile ? 1 : hov ? 1 : 0,
                    transform: isMobile ? 'none' : hov ? 'translateX(0)' : 'translateX(-8px)',
                    transition: 'all 0.25s ease',
                }}>
                    View Case Study
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                </div>



                {/* 🔥 ACTION BUTTONS */}
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
                            navigate(`/admin/portfolio/${item?._id}/edit`);
                        }}
                        style={{
                            padding: '6px 10px',
                            fontSize: 10,
                            background: '#3b82f6',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer'
                        }}
                    >
                        Edit
                    </button>

                    {/* 🗑 DELETE */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item?._id);
                        }}
                        style={{
                            padding: '6px 10px',
                            fontSize: 10,
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer'
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default function PortfolioPage() {
    const { isMobile, isTablet } = useBreakpoint();
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();



    const { data } = useGetProjectsQuery()
    // console.log()

    const filteredItems = data?.data || []



    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
            {/* Portfolio Grid Section */}


            <section id="portfolio-grid" style={{
                padding: isMobile ? '48px 5% 64px' : '60px 8% 80px',
            }}>
                <div style={{ display: 'flex', justifyContent: 'end', width: '100%' }}>
                    <button className='btn-primary' onClick={() => navigate('/admin/portfolio/create')}>Add Project</button>
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
                            fontFamily: 'var(--font-mono)',
                            textTransform: 'uppercase',
                            display: 'inline-block',
                            marginBottom: 12,
                        }}>Featured Work</span>
                        <h2 style={{
                            fontSize: isMobile ? 'clamp(28px, 7vw, 36px)' : 'clamp(36px, 4vw, 48px)',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            color: '#fff',
                            lineHeight: 1.2,
                        }}>
                            Recent <span className="gt">Projects</span>
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
                            marginBottom: 48,
                        }}
                    >

                    </motion.div>

                    {/* Portfolio grid */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={filter}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
                                gap: 28,
                                alignItems: 'stretch',
                            }}
                        >
                            {filteredItems?.map((item, index) => (
                                <PortfolioCard key={index} item={item} i={index} isMobile={isMobile} />
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {filteredItems.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                textAlign: 'center',
                                padding: 60,
                                color: 'var(--text-muted)',
                                fontFamily: 'var(--font-body)',
                            }}
                        >
                            No projects found in this category.
                        </motion.div>
                    )}
                </div>
            </section>

            {/* CTA Section */}

        </div>
    );
}