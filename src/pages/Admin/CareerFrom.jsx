import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
// import {  } from '../../redux/api'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useGetCareerBySlugQuery, useUpdateCareerMutation , useCreateCareerMutation } from '../../redux/api'

const CareerForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        location: '',
        type: 'Full-time',
        experience: '',
        salary: '',
        description: '',
        requirements: [],
        benefits: [],
        status: 'open',
        accent: '#60a5fa',
        postedDate: new Date().toISOString().split('T')[0]
    })

    const { id } = useParams();

    const { data: singleCareer } = useGetCareerBySlugQuery(id, {
        skip: !id
    });

    const [updateCareer] = useUpdateCareerMutation();

    useEffect(() => {
        if (singleCareer?.data) {
            setFormData(singleCareer.data);
        }
    }, [singleCareer]);

    const [requirementsInput, setRequirementsInput] = useState('')
    const [benefitsInput, setBenefitsInput] = useState('')
    const [message, setMessage] = useState({ type: '', text: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const [createCareer] = useCreateCareerMutation()

    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Hybrid']
    const statusOptions = ['open', 'closed']
    const accentColors = [
        '#60a5fa', '#34d399', '#f87171', '#c084fc', '#fbbf24', '#fb923c', '#f472b6', '#38bdf8'
    ]

    // Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Auto-generate slug from title
        if (name === 'title') {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            setFormData(prev => ({ ...prev, slug }))
        }
    }

    // Handle requirements
    const addRequirement = () => {
        if (requirementsInput.trim() && !formData.requirements.includes(requirementsInput.trim())) {
            setFormData(prev => ({
                ...prev,
                requirements: [...prev.requirements, requirementsInput.trim()]
            }))
            setRequirementsInput('')
        }
    }

    const removeRequirement = (reqToRemove) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter(r => r !== reqToRemove)
        }))
    }

    const handleRequirementKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addRequirement()
        }
    }

    // Handle benefits
    const addBenefit = () => {
        if (benefitsInput.trim() && !formData.benefits.includes(benefitsInput.trim())) {
            setFormData(prev => ({
                ...prev,
                benefits: [...prev.benefits, benefitsInput.trim()]
            }))
            setBenefitsInput('')
        }
    }

    const removeBenefit = (benefitToRemove) => {
        setFormData(prev => ({
            ...prev,
            benefits: prev.benefits.filter(b => b !== benefitToRemove)
        }))
    }

    const handleBenefitKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addBenefit()
        }
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            let response;

            if (id) {
                // ✏️ UPDATE
                response = await updateCareer({ id, ...formData }).unwrap();
            } else {
                // ➕ CREATE
                response = await createCareer(formData).unwrap();
            }

            setMessage({
                type: 'success',
                text: id ? 'Updated successfully!' : 'Created successfully!'
            });

            navigate(-1);

        } catch (error) {
            console.error(error);
            setMessage({
                type: 'error',
                text: 'Something went wrong'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            location: '',
            type: 'Full-time',
            experience: '',
            salary: '',
            description: '',
            requirements: [],
            benefits: [],
            status: 'open',
            accent: '#60a5fa',
            postedDate: new Date().toISOString().split('T')[0]
        })
        setRequirementsInput('')
        setBenefitsInput('')
        setMessage({ type: '', text: '' })
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
                        Post a New Job
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>
                        Create a new job opening or career opportunity
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

                {/* Form */}
                <form onSubmit={handleSubmit}>
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
                                    Job Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Senior Full Stack Developer"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 8,
                                        color: '#fff',
                                        fontSize: 14,
                                        outline: 'none',
                                        transition: 'border-color 0.2s'
                                    }}
                                    required
                                />
                            </div>

                            {/* Slug (Auto-generated) */}
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                    Slug (URL) *
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="senior-full-stack-developer"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 8,
                                        color: '#fff',
                                        fontSize: 14,
                                        outline: 'none'
                                    }}
                                    required
                                />
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>
                                    Auto-generated from title, but you can edit it
                                </p>
                            </div>

                            {/* Location & Job Type - 2 columns */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g., Remote, Mumbai, Delhi NCR"
                                        style={{
                                            width: '100%',
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

                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                        Job Type *
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8,
                                            color: '#fff',
                                            fontSize: 14,
                                            outline: 'none',
                                            cursor: 'pointer'
                                        }}
                                        required
                                    >
                                        {jobTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Experience & Salary - 2 columns */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                        Experience Required
                                    </label>
                                    <input
                                        type="text"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        placeholder="e.g., 3-5 years, Fresher, 5+ years"
                                        style={{
                                            width: '100%',
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

                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                        Salary Range
                                    </label>
                                    <input
                                        type="text"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        placeholder="e.g., ₹8-12 LPA, $80k-$100k"
                                        style={{
                                            width: '100%',
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

                            {/* Posted Date & Status - 2 columns */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                        Posted Date
                                    </label>
                                    <input
                                        type="date"
                                        name="postedDate"
                                        value={formData.postedDate}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
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

                                <div>
                                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8,
                                            color: '#fff',
                                            fontSize: 14,
                                            outline: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>
                                                {status === 'open' ? '🔵 Open' : '🔴 Closed'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Accent Color */}
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                    Accent Color
                                </label>
                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {accentColors.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, accent: color }))}
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50%',
                                                    background: color,
                                                    border: formData.accent === color ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        name="accent"
                                        value={formData.accent}
                                        onChange={handleChange}
                                        style={{
                                            width: 120,
                                            padding: '8px 12px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8,
                                            color: '#fff',
                                            fontSize: 12,
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>
                                    Job Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="8"
                                    placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 8,
                                        color: '#fff',
                                        fontSize: 14,
                                        resize: 'vertical',
                                        outline: 'none',
                                        fontFamily: 'inherit'
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Requirements Section */}
                        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 16 }}>
                                Requirements
                            </h3>

                            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                <input
                                    type="text"
                                    value={requirementsInput}
                                    onChange={(e) => setRequirementsInput(e.target.value)}
                                    onKeyPress={handleRequirementKeyPress}
                                    placeholder="e.g., Bachelor's degree in Computer Science"
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
                                <button
                                    type="button"
                                    onClick={addRequirement}
                                    style={{
                                        padding: '12px 24px',
                                        background: 'rgba(96,165,250,0.2)',
                                        border: '1px solid #60a5fa',
                                        borderRadius: 8,
                                        color: '#60a5fa',
                                        fontSize: 14,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Add
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                {formData.requirements.map((req, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        style={{
                                            padding: '8px 16px',
                                            background: 'rgba(96,165,250,0.15)',
                                            border: '1px solid rgba(96,165,250,0.3)',
                                            borderRadius: 8,
                                            color: '#60a5fa',
                                            fontSize: 13,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10
                                        }}
                                    >
                                        ✓ {req}
                                        <button
                                            type="button"
                                            onClick={() => removeRequirement(req)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                fontSize: 16,
                                                padding: '0 4px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            ×
                                        </button>
                                    </motion.span>
                                ))}
                            </div>
                            {formData.requirements.length === 0 && (
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 8 }}>
                                    No requirements added yet. Add at least one requirement.
                                </p>
                            )}
                        </div>

                        {/* Benefits Section */}
                        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 16 }}>
                                Benefits & Perks
                            </h3>

                            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                <input
                                    type="text"
                                    value={benefitsInput}
                                    onChange={(e) => setBenefitsInput(e.target.value)}
                                    onKeyPress={handleBenefitKeyPress}
                                    placeholder="e.g., Health Insurance, Flexible Hours"
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
                                <button
                                    type="button"
                                    onClick={addBenefit}
                                    style={{
                                        padding: '12px 24px',
                                        background: 'rgba(52,211,153,0.2)',
                                        border: '1px solid #34d399',
                                        borderRadius: 8,
                                        color: '#34d399',
                                        fontSize: 14,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Add
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                {formData.benefits.map((benefit, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        style={{
                                            padding: '8px 16px',
                                            background: 'rgba(52,211,153,0.15)',
                                            border: '1px solid rgba(52,211,153,0.3)',
                                            borderRadius: 8,
                                            color: '#34d399',
                                            fontSize: 13,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10
                                        }}
                                    >
                                        🎁 {benefit}
                                        <button
                                            type="button"
                                            onClick={() => removeBenefit(benefit)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                fontSize: 16,
                                                padding: '0 4px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            ×
                                        </button>
                                    </motion.span>
                                ))}
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
                                style={{
                                    padding: '12px 28px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 10,
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
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
                                    transition: 'all 0.2s'
                                }}
                            >
                                {/* {isSubmitting ? 'Creating...' : 'Post Job'} */}
                                {isSubmitting
                                    ? (id ? 'Updating...' : 'Creating...')
                                    : (id ? 'Update Job' : 'Post Job')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CareerForm