import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGetServicesDetailTwoQuery, useUpdateServicesDetailTwoMutation } from '../../redux/api';

const ServicesDetailTwoForm = () => {
    const navigate = useNavigate();
    
    const { data: pageDataResp, isLoading: isFetching, isSuccess } = useGetServicesDetailTwoQuery();
    const [updateServicesDetailTwo, { isLoading: isUpdating }] = useUpdateServicesDetailTwoMutation();
    
    const [activeTab, setActiveTab] = useState('hero');
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        pageTitle: '',
        heroBadge: '',
        heroTitle: '',
        heroimg: '',
        heroAnimatedText: [],
        heroDescription: '',
        
        metrics: [],
        techStackTag: '',
        techStackTitle: '',
        techStackTitleHighlight: '',
        techStackDesc: '',
        techStats: [],
        techStack: [],
        
        servicesTag: '',
        servicesTitle: '',
        servicesTitleHighlight: '',
        servicesDesc: '',
        services: [],
        
        universeTag: '',
        universeTitle: '',
        universeTitleHighlight: '',
        universecenter:"",
        universecenterdesc:"",
        universeCards: [],
        
        whyTag: '',
        whyTitle: '',
        whyTitleHighlight: '',
        whyCards: [],
        
        processTitle: '',
        processTitleHighlight: '',
        processDesc: '',
        processSteps: [],
        
        testimonials: [],
        faqs: [],
        
        contactHeadings: [],
        contactDesc: '',
        contactPhone: '',
        contactEmail: '',
        contactAddress: ''
    });

    // Temp state for simple string arrays
    const [tempAnimatedText, setTempAnimatedText] = useState('');
    const [tempContactHeading, setTempContactHeading] = useState('');

    useEffect(() => {
        if (isSuccess && pageDataResp?.data) {
            setFormData(prev => ({
                ...prev,
                ...pageDataResp.data
            }));
        }
    }, [isSuccess, pageDataResp]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayStringAdd = (e, arrayName, tempVal, setTempVal) => {
        e.preventDefault();
        if (tempVal.trim()) {
            setFormData(prev => ({
                ...prev,
                [arrayName]: [...prev[arrayName], tempVal.trim()]
            }));
            setTempVal('');
        }
    };

    const handleArrayStringRemove = (arrayName, index) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].filter((_, i) => i !== index)
        }));
    };

    // Generic Object Array Handlers
    const handleAddObject = (arrayName, defaultObj) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: [...prev[arrayName], defaultObj]
        }));
    };

    const handleUpdateObject = (arrayName, index, field, value) => {
        const newArray = [...formData[arrayName]];
        newArray[index] = { ...newArray[index], [field]: value };
        setFormData(prev => ({ ...prev, [arrayName]: newArray }));
    };

    const handleRemoveObject = (arrayName, index) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        
        try {
            const result = await updateServicesDetailTwo(formData).unwrap();
            setMessage({ type: 'success', text: 'Page configuration updated successfully!' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            setMessage({ type: 'error', text: error.data?.message || 'Failed to update configuration.' });
        }
    };

    const tabs = [
        { id: 'hero', label: 'Hero & Basic' },
        { id: 'metrics', label: 'Metrics & Tech' },
        { id: 'cards', label: 'Service Cards' },
        { id: 'process', label: 'Process Steps' },
        { id: 'social', label: 'Testimonials & FAQs' },
        { id: 'contact', label: 'Contact Info' }
    ];

    if (isFetching) {
        return <div style={{ color: 'white', padding: '50px', textAlign: 'center' }}>Loading Configuration...</div>;
    }

    return (
        <div style={{
            maxWidth: 1000,
            margin: '0 auto',
            padding: '2rem',
            color: 'white',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Services Detail Two - Configuration</h1>
                <button 
                    onClick={handleSubmit}
                    disabled={isUpdating}
                    style={{
                        padding: '10px 20px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isUpdating ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {isUpdating ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>

            {message.text && (
                <div style={{
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '20px',
                    background: message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: message.type === 'success' ? '#4ade80' : '#f87171',
                    border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`
                }}>
                    {message.text}
                </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '8px 16px',
                            background: activeTab === tab.id ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                            color: activeTab === tab.id ? 'white' : '#a1a1aa',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {activeTab === 'hero' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Page Meta Title</label>
                            <input name="pageTitle" value={formData.pageTitle} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Hero Badge (Small tag at top)</label>
                            <input name="heroBadge" value={formData.heroBadge} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Hero Title</label>
                            <input name="heroTitle" value={formData.heroTitle} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Hero Image (e.g. /assets/image.webp)</label>
                            <input name="heroimg" value={formData.heroimg || ''} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Hero Description</label>
                            <textarea name="heroDescription" value={formData.heroDescription} onChange={handleChange} style={{ ...inputStyle, minHeight: '100px' }} />
                        </div>

                        <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Animated Text Array (The changing words)</label>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input value={tempAnimatedText} onChange={(e) => setTempAnimatedText(e.target.value)} placeholder="e.g. Real Results." style={inputStyle} />
                                <button type="button" onClick={(e) => handleArrayStringAdd(e, 'heroAnimatedText', tempAnimatedText, setTempAnimatedText)} style={btnStyle}>Add</button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {formData.heroAnimatedText.map((txt, idx) => (
                                    <span key={idx} style={tagStyle}>
                                        {txt} <button type="button" onClick={() => handleArrayStringRemove('heroAnimatedText', idx)} style={removeBtnStyle}>×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'metrics' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={sectionStyle}>
                            <h3 style={{ marginBottom: '16px', color: '#3b82f6' }}>Metrics Array</h3>
                            {formData.metrics.map((item, idx) => (
                                <div key={idx} style={itemBoxStyle}>
                                    <input placeholder="Label (e.g. Projects Launched)" value={item.label} onChange={(e) => handleUpdateObject('metrics', idx, 'label', e.target.value)} style={inputStyle} />
                                    <input placeholder="Value (e.g. 250)" type="number" value={item.value} onChange={(e) => handleUpdateObject('metrics', idx, 'value', e.target.value)} style={inputStyle} />
                                    <input placeholder="Suffix (e.g. + or %)" value={item.suffix} onChange={(e) => handleUpdateObject('metrics', idx, 'suffix', e.target.value)} style={inputStyle} />
                                    <input placeholder="Icon (Emoji)" value={item.icon} onChange={(e) => handleUpdateObject('metrics', idx, 'icon', e.target.value)} style={inputStyle} />
                                    <button type="button" onClick={() => handleRemoveObject('metrics', idx)} style={deleteBtnStyle}>Delete</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => handleAddObject('metrics', { label: '', value: 0, suffix: '', icon: '' })} style={addBtnStyle}>+ Add Metric</button>
                        </div>

                        <div style={sectionStyle}>
                            <h3 style={{ marginBottom: '16px', color: '#3b82f6' }}>Tech Stack Heading & Description</h3>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Tech Stack Tag</label>
                                <input name="techStackTag" value={formData.techStackTag || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Tech Stack Title</label>
                                <input name="techStackTitle" value={formData.techStackTitle || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Tech Stack Title Highlight</label>
                                <input name="techStackTitleHighlight" value={formData.techStackTitleHighlight || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Tech Stack Description</label>
                                <textarea name="techStackDesc" value={formData.techStackDesc || ''} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} />
                            </div>
                        </div>

                       

                        <div style={sectionStyle}>
                            <h3 style={{ marginBottom: '16px', color: '#3b82f6' }}>Tech Stack Array</h3>
                            {formData.techStack.map((item, idx) => (
                                <div key={idx} style={itemBoxStyle}>
                                    <input placeholder="Tech Name (e.g. React.js)" value={item.name} onChange={(e) => handleUpdateObject('techStack', idx, 'name', e.target.value)} style={inputStyle} />
                                    <input placeholder="Icon URL" value={item.iconUrl} onChange={(e) => handleUpdateObject('techStack', idx, 'iconUrl', e.target.value)} style={inputStyle} />
                                    <button type="button" onClick={() => handleRemoveObject('techStack', idx)} style={deleteBtnStyle}>Delete</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => handleAddObject('techStack', { name: '', iconUrl: '' })} style={addBtnStyle}>+ Add Tech</button>
                        </div>

                         <div style={sectionStyle}>
                            <h3 style={{ marginBottom: '16px', color: '#3b82f6' }}>Tech Stats Array</h3>
                            {(formData.techStats || []).map((item, idx) => (
                                <div key={idx} style={itemBoxStyle}>
                                    <input placeholder="Highlight (e.g. 3D & Motion)" value={item.highlight} onChange={(e) => handleUpdateObject('techStats', idx, 'highlight', e.target.value)} style={inputStyle} />
                                    <input placeholder="Text (e.g. Immersive Experiences)" value={item.text} onChange={(e) => handleUpdateObject('techStats', idx, 'text', e.target.value)} style={inputStyle} />
                                    <button type="button" onClick={() => handleRemoveObject('techStats', idx)} style={deleteBtnStyle}>Delete</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => handleAddObject('techStats', { highlight: '', text: '' })} style={addBtnStyle}>+ Add Tech Stat</button>
                        </div>
                    </div>
                )}

                {activeTab === 'cards' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={sectionStyle}>
                            <h3 style={{ marginBottom: '16px', color: '#3b82f6' }}>Core Services Heading & Description</h3>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Services Tag</label>
                                <input name="servicesTag" value={formData.servicesTag || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Services Title</label>
                                <input name="servicesTitle" value={formData.servicesTitle || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Services Title Highlight</label>
                                <input name="servicesTitleHighlight" value={formData.servicesTitleHighlight || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Services Description</label>
                                <textarea name="servicesDesc" value={formData.servicesDesc || ''} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} />
                            </div>
                        </div>

                        <div style={sectionStyle}>
                            <h3 style={{ marginBottom: '16px', color: '#3b82f6' }}>Core Services Grid</h3>
                            {formData.services.map((item, idx) => (
                                <div key={idx} style={itemBoxStyle}>
                                    <input placeholder="Title" value={item.title} onChange={(e) => handleUpdateObject('services', idx, 'title', e.target.value)} style={inputStyle} />
                                    <textarea placeholder="Description" value={item.desc} onChange={(e) => handleUpdateObject('services', idx, 'desc', e.target.value)} style={{ ...inputStyle, minHeight: '60px' }} />
                                    <textarea placeholder="SVG Code (raw <svg>)" value={item.iconSvg} onChange={(e) => handleUpdateObject('services', idx, 'iconSvg', e.target.value)} style={{ ...inputStyle, minHeight: '60px', fontFamily: 'monospace' }} />
                                    <button type="button" onClick={() => handleRemoveObject('services', idx)} style={deleteBtnStyle}>Delete</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => handleAddObject('services', { title: '', desc: '', iconSvg: '' })} style={addBtnStyle}>+ Add Service Card</button>
                        </div>

                        <div style={sectionStyle}>
                            <h3 style={{ marginBottom: '16px', color: '#3b82f6' }}>Universe Heading</h3>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Universe Tag</label>
                                <input name="universeTag" value={formData.universeTag || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Universe Title</label>
                                <input name="universeTitle" value={formData.universeTitle || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Universe Title Highlight</label>
                                <input name="universeTitleHighlight" value={formData.universeTitleHighlight || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Universe Center Title (Middle text)</label>
                                <input name="universecenter" value={formData.universecenter || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Universe Center Description</label>
                                <textarea name="universecenterdesc" value={formData.universecenterdesc || ''} onChange={handleChange} style={{ ...inputStyle, minHeight: '60px' }} />
                            </div>
                        </div>

                        <div style={sectionStyle}>
                            <h3 style={{ marginBottom: '16px', color: '#3b82f6' }}>Universe Cards (Exactly 4 Recommended)</h3>
                            {formData.universeCards.map((item, idx) => (
                                <div key={idx} style={itemBoxStyle}>
                                    <input placeholder="Title" value={item.title} onChange={(e) => handleUpdateObject('universeCards', idx, 'title', e.target.value)} style={inputStyle} />
                                    <textarea placeholder="Description" value={item.desc} onChange={(e) => handleUpdateObject('universeCards', idx, 'desc', e.target.value)} style={{ ...inputStyle, minHeight: '60px' }} />
                                    <button type="button" onClick={() => handleRemoveObject('universeCards', idx)} style={deleteBtnStyle}>Delete</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => handleAddObject('universeCards', { title: '', desc: '' })} style={addBtnStyle}>+ Add Universe Card</button>
                        </div>

                        <div style={sectionStyle}>
                            <h3 style={{ marginBottom: '16px', color: '#3b82f6' }}>Why Heading</h3>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Why Tag</label>
                                <input name="whyTag" value={formData.whyTag || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Why Title</label>
                                <input name="whyTitle" value={formData.whyTitle || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Why Title Highlight</label>
                                <input name="whyTitleHighlight" value={formData.whyTitleHighlight || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>

                        <div style={sectionStyle}>
                            <h3 style={{ marginBottom: '16px', color: '#3b82f6' }}>Why Riveyra Cards</h3>
                            {formData.whyCards.map((item, idx) => (
                                <div key={idx} style={itemBoxStyle}>
                                    <input placeholder="Title" value={item.title} onChange={(e) => handleUpdateObject('whyCards', idx, 'title', e.target.value)} style={inputStyle} />
                                    <textarea placeholder="Description" value={item.desc} onChange={(e) => handleUpdateObject('whyCards', idx, 'desc', e.target.value)} style={{ ...inputStyle, minHeight: '60px' }} />
                                    <textarea placeholder="SVG Code" value={item.iconSvg} onChange={(e) => handleUpdateObject('whyCards', idx, 'iconSvg', e.target.value)} style={{ ...inputStyle, minHeight: '60px', fontFamily: 'monospace' }} />
                                    <button type="button" onClick={() => handleRemoveObject('whyCards', idx)} style={deleteBtnStyle}>Delete</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => handleAddObject('whyCards', { title: '', desc: '', iconSvg: '' })} style={addBtnStyle}>+ Add Why Card</button>
                        </div>
                    </div>
                )}

                {activeTab === 'process' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Process Main Title</label>
                            <input name="processTitle" value={formData.processTitle} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Process Title Highlighted Word</label>
                            <input name="processTitleHighlight" value={formData.processTitleHighlight} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Process Description</label>
                            <textarea name="processDesc" value={formData.processDesc} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} />
                        </div>

                        <div style={sectionStyle}>
                            <h3 style={{ marginBottom: '16px', color: '#3b82f6' }}>Process Steps</h3>
                            {formData.processSteps.map((item, idx) => (
                                <div key={idx} style={itemBoxStyle}>
                                    <input placeholder="Step Number (e.g. 01)" value={item.stepNumber} onChange={(e) => handleUpdateObject('processSteps', idx, 'stepNumber', e.target.value)} style={inputStyle} />
                                    <input placeholder="Title" value={item.title} onChange={(e) => handleUpdateObject('processSteps', idx, 'title', e.target.value)} style={inputStyle} />
                                    <textarea placeholder="Description" value={item.desc} onChange={(e) => handleUpdateObject('processSteps', idx, 'desc', e.target.value)} style={{ ...inputStyle, minHeight: '60px' }} />
                                    <textarea placeholder="SVG Code" value={item.iconSvg} onChange={(e) => handleUpdateObject('processSteps', idx, 'iconSvg', e.target.value)} style={{ ...inputStyle, minHeight: '60px', fontFamily: 'monospace' }} />
                                    <button type="button" onClick={() => handleRemoveObject('processSteps', idx)} style={deleteBtnStyle}>Delete</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => handleAddObject('processSteps', { stepNumber: '', title: '', desc: '', iconSvg: '' })} style={addBtnStyle}>+ Add Process Step</button>
                        </div>
                    </div>
                )}

                {activeTab === 'social' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={sectionStyle}>
                            <h3 style={{ marginBottom: '16px', color: '#3b82f6' }}>Testimonials</h3>
                            {formData.testimonials.map((item, idx) => (
                                <div key={idx} style={itemBoxStyle}>
                                    <input placeholder="Name" value={item.name} onChange={(e) => handleUpdateObject('testimonials', idx, 'name', e.target.value)} style={inputStyle} />
                                    <input placeholder="Role" value={item.role} onChange={(e) => handleUpdateObject('testimonials', idx, 'role', e.target.value)} style={inputStyle} />
                                    <input placeholder="Company" value={item.company} onChange={(e) => handleUpdateObject('testimonials', idx, 'company', e.target.value)} style={inputStyle} />
                                    <textarea placeholder="Review Content" value={item.content} onChange={(e) => handleUpdateObject('testimonials', idx, 'content', e.target.value)} style={{ ...inputStyle, minHeight: '60px' }} />
                                    <input placeholder="Rating (e.g. 5)" type="number" value={item.rating} onChange={(e) => handleUpdateObject('testimonials', idx, 'rating', e.target.value)} style={inputStyle} />
                                    <input placeholder="Image URL" value={item.imageUrl} onChange={(e) => handleUpdateObject('testimonials', idx, 'imageUrl', e.target.value)} style={inputStyle} />
                                    <button type="button" onClick={() => handleRemoveObject('testimonials', idx)} style={deleteBtnStyle}>Delete</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => handleAddObject('testimonials', { name: '', role: '', company: '', content: '', rating: 5, imageUrl: '' })} style={addBtnStyle}>+ Add Testimonial</button>
                        </div>

                        <div style={sectionStyle}>
                            <h3 style={{ marginBottom: '16px', color: '#3b82f6' }}>FAQs</h3>
                            {formData.faqs.map((item, idx) => (
                                <div key={idx} style={itemBoxStyle}>
                                    <input placeholder="Question" value={item.question} onChange={(e) => handleUpdateObject('faqs', idx, 'question', e.target.value)} style={inputStyle} />
                                    <textarea placeholder="Answer" value={item.answer} onChange={(e) => handleUpdateObject('faqs', idx, 'answer', e.target.value)} style={{ ...inputStyle, minHeight: '60px' }} />
                                    <button type="button" onClick={() => handleRemoveObject('faqs', idx)} style={deleteBtnStyle}>Delete</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => handleAddObject('faqs', { question: '', answer: '' })} style={addBtnStyle}>+ Add FAQ</button>
                        </div>
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Contact Headings Array (e.g. Get In Touch, Build Fast, Scale Higher)</label>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input value={tempContactHeading} onChange={(e) => setTempContactHeading(e.target.value)} placeholder="e.g. Get In Touch" style={inputStyle} />
                                <button type="button" onClick={(e) => handleArrayStringAdd(e, 'contactHeadings', tempContactHeading, setTempContactHeading)} style={btnStyle}>Add</button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {formData.contactHeadings.map((txt, idx) => (
                                    <span key={idx} style={tagStyle}>
                                        {txt} <button type="button" onClick={() => handleArrayStringRemove('contactHeadings', idx)} style={removeBtnStyle}>×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Contact Description</label>
                            <textarea name="contactDesc" value={formData.contactDesc} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Contact Phone</label>
                            <input name="contactPhone" value={formData.contactPhone} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Contact Email</label>
                            <input name="contactEmail" value={formData.contactEmail} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', color: '#a1a1aa' }}>Contact Address</label>
                            <textarea name="contactAddress" value={formData.contactAddress} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} />
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

// --- Reusable Inline Styles ---
const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    color: 'white',
    outline: 'none',
    boxSizing: 'border-box'
};

const btnStyle = {
    padding: '10px 16px',
    background: '#3f3f46',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer'
};

const tagStyle = {
    padding: '6px 12px',
    background: '#3b82f6',
    borderRadius: '20px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
};

const removeBtnStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: 0
};

const sectionStyle = {
    padding: '20px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '8px'
};

const itemBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '16px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '1px solid rgba(255,255,255,0.05)'
};

const addBtnStyle = {
    padding: '10px',
    width: '100%',
    background: 'rgba(59, 130, 246, 0.2)',
    color: '#60a5fa',
    border: '1px dashed #3b82f6',
    borderRadius: '6px',
    cursor: 'pointer'
};

const deleteBtnStyle = {
    padding: '8px',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#f87171',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '6px',
    cursor: 'pointer',
    alignSelf: 'flex-end'
};

export default ServicesDetailTwoForm;
