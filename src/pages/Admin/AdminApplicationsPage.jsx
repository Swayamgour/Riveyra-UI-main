// src/pages/AdminApplicationsPage.jsx
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
// import { useBreakpoint } from '../hooks/useBreakpoint.jsx'
import { useDeleteApplicationMutation, useDownloadResumeMutation, useGetApplicationsQuery, useUpdateApplicationMutation } from '../../redux/api'
import {
    FaArrowLeft,
    FaSearch,
    FaFilter,
    FaEye,
    FaDownload,
    FaTrash,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaSpinner,
    FaFilePdf,
    FaFileWord,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaBriefcase,
    FaCalendarAlt,
    FaRupeeSign,
    FaExternalLinkAlt,
    FaUserGraduate,
    FaLinkedin,
    FaGithub
} from "react-icons/fa";
import { IoMdAlert, IoMdDocument } from "react-icons/io";
import { useBreakpoint } from '../../hooks/useBreakpoint';

/* ══════════════════════════════════════════════════════
   ADMIN APPLICATIONS PAGE
══════════════════════════════════════════════════════ */

export default function AdminApplicationsPage() {
    const navigate = useNavigate()
    const { isMobile, isTablet } = useBreakpoint()
    const px = isMobile ? '5%' : isTablet ? '6%' : '7%'

    // API hooks
    const { data: applicationsData, isLoading, refetch } = useGetApplicationsQuery()
    const [updateStatus] = useUpdateApplicationMutation()
    const [deleteApplication] = useDeleteApplicationMutation()
    const [downloadResume] = useDownloadResumeMutation()

    // State
    const [applications, setApplications] = useState([])
    const [filteredApps, setFilteredApps] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [jobFilter, setJobFilter] = useState('all')
    const [selectedApp, setSelectedApp] = useState(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
    const [updatingStatus, setUpdatingStatus] = useState(null)
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        reviewed: 0,
        shortlisted: 0,
        rejected: 0,
        hired: 0
    })

    // Get unique job titles for filter
    const jobTitles = ['all', ...new Set(applications.map(app => app.jobTitle).filter(Boolean))]

    // Status options
    const statusOptions = [
        { value: 'pending', label: 'Pending', color: '#fbbf24', icon: FaClock },
        { value: 'reviewed', label: 'Reviewed', color: '#60a5fa', icon: FaEye },
        { value: 'shortlisted', label: 'Shortlisted', color: '#34d399', icon: FaCheckCircle },
        { value: 'rejected', label: 'Rejected', color: '#f87171', icon: FaTimesCircle },
        { value: 'hired', label: 'Hired', color: '#c084fc', icon: FaUserGraduate }
    ]

    // Process applications data
    useEffect(() => {
        if (applicationsData?.data) {
            setApplications(applicationsData.data)
            filterApplications(applicationsData.data, searchTerm, statusFilter, jobFilter)
            calculateStats(applicationsData.data)
        }
    }, [applicationsData])

    const calculateStats = (apps) => {
        const newStats = {
            total: apps.length,
            pending: apps.filter(a => a.status === 'pending').length,
            reviewed: apps.filter(a => a.status === 'reviewed').length,
            shortlisted: apps.filter(a => a.status === 'shortlisted').length,
            rejected: apps.filter(a => a.status === 'rejected').length,
            hired: apps.filter(a => a.status === 'hired').length
        }
        setStats(newStats)
    }

    const filterApplications = (apps, search, status, job) => {
        let filtered = [...apps]

        // Apply search
        if (search) {
            const searchLower = search.toLowerCase()
            filtered = filtered.filter(app =>
                app.fullName?.toLowerCase().includes(searchLower) ||
                app.email?.toLowerCase().includes(searchLower) ||
                app.phone?.includes(search) ||
                app.jobTitle?.toLowerCase().includes(searchLower)
            )
        }

        // Apply status filter
        if (status !== 'all') {
            filtered = filtered.filter(app => app.status === status)
        }

        // Apply job filter
        if (job !== 'all') {
            filtered = filtered.filter(app => app.jobTitle === job)
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        setFilteredApps(filtered)
    }

    // Handle search and filters
    useEffect(() => {
        filterApplications(applications, searchTerm, statusFilter, jobFilter)
    }, [searchTerm, statusFilter, jobFilter, applications])

    const handleStatusUpdate = async (appId, newStatus) => {
        setUpdatingStatus(appId)
        try {
            await updateStatus({ id: appId, status: newStatus }).unwrap()
            refetch()
        } catch (error) {
            console.error('Failed to update status:', error)
        } finally {
            setUpdatingStatus(null)
        }
    }

    const handleDelete = async (appId) => {
        try {
            await deleteApplication(appId).unwrap()
            refetch()
            setShowDeleteConfirm(null)
            if (selectedApp?.id === appId) {
                setShowDetailModal(false)
                setSelectedApp(null)
            }
        } catch (error) {
            console.error('Failed to delete application:', error)
        }
    }

    const handleViewDetails = (app) => {
        setSelectedApp(app)
        setShowDetailModal(true)
    }

    // const handleDownloadResume = (app) => {
    //     console.log(app)
    //     if (app.resume) {
    //         window.open(app.resume, '_blank')
    //     }
    // }

    // const handleDownloadResume = (app) => {
    //     if (!app?.resume) return;

    //     const fixedUrl = app.resume.replace('/image/upload/', '/raw/upload/');

    //     window.open(fixedUrl, '_blank');
    // }

   

    const handleDownloadResume = async (app) => {
    const public_id = app.resume
        .split('/upload/')[1]
        .split('.')[0];

    const res = await downloadResume({ public_id }).unwrap();

    if (res?.url) {
        window.open(res.url, "_blank");
    }
};

    const getStatusBadge = (status) => {
        const option = statusOptions.find(opt => opt.value === status)
        if (!option) return null
        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 100,
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                background: `${option.color}1a`,
                color: option.color,
                border: `1px solid ${option.color}40`,
            }}>
                <option.icon size={10} />
                {option.label}
            </span>
        )
    }

    const getFileIcon = (resumeUrl) => {
        if (resumeUrl?.endsWith('.pdf')) return <FaFilePdf style={{ color: '#f87171' }} />
        return <FaFileWord style={{ color: '#60a5fa' }} />
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (isLoading) {
        return (
            <div style={{
                background: 'var(--bg)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <FaSpinner style={{ animation: 'spin 1s linear infinite', fontSize: 40, color: '#60a5fa' }} />
            </div>
        )
    }

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

            {/* Header */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                padding: `20px ${px}`,
                background: 'rgba(2,8,18,0.95)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(96,165,250,0.1)',
            }}>
                <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                background: 'transparent',
                                border: 'none',
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: 14,
                                fontFamily: 'var(--font-mono)',
                                cursor: 'pointer',
                                padding: '8px 12px',
                                borderRadius: 8,
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#60a5fa'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                        >
                            <FaArrowLeft /> Dashboard
                        </button>
                        <h1 style={{
                            fontSize: isMobile ? 20 : 24,
                            fontFamily: 'var(--font-display)',
                            fontWeight: 800,
                            color: '#fff',
                        }}>
                            Job Applications
                        </h1>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button
                            onClick={() => refetch()}
                            style={{
                                padding: '8px 16px',
                                background: 'rgba(96,165,250,0.1)',
                                border: '1px solid rgba(96,165,250,0.3)',
                                borderRadius: 8,
                                color: '#60a5fa',
                                fontSize: 12,
                                fontFamily: 'var(--font-mono)',
                                cursor: 'pointer',
                            }}
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ padding: `32px ${px} 60px` }}>
                <div style={{ maxWidth: 1400, margin: '0 auto' }}>

                    {/* Stats Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(6,1fr)',
                        gap: 16,
                        marginBottom: 32,
                    }}>
                        {[
                            { label: 'Total', value: stats.total, color: '#60a5fa', icon: IoMdDocument },
                            { label: 'Pending', value: stats.pending, color: '#fbbf24', icon: FaClock },
                            { label: 'Reviewed', value: stats.reviewed, color: '#60a5fa', icon: FaEye },
                            { label: 'Shortlisted', value: stats.shortlisted, color: '#34d399', icon: FaCheckCircle },
                            { label: 'Rejected', value: stats.rejected, color: '#f87171', icon: FaTimesCircle },
                            { label: 'Hired', value: stats.hired, color: '#c084fc', icon: FaUserGraduate },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                style={{
                                    padding: '16px',
                                    background: 'rgba(8,14,28,0.88)',
                                    border: `1px solid ${stat.color}20`,
                                    borderRadius: 12,
                                    textAlign: 'center',
                                }}
                            >
                                <stat.icon style={{ color: stat.color, fontSize: 24, marginBottom: 8 }} />
                                <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Filters Bar */}
                    <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: 16,
                        marginBottom: 24,
                        padding: '20px',
                        background: 'rgba(8,14,28,0.88)',
                        border: '1px solid rgba(96,165,250,0.1)',
                        borderRadius: 16,
                    }}>
                        {/* Search */}
                        <div style={{ flex: 1, position: 'relative' }}>
                            <FaSearch style={{
                                position: 'absolute',
                                left: 12,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'rgba(255,255,255,0.4)',
                                fontSize: 14
                            }} />
                            <input
                                type="text"
                                placeholder="Search by name, email, phone or job title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px 10px 36px',
                                    background: 'rgba(0,0,0,0.4)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    color: '#fff',
                                    fontSize: 13,
                                    fontFamily: 'var(--font-body)',
                                    outline: 'none',
                                }}
                            />
                        </div>

                        {/* Status Filter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FaFilter style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{
                                    padding: '10px 12px',
                                    background: 'rgba(0,0,0,0.4)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    color: '#fff',
                                    fontSize: 13,
                                    fontFamily: 'var(--font-mono)',
                                    cursor: 'pointer',
                                }}
                            >
                                <option value="all">All Status</option>
                                {statusOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Job Filter */}
                        <div>
                            <select
                                value={jobFilter}
                                onChange={(e) => setJobFilter(e.target.value)}
                                style={{
                                    padding: '10px 12px',
                                    background: 'rgba(0,0,0,0.4)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    color: '#fff',
                                    fontSize: 13,
                                    fontFamily: 'var(--font-mono)',
                                    cursor: 'pointer',
                                }}
                            >
                                <option value="all">All Positions</option>
                                {jobTitles.filter(j => j !== 'all').map(job => (
                                    <option key={job} value={job}>{job}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div style={{
                        marginBottom: 20,
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.5)',
                        fontFamily: 'var(--font-mono)',
                    }}>
                        Showing {filteredApps.length} of {applications.length} applications
                    </div>

                    {/* Applications Table/Cards */}
                    {filteredApps.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '80px 20px',
                            background: 'rgba(8,14,28,0.6)',
                            borderRadius: 16,
                            border: '1px solid rgba(96,165,250,0.1)',
                        }}>
                            <IoMdAlert size={48} style={{ color: 'rgba(255,255,255,0.3)', marginBottom: 16 }} />
                            <h3 style={{ color: '#fff', marginBottom: 8 }}>No applications found</h3>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
                                Try adjusting your search or filters
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                        }}>
                            {filteredApps?.map((app, index) => (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    style={{
                                        background: 'rgba(8,14,28,0.88)',
                                        border: '1px solid rgba(96,165,250,0.1)',
                                        borderRadius: 12,
                                        padding: '16px 20px',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(96,165,250,0.3)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(96,165,250,0.1)'}
                                >
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: isMobile ? 'column' : 'row',
                                        justifyContent: 'space-between',
                                        alignItems: isMobile ? 'flex-start' : 'center',
                                        gap: 12,
                                    }}>
                                        {/* Left - Candidate Info */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                                                <h3 style={{
                                                    fontSize: 16,
                                                    fontFamily: 'var(--font-display)',
                                                    fontWeight: 700,
                                                    color: '#fff',
                                                }}>
                                                    {app.fullName}
                                                </h3>
                                                {getStatusBadge(app.status)}
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 16,
                                                fontSize: 12,
                                                color: 'rgba(255,255,255,0.6)',
                                            }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    <FaEnvelope size={11} /> {app.email}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    <FaPhone size={11} /> {app.phone}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    <FaBriefcase size={11} /> {app.jobTitle}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    <FaCalendarAlt size={11} /> {formatDate(app.createdAt)}
                                                </span>
                                            </div>
                                            {app.experience && (
                                                <div style={{
                                                    fontSize: 11,
                                                    color: 'rgba(255,255,255,0.4)',
                                                    marginTop: 6,
                                                }}>
                                                    Exp: {app.experience} • Notice: {app.noticePeriod || 'Not specified'}
                                                    {app.expectedCtc && ` • Expected: ₹${app.expectedCtc} LPA`}
                                                </div>
                                            )}
                                        </div>

                                        {/* Right - Actions */}
                                        <div style={{
                                            display: 'flex',
                                            gap: 8,
                                            flexWrap: 'wrap',
                                        }}>
                                            {/* Status Dropdown */}
                                            <select
                                                value={app.status}
                                                onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                                disabled={updatingStatus === app.id}
                                                style={{
                                                    padding: '6px 10px',
                                                    background: 'rgba(0,0,0,0.4)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 6,
                                                    color: '#fff',
                                                    fontSize: 11,
                                                    fontFamily: 'var(--font-mono)',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {statusOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>

                                            {/* View Details */}
                                            <button
                                                onClick={() => handleViewDetails(app)}
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
                                                <FaEye size={10} /> View
                                            </button>

                                            {/* Download Resume */}
                                            {app.resume && (
                                                <button
                                                    onClick={() => handleDownloadResume(app)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: 'rgba(52,211,153,0.1)',
                                                        border: '1px solid rgba(52,211,153,0.3)',
                                                        borderRadius: 6,
                                                        color: '#34d399',
                                                        fontSize: 11,
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 5,
                                                    }}
                                                >
                                                    {getFileIcon(app.resume)} Resume
                                                </button>
                                            )}

                                            {/* Delete */}
                                            <button
                                                onClick={() => setShowDeleteConfirm(app._id)}
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
                                                <FaTrash size={10} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {showDetailModal && selectedApp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.9)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 1000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 20,
                            overflow: 'auto',
                        }}
                        onClick={() => setShowDetailModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            style={{
                                maxWidth: 800,
                                width: '100%',
                                maxHeight: '90vh',
                                overflow: 'auto',
                                background: 'rgba(8,14,28,0.98)',
                                border: '1px solid rgba(96,165,250,0.2)',
                                borderRadius: 20,
                                padding: 32,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                                <div>
                                    <h2 style={{ fontSize: 24, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                                        {selectedApp.fullName}
                                    </h2>
                                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>
                                        Applied for: {selectedApp.jobTitle}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'rgba(255,255,255,0.5)',
                                        fontSize: 24,
                                        cursor: 'pointer',
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            {/* Personal Details */}
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={{ fontSize: 16, color: '#60a5fa', marginBottom: 16, borderBottom: '1px solid rgba(96,165,250,0.2)', paddingBottom: 8 }}>
                                    Personal Information
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>Email</label>
                                        <p style={{ color: '#fff', fontSize: 14 }}>{selectedApp.email}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>Phone</label>
                                        <p style={{ color: '#fff', fontSize: 14 }}>{selectedApp.phone}</p>
                                    </div>
                                    {selectedApp.linkedin && (
                                        <div>
                                            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>LinkedIn</label>
                                            <p>
                                                <a href={selectedApp.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', fontSize: 14, textDecoration: 'none' }}>
                                                    View Profile <FaExternalLinkAlt size={10} />
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                    {selectedApp.portfolio && (
                                        <div>
                                            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>Portfolio/GitHub</label>
                                            <p>
                                                <a href={selectedApp.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', fontSize: 14, textDecoration: 'none' }}>
                                                    Visit Link <FaExternalLinkAlt size={10} />
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Professional Details */}
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={{ fontSize: 16, color: '#60a5fa', marginBottom: 16, borderBottom: '1px solid rgba(96,165,250,0.2)', paddingBottom: 8 }}>
                                    Professional Information
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>Experience</label>
                                        <p style={{ color: '#fff', fontSize: 14 }}>{selectedApp.experience || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>Notice Period</label>
                                        <p style={{ color: '#fff', fontSize: 14 }}>{selectedApp.noticePeriod || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>Current CTC</label>
                                        <p style={{ color: '#fff', fontSize: 14 }}>{selectedApp.currentCtc ? `₹${selectedApp.currentCtc} LPA` : 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>Expected CTC</label>
                                        <p style={{ color: '#fff', fontSize: 14 }}>{selectedApp.expectedCtc ? `₹${selectedApp.expectedCtc} LPA` : 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Cover Letter */}
                            {selectedApp.coverLetter && (
                                <div style={{ marginBottom: 24 }}>
                                    <h3 style={{ fontSize: 16, color: '#60a5fa', marginBottom: 16, borderBottom: '1px solid rgba(96,165,250,0.2)', paddingBottom: 8 }}>
                                        Cover Letter
                                    </h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6 }}>
                                        {selectedApp.coverLetter}
                                    </p>
                                </div>
                            )}

                            {/* Resume */}
                            {selectedApp.resumeUrl && (
                                <div style={{ marginBottom: 24 }}>
                                    <h3 style={{ fontSize: 16, color: '#60a5fa', marginBottom: 16, borderBottom: '1px solid rgba(96,165,250,0.2)', paddingBottom: 8 }}>
                                        Resume/CV
                                    </h3>
                                    <button
                                        onClick={() => handleDownloadResume(selectedApp)}
                                        style={{
                                            padding: '10px 20px',
                                            background: 'linear-gradient(135deg,#60a5fa,#3b82f6)',
                                            border: 'none',
                                            borderRadius: 8,
                                            color: '#fff',
                                            fontSize: 13,
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 8,
                                        }}
                                    >
                                        <FaDownload /> Download Resume
                                    </button>
                                </div>
                            )}

                            {/* Application Meta */}
                            <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                                Applied on: {formatDate(selectedApp.createdAt)}
                                {selectedApp.updatedAt !== selectedApp.createdAt && (
                                    <> • Last updated: {formatDate(selectedApp.updatedAt)}</>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.8)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 1100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onClick={() => setShowDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            style={{
                                maxWidth: 400,
                                width: '90%',
                                background: 'rgba(8,14,28,0.98)',
                                border: '1px solid rgba(248,113,113,0.3)',
                                borderRadius: 16,
                                padding: 24,
                                textAlign: 'center',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaTrash size={40} style={{ color: '#f87171', marginBottom: 16 }} />
                            <h3 style={{ fontSize: 20, color: '#fff', marginBottom: 8 }}>Delete Application</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 24 }}>
                                Are you sure you want to delete this application? This action cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    style={{
                                        padding: '10px 20px',
                                        background: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: 8,
                                        color: '#fff',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(showDeleteConfirm)}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#f87171',
                                        border: 'none',
                                        borderRadius: 8,
                                        color: '#fff',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}