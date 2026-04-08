// src/pages/ApplyPage.jsx
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useBreakpoint } from '../hooks/useBreakpoint.jsx'
import { useApplyJobMutation } from '../redux/api'
import {
    FaArrowLeft, FaArrowRight, FaCheckCircle, FaFile, FaUpload, FaClipboardCheck, FaSpinner
} from "react-icons/fa";
import { IoMdAlert } from "react-icons/io";

/* ══════════════════════════════════════════════════════
   APPLICATION PAGE WITH PROPER ERROR HANDLING
══════════════════════════════════════════════════════ */

export default function ApplyPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const { isMobile, isTablet } = useBreakpoint()
    const [applyJob, { isLoading: isApiLoading }] = useApplyJobMutation()

    const px = isMobile ? '5%' : isTablet ? '6%' : '7%'

    // Get job data from navigation state
    const jobFromState = location.state?.job || {}

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        portfolio: '',
        experience: '',
        noticePeriod: '',
        currentCtc: '',
        expectedCtc: '',
        jobTitle: jobFromState.title || '',
        jobId: jobFromState.id || '',
        coverLetter: '',
    })

    const [resumeFile, setResumeFile] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null)
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const fileInputRef = useRef(null)
    const [dragActive, setDragActive] = useState(false)

    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

    // Validation functions
    const validateField = (name, value) => {
        switch (name) {
            case 'fullName':
                if (!value?.trim()) return 'Full name is required'
                if (value.trim().length < 2) return 'Name must be at least 2 characters'
                if (!/^[a-zA-Z\s\-']+$/.test(value.trim())) return 'Name can only contain letters, spaces, hyphens, and apostrophes'
                return ''

            case 'email':
                if (!value?.trim()) return 'Email address is required'
                if (!/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(value)) return 'Please enter a valid email address (e.g., name@example.com)'
                return ''

            case 'phone':
                if (!value?.trim()) return 'Phone number is required'
                const phoneDigits = value.replace(/[^0-9]/g, '')
                if (phoneDigits.length !== 10) return 'Phone number must be exactly 10 digits'
                if (!/^[6-9][0-9]{9}$/.test(phoneDigits)) return 'Please enter a valid Indian mobile number (starts with 6-9)'
                return ''

            case 'linkedin':
                if (value && value.trim()) {
                    const linkedinPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[\w\-]+\/?$/i
                    if (!linkedinPattern.test(value.trim())) return 'Please enter a valid LinkedIn profile URL'
                }
                return ''

            case 'portfolio':
                if (value && value.trim()) {
                    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i
                    if (!urlPattern.test(value.trim())) return 'Please enter a valid URL (e.g., https://github.com/username)'
                }
                return ''

            case 'currentCtc':
                if (value && value.trim()) {
                    const ctcNum = parseFloat(value)
                    if (isNaN(ctcNum)) return 'Please enter a valid number'
                    if (ctcNum < 0) return 'CTC cannot be negative'
                    if (ctcNum > 100) return 'Please enter a realistic CTC (max 100 LPA)'
                }
                return ''

            case 'expectedCtc':
                if (value && value.trim()) {
                    const ctcNum = parseFloat(value)
                    if (isNaN(ctcNum)) return 'Please enter a valid number'
                    if (ctcNum < 0) return 'CTC cannot be negative'
                    if (ctcNum > 100) return 'Please enter a realistic CTC (max 100 LPA)'

                    const currentCtc = parseFloat(formData.currentCtc)
                    if (formData.currentCtc && !isNaN(currentCtc) && ctcNum < currentCtc) {
                        return 'Expected CTC should be greater than or equal to current CTC'
                    }
                }
                return ''

            case 'resume':
                if (!value) return 'Resume/CV is required'
                return ''

            default:
                return ''
        }
    }

    const validateForm = () => {
        const newErrors = {}

        // Validate all fields
        newErrors.fullName = validateField('fullName', formData.fullName)
        newErrors.email = validateField('email', formData.email)
        newErrors.phone = validateField('phone', formData.phone)
        newErrors.linkedin = validateField('linkedin', formData.linkedin)
        newErrors.portfolio = validateField('portfolio', formData.portfolio)
        newErrors.currentCtc = validateField('currentCtc', formData.currentCtc)
        newErrors.expectedCtc = validateField('expectedCtc', formData.expectedCtc)
        newErrors.resume = validateField('resume', resumeFile)

        // Remove empty errors
        Object.keys(newErrors).forEach(key => {
            if (!newErrors[key]) delete newErrors[key]
        })

        setErrors(newErrors)

        // Mark all fields as touched
        const allTouched = {}
        Object.keys(formData).forEach(key => { allTouched[key] = true })
        allTouched.resume = true
        setTouched(allTouched)

        return Object.keys(newErrors).length === 0
    }

    const handleBlur = (e) => {
        const { name, value } = e.target
        setTouched({ ...touched, [name]: true })

        const error = validateField(name, value)
        if (error) {
            setErrors({ ...errors, [name]: error })
        } else {
            const newErrors = { ...errors }
            delete newErrors[name]
            setErrors(newErrors)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })

        // Clear error when user starts typing
        if (errors[name]) {
            const newErrors = { ...errors }
            delete newErrors[name]
            setErrors(newErrors)
        }
    }

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '')
        if (value.length > 10) value = value.slice(0, 10)

        // Format phone number as user types (optional)
        let formattedValue = value
        if (value.length > 5) {
            formattedValue = `${value.slice(0, 5)} ${value.slice(5)}`
        }

        setFormData({ ...formData, phone: formattedValue })

        if (errors.phone) {
            const newErrors = { ...errors }
            delete newErrors.phone
            setErrors(newErrors)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        validateAndSetFile(file)
        setTouched({ ...touched, resume: true })
    }

    const validateAndSetFile = (file) => {
        if (!file) {
            setErrors({ ...errors, resume: 'Resume/CV is required' })
            return
        }

        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if (!validTypes.includes(file.type)) {
            setErrors({ ...errors, resume: 'Please upload PDF, DOC, or DOCX file only' })
            setSubmitStatus({ type: 'error', message: 'Invalid file type. Please upload PDF, DOC, or DOCX.' })
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors({ ...errors, resume: 'File size must be less than 5MB' })
            setSubmitStatus({ type: 'error', message: 'File is too large. Maximum size is 5MB.' })
            return
        }

        setResumeFile(file)
        const newErrors = { ...errors }
        delete newErrors.resume
        setErrors(newErrors)
        setSubmitStatus(null)
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const file = e.dataTransfer.files[0]
        validateAndSetFile(file)
        setTouched({ ...touched, resume: true })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate all fields
        if (!validateForm()) {
            setSubmitStatus({
                type: 'error',
                message: 'Please fix the errors above before submitting.'
            })

            // Scroll to first error
            const firstErrorField = Object.keys(errors)[0]
            if (firstErrorField) {
                const element = document.querySelector(`[name="${firstErrorField}"]`)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    element.focus()
                }
            }
            return
        }

        setIsSubmitting(true)
        setSubmitStatus(null)

        // Create FormData for API submission
        const submitData = new FormData()
        submitData.append('fullName', formData.fullName.trim())
        submitData.append('email', formData.email.trim().toLowerCase())
        submitData.append('phone', formData.phone.replace(/\s/g, ''))
        submitData.append('linkedin', formData.linkedin?.trim() || '')
        submitData.append('portfolio', formData.portfolio?.trim() || '')
        submitData.append('experience', formData.experience || '')
        submitData.append('noticePeriod', formData.noticePeriod || '')
        submitData.append('currentCtc', formData.currentCtc || '')
        submitData.append('expectedCtc', formData.expectedCtc || '')
        submitData.append('jobTitle', formData.jobTitle)
        submitData.append('jobId', formData.jobId)
        submitData.append('coverLetter', formData.coverLetter?.trim() || '')
        submitData.append('resume', resumeFile)

        try {
            const response = await applyJob(submitData).unwrap()

            if (response?.success) {
                setSubmitStatus({
                    type: 'success',
                    message: '✓ Application submitted successfully! Our team will review your application and get back to you within 5-7 business days.'
                })

                // Reset form
                setFormData({
                    fullName: '', email: '', phone: '', linkedin: '', portfolio: '',
                    experience: '', noticePeriod: '', currentCtc: '', expectedCtc: '',
                    jobTitle: jobFromState.title || '', jobId: jobFromState.id || '',
                    coverLetter: '',
                })
                setResumeFile(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
                setErrors({})
                setTouched({})

                // Scroll to success message
                window.scrollTo({ top: 0, behavior: 'smooth' })

                // Redirect after 3 seconds
                setTimeout(() => {
                    navigate('/career')
                }, 2000)
            } else {
                throw new Error(response?.message || 'Submission failed')
            }
        } catch (error) {
            console.error('Submission error:', error)

            // Handle different types of errors
            let errorMessage = 'Something went wrong. Please try again or email us directly at careers@riveyra.com'

            if (error?.data?.message) {
                errorMessage = error.data.message
            } else if (error?.error) {
                errorMessage = error.error
            } else if (error?.status === 400) {
                errorMessage = 'Please check your information and try again.'
            } else if (error?.status === 413) {
                errorMessage = 'File is too large. Please compress your resume (max 5MB).'
            } else if (error?.status === 500) {
                errorMessage = 'Server error. Please try again later or email us directly.'
            }

            setSubmitStatus({
                type: 'error',
                message: `✗ ${errorMessage}`
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Experience options
    const experienceOptions = ['Fresher', '0-1 Year', '1-3 Years', '3-5 Years', '5-8 Years', '8+ Years']
    const noticeOptions = ['Immediate', '15 Days', '30 Days', '45 Days', '60 Days', '90 Days']

    // Redirect if no job data
    if (!location.state?.job) {
        return (
            <div style={{
                background: 'var(--bg)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                padding: 50,
                textAlign: 'center'
            }}>
                <div>
                    <IoMdAlert size={48} style={{ color: '#f87171', marginBottom: 16 }} />
                    <h2 style={{ fontSize: 24, marginBottom: 12 }}>No Job Selected</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>
                        Please select a job position from our careers page.
                    </p>
                    <button
                        onClick={() => navigate('/careers')}
                        className="btn-primary"
                        style={{ padding: '12px 24px' }}
                    >
                        View Open Positions <FaArrowRight />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>
            {/* Add keyframe animation */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .error-shake {
                    animation: shake 0.3s ease-in-out;
                }
            `}</style>

            {/* Header with back button */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                padding: `20px ${px}`,
                background: 'rgba(2,8,18,0.95)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(96,165,250,0.1)',
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button
                        onClick={() => navigate('/careers')}
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
                        <FaArrowLeft /> Back to Careers
                    </button>
                </div>
            </div>

            {/* Main Form */}
            <section ref={sectionRef} style={{ padding: `40px ${px} 80px` }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        style={{ textAlign: 'center', marginBottom: 48 }}
                    >
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{ width: 28, height: 1, background: '#60a5fa' }} />
                            <span style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(96,165,250,0.7)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                                Join Our Team
                            </span>
                            <div style={{ width: 28, height: 1, background: '#60a5fa' }} />
                        </div>

                        <h1 style={{
                            fontSize: isMobile ? 'clamp(32px,10vw,48px)' : 'clamp(40px,5vw,56px)',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            letterSpacing: '-2px',
                            marginBottom: 12,
                        }}>
                            Apply for <span className="gt">{formData.jobTitle || 'this Position'}</span>
                        </h1>

                        {formData.jobTitle && (
                            <p style={{
                                fontSize: 14,
                                color: 'rgba(255,255,255,0.5)',
                                fontFamily: 'var(--font-mono)',
                                display: 'inline-block',
                                padding: '6px 14px',
                                background: 'rgba(96,165,250,0.1)',
                                borderRadius: 100,
                                border: '1px solid rgba(96,165,250,0.2)',
                            }}>
                                {formData.jobTitle} • {location.state?.job?.location || 'Kanpur, India'}
                            </p>
                        )}
                    </motion.div>

                    {/* Status Message */}
                    <AnimatePresence>
                        {submitStatus && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    padding: '16px 20px',
                                    borderRadius: 12,
                                    marginBottom: 32,
                                    background: submitStatus.type === 'success' ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
                                    border: `1px solid ${submitStatus.type === 'success' ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                }}
                            >
                                {submitStatus.type === 'success' ? (
                                    <FaCheckCircle style={{ color: '#34d399', flexShrink: 0, fontSize: 20 }} />
                                ) : (
                                    <IoMdAlert style={{ color: '#f87171', flexShrink: 0, fontSize: 20 }} />
                                )}
                                <span style={{
                                    color: submitStatus.type === 'success' ? '#34d399' : '#f87171',
                                    fontSize: 14,
                                    fontFamily: 'var(--font-body)',
                                    lineHeight: 1.5,
                                    flex: 1
                                }}>
                                    {submitStatus.message}
                                </span>
                                <button
                                    onClick={() => setSubmitStatus(null)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: submitStatus.type === 'success' ? '#34d399' : '#f87171',
                                        cursor: 'pointer',
                                        fontSize: 16,
                                        opacity: 0.7,
                                        padding: '0 4px'
                                    }}
                                >
                                    ×
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        onSubmit={handleSubmit}
                        style={{
                            background: 'rgba(8,14,28,0.88)',
                            border: '1px solid rgba(96,165,250,0.1)',
                            borderRadius: 24,
                            padding: isMobile ? '28px 20px' : '40px 48px',
                        }}
                    >
                        {/* Personal Information */}
                        <div style={{ marginBottom: 32 }}>
                            <h2 style={{
                                fontSize: 18,
                                fontFamily: 'var(--font-display)',
                                fontWeight: 700,
                                color: '#60a5fa',
                                marginBottom: 20,
                                paddingBottom: 8,
                                borderBottom: '1px solid rgba(96,165,250,0.2)',
                            }}>
                                Personal Information
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
                                {/* Full Name */}
                                <div>
                                    <label style={{ display: 'block', fontSize: 12.5, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
                                        Full Name <span style={{ color: '#f87171' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="John Doe"
                                        className={errors.fullName && touched.fullName ? 'error-shake' : ''}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            background: 'rgba(0,0,0,0.4)',
                                            border: `1px solid ${errors.fullName && touched.fullName ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: 10,
                                            color: '#fff',
                                            fontSize: 14,
                                            fontFamily: 'var(--font-body)',
                                            outline: 'none',
                                            transition: 'all 0.2s',
                                        }}
                                    />
                                    {errors.fullName && touched.fullName && (
                                        <p style={{ fontSize: 11, color: '#f87171', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <IoMdAlert size={12} /> {errors.fullName}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label style={{ display: 'block', fontSize: 12.5, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
                                        Email Address <span style={{ color: '#f87171' }}>*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="john@example.com"
                                        className={errors.email && touched.email ? 'error-shake' : ''}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            background: 'rgba(0,0,0,0.4)',
                                            border: `1px solid ${errors.email && touched.email ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: 10,
                                            color: '#fff',
                                            fontSize: 14,
                                            fontFamily: 'var(--font-body)',
                                            outline: 'none',
                                        }}
                                    />
                                    {errors.email && touched.email && (
                                        <p style={{ fontSize: 11, color: '#f87171', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <IoMdAlert size={12} /> {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label style={{ display: 'block', fontSize: 12.5, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
                                        Phone Number <span style={{ color: '#f87171' }}>*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        onBlur={handleBlur}
                                        placeholder="98765 43210"
                                        className={errors.phone && touched.phone ? 'error-shake' : ''}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            background: 'rgba(0,0,0,0.4)',
                                            border: `1px solid ${errors.phone && touched.phone ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: 10,
                                            color: '#fff',
                                            fontSize: 14,
                                            fontFamily: 'var(--font-body)',
                                            outline: 'none',
                                        }}
                                    />
                                    {errors.phone && touched.phone && (
                                        <p style={{ fontSize: 11, color: '#f87171', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <IoMdAlert size={12} /> {errors.phone}
                                        </p>
                                    )}
                                </div>

                                {/* LinkedIn */}
                                <div>
                                    <label style={{ display: 'block', fontSize: 12.5, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
                                        LinkedIn Profile <span style={{ color: 'rgba(255,255,255,0.3)' }}>(Optional)</span>
                                    </label>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="linkedin.com/in/johndoe"
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            background: 'rgba(0,0,0,0.4)',
                                            border: `1px solid ${errors.linkedin && touched.linkedin ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: 10,
                                            color: '#fff',
                                            fontSize: 14,
                                            fontFamily: 'var(--font-body)',
                                            outline: 'none',
                                        }}
                                    />
                                    {errors.linkedin && touched.linkedin && (
                                        <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>{errors.linkedin}</p>
                                    )}
                                </div>

                                {/* Portfolio */}
                                <div>
                                    <label style={{ display: 'block', fontSize: 12.5, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
                                        Portfolio / GitHub <span style={{ color: 'rgba(255,255,255,0.3)' }}>(Optional)</span>
                                    </label>
                                    <input
                                        type="url"
                                        name="portfolio"
                                        value={formData.portfolio}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="github.com/johndoe"
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            background: 'rgba(0,0,0,0.4)',
                                            border: `1px solid ${errors.portfolio && touched.portfolio ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: 10,
                                            color: '#fff',
                                            fontSize: 14,
                                            fontFamily: 'var(--font-body)',
                                            outline: 'none',
                                        }}
                                    />
                                    {errors.portfolio && touched.portfolio && (
                                        <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>{errors.portfolio}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Professional Information */}
                        <div style={{ marginBottom: 32 }}>
                            <h2 style={{
                                fontSize: 18,
                                fontFamily: 'var(--font-display)',
                                fontWeight: 700,
                                color: '#60a5fa',
                                marginBottom: 20,
                                paddingBottom: 8,
                                borderBottom: '1px solid rgba(96,165,250,0.2)',
                            }}>
                                Professional Information
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
                                {/* Experience */}
                                <div>
                                    <label style={{ display: 'block', fontSize: 12.5, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
                                        Total Experience <span style={{ color: 'rgba(255,255,255,0.3)' }}>(Optional)</span>
                                    </label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            background: 'rgba(0,0,0,0.4)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 10,
                                            color: '#fff',
                                            fontSize: 14,
                                            fontFamily: 'var(--font-body)',
                                            outline: 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <option value="">Select Experience</option>
                                        {experienceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>

                                {/* Notice Period */}
                                <div>
                                    <label style={{ display: 'block', fontSize: 12.5, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
                                        Notice Period <span style={{ color: 'rgba(255,255,255,0.3)' }}>(Optional)</span>
                                    </label>
                                    <select
                                        name="noticePeriod"
                                        value={formData.noticePeriod}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            background: 'rgba(0,0,0,0.4)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 10,
                                            color: '#fff',
                                            fontSize: 14,
                                            fontFamily: 'var(--font-body)',
                                            outline: 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <option value="">Select Notice Period</option>
                                        {noticeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>

                                {/* Current CTC */}
                                <div>
                                    <label style={{ display: 'block', fontSize: 12.5, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
                                        Current CTC (₹ LPA) <span style={{ color: 'rgba(255,255,255,0.3)' }}>(Optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="currentCtc"
                                        value={formData.currentCtc}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="e.g., 5.5"
                                        className={errors.currentCtc && touched.currentCtc ? 'error-shake' : ''}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            background: 'rgba(0,0,0,0.4)',
                                            border: `1px solid ${errors.currentCtc && touched.currentCtc ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: 10,
                                            color: '#fff',
                                            fontSize: 14,
                                            fontFamily: 'var(--font-body)',
                                            outline: 'none',
                                        }}
                                    />
                                    {errors.currentCtc && touched.currentCtc && (
                                        <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>{errors.currentCtc}</p>
                                    )}
                                </div>

                                {/* Expected CTC */}
                                <div>
                                    <label style={{ display: 'block', fontSize: 12.5, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
                                        Expected CTC (₹ LPA) <span style={{ color: 'rgba(255,255,255,0.3)' }}>(Optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="expectedCtc"
                                        value={formData.expectedCtc}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="e.g., 8.0"
                                        className={errors.expectedCtc && touched.expectedCtc ? 'error-shake' : ''}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            background: 'rgba(0,0,0,0.4)',
                                            border: `1px solid ${errors.expectedCtc && touched.expectedCtc ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: 10,
                                            color: '#fff',
                                            fontSize: 14,
                                            fontFamily: 'var(--font-body)',
                                            outline: 'none',
                                        }}
                                    />
                                    {errors.expectedCtc && touched.expectedCtc && (
                                        <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>{errors.expectedCtc}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Resume Upload */}
                        <div style={{ marginBottom: 32 }}>
                            <h2 style={{
                                fontSize: 18,
                                fontFamily: 'var(--font-display)',
                                fontWeight: 700,
                                color: '#60a5fa',
                                marginBottom: 20,
                                paddingBottom: 8,
                                borderBottom: '1px solid rgba(96,165,250,0.2)',
                            }}>
                                Resume / CV <span style={{ color: '#f87171' }}>*</span>
                            </h2>

                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={errors.resume && touched.resume ? 'error-shake' : ''}
                                style={{
                                    border: `2px dashed ${dragActive ? '#60a5fa' : errors.resume && touched.resume ? '#f87171' : 'rgba(96,165,250,0.3)'}`,
                                    borderRadius: 16,
                                    padding: '32px 24px',
                                    textAlign: 'center',
                                    background: dragActive ? 'rgba(96,165,250,0.05)' : 'rgba(0,0,0,0.2)',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />

                                {resumeFile ? (
                                    <div>
                                        <FaFile style={{ color: '#34d399', marginBottom: 12 }} size={40} />
                                        <p style={{ color: '#34d399', fontSize: 14, marginBottom: 4, fontWeight: 600 }}>{resumeFile.name}</p>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                                            {(resumeFile.size / 1024).toFixed(0)} KB • Click to change
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <FaUpload style={{ color: '#60a5fa', marginBottom: 12 }} size={40} />
                                        <p style={{ color: '#fff', fontSize: 14, marginBottom: 6 }}>Drag & drop your resume here</p>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>or click to browse</p>
                                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 12 }}>PDF, DOC, DOCX (Max 5MB)</p>
                                    </div>
                                )}
                            </div>
                            {errors.resume && touched.resume && (
                                <p style={{ fontSize: 11, color: '#f87171', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <IoMdAlert size={12} /> {errors.resume}
                                </p>
                            )}
                        </div>

                        {/* Cover Letter */}
                        <div style={{ marginBottom: 32 }}>
                            <h2 style={{
                                fontSize: 18,
                                fontFamily: 'var(--font-display)',
                                fontWeight: 700,
                                color: '#60a5fa',
                                marginBottom: 20,
                                paddingBottom: 8,
                                borderBottom: '1px solid rgba(96,165,250,0.2)',
                            }}>
                                Cover Letter <span style={{ color: 'rgba(255,255,255,0.3)' }}>(Optional)</span>
                            </h2>

                            <textarea
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleChange}
                                placeholder="Tell us why you're interested in this role and what makes you a great fit... (Max 1000 characters)"
                                rows={5}
                                maxLength={1000}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    background: 'rgba(0,0,0,0.4)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 12,
                                    color: '#fff',
                                    fontSize: 14,
                                    fontFamily: 'var(--font-body)',
                                    outline: 'none',
                                    resize: 'vertical',
                                }}
                            />
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6, textAlign: 'right' }}>
                                {formData.coverLetter.length}/1000 characters
                            </p>
                        </div>

                        {/* Error Summary */}
                        {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
                            <div style={{
                                marginBottom: 24,
                                padding: '14px 18px',
                                background: 'rgba(248,113,113,0.08)',
                                border: '1px solid rgba(248,113,113,0.2)',
                                borderRadius: 12,
                            }}>
                                <p style={{ fontSize: 13, color: '#f87171', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <IoMdAlert /> Please fix the following errors:
                                </p>
                                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: '#f87171' }}>
                                    {Object.entries(errors).map(([field, error]) => (
                                        <li key={field}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
                                <span style={{ color: '#f87171' }}>*</span> Required fields
                            </p>

                            <div style={{ display: 'flex', gap: 12 }}>
                                <button
                                    type="button"
                                    onClick={() => navigate('/careers')}
                                    className="btn-ghost"
                                    style={{
                                        fontSize: 14,
                                        padding: '12px 24px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isApiLoading}
                                    className="btn-primary"
                                    style={{
                                        fontSize: 14,
                                        padding: '12px 32px',
                                        background: (isSubmitting || isApiLoading) ? 'rgba(96,165,250,0.5)' : 'linear-gradient(135deg,#60a5fa,#3b82f6)',
                                        cursor: (isSubmitting || isApiLoading) ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {(isSubmitting || isApiLoading) ? (
                                        <>
                                            <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Application <FaArrowRight />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.form>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.5 }}
                        style={{
                            textAlign: 'center',
                            marginTop: 40,
                            padding: '20px',
                            borderRadius: 12,
                            background: 'rgba(8,14,28,0.6)',
                            border: '1px solid rgba(96,165,250,0.08)',
                        }}
                    >
                        <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)' }}>
                            Having trouble with the form? Email your application to{' '}
                            <a href="mailto:careers@riveyra.com" style={{ color: '#60a5fa', textDecoration: 'none' }}>
                                careers@riveyra.com
                            </a>
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}