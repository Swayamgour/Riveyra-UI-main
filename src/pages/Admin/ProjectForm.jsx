import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCreateProjectMutation, useUpdateProjectMutation, useGetProjectsQuery } from '../../redux/api'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const ProjectForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        link: '',
        category: '',
        color: '#60a5fa',
        description: '',
        year: new Date().getFullYear().toString(),
        tech: []
    })

    const { id } = useParams()
    const isEdit = Boolean(id)

    const { data } = useGetProjectsQuery()
    const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation()
    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation()
    const navigate = useNavigate()

    const [techInput, setTechInput] = useState('')
    const [message, setMessage] = useState({ type: '', text: '' })

    // Form validation errors
    const [errors, setErrors] = useState({})

    // Image states
    const [workImg, setWorkImg] = useState(null)
    const [workImgPreview, setWorkImgPreview] = useState(null)
    const [detailImgs, setDetailImgs] = useState([])
    const [detailImgsPreviews, setDetailImgsPreviews] = useState([])

    const [uploadProgress, setUploadProgress] = useState(0)

    const isSubmitting = isCreating || isUpdating

    useEffect(() => {
        if (isEdit && data?.data) {
            const project = data.data.find(p => p._id === id)

            if (project) {
                setFormData({
                    title: project.title || '',
                    link: project.link || '',
                    category: project.category || '',
                    color: project.color || '#60a5fa',
                    description: project.description || '',
                    year: project.year || '',
                    tech: project.tech || []
                })

                setWorkImgPreview(project.workImg)
                setDetailImgsPreviews(project.detailImgs || [])
            }
        }
    }, [id, data])

    const categories = [
        'Web Redesign',
        'ERP System',
        'Web Development',
        'Real Estate App',
        'Mobile App',
        'E-commerce',
        'AI/ML',
        'Other'
    ]

    // Validation function
    const validateForm = () => {
        const newErrors = {}

        // Title validation
        if (!formData.title.trim()) {
            newErrors.title = 'Project title is required'
        } else if (formData.title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters'
        } else if (formData.title.trim().length > 100) {
            newErrors.title = 'Title must not exceed 100 characters'
        }

        // Category validation
        if (!formData.category) {
            newErrors.category = 'Please select a category'
        }

        // Description validation
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required'
        } else if (formData.description.trim().length < 20) {
            newErrors.description = 'Description must be at least 20 characters'
        } else if (formData.description.trim().length > 2000) {
            newErrors.description = 'Description must not exceed 2000 characters'
        }

        // Year validation
        const currentYear = new Date().getFullYear()
        const yearNum = parseInt(formData.year)
        if (!formData.year) {
            newErrors.year = 'Year is required'
        } else if (isNaN(yearNum) || !/^\d{4}$/.test(formData.year)) {
            newErrors.year = 'Please enter a valid 4-digit year'
        } else if (yearNum < 2000 || yearNum > currentYear + 5) {
            newErrors.year = `Year must be between 2000 and ${currentYear + 5}`
        }

        // Tech stack validation
        if (formData.tech.length === 0) {
            newErrors.tech = 'At least one technology is required'
        }

        // URL validation (if provided)
        if (formData.link && !/^https?:\/\/[^\s]+$/.test(formData.link)) {
            newErrors.link = 'Please enter a valid URL starting with http:// or https://'
        }

        // Image validation for new projects
        if (!isEdit && !workImg && !workImgPreview) {
            newErrors.workImg = 'Main project image is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Clear a specific error when field is updated
    const clearFieldError = (fieldName) => {
        if (errors[fieldName]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[fieldName]
                return newErrors
            })
        }
    }

    // Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        clearFieldError(name)

        // Clear message when user starts typing
        if (message.text) {
            setMessage({ type: '', text: '' })
        }
    }

    // Handle tech tags
    const addTech = () => {
        const techValue = techInput.trim()

        if (!techValue) {
            setErrors(prev => ({ ...prev, tech: 'Please enter a technology name' }))
            return
        }

        if (techValue.length > 50) {
            setErrors(prev => ({ ...prev, tech: 'Technology name must not exceed 50 characters' }))
            return
        }

        if (formData.tech.includes(techValue)) {
            setErrors(prev => ({ ...prev, tech: 'This technology is already added' }))
            return
        }

        if (formData.tech.length >= 20) {
            setErrors(prev => ({ ...prev, tech: 'Maximum 20 technologies allowed' }))
            return
        }

        setFormData(prev => ({
            ...prev,
            tech: [...prev.tech, techValue]
        }))
        setTechInput('')
        clearFieldError('tech')
    }

    const removeTech = (techToRemove) => {
        setFormData(prev => ({
            ...prev,
            tech: prev.tech.filter(t => t !== techToRemove)
        }))
        clearFieldError('tech')
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTech()
        }
    }

    // Handle main image upload (single image)
    const handleWorkImgChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
            if (!validTypes.includes(file.type)) {
                setMessage({
                    type: 'error',
                    text: 'Please upload a valid image file (JPEG, PNG, WEBP)'
                })
                return
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setMessage({
                    type: 'error',
                    text: 'Image size must be less than 5MB'
                })
                return
            }

            setWorkImg(file)
            clearFieldError('workImg')
            const reader = new FileReader()
            reader.onloadend = () => {
                setWorkImgPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    // Handle detail images upload (max 2 images)
    const handleDetailImgsChange = (e) => {
        const files = Array.from(e.target.files)
        const remainingSlots = 2 - detailImgs.length

        if (files.length > remainingSlots) {
            setMessage({
                type: 'error',
                text: `You can only upload ${remainingSlots} more image(s). Maximum 2 detail images allowed.`
            })
            return
        }

        // Validate each file
        const validFiles = []
        for (const file of files) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
            if (!validTypes.includes(file.type)) {
                setMessage({
                    type: 'error',
                    text: `${file.name} is not a valid image file`
                })
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                setMessage({
                    type: 'error',
                    text: `${file.name} exceeds 5MB limit`
                })
                return
            }
            validFiles.push(file)
        }

        const newImages = [...detailImgs, ...validFiles]
        if (newImages.length > 2) {
            setMessage({
                type: 'error',
                text: 'Maximum 2 detail images allowed'
            })
            return
        }

        setDetailImgs(newImages)

        // Create previews
        validFiles.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setDetailImgsPreviews(prev => [...prev, reader.result])
            }
            reader.readAsDataURL(file)
        })
    }

    // Remove detail image
    const removeDetailImg = (index) => {
        const newImages = detailImgs.filter((_, i) => i !== index)
        const newPreviews = detailImgsPreviews.filter((_, i) => i !== index)
        setDetailImgs(newImages)
        setDetailImgsPreviews(newPreviews)
    }

    // Remove main image
    const removeWorkImg = () => {
        setWorkImg(null)
        setWorkImgPreview(null)
        if (!isEdit) {
            setErrors(prev => ({ ...prev, workImg: 'Main project image is required' }))
        }
    }

    // Simulate upload progress
    const simulateUploadProgress = () => {
        setUploadProgress(0)
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(interval)
                    return 90
                }
                return prev + 10
            })
        }, 200)
        return () => clearInterval(interval)
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Clear previous messages
        setMessage({ type: '', text: '' })

        // Validate form
        if (!validateForm()) {
            setMessage({
                type: 'error',
                text: 'Please fix the errors before submitting'
            })
            // Scroll to first error
            const firstError = document.querySelector('.error-message')
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            return
        }

        try {
            const formDataToSend = new FormData()

            formDataToSend.append('title', formData.title.trim())
            formDataToSend.append('link', formData.link)
            formDataToSend.append('category', formData.category)
            formDataToSend.append('color', formData.color)
            formDataToSend.append('description', formData.description.trim())
            formDataToSend.append('year', formData.year)
            formDataToSend.append('tech', JSON.stringify(formData.tech))

            // Only append if new image selected
            if (workImg) {
                formDataToSend.append('workImg', workImg)
            } else if (isEdit && workImgPreview && !workImg) {
                // Keep existing image for edit
                formDataToSend.append('keepWorkImg', 'true')
            }

            detailImgs.forEach(img => {
                formDataToSend.append('detailImgs', img)
            })

            // Start progress simulation
            const clearProgress = simulateUploadProgress()

            let response

            if (isEdit) {
                response = await updateProject({
                    id,
                    formData: formDataToSend
                }).unwrap()
            } else {
                response = await createProject(formDataToSend).unwrap()
            }

            clearProgress()
            setUploadProgress(100)

            setTimeout(() => setUploadProgress(0), 500)

            if (response.success) {
                setMessage({
                    type: 'success',
                    text: isEdit ? 'Project updated successfully!' : 'Project created successfully!'
                })

                // Navigate back after 1.5 seconds
                setTimeout(() => {
                    navigate(-1)
                }, 1500)
            }

        } catch (error) {
            setUploadProgress(0)
            console.error('Submission error:', error)

            let errorMessage = error?.data?.message || 'Something went wrong'

            // Handle specific error cases
            if (error?.status === 413) {
                errorMessage = 'Images are too large. Please compress them and try again.'
            } else if (error?.status === 400) {
                errorMessage = error.data?.message || 'Invalid data. Please check your inputs.'
            } else if (error?.status === 409) {
                errorMessage = 'A project with this title already exists.'
            }

            setMessage({
                type: 'error',
                text: errorMessage
            })
        }
    }

    // Reset form
    const resetForm = () => {
        if (window.confirm('Are you sure you want to reset all form data? This action cannot be undone.')) {
            setFormData({
                title: '',
                link: '',
                category: '',
                color: '#60a5fa',
                description: '',
                year: new Date().getFullYear().toString(),
                tech: []
            })
            setTechInput('')
            setWorkImg(null)
            setWorkImgPreview(null)
            setDetailImgs([])
            setDetailImgsPreviews([])
            setMessage({ type: '', text: '' })
            setErrors({})
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1422 100%)',
            padding: '40px 5%'
        }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: 40 }}
                >
                    <h1 style={{
                        fontSize: 'clamp(28px, 5vw, 42px)',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: 8
                    }}>
                        {isEdit ? "Edit Project" : "Add New Project"}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>
                        Fill in the details below to {isEdit ? 'update' : 'add a new'} project to your portfolio
                    </p>
                </motion.div>

                {/* Message */}
                <AnimatePresence>
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                                padding: '14px 18px',
                                borderRadius: 10,
                                marginBottom: 24,
                                background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`,
                                color: message.type === 'success' ? '#22c55e' : '#ef4444',
                                fontSize: 14
                            }}
                        >
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div style={{
                        marginBottom: 24,
                        padding: 12,
                        background: 'rgba(96,165,250,0.1)',
                        borderRadius: 8,
                        border: '1px solid rgba(96,165,250,0.3)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ color: '#60a5fa', fontSize: 13 }}>Uploading images...</span>
                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{uploadProgress}%</span>
                        </div>
                        <div style={{
                            width: '100%',
                            height: 4,
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: 2,
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${uploadProgress}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
                                transition: 'width 0.3s'
                            }} />
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 20,
                        padding: '32px 28px'
                    }}>

                        {/* Basic Information */}
                        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 24 }}>
                            Basic Information
                        </h3>

                        <div style={{ display: 'grid', gap: 20 }}>
                            {/* Title */}
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                    Project Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., DGFASLI, SDRF, Martolia Group"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: `1px solid ${errors.title ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                                        borderRadius: 8,
                                        color: '#fff',
                                        fontSize: 14,
                                        outline: 'none',
                                        transition: 'border-color 0.2s'
                                    }}
                                />
                                {errors.title && (
                                    <p className="error-message" style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Link */}
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                    Project URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleChange}
                                    placeholder="https://example.com"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: `1px solid ${errors.link ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                                        borderRadius: 8,
                                        color: '#fff',
                                        fontSize: 14,
                                        outline: 'none'
                                    }}
                                />
                                {errors.link && (
                                    <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                                        {errors.link}
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: `1px solid ${errors.category ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                                        borderRadius: 8,
                                        color: '#fff',
                                        fontSize: 14,
                                        outline: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            {/* Color */}
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                    Accent Color
                                </label>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        style={{ width: 50, height: 40, borderRadius: 8, cursor: 'pointer', background: 'rgba(0,0,0,0.3)' }}
                                    />
                                    <input
                                        type="text"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        style={{
                                            flex: 1,
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8,
                                            color: '#fff',
                                            fontSize: 14,
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Year */}
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                    Year *
                                </label>
                                <input
                                    type="text"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    placeholder="2024"
                                    maxLength="4"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: `1px solid ${errors.year ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                                        borderRadius: 8,
                                        color: '#fff',
                                        fontSize: 14,
                                        outline: 'none'
                                    }}
                                />
                                {errors.year && (
                                    <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                                        {errors.year}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Describe the project, its impact, and key features..."
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: `1px solid ${errors.description ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                                        borderRadius: 8,
                                        color: '#fff',
                                        fontSize: 14,
                                        resize: 'vertical',
                                        outline: 'none',
                                        fontFamily: 'inherit'
                                    }}
                                />
                                {errors.description && (
                                    <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                                        {errors.description}
                                    </p>
                                )}
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>
                                    {formData.description.length}/2000 characters
                                </p>
                            </div>

                            {/* Technologies */}
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                    Technologies / Tech Stack *
                                </label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <input
                                        type="text"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="e.g., React, Node.js, MongoDB"
                                        style={{
                                            flex: 1,
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: `1px solid ${errors.tech ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: 8,
                                            color: '#fff',
                                            fontSize: 14,
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={addTech}
                                        disabled={isSubmitting}
                                        style={{
                                            padding: '12px 20px',
                                            background: 'rgba(96,165,250,0.2)',
                                            border: '1px solid #60a5fa',
                                            borderRadius: 8,
                                            color: '#60a5fa',
                                            fontSize: 14,
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            opacity: isSubmitting ? 0.5 : 1,
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                                {errors.tech && (
                                    <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                                        {errors.tech}
                                    </p>
                                )}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                                    {formData.tech.map(tech => (
                                        <span
                                            key={tech}
                                            style={{
                                                padding: '6px 12px',
                                                background: 'rgba(96,165,250,0.15)',
                                                border: '1px solid rgba(96,165,250,0.3)',
                                                borderRadius: 6,
                                                color: '#60a5fa',
                                                fontSize: 13,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8
                                            }}
                                        >
                                            {tech}
                                            <button
                                                type="button"
                                                onClick={() => removeTech(tech)}
                                                disabled={isSubmitting}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#ef4444',
                                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                    fontSize: 16,
                                                    padding: '0 4px'
                                                }}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 24 }}>
                                Images
                            </h3>

                            {/* Main Image */}
                            <div style={{ marginBottom: 28 }}>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                    Main Project Image {!isEdit && '*'}
                                </label>
                                <div style={{
                                    border: `2px dashed ${errors.workImg ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
                                    borderRadius: 12,
                                    padding: workImgPreview ? '12px' : '40px',
                                    textAlign: 'center',
                                    transition: 'all 0.2s',
                                    background: 'rgba(0,0,0,0.2)'
                                }}>
                                    {workImgPreview ? (
                                        <div>
                                            <img
                                                src={workImgPreview}
                                                alt="Main project preview"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: 200,
                                                    borderRadius: 8,
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={removeWorkImg}
                                                disabled={isSubmitting}
                                                style={{
                                                    marginTop: 12,
                                                    padding: '6px 16px',
                                                    background: 'rgba(239,68,68,0.2)',
                                                    border: '1px solid #ef4444',
                                                    borderRadius: 6,
                                                    color: '#ef4444',
                                                    fontSize: 12,
                                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                    opacity: isSubmitting ? 0.5 : 1
                                                }}
                                            >
                                                Remove Image
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={handleWorkImgChange}
                                                style={{ display: 'none' }}
                                                id="workImgInput"
                                                disabled={isSubmitting}
                                            />
                                            <label
                                                htmlFor="workImgInput"
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '10px 24px',
                                                    background: 'rgba(96,165,250,0.2)',
                                                    border: '1px solid #60a5fa',
                                                    borderRadius: 8,
                                                    color: '#60a5fa',
                                                    fontSize: 14,
                                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                    opacity: isSubmitting ? 0.5 : 1
                                                }}
                                            >
                                                Choose Main Image
                                            </label>
                                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 12 }}>
                                                PNG, JPG, WEBP (Max 5MB)
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {errors.workImg && (
                                    <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                                        {errors.workImg}
                                    </p>
                                )}
                            </div>

                            {/* Detail Images */}
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                    Detail Images (Optional) - Max 2 images
                                </label>
                                <div style={{
                                    border: '2px dashed rgba(255,255,255,0.2)',
                                    borderRadius: 12,
                                    padding: '24px',
                                    background: 'rgba(0,0,0,0.2)'
                                }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                                        {detailImgsPreviews.map((preview, index) => (
                                            <div key={index} style={{ position: 'relative' }}>
                                                <img
                                                    src={preview}
                                                    alt={`Detail ${index + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: 120,
                                                        borderRadius: 8,
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeDetailImg(index)}
                                                    disabled={isSubmitting}
                                                    style={{
                                                        position: 'absolute',
                                                        top: -8,
                                                        right: -8,
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        background: '#ef4444',
                                                        border: 'none',
                                                        color: '#fff',
                                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: 14,
                                                        opacity: isSubmitting ? 0.5 : 1
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}

                                        {detailImgs.length < 2 && (
                                            <div style={{
                                                border: '1px dashed rgba(255,255,255,0.3)',
                                                borderRadius: 8,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: 120,
                                                cursor: isSubmitting ? 'not-allowed' : 'pointer'
                                            }}>
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                                    onChange={handleDetailImgsChange}
                                                    style={{ display: 'none' }}
                                                    id="detailImgsInput"
                                                    disabled={isSubmitting}
                                                    multiple
                                                />
                                                <label
                                                    htmlFor="detailImgsInput"
                                                    style={{
                                                        padding: '10px 20px',
                                                        background: 'rgba(96,165,250,0.15)',
                                                        borderRadius: 6,
                                                        color: '#60a5fa',
                                                        fontSize: 13,
                                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                        textAlign: 'center',
                                                        opacity: isSubmitting ? 0.5 : 1
                                                    }}
                                                >
                                                    + Add Detail Image<br />
                                                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                                                        ({detailImgs.length}/2 used)
                                                    </span>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 16, textAlign: 'center' }}>
                                        Upload up to 2 detail images (PNG, JPG, WEBP, Max 5MB each)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div style={{
                            display: 'flex',
                            gap: 16,
                            justifyContent: 'flex-end',
                            marginTop: 32,
                            paddingTop: 24,
                            borderTop: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={isSubmitting}
                                style={{
                                    padding: '12px 28px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 10,
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    opacity: isSubmitting ? 0.5 : 1,
                                    transition: 'all 0.2s'
                                }}
                            >
                                Reset Form
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    padding: '12px 32px',
                                    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                                    border: 'none',
                                    borderRadius: 10,
                                    color: '#fff',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    opacity: isSubmitting ? 0.7 : 1,
                                    transition: 'all 0.2s',
                                    position: 'relative'
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span style={{ opacity: 0.7 }}>
                                            {isEdit ? 'Updating...' : 'Creating...'}
                                        </span>
                                        <span style={{
                                            position: 'absolute',
                                            left: '50%',
                                            top: '50%',
                                            transform: 'translate(-50%, -50%)'
                                        }}>
                                            ⏳
                                        </span>
                                    </>
                                ) : (
                                    isEdit ? 'Update Project' : 'Create Project'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProjectForm