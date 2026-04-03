// src/pages/CareerPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const JOB_OPENINGS = [
    {
        id: 1,
        title: 'Senior React Developer',
        location: 'Remote / Kanpur',
        type: 'Full-time',
        experience: '3-5 years',
        salary: '₹12L - ₹18L / year',
        description: 'We are looking for an experienced React developer to join our core team. You will be responsible for building complex web applications and mentoring junior developers.',
        requirements: [
            '3+ years of experience with React.js',
            'Strong JavaScript/ES6+ knowledge',
            'Experience with Next.js is a plus',
            'Good understanding of state management (Redux/Zustand)'
        ],
        benefits: [
            'Competitive salary',
            'Remote work options',
            'Health insurance',
            'Learning budget'
        ],
        status: 'open',
        accent: '#60a5fa',
        postedDate: '2025-03-15'
    },
    {
        id: 2,
        title: 'UI/UX Designer',
        location: 'Kanpur',
        type: 'Full-time',
        experience: '2-4 years',
        salary: '₹8L - ₹12L / year',
        description: 'Seeking a creative UI/UX designer who can create beautiful, user-centered interfaces and translate them into functional designs.',
        requirements: [
            'Proficiency in Figma/Adobe XD',
            'Strong portfolio demonstrating UI/UX work',
            'Understanding of user research methods',
            'Basic knowledge of HTML/CSS'
        ],
        benefits: [
            'Creative freedom',
            'Modern design tools',
            'Flexible hours',
            'Team outings'
        ],
        status: 'open',
        accent: '#c084fc',
        postedDate: '2025-03-20'
    },
    {
        id: 3,
        title: 'Digital Marketing Lead',
        location: 'Remote',
        type: 'Part-time',
        experience: '4-6 years',
        salary: '₹6L - ₹9L / year',
        description: 'Lead our digital marketing efforts including SEO, content strategy, and social media campaigns to drive brand growth.',
        requirements: [
            'Proven track record in digital marketing',
            'Experience with SEO tools (Ahrefs/Semrush)',
            'Content strategy expertise',
            'Analytics and reporting skills'
        ],
        benefits: [
            'Performance bonuses',
            'Flexible schedule',
            'Work from anywhere',
            'Professional development'
        ],
        status: 'closed',
        accent: '#fbbf24',
        postedDate: '2025-02-10'
    },
    {
        id: 4,
        title: 'Backend Developer (Node.js)',
        location: 'Remote / Kanpur',
        type: 'Full-time',
        experience: '2-4 years',
        salary: '₹10L - ₹16L / year',
        description: 'Looking for a backend developer to build scalable APIs and microservices using Node.js and related technologies.',
        requirements: [
            'Strong Node.js experience',
            'Experience with Express.js',
            'Database knowledge (PostgreSQL/MongoDB)',
            'Understanding of REST APIs'
        ],
        benefits: [
            'Competitive salary',
            'Remote work',
            'Health benefits',
            'Growth opportunities'
        ],
        status: 'open',
        accent: '#22d3ee',
        postedDate: '2025-03-25'
    },
    {
        id: 5,
        title: 'DevOps Engineer',
        location: 'Remote',
        type: 'Full-time',
        experience: '3-5 years',
        salary: '₹14L - ₹20L / year',
        description: 'Join our infrastructure team to manage cloud infrastructure, CI/CD pipelines, and ensure system reliability.',
        requirements: [
            'AWS/Azure/GCP experience',
            'Docker and Kubernetes knowledge',
            'CI/CD pipeline setup (GitHub Actions/Jenkins)',
            'Infrastructure as Code (Terraform)'
        ],
        benefits: [
            'Cloud certification budget',
            'Remote first culture',
            'Equipment allowance',
            'Performance bonus'
        ],
        status: 'open',
        accent: '#60a5fa',
        postedDate: '2025-03-22'
    },
    {
        id: 6,
        title: 'Quality Assurance Engineer',
        location: 'Kanpur',
        type: 'Full-time',
        experience: '1-3 years',
        salary: '₹5L - ₹8L / year',
        description: 'Responsible for manual and automated testing of web and mobile applications to ensure high quality delivery.',
        requirements: [
            'Experience with testing frameworks (Jest/Cypress)',
            'Understanding of SDLC',
            'Attention to detail',
            'Bug tracking tools (Jira)'
        ],
        benefits: [
            'Learning opportunities',
            'Team events',
            'Health insurance',
            'Work-life balance'
        ],
        status: 'closed',
        accent: '#c084fc',
        postedDate: '2025-02-28'
    },
];

const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract'];
const locations = ['All', 'Remote', 'Kanpur', 'Remote / Kanpur'];

function JobCard({ job, i, isMobile }) {
    const [hov, setHov] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const handleApply = (e) => {
        e.stopPropagation();
        navigate(`/careers/apply/${job.id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                width: '100%',
                borderRadius: 20,
                background: hov ? `rgba(96,165,250,0.04)` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${hov ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.07)'}`,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                transform: hov ? 'translateY(-4px)' : 'none',
                boxShadow: hov ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${job.accent}20` : 'none',
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
                background: `linear-gradient(90deg, ${job.accent}, transparent)`,
                opacity: hov ? 1 : 0,
                transition: 'opacity 0.3s',
                zIndex: 2,
            }} />

            <div style={{ padding: isMobile ? '20px 16px' : '24px 24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                    <h3 style={{
                        fontSize: isMobile ? 17 : 19,
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        color: '#fff',
                        letterSpacing: '-0.3px',
                    }}>
                        {job.title}
                    </h3>
                    <div className={`badge ${job.status === 'open' ? 'badge-active' : 'badge-draft'}`} style={{ fontSize: 11 }}>
                        {job.status === 'open' ? 'Open' : 'Closed'}
                    </div>
                </div>

                {/* Meta info */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 12 : 16, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12 }}>📍</span>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{job.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12 }}>⏰</span>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{job.type}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12 }}>💼</span>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{job.experience}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12 }}>💰</span>
                        <span style={{ fontSize: 12, color: job.accent }}>{job.salary}</span>
                    </div>
                </div>

                {/* Description */}
                <p style={{
                    fontSize: isMobile ? 13 : 13.5,
                    lineHeight: 1.65,
                    color: 'rgba(255,255,255,0.55)',
                    marginBottom: 16,
                    fontFamily: 'var(--font-body)',
                }}>
                    {expanded ? job.description : `${job.description.substring(0, 120)}...`}
                </p>

                {/* Read more toggle */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: job.accent,
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer',
                        marginBottom: 16,
                        padding: 0,
                    }}
                >
                    {expanded ? 'Show less' : 'Read more'}
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div style={{
                                padding: 16,
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: 12,
                                marginBottom: 16,
                            }}>
                                <div style={{ marginBottom: 16 }}>
                                    <h4 style={{ fontSize: 13, fontWeight: 600, color: job.accent, marginBottom: 10 }}>Requirements:</h4>
                                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                                        {job.requirements.map((req, idx) => (
                                            <li key={idx} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{req}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: 13, fontWeight: 600, color: job.accent, marginBottom: 10 }}>What We Offer:</h4>
                                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                                        {job.benefits.map((benefit, idx) => (
                                            <li key={idx} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{benefit}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Apply button */}


                {job.status === 'closed' && (
                    <div style={{
                        width: '100%',
                        padding: '12px',
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 40,
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.4)',
                        marginTop: expanded ? 0 : 8,
                    }}>
                        This position is currently closed
                    </div>
                )}

                {/* Posted date */}
                <div style={{
                    marginTop: 12,
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.3)',
                    fontFamily: 'var(--font-mono)',
                    textAlign: 'center',
                }}>
                    Posted: {new Date(job.postedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>
        </motion.div>
    );
}

export default function CareerPage() {
    const { isMobile, isTablet } = useBreakpoint();
    const [filterType, setFilterType] = useState('All');
    const [filterLocation, setFilterLocation] = useState('All');

    const filteredJobs = JOB_OPENINGS.filter(job => {
        const typeMatch = filterType === 'All' || job.type === filterType;
        const locationMatch = filterLocation === 'All' || job.location === filterLocation;
        return typeMatch && locationMatch;
    });

    const openPositions = JOB_OPENINGS.filter(job => job.status === 'open').length;

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
            {/* Hero Section */}

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
                        <JobCard key={job.id} job={job} i={index} isMobile={isMobile} />
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