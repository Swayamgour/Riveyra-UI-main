// ServiceForm.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import {
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useGetServiceByIdQuery
} from '../../redux/api'
import { tabs } from '../../components/data'


const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Spaces ko - se replace kare
        .replace(/[^\w\-]+/g, '')       // Special characters hata de
        .replace(/\-\-+/g, '-')         // Multiple - ko single - kare
        .replace(/^-+/, '')             // Starting se - hata de
        .replace(/-+$/, '')             // End se - hata de
}

const ServiceForm = () => {
    const { id } = useParams()
    const isEdit = Boolean(id)
    const navigate = useNavigate()

    const { data: servicesDataById, isSuccess } = useGetServiceByIdQuery(id)

    let servicesData = servicesDataById?.data || []



    const [createService, { isLoading: isCreating }] = useCreateServiceMutation()
    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation()
    const isSubmitting = isCreating || isUpdating

    const [activeTab, setActiveTab] = useState('basic')
    const [message, setMessage] = useState({ type: '', text: '' })
    const [errors, setErrors] = useState({})
    const [validationAttempted, setValidationAttempted] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        desc: '',
        slug: '',
        accent: '#60a5fa',
        path: '',
        tags: [],

        hero: {
            badge: '',
            title: '',
            subtitle: '',
            intro: '',
            desc: [],
            questionsTitle: '',
            questions: [],
            closing: []
        },
        blocks: [],
        comparison: { title: '', data: [] },
        whoNeeds: { title: '', problems: [], idealFor: [] },
        approach: { title: '', steps: [], whyChoose: [] },
        faq: [],
        cta: { title: '', desc: '', buttons: [] },

        // ✅ SEO
        seo: {
            metaTitle: '',
            metaDescription: '',
            keywords: [],          // array of strings
            canonical: '',
            robots: 'index, follow',
            openGraph: {
                title: '',
                description: '',
                image: ''
            },
            twitter: {
                title: '',
                description: '',
                image: ''
            },
            schema: ''              // JSON-LD as raw JSON text
        }
    })

    // Image states for blocks
    const [blockImageFiles, setBlockImageFiles] = useState({})

    // Temporary input states
    const [tempTag, setTempTag] = useState('')
    const [tempHeroDesc, setTempHeroDesc] = useState('')
    const [tempHeroQuestion, setTempHeroQuestion] = useState('')
    const [tempHeroClosing, setTempHeroClosing] = useState('')
    const [tempProblem, setTempProblem] = useState('')
    const [tempIdealFor, setTempIdealFor] = useState('')
    const [tempFeature, setTempFeature] = useState('')
    const [tempTraditional, setTempTraditional] = useState('')
    const [tempAi, setTempAi] = useState('')
    const [tempStepNumber, setTempStepNumber] = useState('')
    const [tempStepTitle, setTempStepTitle] = useState('')
    const [tempStepDesc, setTempStepDesc] = useState('')
    const [tempWhyTitle, setTempWhyTitle] = useState('')
    const [tempWhyDesc, setTempWhyDesc] = useState('')
    const [tempFaqQ, setTempFaqQ] = useState('')
    const [tempFaqA, setTempFaqA] = useState('')
    const [tempCtaLabel, setTempCtaLabel] = useState('')
    const [tempCtaLink, setTempCtaLink] = useState('')

    const [iconFile, setIconFile] = useState(null)
    const [iconPreview, setIconPreview] = useState("")

    // SEO temp states
    const [tempKeyword, setTempKeyword] = useState('')

    // Generic SEO field change (top-level: metaTitle, metaDescription, canonical, robots, schema)
    const handleSeoChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            seo: { ...prev.seo, [field]: value }
        }))
    }

    // Nested OG / Twitter change
    const handleSeoNestedChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            seo: {
                ...prev.seo,
                [section]: { ...prev.seo[section], [field]: value }
            }
        }))
    }

    // Keywords handlers
    const addKeyword = () => {
        if (tempKeyword.trim() && !formData?.seo.keywords.includes(tempKeyword.trim())) {
            setFormData(prev => ({
                ...prev,
                seo: { ...prev.seo, keywords: [...prev.seo.keywords, tempKeyword.trim()] }
            }))
            setTempKeyword('')
        }
    }

    const removeKeyword = (kw) => {
        setFormData(prev => ({
            ...prev,
            seo: { ...prev.seo, keywords: prev.seo.keywords.filter(k => k !== kw) }
        }))
    }

    // Load data for edit
    useEffect(() => {
        if (isEdit && servicesDataById?.data && isSuccess) {
            const service = servicesDataById.data;

            setFormData({
                title: service.title || '',
                desc: service.desc || '',
                slug: service.slug || '',
                accent: service.accent || '#60a5fa',
                path: service.path || '',
                tags: service.tags || [],
                hero: service.hero || { /*...*/ },
                blocks: service.blocks || [],
                comparison: service.comparison || { title: '', data: [] },
                whoNeeds: service.whoNeeds || { title: '', problems: [], idealFor: [] },
                approach: service.approach || { title: '', steps: [], whyChoose: [] },
                faq: service.faq || [],
                cta: service.cta || { title: '', desc: '', buttons: [] },
                // ✅ SEO
                seo: {
                    metaTitle: service.seo?.metaTitle || '',
                    metaDescription: service.seo?.metaDescription || '',
                    keywords: service.seo?.keywords || [],
                    canonical: service.seo?.canonical || '',
                    robots: service.seo?.robots || 'index, follow',
                    openGraph: {
                        title: service.seo?.openGraph?.title || '',
                        description: service.seo?.openGraph?.description || '',
                        image: service.seo?.openGraph?.image || ''
                    },
                    twitter: {
                        title: service.seo?.twitter?.title || '',
                        description: service.seo?.twitter?.description || '',
                        image: service.seo?.twitter?.image || ''
                    },
                    schema: service.seo?.schema
                        ? (typeof service.seo.schema === 'string'
                            ? service.seo.schema
                            : JSON.stringify(service.seo.schema, null, 2))
                        : ''
                }
            });
        }
    }, [id, servicesDataById, isSuccess])

    // Auto-generate slug from title
    useEffect(() => {
        if (formData?.title && !formData?.slug && !isEdit) {
            const generatedSlug = formData?.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            setFormData(prev => ({ ...prev, slug: generatedSlug }))
        }
    }, [formData?.title, isEdit])

    // Validation
    const validateForm = () => {
        const newErrors = {};

        // BASIC
        if (!formData?.title?.trim()) newErrors.title = "Title is required";
        if (!formData?.desc?.trim()) newErrors.desc = "Description is required";
        if (!formData?.slug?.trim()) newErrors.slug = "Slug is required";

        // HERO
        if (!formData?.hero.badge?.trim()) newErrors["hero.badge"] = "Hero badge required";
        if (!formData?.hero.title?.trim()) newErrors["hero.title"] = "Hero title required";
        if (!formData?.hero.subtitle?.trim()) newErrors["hero.subtitle"] = "Hero subtitle required";

        if (!formData?.hero.desc || formData?.hero.desc.length === 0) {
            newErrors["hero.desc"] = "At least one description required";
        }

        // FAQ (optional but recommended)
        formData?.faq.forEach((faq, i) => {
            if (!faq.q?.trim()) newErrors[`faq.q.${i}`] = "Question required";
            if (!faq.a?.trim()) newErrors[`faq.a.${i}`] = "Answer required";
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Generic handlers

    const handleChange = (field, value) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value };

            // ✅ auto slug generate
            if (field === 'title') {
                updated.slug = generateSlug(value);
            }

            return updated;
        });

        // ✅ remove error
        if (errors[field]) {
            const newErrors = { ...errors };
            delete newErrors[field];
            setErrors(newErrors);
        }
    };

    const handleHeroChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            hero: { ...prev.hero, [field]: value }
        }));

        const key = `hero.${field}`;
        if (errors[key]) {
            const newErrors = { ...errors };
            delete newErrors[key];
            setErrors(newErrors);
        }
    };

    // Tags handlers
    const addTag = () => {
        if (tempTag.trim() && !formData?.tags.includes(tempTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tempTag.trim()]
            }))
            setTempTag('')
        }
    }

    const removeTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }))
    }

    // Hero array handlers
    const addHeroDesc = () => {
        if (tempHeroDesc.trim()) {
            setFormData(prev => ({
                ...prev,
                hero: { ...prev.hero, desc: [...prev.hero.desc, tempHeroDesc.trim()] }
            }))
            setTempHeroDesc('')
        }
    }

    const removeHeroDesc = (index) => {
        setFormData(prev => ({
            ...prev,
            hero: { ...prev.hero, desc: prev.hero.desc.filter((_, i) => i !== index) }
        }))
    }

    const addHeroQuestion = () => {
        if (tempHeroQuestion.trim()) {
            setFormData(prev => ({
                ...prev,
                hero: { ...prev.hero, questions: [...prev.hero.questions, tempHeroQuestion.trim()] }
            }))
            setTempHeroQuestion('')
        }
    }

    const removeHeroQuestion = (index) => {
        setFormData(prev => ({
            ...prev,
            hero: { ...prev.hero, questions: prev.hero.questions.filter((_, i) => i !== index) }
        }))
    }

    const addHeroClosing = () => {
        if (tempHeroClosing.trim()) {
            setFormData(prev => ({
                ...prev,
                hero: { ...prev.hero, closing: [...prev.hero.closing, tempHeroClosing.trim()] }
            }))
            setTempHeroClosing('')
        }
    }

    const removeHeroClosing = (index) => {
        setFormData(prev => ({
            ...prev,
            hero: { ...prev.hero, closing: prev.hero.closing.filter((_, i) => i !== index) }
        }))
    }

    // Blocks handlers with image support
    const addBlock = () => {
        setFormData(prev => ({
            ...prev,
            blocks: [...prev.blocks, {
                label: '',
                title: '',
                desc: '',
                image: '', // This will store the image URL or base64
                features: [],
                extra: '',
                example: '',
                reverse: false
            }]
        }))
    }

    const updateBlock = (index, field, value) => {
        const updatedBlocks = [...formData?.blocks]
        updatedBlocks[index] = { ...updatedBlocks[index], [field]: value }
        setFormData(prev => ({ ...prev, blocks: updatedBlocks }))
    }

    const handleBlockImageUpload = (index, file) => {
        if (file) {
            // Convert to base64 for preview
            const reader = new FileReader()
            reader.onloadend = () => {
                updateBlock(index, 'image', reader.result)
            }
            reader.readAsDataURL(file)

            // Store file for FormData
            setBlockImageFiles(prev => ({
                ...prev,
                [index]: file
            }))
        }
    }

    const removeBlock = (index) => {
        setFormData(prev => ({
            ...prev,
            blocks: prev.blocks.filter((_, i) => i !== index)
        }))
        // Remove image file reference
        const newBlockImageFiles = { ...blockImageFiles }
        delete newBlockImageFiles[index]
        setBlockImageFiles(newBlockImageFiles)
    }

    const addFeature = (blockIndex) => {
        if (tempFeature.trim()) {
            const updatedBlocks = [...formData?.blocks]
            updatedBlocks[blockIndex].features.push(tempFeature.trim())
            setFormData(prev => ({ ...prev, blocks: updatedBlocks }))
            setTempFeature('')
        }
    }

    const removeFeature = (blockIndex, featureIndex) => {
        const updatedBlocks = [...formData?.blocks]
        updatedBlocks[blockIndex].features = updatedBlocks[blockIndex].features.filter((_, i) => i !== featureIndex)
        setFormData(prev => ({ ...prev, blocks: updatedBlocks }))
    }

    // Comparison handlers
    const addComparisonRow = () => {
        if (tempFeature && tempTraditional && tempAi) {
            setFormData(prev => ({
                ...prev,
                comparison: {
                    ...prev.comparison,
                    data: [...prev.comparison.data, {
                        feature: tempFeature,
                        traditional: tempTraditional,
                        ai: tempAi
                    }]
                }
            }))
            setTempFeature('')
            setTempTraditional('')
            setTempAi('')
        }
    }

    const updateComparisonRow = (index, field, value) => {
        const updatedData = [...formData?.comparison.data]
        updatedData[index] = { ...updatedData[index], [field]: value }
        setFormData(prev => ({
            ...prev,
            comparison: { ...prev.comparison, data: updatedData }
        }))
    }

    const removeComparisonRow = (index) => {
        setFormData(prev => ({
            ...prev,
            comparison: {
                ...prev.comparison,
                data: prev.comparison.data.filter((_, i) => i !== index)
            }
        }))
    }

    // Who Needs handlers
    const addProblem = () => {
        if (tempProblem.trim()) {
            setFormData(prev => ({
                ...prev,
                whoNeeds: { ...prev.whoNeeds, problems: [...prev.whoNeeds.problems, tempProblem.trim()] }
            }))
            setTempProblem('')
        }
    }

    const removeProblem = (index) => {
        setFormData(prev => ({
            ...prev,
            whoNeeds: {
                ...prev.whoNeeds,
                problems: prev.whoNeeds.problems.filter((_, i) => i !== index)
            }
        }))
    }

    const addIdealFor = () => {
        if (tempIdealFor.trim()) {
            setFormData(prev => ({
                ...prev,
                whoNeeds: { ...prev.whoNeeds, idealFor: [...prev.whoNeeds.idealFor, tempIdealFor.trim()] }
            }))
            setTempIdealFor('')
        }
    }

    const removeIdealFor = (index) => {
        setFormData(prev => ({
            ...prev,
            whoNeeds: {
                ...prev.whoNeeds,
                idealFor: prev.whoNeeds.idealFor.filter((_, i) => i !== index)
            }
        }))
    }

    // Approach handlers
    const addStep = () => {
        if (tempStepNumber && tempStepTitle && tempStepDesc) {
            setFormData(prev => ({
                ...prev,
                approach: {
                    ...prev.approach,
                    steps: [...prev.approach.steps, {
                        number: tempStepNumber,
                        title: tempStepTitle,
                        desc: tempStepDesc
                    }]
                }
            }))
            setTempStepNumber('')
            setTempStepTitle('')
            setTempStepDesc('')
        }
    }

    const updateStep = (index, field, value) => {
        const updatedSteps = [...formData?.approach.steps]
        updatedSteps[index] = { ...updatedSteps[index], [field]: value }
        setFormData(prev => ({
            ...prev,
            approach: { ...prev.approach, steps: updatedSteps }
        }))
    }

    const removeStep = (index) => {
        setFormData(prev => ({
            ...prev,
            approach: {
                ...prev.approach,
                steps: prev.approach.steps.filter((_, i) => i !== index)
            }
        }))
    }

    const addWhyChoose = () => {
        if (tempWhyTitle && tempWhyDesc) {
            setFormData(prev => ({
                ...prev,
                approach: {
                    ...prev.approach,
                    whyChoose: [...prev.approach.whyChoose, {
                        title: tempWhyTitle,
                        desc: tempWhyDesc
                    }]
                }
            }))
            setTempWhyTitle('')
            setTempWhyDesc('')
        }
    }

    const updateWhyChoose = (index, field, value) => {
        const updatedWhyChoose = [...formData?.approach.whyChoose]
        updatedWhyChoose[index] = { ...updatedWhyChoose[index], [field]: value }
        setFormData(prev => ({
            ...prev,
            approach: { ...prev.approach, whyChoose: updatedWhyChoose }
        }))
    }

    const removeWhyChoose = (index) => {
        setFormData(prev => ({
            ...prev,
            approach: {
                ...prev.approach,
                whyChoose: prev.approach.whyChoose.filter((_, i) => i !== index)
            }
        }))
    }

    const addFaq = () => {
        if (!tempFaqQ.trim() || !tempFaqA.trim()) return;

        setFormData(prev => ({
            ...prev,
            faq: [...prev.faq, { q: tempFaqQ, a: tempFaqA }]
        }));

        setTempFaqQ('');
        setTempFaqA('');
    };

    const updateFaq = (index, field, value) => {
        const updatedFaq = [...formData?.faq]
        updatedFaq[index] = { ...updatedFaq[index], [field]: value }
        setFormData(prev => ({ ...prev, faq: updatedFaq }))
    }

    const removeFaq = (index) => {
        setFormData(prev => ({
            ...prev,
            faq: prev.faq.filter((_, i) => i !== index)
        }))
    }

    // CTA handlers
    const addCtaButton = () => {
        if (tempCtaLabel && tempCtaLink) {
            setFormData(prev => ({
                ...prev,
                cta: {
                    ...prev.cta,
                    buttons: [...prev.cta.buttons, { label: tempCtaLabel, link: tempCtaLink }]
                }
            }))
            setTempCtaLabel('')
            setTempCtaLink('')
        }
    }

    const updateCtaButton = (index, field, value) => {
        const updatedButtons = [...formData?.cta.buttons]
        updatedButtons[index] = { ...updatedButtons[index], [field]: value }
        setFormData(prev => ({
            ...prev,
            cta: { ...prev.cta, buttons: updatedButtons }
        }))
    }

    const removeCtaButton = (index) => {
        setFormData(prev => ({
            ...prev,
            cta: {
                ...prev.cta,
                buttons: prev.cta.buttons.filter((_, i) => i !== index)
            }
        }))
    }

    useEffect(() => {
        if (isEdit && servicesDataById?.data) {
            const service = servicesDataById.data

            if (service.icons) {
                setIconPreview(service.icons)
            }
        }
    }, [isEdit, servicesDataById])

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Clear previous messages
        setMessage({ type: '', text: '' })
        setValidationAttempted(true)

        // Validate form
        const isValid = validateForm()

        if (!isValid) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setMessage({
                type: 'error',
                text: 'Please fix all validation errors before submitting. Check all required fields marked with *.'
            })
            // Scroll to first error
            const firstErrorField = Object.keys(errors)[0]
            if (firstErrorField) {
                const element = document.querySelector(`[name="${firstErrorField}"]`)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
            }
            return
        }

        try {
            const formDataToSend = new FormData()

            // Append basic fields as strings
            formDataToSend.append('title', formData?.title)
            formDataToSend.append('desc', formData?.desc)
            formDataToSend.append('slug', formData?.slug)
            formDataToSend.append('accent', formData?.accent)
            formDataToSend.append('path', formData?.path || '')
            formDataToSend.append('tags', JSON.stringify(formData?.tags))

            // Append nested objects as JSON strings
            formDataToSend.append('hero', JSON.stringify(formData?.hero))
            formDataToSend.append('comparison', JSON.stringify(formData?.comparison))
            formDataToSend.append('whoNeeds', JSON.stringify(formData?.whoNeeds))
            formDataToSend.append('approach', JSON.stringify(formData?.approach))
            formDataToSend.append('faq', JSON.stringify(formData?.faq))
            formDataToSend.append('cta', JSON.stringify(formData?.cta))
            formDataToSend.append("seo", JSON.stringify(formData.seo));

            // ICON FILE
            if (iconFile) {
                // console.log(iconFile)
                formDataToSend.append("icon", iconFile)
            }

            // Handle blocks with images
            const blocksWithImages = formData?.blocks.map((block, index) => {
                const blockCopy = { ...block }
                // If there's an image file for this block, we'll send it separately
                if (blockImageFiles[index]) {
                    blockCopy.image = `block_image_${index}` // Temporary marker
                }
                return blockCopy
            })

            formDataToSend.append('blocks', JSON.stringify(blocksWithImages))

            // Append block images
            Object.entries(blockImageFiles).forEach(([index, file]) => {
                // formDataToSend.append(`block_image_${index}`, file)
                formDataToSend.append("blockImages", file);
            })

            let response
            if (isEdit) {
                formDataToSend.append('id', id)
                
                response = await updateService({ id, formData: formDataToSend }).unwrap()
            } else {
                response = await createService(formDataToSend).unwrap()
            }

            if (response.success) {
                setMessage({ type: 'success', text: `Service ${isEdit ? 'updated' : 'created'} successfully!` })
                setTimeout(() => navigate('/admin/services'), 1500)
            } else {
                setMessage({ type: 'error', text: response.message || 'Something went wrong' })
            }
        } catch (error) {
            console.error('Submission error:', error)
            const errorMessage = error?.data?.message || error?.message || 'Something went wrong while saving the service'
            setMessage({ type: 'error', text: errorMessage })

            // Show detailed error if available
            if (error?.data?.errors) {
                const detailedErrors = Object.values(error.data.errors).flat().join(', ')
                setMessage({ type: 'error', text: `Validation failed: ${detailedErrors}` })
            }
        }
    }

    const handleIconUpload = (file) => {
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setIconPreview(reader.result) // preview
            }
            reader.readAsDataURL(file)

            setIconFile(file) // actual file
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1422 100%)',
            padding: '40px 5%'
        }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
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
                        {isEdit ? 'Edit Service' : 'Create New Service'}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>
                        Fill in all sections to create a comprehensive service page
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

                {/* Validation Summary */}
                {validationAttempted && Object.keys(errors).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            padding: '14px 18px',
                            borderRadius: 10,
                            marginBottom: 24,
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid #ef4444',
                            color: '#ef4444',
                            fontSize: 14
                        }}
                    >
                        <strong>Please fix the following errors:</strong>
                        <ul style={{ marginTop: 8, marginLeft: 20 }}>
                            {Object.entries(errors).slice(0, 5).map(([key, error]) => (
                                <li key={key}>{error}</li>
                            ))}
                            {Object.keys(errors).length > 5 && (
                                <li>...and {Object.keys(errors).length - 5} more errors</li>
                            )}
                        </ul>
                    </motion.div>
                )}

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginBottom: 24,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    paddingBottom: 12
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '10px 20px',
                                background: activeTab === tab.id ? 'rgba(96,165,250,0.2)' : 'transparent',
                                border: activeTab === tab.id ? '1px solid #60a5fa' : '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 10,
                                color: activeTab === tab.id ? '#60a5fa' : 'rgba(255,255,255,0.7)',
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 20,
                        padding: '32px 28px'
                    }}>
                        {/* BASIC INFO TAB */}
                        {activeTab === 'basic' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
                                    Basic Information <span style={{ color: '#ef4444' }}>*</span>
                                </h3>

                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Service Icon
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleIconUpload(e.target.files[0])}
                                        style={{
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8,
                                            color: '#fff',
                                            cursor: 'pointer'
                                        }}
                                    />

                                    {/* Preview */}
                                    {iconPreview && (
                                        <div style={{ marginTop: 10 }}>
                                            <img
                                                src={iconPreview}
                                                alt="icon preview"
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    objectFit: 'cover',
                                                    borderRadius: 8
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Service Title <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        name="title"
                                        type="text"
                                        value={formData?.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        placeholder="e.g., AI Development Services"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: `1px solid ${errors.title ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: 8,
                                            color: '#fff',
                                            fontSize: 14
                                        }}
                                    />
                                    {errors.title && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.title}</p>}
                                </div>

                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Short Description <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <textarea
                                        value={formData?.desc}
                                        onChange={(e) => handleChange('desc', e.target.value)}
                                        placeholder="Brief description of the service..."
                                        rows="3"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: `1px solid ${errors.desc ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: 8,
                                            color: '#fff',
                                            fontSize: 14,
                                            resize: 'vertical'
                                        }}
                                    />
                                    {errors.desc && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.desc}</p>}
                                </div>

                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Slug / URL <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData?.slug}
                                        onChange={(e) => handleChange('slug', e.target.value)}
                                        placeholder="ai-development-services"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: `1px solid ${errors.slug ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: 8,
                                            color: '#fff',
                                            fontSize: 14
                                        }}
                                    />
                                    {errors.slug && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.slug}</p>}
                                </div>

                                {/* <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Path / Route
                                    </label>
                                    <input
                                        type="text"
                                        value={formData?.path}
                                        onChange={(e) => handleChange('path', e.target.value)}
                                        placeholder="/services/ai-development"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8,
                                            color: '#fff',
                                            fontSize: 14
                                        }}
                                    />
                                </div> */}

                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Accent Color
                                    </label>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            value={formData?.accent}
                                            onChange={(e) => handleChange('accent', e.target.value)}
                                            style={{ width: 50, height: 40, borderRadius: 8, cursor: 'pointer' }}
                                        />
                                        <input
                                            type="text"
                                            value={formData?.accent}
                                            onChange={(e) => handleChange('accent', e.target.value)}
                                            style={{
                                                flex: 1,
                                                padding: '12px 16px',
                                                background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 8,
                                                color: '#fff',
                                                fontSize: 14
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Tags / Technologies
                                    </label>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <input
                                            type="text"
                                            value={tempTag}
                                            onChange={(e) => setTempTag(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && addTag()}
                                            placeholder="e.g., AI, Machine Learning, React"
                                            style={{
                                                flex: 1,
                                                padding: '12px 16px',
                                                background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 8,
                                                color: '#fff',
                                                fontSize: 14
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={addTag}
                                            style={{
                                                padding: '12px 20px',
                                                background: 'rgba(96,165,250,0.2)',
                                                border: '1px solid #60a5fa',
                                                borderRadius: 8,
                                                color: '#60a5fa',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                                        {formData?.tags.map(tag => (
                                            <span key={tag} style={{
                                                padding: '6px 12px',
                                                background: 'rgba(96,165,250,0.15)',
                                                border: '1px solid rgba(96,165,250,0.3)',
                                                borderRadius: 6,
                                                color: '#60a5fa',
                                                fontSize: 13,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8
                                            }}>
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    fontSize: 16
                                                }}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* HERO TAB */}
                        {activeTab === 'hero' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
                                    Hero Section <span style={{ color: '#ef4444' }}>*</span>
                                </h3>

                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Badge <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData?.hero.badge}
                                        onChange={(e) => handleHeroChange('badge', e.target.value)}
                                        placeholder="e.g., AI Solutions"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: `1px solid ${errors['hero.badge'] ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: 8,
                                            color: '#fff'
                                        }}
                                    />
                                    {errors['hero.badge'] && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors['hero.badge']}</p>}
                                </div>

                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Hero Title <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData?.hero.title}
                                        onChange={(e) => handleHeroChange('title', e.target.value)}
                                        placeholder="Main hero title"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: `1px solid ${errors['hero.title'] ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: 8,
                                            color: '#fff'
                                        }}
                                    />
                                    {errors['hero.title'] && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors['hero.title']}</p>}
                                </div>

                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Subtitle <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData?.hero.subtitle}
                                        onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                                        placeholder="Hero subtitle"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: `1px solid ${errors['hero.subtitle'] ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: 8,
                                            color: '#fff'
                                        }}
                                    />
                                    {errors['hero.subtitle'] && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors['hero.subtitle']}</p>}
                                </div>

                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Intro Text
                                    </label>
                                    <textarea
                                        value={formData?.hero.intro}
                                        onChange={(e) => handleHeroChange('intro', e.target.value)}
                                        rows="3"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8,
                                            color: '#fff'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Description Paragraphs <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    {formData?.hero?.desc?.map((desc, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                            <input
                                                type="text"
                                                value={desc}
                                                onChange={(e) => {
                                                    const newDesc = [...formData?.hero.desc]
                                                    newDesc[idx] = e.target.value
                                                    handleHeroChange('desc', newDesc)
                                                }}
                                                style={{
                                                    flex: 1,
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff'
                                                }}
                                            />
                                            <button type="button" onClick={() => removeHeroDesc(idx)} style={{
                                                padding: '12px 16px',
                                                background: 'rgba(239,68,68,0.2)',
                                                border: '1px solid #ef4444',
                                                borderRadius: 8,
                                                color: '#ef4444',
                                                cursor: 'pointer'
                                            }}>Remove</button>
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <input
                                            type="text"
                                            value={tempHeroDesc}
                                            onChange={(e) => setTempHeroDesc(e.target.value)}
                                            placeholder="Add a description paragraph"
                                            style={{
                                                flex: 1,
                                                padding: '12px 16px',
                                                background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 8,
                                                color: '#fff'
                                            }}
                                        />
                                        <button type="button" onClick={addHeroDesc} style={{
                                            padding: '12px 20px',
                                            background: 'rgba(96,165,250,0.2)',
                                            border: '1px solid #60a5fa',
                                            borderRadius: 8,
                                            color: '#60a5fa',
                                            cursor: 'pointer'
                                        }}>Add</button>
                                    </div>
                                    {errors['hero.desc'] && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors['hero.desc']}</p>}
                                </div>

                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Questions Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData?.hero.questionsTitle}
                                        onChange={(e) => handleHeroChange('questionsTitle', e.target.value)}
                                        placeholder="Common Questions"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8,
                                            color: '#fff'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Questions
                                    </label>
                                    {formData?.hero?.questions?.map((q, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                            <input
                                                type="text"
                                                value={q}
                                                onChange={(e) => {
                                                    const newQuestions = [...formData?.hero.questions]
                                                    newQuestions[idx] = e.target.value
                                                    handleHeroChange('questions', newQuestions)
                                                }}
                                                style={{
                                                    flex: 1,
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff'
                                                }}
                                            />
                                            <button type="button" onClick={() => removeHeroQuestion(idx)} style={{
                                                padding: '12px 16px',
                                                background: 'rgba(239,68,68,0.2)',
                                                border: '1px solid #ef4444',
                                                borderRadius: 8,
                                                color: '#ef4444',
                                                cursor: 'pointer'
                                            }}>Remove</button>
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <input
                                            type="text"
                                            value={tempHeroQuestion}
                                            onChange={(e) => setTempHeroQuestion(e.target.value)}
                                            placeholder="Add a question"
                                            style={{
                                                flex: 1,
                                                padding: '12px 16px',
                                                background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 8,
                                                color: '#fff'
                                            }}
                                        />
                                        <button type="button" onClick={addHeroQuestion} style={{
                                            padding: '12px 20px',
                                            background: 'rgba(96,165,250,0.2)',
                                            border: '1px solid #60a5fa',
                                            borderRadius: 8,
                                            color: '#60a5fa',
                                            cursor: 'pointer'
                                        }}>Add</button>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Closing Statements
                                    </label>
                                    {formData?.hero.closing.map((c, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                            <input
                                                type="text"
                                                value={c}
                                                onChange={(e) => {
                                                    const newClosing = [...formData?.hero.closing]
                                                    newClosing[idx] = e.target.value
                                                    handleHeroChange('closing', newClosing)
                                                }}
                                                style={{
                                                    flex: 1,
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff'
                                                }}
                                            />
                                            <button type="button" onClick={() => removeHeroClosing(idx)} style={{
                                                padding: '12px 16px',
                                                background: 'rgba(239,68,68,0.2)',
                                                border: '1px solid #ef4444',
                                                borderRadius: 8,
                                                color: '#ef4444',
                                                cursor: 'pointer'
                                            }}>Remove</button>
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <input
                                            type="text"
                                            value={tempHeroClosing}
                                            onChange={(e) => setTempHeroClosing(e.target.value)}
                                            placeholder="Add a closing statement"
                                            style={{
                                                flex: 1,
                                                padding: '12px 16px',
                                                background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 8,
                                                color: '#fff'
                                            }}
                                        />
                                        <button type="button" onClick={addHeroClosing} style={{
                                            padding: '12px 20px',
                                            background: 'rgba(96,165,250,0.2)',
                                            border: '1px solid #60a5fa',
                                            borderRadius: 8,
                                            color: '#60a5fa',
                                            cursor: 'pointer'
                                        }}>Add</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BLOCKS TAB */}
                        {activeTab === 'blocks' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>
                                        Content Blocks
                                    </h3>
                                    <button type="button" onClick={addBlock} style={{
                                        padding: '10px 20px',
                                        background: 'rgba(96,165,250,0.2)',
                                        border: '1px solid #60a5fa',
                                        borderRadius: 8,
                                        color: '#60a5fa',
                                        cursor: 'pointer'
                                    }}>
                                        + Add Block
                                    </button>
                                </div>

                                {formData?.blocks.map((block, idx) => (
                                    <div key={idx} style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: 16,
                                        padding: 20,
                                        marginBottom: 20
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                            <h4 style={{ color: '#60a5fa' }}>Block {idx + 1}</h4>
                                            <button type="button" onClick={() => removeBlock(idx)} style={{
                                                padding: '6px 12px',
                                                background: 'rgba(239,68,68,0.2)',
                                                border: '1px solid #ef4444',
                                                borderRadius: 6,
                                                color: '#ef4444',
                                                cursor: 'pointer'
                                            }}>Remove Block</button>
                                        </div>

                                        <div style={{ display: 'grid', gap: 16 }}>
                                            <input
                                                type="text"
                                                placeholder="Label"
                                                value={block.label}
                                                onChange={(e) => updateBlock(idx, 'label', e.target.value)}
                                                style={{
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff'
                                                }}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Title"
                                                value={block.title}
                                                onChange={(e) => updateBlock(idx, 'title', e.target.value)}
                                                style={{
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff'
                                                }}
                                            />
                                            <textarea
                                                placeholder="Description"
                                                value={block.desc}
                                                onChange={(e) => updateBlock(idx, 'desc', e.target.value)}
                                                rows="3"
                                                style={{
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff'
                                                }}
                                            />

                                            {/* Image Upload */}
                                            <div>
                                                <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                                    Block Image
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleBlockImageUpload(idx, e.target.files[0])}
                                                    style={{
                                                        padding: '12px 16px',
                                                        background: 'rgba(0,0,0,0.3)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: 8,
                                                        color: '#fff',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                                {block.image && (
                                                    <div style={{ marginTop: 8 }}>
                                                        <img
                                                            src={block.image}
                                                            alt="Block preview"
                                                            style={{
                                                                maxWidth: '100%',
                                                                maxHeight: 150,
                                                                borderRadius: 8,
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => updateBlock(idx, 'image', '')}
                                                            style={{
                                                                marginTop: 8,
                                                                padding: '4px 12px',
                                                                background: 'rgba(239,68,68,0.2)',
                                                                border: '1px solid #ef4444',
                                                                borderRadius: 6,
                                                                color: '#ef4444',
                                                                cursor: 'pointer',
                                                                fontSize: 12
                                                            }}
                                                        >
                                                            Remove Image
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 8, display: 'block' }}>
                                                    Features
                                                </label>
                                                {block.features.map((feature, fIdx) => (
                                                    <div key={fIdx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                                        <input
                                                            type="text"
                                                            value={feature}
                                                            onChange={(e) => {
                                                                const newFeatures = [...block.features]
                                                                newFeatures[fIdx] = e.target.value
                                                                updateBlock(idx, 'features', newFeatures)
                                                            }}
                                                            style={{
                                                                flex: 1,
                                                                padding: '12px 16px',
                                                                background: 'rgba(0,0,0,0.3)',
                                                                border: '1px solid rgba(255,255,255,0.1)',
                                                                borderRadius: 8,
                                                                color: '#fff'
                                                            }}
                                                        />
                                                        <button type="button" onClick={() => removeFeature(idx, fIdx)} style={{
                                                            padding: '12px 16px',
                                                            background: 'rgba(239,68,68,0.2)',
                                                            border: '1px solid #ef4444',
                                                            borderRadius: 8,
                                                            color: '#ef4444',
                                                            cursor: 'pointer'
                                                        }}>Remove</button>
                                                    </div>
                                                ))}
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <input
                                                        type="text"
                                                        value={tempFeature}
                                                        onChange={(e) => setTempFeature(e.target.value)}
                                                        placeholder="Add a feature"
                                                        style={{
                                                            flex: 1,
                                                            padding: '12px 16px',
                                                            background: 'rgba(0,0,0,0.3)',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            borderRadius: 8,
                                                            color: '#fff'
                                                        }}
                                                    />
                                                    <button type="button" onClick={() => addFeature(idx)} style={{
                                                        padding: '12px 20px',
                                                        background: 'rgba(96,165,250,0.2)',
                                                        border: '1px solid #60a5fa',
                                                        borderRadius: 8,
                                                        color: '#60a5fa',
                                                        cursor: 'pointer'
                                                    }}>Add</button>
                                                </div>
                                            </div>

                                            <input
                                                type="text"
                                                placeholder="Extra Info"
                                                value={block.extra}
                                                onChange={(e) => updateBlock(idx, 'extra', e.target.value)}
                                                style={{
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff'
                                                }}
                                            />

                                            <input
                                                type="text"
                                                placeholder="Example"
                                                value={block.example}
                                                onChange={(e) => updateBlock(idx, 'example', e.target.value)}
                                                style={{
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff'
                                                }}
                                            />

                                            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <input
                                                    type="checkbox"
                                                    checked={block.reverse}
                                                    onChange={(e) => updateBlock(idx, 'reverse', e.target.checked)}
                                                />
                                                <span style={{ color: 'rgba(255,255,255,0.8)' }}>Reverse Layout</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}

                                {formData?.blocks.length === 0 && (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: 60,
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: 16,
                                        color: 'rgba(255,255,255,0.4)'
                                    }}>
                                        No blocks added yet. Click "Add Block" to get started.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* COMPARISON TAB */}
                        {activeTab === 'comparison' && (
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 24 }}>
                                    Comparison Section
                                </h3>

                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Comparison Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData?.comparison.title}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            comparison: { ...prev.comparison, title: e.target.value }
                                        }))}
                                        placeholder="Traditional vs AI Approach"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8,
                                            color: '#fff'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                        <label style={{ color: 'rgba(255,255,255,0.8)' }}>Comparison Data</label>
                                        <button type="button" onClick={addComparisonRow} style={{
                                            padding: '8px 16px',
                                            background: 'rgba(96,165,250,0.2)',
                                            border: '1px solid #60a5fa',
                                            borderRadius: 8,
                                            color: '#60a5fa',
                                            cursor: 'pointer'
                                        }}>Add Row</button>
                                    </div>

                                    {formData?.comparison.data.map((row, idx) => (
                                        <div key={idx} style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: 12,
                                            padding: 16,
                                            marginBottom: 16
                                        }}>
                                            <div style={{ display: 'grid', gap: 12 }}>
                                                <input
                                                    type="text"
                                                    placeholder="Feature"
                                                    value={row.feature}
                                                    onChange={(e) => updateComparisonRow(idx, 'feature', e.target.value)}
                                                    style={{
                                                        padding: '12px 16px',
                                                        background: 'rgba(0,0,0,0.3)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: 8,
                                                        color: '#fff'
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Traditional Approach"
                                                    value={row.traditional}
                                                    onChange={(e) => updateComparisonRow(idx, 'traditional', e.target.value)}
                                                    style={{
                                                        padding: '12px 16px',
                                                        background: 'rgba(0,0,0,0.3)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: 8,
                                                        color: '#fff'
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="AI Approach"
                                                    value={row.ai}
                                                    onChange={(e) => updateComparisonRow(idx, 'ai', e.target.value)}
                                                    style={{
                                                        padding: '12px 16px',
                                                        background: 'rgba(0,0,0,0.3)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: 8,
                                                        color: '#fff'
                                                    }}
                                                />
                                                <button type="button" onClick={() => removeComparisonRow(idx)} style={{
                                                    padding: '8px',
                                                    background: 'rgba(239,68,68,0.2)',
                                                    border: '1px solid #ef4444',
                                                    borderRadius: 8,
                                                    color: '#ef4444',
                                                    cursor: 'pointer'
                                                }}>Remove Row</button>
                                            </div>
                                        </div>
                                    ))}

                                    <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
                                        <input
                                            type="text"
                                            placeholder="Feature"
                                            value={tempFeature}
                                            onChange={(e) => setTempFeature(e.target.value)}
                                            style={{
                                                padding: '12px 16px',
                                                background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 8,
                                                color: '#fff'
                                            }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Traditional Approach"
                                            value={tempTraditional}
                                            onChange={(e) => setTempTraditional(e.target.value)}
                                            style={{
                                                padding: '12px 16px',
                                                background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 8,
                                                color: '#fff'
                                            }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="AI Approach"
                                            value={tempAi}
                                            onChange={(e) => setTempAi(e.target.value)}
                                            style={{
                                                padding: '12px 16px',
                                                background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 8,
                                                color: '#fff'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* WHO NEEDS TAB */}
                        {activeTab === 'whoNeeds' && (
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 24 }}>
                                    Who Needs This Service
                                </h3>

                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Section Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData?.whoNeeds.title}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            whoNeeds: { ...prev.whoNeeds, title: e.target.value }
                                        }))}
                                        placeholder="Who Needs AI Development?"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8,
                                            color: '#fff'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Problems Solved
                                    </label>
                                    {formData?.whoNeeds.problems.map((problem, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                            <input
                                                type="text"
                                                value={problem}
                                                onChange={(e) => {
                                                    const newProblems = [...formData?.whoNeeds.problems]
                                                    newProblems[idx] = e.target.value
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        whoNeeds: { ...prev.whoNeeds, problems: newProblems }
                                                    }))
                                                }}
                                                style={{
                                                    flex: 1,
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff'
                                                }}
                                            />
                                            <button type="button" onClick={() => removeProblem(idx)} style={{
                                                padding: '12px 16px',
                                                background: 'rgba(239,68,68,0.2)',
                                                border: '1px solid #ef4444',
                                                borderRadius: 8,
                                                color: '#ef4444',
                                                cursor: 'pointer'
                                            }}>Remove</button>
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <input
                                            type="text"
                                            value={tempProblem}
                                            onChange={(e) => setTempProblem(e.target.value)}
                                            placeholder="Add a problem"
                                            style={{
                                                flex: 1,
                                                padding: '12px 16px',
                                                background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 8,
                                                color: '#fff'
                                            }}
                                        />
                                        <button type="button" onClick={addProblem} style={{
                                            padding: '12px 20px',
                                            background: 'rgba(96,165,250,0.2)',
                                            border: '1px solid #60a5fa',
                                            borderRadius: 8,
                                            color: '#60a5fa',
                                            cursor: 'pointer'
                                        }}>Add</button>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Ideal For
                                    </label>
                                    {formData?.whoNeeds.idealFor.map((ideal, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                            <input
                                                type="text"
                                                value={ideal}
                                                onChange={(e) => {
                                                    const newIdeal = [...formData?.whoNeeds.idealFor]
                                                    newIdeal[idx] = e.target.value
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        whoNeeds: { ...prev.whoNeeds, idealFor: newIdeal }
                                                    }))
                                                }}
                                                style={{
                                                    flex: 1,
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff'
                                                }}
                                            />
                                            <button type="button" onClick={() => removeIdealFor(idx)} style={{
                                                padding: '12px 16px',
                                                background: 'rgba(239,68,68,0.2)',
                                                border: '1px solid #ef4444',
                                                borderRadius: 8,
                                                color: '#ef4444',
                                                cursor: 'pointer'
                                            }}>Remove</button>
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <input
                                            type="text"
                                            value={tempIdealFor}
                                            onChange={(e) => setTempIdealFor(e.target.value)}
                                            placeholder="Add ideal audience"
                                            style={{
                                                flex: 1,
                                                padding: '12px 16px',
                                                background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 8,
                                                color: '#fff'
                                            }}
                                        />
                                        <button type="button" onClick={addIdealFor} style={{
                                            padding: '12px 20px',
                                            background: 'rgba(96,165,250,0.2)',
                                            border: '1px solid #60a5fa',
                                            borderRadius: 8,
                                            color: '#60a5fa',
                                            cursor: 'pointer'
                                        }}>Add</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* APPROACH TAB */}
                        {/* APPROACH TAB */}
                        {activeTab === 'approach' && (
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 24 }}>
                                    Approach Section
                                </h3>

                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Section Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData?.approach.title}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            approach: { ...prev.approach, title: e.target.value }
                                        }))}
                                        placeholder="Our Approach"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8,
                                            color: '#fff'
                                        }}
                                    />
                                </div>

                                {/* Steps Section */}
                                <div style={{ marginBottom: 32 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                        <label style={{ color: 'rgba(255,255,255,0.8)' }}>Steps</label>
                                        <button type="button" onClick={addStep} style={{
                                            padding: '8px 16px',
                                            background: 'rgba(96,165,250,0.2)',
                                            border: '1px solid #60a5fa',
                                            borderRadius: 8,
                                            color: '#60a5fa',
                                            cursor: 'pointer'
                                        }}>Add Step</button>
                                    </div>

                                    {/* Input fields for adding new step */}
                                    <div style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: 12,
                                        padding: 16,
                                        marginBottom: 20
                                    }}>
                                        <h4 style={{ color: '#60a5fa', marginBottom: 12, fontSize: 14 }}>Add New Step</h4>
                                        <div style={{ display: 'grid', gap: 12 }}>
                                            <input
                                                type="text"
                                                placeholder="Step Number (e.g., 01, 02)"
                                                value={tempStepNumber}
                                                onChange={(e) => setTempStepNumber(e.target.value)}
                                                style={{
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff'
                                                }}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Step Title"
                                                value={tempStepTitle}
                                                onChange={(e) => setTempStepTitle(e.target.value)}
                                                style={{
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff'
                                                }}
                                            />
                                            <textarea
                                                placeholder="Step Description"
                                                value={tempStepDesc}
                                                onChange={(e) => setTempStepDesc(e.target.value)}
                                                rows="3"
                                                style={{
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff',
                                                    resize: 'vertical'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={addStep}
                                                style={{
                                                    padding: '10px',
                                                    background: 'rgba(96,165,250,0.2)',
                                                    border: '1px solid #60a5fa',
                                                    borderRadius: 8,
                                                    color: '#60a5fa',
                                                    cursor: 'pointer',
                                                    fontWeight: 500
                                                }}
                                            >
                                                Add This Step
                                            </button>
                                        </div>
                                    </div>

                                    {/* Display existing steps */}
                                    {formData?.approach.steps.map((step, idx) => (
                                        <div key={idx} style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: 12,
                                            padding: 16,
                                            marginBottom: 16
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                                                <h4 style={{ color: '#60a5fa' }}>Step {step.number || idx + 1}</h4>
                                                <button type="button" onClick={() => removeStep(idx)} style={{
                                                    padding: '6px 12px',
                                                    background: 'rgba(239,68,68,0.2)',
                                                    border: '1px solid #ef4444',
                                                    borderRadius: 6,
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    fontSize: 12
                                                }}>Remove</button>
                                            </div>
                                            <div style={{ display: 'grid', gap: 12 }}>
                                                <input
                                                    type="text"
                                                    placeholder="Step Number (e.g., 01, 02)"
                                                    value={step.number}
                                                    onChange={(e) => updateStep(idx, 'number', e.target.value)}
                                                    style={{
                                                        padding: '12px 16px',
                                                        background: 'rgba(0,0,0,0.3)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: 8,
                                                        color: '#fff'
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Step Title"
                                                    value={step.title}
                                                    onChange={(e) => updateStep(idx, 'title', e.target.value)}
                                                    style={{
                                                        padding: '12px 16px',
                                                        background: 'rgba(0,0,0,0.3)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: 8,
                                                        color: '#fff'
                                                    }}
                                                />
                                                <textarea
                                                    placeholder="Step Description"
                                                    value={step.desc}
                                                    onChange={(e) => updateStep(idx, 'desc', e.target.value)}
                                                    rows="3"
                                                    style={{
                                                        padding: '12px 16px',
                                                        background: 'rgba(0,0,0,0.3)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: 8,
                                                        color: '#fff'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {formData?.approach.steps.length === 0 && (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: 40,
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: 12,
                                            color: 'rgba(255,255,255,0.4)',
                                            fontSize: 14
                                        }}>
                                            No steps added yet. Fill the form above and click "Add This Step".
                                        </div>
                                    )}
                                </div>

                                {/* Why Choose Us Section */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                        <label style={{ color: 'rgba(255,255,255,0.8)' }}>Why Choose Us</label>
                                        <button type="button" onClick={addWhyChoose} style={{
                                            padding: '8px 16px',
                                            background: 'rgba(96,165,250,0.2)',
                                            border: '1px solid #60a5fa',
                                            borderRadius: 8,
                                            color: '#60a5fa',
                                            cursor: 'pointer'
                                        }}>Add Reason</button>
                                    </div>

                                    {/* Input fields for adding new reason */}
                                    <div style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: 12,
                                        padding: 16,
                                        marginBottom: 20
                                    }}>
                                        <h4 style={{ color: '#60a5fa', marginBottom: 12, fontSize: 14 }}>Add New Reason</h4>
                                        <div style={{ display: 'grid', gap: 12 }}>
                                            <input
                                                type="text"
                                                placeholder="Reason Title"
                                                value={tempWhyTitle}
                                                onChange={(e) => setTempWhyTitle(e.target.value)}
                                                style={{
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff'
                                                }}
                                            />
                                            <textarea
                                                placeholder="Reason Description"
                                                value={tempWhyDesc}
                                                onChange={(e) => setTempWhyDesc(e.target.value)}
                                                rows="3"
                                                style={{
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff',
                                                    resize: 'vertical'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={addWhyChoose}
                                                style={{
                                                    padding: '10px',
                                                    background: 'rgba(96,165,250,0.2)',
                                                    border: '1px solid #60a5fa',
                                                    borderRadius: 8,
                                                    color: '#60a5fa',
                                                    cursor: 'pointer',
                                                    fontWeight: 500
                                                }}
                                            >
                                                Add This Reason
                                            </button>
                                        </div>
                                    </div>

                                    {/* Display existing reasons */}
                                    {formData?.approach.whyChoose.map((item, idx) => (
                                        <div key={idx} style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: 12,
                                            padding: 16,
                                            marginBottom: 16
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                                                <h4 style={{ color: '#60a5fa' }}>Reason {idx + 1}</h4>
                                                <button type="button" onClick={() => removeWhyChoose(idx)} style={{
                                                    padding: '6px 12px',
                                                    background: 'rgba(239,68,68,0.2)',
                                                    border: '1px solid #ef4444',
                                                    borderRadius: 6,
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    fontSize: 12
                                                }}>Remove</button>
                                            </div>
                                            <div style={{ display: 'grid', gap: 12 }}>
                                                <input
                                                    type="text"
                                                    placeholder="Title"
                                                    value={item.title}
                                                    onChange={(e) => updateWhyChoose(idx, 'title', e.target.value)}
                                                    style={{
                                                        padding: '12px 16px',
                                                        background: 'rgba(0,0,0,0.3)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: 8,
                                                        color: '#fff'
                                                    }}
                                                />
                                                <textarea
                                                    placeholder="Description"
                                                    value={item.desc}
                                                    onChange={(e) => updateWhyChoose(idx, 'desc', e.target.value)}
                                                    rows="3"
                                                    style={{
                                                        padding: '12px 16px',
                                                        background: 'rgba(0,0,0,0.3)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: 8,
                                                        color: '#fff'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {formData?.approach.whyChoose.length === 0 && (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: 40,
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: 12,
                                            color: 'rgba(255,255,255,0.4)',
                                            fontSize: 14
                                        }}>
                                            No reasons added yet. Fill the form above and click "Add This Reason".
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* FAQ TAB */}
                        {activeTab === 'faq' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>
                                        Frequently Asked Questions
                                    </h3>
                                    <button type="button" onClick={addFaq} style={{
                                        padding: '10px 20px',
                                        background: 'rgba(96,165,250,0.2)',
                                        border: '1px solid #60a5fa',
                                        borderRadius: 8,
                                        color: '#60a5fa',
                                        cursor: 'pointer'
                                    }}>
                                        + Add FAQ
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
                                    <input
                                        type="text"
                                        placeholder="Enter Question"
                                        value={tempFaqQ}
                                        onChange={(e) => setTempFaqQ(e.target.value)}
                                        style={{
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8,
                                            color: '#fff'
                                        }}
                                    />

                                    <textarea
                                        placeholder="Enter Answer"
                                        value={tempFaqA}
                                        onChange={(e) => setTempFaqA(e.target.value)}
                                        rows="3"
                                        style={{
                                            padding: '12px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8,
                                            color: '#fff'
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={addFaq}
                                        style={{
                                            padding: '12px',
                                            background: 'rgba(96,165,250,0.2)',
                                            border: '1px solid #60a5fa',
                                            borderRadius: 8,
                                            color: '#60a5fa',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Add FAQ
                                    </button>
                                </div>

                                {formData?.faq.map((faq, idx) => (
                                    <div key={idx} style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: 12,
                                        padding: 20,
                                        marginBottom: 16
                                    }}>
                                        <div style={{ display: 'grid', gap: 12 }}>
                                            <input
                                                type="text"
                                                placeholder="Question"
                                                value={faq.q}
                                                onChange={(e) => updateFaq(idx, 'q', e.target.value)}
                                                style={{
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff'
                                                }}
                                            />
                                            <textarea
                                                placeholder="Answer"
                                                value={faq.a}
                                                onChange={(e) => updateFaq(idx, 'a', e.target.value)}
                                                rows="3"
                                                style={{
                                                    padding: '12px 16px',
                                                    background: 'rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: 8,
                                                    color: '#fff'
                                                }}
                                            />
                                            <button type="button" onClick={() => removeFaq(idx)} style={{
                                                padding: '8px',
                                                background: 'rgba(239,68,68,0.2)',
                                                border: '1px solid #ef4444',
                                                borderRadius: 8,
                                                color: '#ef4444',
                                                cursor: 'pointer'
                                            }}>Remove FAQ</button>
                                        </div>
                                    </div>
                                ))}

                                {formData?.faq.length === 0 && (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: 60,
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: 16,
                                        color: 'rgba(255,255,255,0.4)'
                                    }}>
                                        No FAQs added yet. Click "Add FAQ" to get started.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* CTA TAB */}
                        {activeTab === 'cta' && (
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 24 }}>
                                    Call to Action Section
                                </h3>

                                <div style={{ display: 'grid', gap: 20 }}>
                                    <div>
                                        <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                            CTA Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData?.cta.title}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                cta: { ...prev.cta, title: e.target.value }
                                            }))}
                                            placeholder="Ready to Get Started?"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 8,
                                                color: '#fff'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                            CTA Description
                                        </label>
                                        <textarea
                                            value={formData?.cta.desc}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                cta: { ...prev.cta, desc: e.target.value }
                                            }))}
                                            rows="2"
                                            placeholder="Let's transform your business with AI solutions"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 8,
                                                color: '#fff'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                            <label style={{ color: 'rgba(255,255,255,0.8)' }}>CTA Buttons</label>
                                            <button type="button" onClick={addCtaButton} style={{
                                                padding: '8px 16px',
                                                background: 'rgba(96,165,250,0.2)',
                                                border: '1px solid #60a5fa',
                                                borderRadius: 8,
                                                color: '#60a5fa',
                                                cursor: 'pointer'
                                            }}>Add Button</button>
                                        </div>

                                        {formData?.cta.buttons.map((btn, idx) => (
                                            <div key={idx} style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                borderRadius: 12,
                                                padding: 16,
                                                marginBottom: 16
                                            }}>
                                                <div style={{ display: 'grid', gap: 12 }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Button Label"
                                                        value={btn.label}
                                                        onChange={(e) => updateCtaButton(idx, 'label', e.target.value)}
                                                        style={{
                                                            padding: '12px 16px',
                                                            background: 'rgba(0,0,0,0.3)',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            borderRadius: 8,
                                                            color: '#fff'
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Button Link"
                                                        value={btn.link}
                                                        onChange={(e) => updateCtaButton(idx, 'link', e.target.value)}
                                                        style={{
                                                            padding: '12px 16px',
                                                            background: 'rgba(0,0,0,0.3)',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            borderRadius: 8,
                                                            color: '#fff'
                                                        }}
                                                    />
                                                    <button type="button" onClick={() => removeCtaButton(idx)} style={{
                                                        padding: '8px',
                                                        background: 'rgba(239,68,68,0.2)',
                                                        border: '1px solid #ef4444',
                                                        borderRadius: 8,
                                                        color: '#ef4444',
                                                        cursor: 'pointer'
                                                    }}>Remove Button</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SEO TAB */}
                        {activeTab === 'seo' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
                                    SEO Settings
                                </h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: -12 }}>
                                    Sab fields optional hain — khali chodne par title/description se auto-fill ho jayega.
                                </p>

                                {/* Meta Title */}
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData?.seo.metaTitle}
                                        onChange={(e) => handleSeoChange('metaTitle', e.target.value)}
                                        placeholder="e.g., AI Development Services | YourBrand"
                                        style={{
                                            width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14
                                        }}
                                    />
                                </div>

                                {/* Meta Description */}
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Meta Description
                                    </label>
                                    <textarea
                                        value={formData?.seo.metaDescription}
                                        onChange={(e) => handleSeoChange('metaDescription', e.target.value)}
                                        rows="3"
                                        placeholder="Short SEO description (150-160 chars recommended)"
                                        style={{
                                            width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14, resize: 'vertical'
                                        }}
                                    />
                                </div>

                                {/* Keywords */}
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Keywords
                                    </label>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <input
                                            type="text"
                                            value={tempKeyword}
                                            onChange={(e) => setTempKeyword(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                                            placeholder="e.g., AI development, machine learning"
                                            style={{
                                                flex: 1, padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14
                                            }}
                                        />
                                        <button type="button" onClick={addKeyword} style={{
                                            padding: '12px 20px', background: 'rgba(96,165,250,0.2)',
                                            border: '1px solid #60a5fa', borderRadius: 8, color: '#60a5fa', cursor: 'pointer'
                                        }}>Add</button>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                                        {formData?.seo.keywords.map(kw => (
                                            <span key={kw} style={{
                                                padding: '6px 12px', background: 'rgba(96,165,250,0.15)',
                                                border: '1px solid rgba(96,165,250,0.3)', borderRadius: 6,
                                                color: '#60a5fa', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8
                                            }}>
                                                {kw}
                                                <button type="button" onClick={() => removeKeyword(kw)} style={{
                                                    background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16
                                                }}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Canonical URL */}
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Canonical URL
                                    </label>
                                    <input
                                        type="text"
                                        value={formData?.seo.canonical}
                                        onChange={(e) => handleSeoChange('canonical', e.target.value)}
                                        placeholder="https://yoursite.com/ServiceDetail/your-slug (auto-generated if empty)"
                                        style={{
                                            width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14
                                        }}
                                    />
                                </div>

                                {/* Robots */}
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Robots
                                    </label>
                                    <select
                                        value={formData?.seo.robots}
                                        onChange={(e) => handleSeoChange('robots', e.target.value)}
                                        style={{
                                            width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14
                                        }}
                                    >
                                        <option value="index, follow">index, follow</option>
                                        <option value="noindex, follow">noindex, follow</option>
                                        <option value="index, nofollow">index, nofollow</option>
                                        <option value="noindex, nofollow">noindex, nofollow</option>
                                    </select>
                                </div>

                                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '8px 0' }} />

                                {/* Open Graph */}
                                <h4 style={{ color: '#60a5fa', fontSize: 15, fontWeight: 600 }}>Open Graph (Facebook/LinkedIn)</h4>
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>OG Title</label>
                                    <input
                                        type="text"
                                        value={formData?.seo.openGraph.title}
                                        onChange={(e) => handleSeoNestedChange('openGraph', 'title', e.target.value)}
                                        style={{
                                            width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>OG Description</label>
                                    <textarea
                                        value={formData?.seo.openGraph.description}
                                        onChange={(e) => handleSeoNestedChange('openGraph', 'description', e.target.value)}
                                        rows="2"
                                        style={{
                                            width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14, resize: 'vertical'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>OG Image URL</label>
                                    <input
                                        type="text"
                                        value={formData?.seo.openGraph.image}
                                        onChange={(e) => handleSeoNestedChange('openGraph', 'image', e.target.value)}
                                        placeholder="Leave empty to use hero image"
                                        style={{
                                            width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14
                                        }}
                                    />
                                </div>

                                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '8px 0' }} />

                                {/* Twitter */}
                                <h4 style={{ color: '#60a5fa', fontSize: 15, fontWeight: 600 }}>Twitter Card</h4>
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>Twitter Title</label>
                                    <input
                                        type="text"
                                        value={formData?.seo.twitter.title}
                                        onChange={(e) => handleSeoNestedChange('twitter', 'title', e.target.value)}
                                        style={{
                                            width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>Twitter Description</label>
                                    <textarea
                                        value={formData?.seo.twitter.description}
                                        onChange={(e) => handleSeoNestedChange('twitter', 'description', e.target.value)}
                                        rows="2"
                                        style={{
                                            width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14, resize: 'vertical'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>Twitter Image URL</label>
                                    <input
                                        type="text"
                                        value={formData?.seo.twitter.image}
                                        onChange={(e) => handleSeoNestedChange('twitter', 'image', e.target.value)}
                                        placeholder="Leave empty to use hero image"
                                        style={{
                                            width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 14
                                        }}
                                    />
                                </div>

                                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '8px 0' }} />

                                {/* Schema JSON-LD */}
                                <div>
                                    <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8, display: 'block' }}>
                                        Schema (JSON-LD) — optional, advanced
                                    </label>
                                    <textarea
                                        value={formData?.seo.schema}
                                        onChange={(e) => handleSeoChange('schema', e.target.value)}
                                        rows="6"
                                        placeholder='{ "@context": "https://schema.org", "@type": "Service", ... }'
                                        style={{
                                            width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff',
                                            fontSize: 13, fontFamily: 'monospace', resize: 'vertical'
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Form Actions */}
                        <div style={{
                            display: 'flex',
                            gap: 16,
                            justifyContent: 'flex-end',
                            marginTop: 40,
                            paddingTop: 24,
                            borderTop: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/services')}
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
                                    opacity: isSubmitting ? 0.5 : 1
                                }}
                            >
                                Cancel
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
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div style={{
                                            width: 16,
                                            height: 16,
                                            border: '2px solid #fff',
                                            borderTopColor: 'transparent',
                                            borderRadius: '50%',
                                            animation: 'spin 0.6s linear infinite'
                                        }} />
                                        Saving...
                                    </>
                                ) : (
                                    isEdit ? 'Update Service' : 'Create Service'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <style>
                {`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    )
}

export default ServiceForm