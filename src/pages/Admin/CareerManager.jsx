// src/pages/CareerPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useDeleteCareerMutation, useGetCareersQuery } from '../../redux/api';



const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract'];
const locations = ['All', 'Remote', 'Kanpur', 'Remote / Kanpur'];

function JobCard({ job, i, isMobile }) {
    const [hov, setHov] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const [deleteCareer] = useDeleteCareerMutation()


    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this career? This action cannot be undone.'
        );

        if (!confirmDelete) return; // ❌ user ne cancel kiya

        try {
            await deleteCareer(id).unwrap();
            alert('Deleted successfully ✅');
        } catch (error) {
            console.error('Error deleting career:', error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                borderRadius: 20,
                background: hov ? `rgba(96,165,250,0.05)` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${hov ? job.accent + '40' : 'rgba(255,255,255,0.07)'}`,
                cursor: 'pointer',
                overflow: 'hidden',
                transition: '0.3s',
                transform: hov ? 'translateY(-4px)' : 'none',
                position: 'relative',
            }}
        >
            {/* Top bar */}
            <div style={{
                height: 3,
                background: job.accent || '#60a5fa'
            }} />

            <div style={{ padding: isMobile ? 16 : 22 }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ color: '#fff', fontSize: 18 }}>
                        {job.title || 'No Title'}
                    </h3>

                    <span style={{
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: 20,
                        background: job.status === 'open' ? '#16a34a20' : '#ef444420',
                        color: job.status === 'open' ? '#22c55e' : '#ef4444'
                    }}>
                        {job.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
                    <span>📍 {job.location || 'N/A'}</span>
                    <span>⏰ {job.type || 'N/A'}</span>
                    <span>💼 {job.experience || 'N/A'}</span>
                    <span style={{ color: job.accent }}>
                        💰 {job.salary || 'Not Disclosed'}
                    </span>
                </div>

                {/* Description */}
                <p style={{ marginTop: 12, color: '#aaa', fontSize: 13 }}>
                    {expanded
                        ? job.description
                        : `${job.description?.slice(0, 120) || ''}...`}
                </p>

                {/* Toggle */}
                {job.description && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: job.accent,
                            cursor: 'pointer',
                            fontSize: 11
                        }}
                    >
                        {expanded ? 'Show less' : 'Read more'}
                    </button>
                )}

                {/* Expanded Section */}
                {expanded && (
                    <div style={{
                        marginTop: 15,
                        padding: 12,
                        borderRadius: 10,
                        background: '#ffffff08'
                    }}>

                        {/* Requirements */}
                        {job.requirements?.length > 0 && (
                            <>
                                <h4 style={{ color: job.accent }}>Requirements</h4>
                                <ul>
                                    {job.requirements.map((req, i) => (
                                        <li key={i}>{req}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {/* Benefits */}
                        {job.benefits?.length > 0 && (
                            <>
                                <h4 style={{ color: job.accent }}>Benefits</h4>
                                <ul>
                                    {job.benefits.map((b, i) => (
                                        <li key={i}>{b}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                )}

                {/* Apply Button */}
                {job.status === 'open' ? (
                    ''
                ) : (
                    <div style={{
                        marginTop: 15,
                        textAlign: 'center',
                        fontSize: 12,
                        color: '#888'
                    }}>
                        This position is closed
                    </div>
                )}

                {/* Date */}
                <div style={{
                    marginTop: 10,
                    fontSize: 10,
                    color: '#666',
                    textAlign: 'center'
                }}>
                    Posted: {job.postedDate
                        ? new Date(job.postedDate).toDateString()
                        : 'N/A'}
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
                            navigate(`/admin/careers/${job?._id}/edit`);
                        }}
                        style={{
                            padding: '6px 10px',
                            fontSize: 10,
                            background: '#3b82f6',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                            zIndex: 999999
                        }}
                    >
                        Edit
                    </button>

                    {/* 🗑 DELETE */}
                    <button
                        onClick={(e) => {
                            // e.stopPropagation();
                            handleDelete(job?._id);
                        }}
                        style={{
                            padding: '6px 10px',
                            fontSize: 10,
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                            zIndex: 999999

                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </motion.div>
    );
}




export default function CareerPage() {
    const { isMobile, isTablet } = useBreakpoint();
    const [filterType, setFilterType] = useState('All');
    const [filterLocation, setFilterLocation] = useState('All');

    const { data: careers } = useGetCareersQuery();

    let careersData = careers?.data || [];

    const filteredJobs = careersData?.filter(job => {
        const typeMatch = filterType === 'All' || job.type === filterType;
        const locationMatch = filterLocation === 'All' || job.location === filterLocation;
        return typeMatch && locationMatch;
    });



    const openPositions = careersData?.filter(job => job.status === 'open').length;

    const navigate = useNavigate()

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
            {/* Hero Section */}

            <div style={{ maxWidth: 1200, margin: '0 auto' }}>

                <div style={{ display: 'flex', justifyContent: 'end', width: '100%' }}>
                    <button className='btn-primary' onClick={() => navigate('/admin/careers/create')}>Add Career</button>
                </div>

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
                    }}>Current Opportunities</span>
                    <h2 style={{
                        fontSize: isMobile ? 'clamp(28px, 7vw, 36px)' : 'clamp(36px, 4vw, 48px)',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        color: '#fff',
                        lineHeight: 1.2,
                    }}>
                        {/* Recent <span className="gt">Projects</span> */}
                        Find Your <span className="gt">Perfect Role</span>
                    </h2>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        display: 'flex',
                        gap: isMobile ? 12 : 20,
                        flexWrap: 'wrap',
                        marginBottom: 40,
                    }}
                >


                </motion.div>

                {/* Jobs grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
                    gap: 24,
                    alignItems: 'stretch',
                }}>
                    {filteredJobs.map((job, index) => (
                        <JobCard key={index} job={job} i={index} isMobile={isMobile} />
                    ))}
                </div>

                {filteredJobs.length === 0 && (
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
                        No jobs found matching your criteria.
                    </motion.div>
                )}

                {/* Why Join Us Section */}

            </div>

        </div>
    );
}