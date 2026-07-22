// import React from 'react'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Icons from '../components/ui/Icons'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { useCreateContactMutation } from '../redux/api'
import emailjs from "@emailjs/browser";

// import { useBreakpoint } from '../../hooks/useBreakpoint.jsx'
// import ContactForm from '../ContactForm.jsx'


const SERVICES = [
    'Web Development', 'Mobile App', 'UI/UX Design',
    'Digital Marketing', 'ERP Solutions', 'AI & Automation', 'Other',
]

const BUDGETS = ['< ₹1 Lakh', '₹1–5 Lakh', '₹5–15 Lakh', '₹15–50 Lakh', '₹50 Lakh+']


function Field({ label, type = 'text', name, value, onChange, required, error }) {
    const [focused, setFocused] = useState(false)
    const filled = value && value.length > 0
    const active = focused || filled

    return (
        <div style={{ position: 'relative', marginBottom: 24 }}>
            <label style={{
                position: 'absolute', left: 16,
                top: active ? -10 : 17,
                fontSize: active ? 10.5 : 14,
                color: active ? '#60a5fa' : 'rgba(255,255,255,0.38)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: active ? 1.5 : 0.3,
                textTransform: active ? 'uppercase' : 'none',
                transition: 'all 0.22s cubic-bezier(0.16,1,0.3,1)',
                pointerEvents: 'none', zIndex: 2,
                background: active ? 'linear-gradient(transparent 50%,rgba(8,15,30,1) 50%)' : 'transparent',
                padding: active ? '0 6px' : '0',
            }}>
                {label}{required && ' *'}
            </label>
            {type === 'textarea' ? (
                <textarea
                    name={name} value={value} onChange={onChange}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    rows={4}
                    style={{
                        width: '100%', padding: '16px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${error ? '#ef4444' : (focused ? '#60a5fa' : 'rgba(255,255,255,0.1)')}`,
                        color: '#ffffff', fontFamily: 'var(--font-body)', fontSize: 14.5,
                        resize: 'none', outline: 'none', lineHeight: 1.7,
                        boxShadow: focused ? '0 0 0 3px rgba(96,165,250,0.1),inset 0 1px 0 rgba(255,255,255,0.03)' : 'inset 0 1px 0 rgba(255,255,255,0.03)',
                        transition: 'all 0.22s', boxSizing: 'border-box',
                    }}
                />
            ) : (
                <input
                    type={type} name={name} value={value} onChange={onChange}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    style={{
                        width: '100%', padding: '16px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${error ? '#ef4444' : (focused ? '#60a5fa' : 'rgba(255,255,255,0.1)')}`,
                        color: '#ffffff', fontFamily: 'var(--font-body)', fontSize: 14.5,
                        outline: 'none',
                        boxShadow: focused ? '0 0 0 3px rgba(96,165,250,0.1),inset 0 1px 0 rgba(255,255,255,0.03)' : 'inset 0 1px 0 rgba(255,255,255,0.03)',
                        transition: 'all 0.22s', boxSizing: 'border-box',
                    }}
                />
            )}
            {error && (
                <div style={{
                    fontSize: 11,
                    color: '#ef4444',
                    fontFamily: 'var(--font-mono)',
                    marginTop: 6,
                    marginLeft: 12,
                    letterSpacing: 0.3
                }}>
                    {error}
                </div>
            )}
        </div>
    )
}


function TagSelect({ options, selected, onToggle, multi = false, color = '#60a5fa', error, label }) {
    return (
        <div style={{ marginBottom: 28 }}>
            {label && (
                <div style={{ fontSize: 11, color: color, fontFamily: 'var(--font-mono)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
                    {label}
                </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {options.map(opt => {
                    const active = multi ? selected.includes(opt) : selected === opt
                    return (
                        <button key={opt} type="button" onClick={() => onToggle(opt)}
                            style={{
                                padding: '7px 14px', borderRadius: 8, fontSize: 12,
                                fontFamily: 'var(--font-mono)', fontWeight: 500,
                                letterSpacing: 0.5, cursor: 'pointer', transition: 'all 0.2s',
                                border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
                                background: active ? `${color}18` : 'rgba(255,255,255,0.03)',
                                color: active ? color : 'rgba(255,255,255,0.5)',
                                boxShadow: active ? `0 0 12px ${color}22` : 'none',
                            }}
                        >
                            {opt}
                        </button>
                    )
                })}
            </div>
            {error && (
                <div style={{
                    fontSize: 11,
                    color: '#ef4444',
                    fontFamily: 'var(--font-mono)',
                    marginTop: 8,
                    marginLeft: 4,
                    letterSpacing: 0.3
                }}>
                    {error}
                </div>
            )}
        </div>
    )
}


function ContactForm() {

    const ref = useRef(null)
    // const inView = useInView(ref, { once: true, margin: '-80px' })
    const { isMobile, isTablet, isMobileOrTablet } = useBreakpoint()

    const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' })
    const [services, setServices] = useState([])
    const [budget, setBudget] = useState('')
    const [sent, setSent] = useState(false)
    const [sending, setSending] = useState(false)
    const [formErrors, setFormErrors] = useState({});


    const [createContact] = useCreateContactMutation()


    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
    const toggleService = s => setServices(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])



    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};

        // Name
        if (!form.name?.trim()) {
            errors.name = "Name is required";
        }

        // Email
        if (!form.email?.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) {
            errors.email = "Invalid email format";
        }

        // Phone
        if (form.phone) {
            const cleaned = form.phone.replace(/\D/g, "");

            if (cleaned.length !== 10) {
                errors.phone = "Phone must be 10 digits";
            }
        }

        // Message
        if (!form.message?.trim()) {
            errors.message = "Message is required";
        }

        // Services
        if (!services.length) {
            errors.services = "Select at least one service";
        }

        // Budget
        if (!budget) {
            errors.budget = "Select budget";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);

            const firstErrorField = document.querySelector(".error-field");

            if (firstErrorField) {
                firstErrorField.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }

            return;
        }

        try {
            setSending(true);

            // ======================
            // Save in Backend
            // ======================

            const payload = {
                ...form,
                services,
                budget,
            };

            await createContact(payload).unwrap();

            // ======================
            // Send Email using EmailJS
            // ======================

            const templateParams = {
                name: form.name,
                email: form.email,
                phone: form.phone || "",
                company: form.company || "",
                services: services.join(", "),
                budget: budget,
                message: form.message,
            };

            await emailjs.send(
                "service_bablg2q",      // e.g. service_abcd123
                "template_3pzex5z",     // e.g. template_xyz123
                templateParams,
                "QdA9R7vW9eW5yIRV2"       // e.g. xxxxxxxxxxxxxxxxx
            );

            // ======================
            // Success
            // ======================

            setSent(true);

            setForm({
                name: "",
                email: "",
                phone: "",
                company: "",
                message: "",
            });

            setServices([]);
            setBudget("");
            setFormErrors({});

        } catch (err) {
            // console.log(err);

            setFormErrors({
                submit:
                    err?.text ||
                    err?.data?.message ||
                    "Something went wrong",
            });

        } finally {
            setSending(false);
        }
    };

    // Clear specific error when user starts typing
    const handleFieldChange = (field, value) => {
        set(field, value);
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: isMobileOrTablet ? 0 : -40, y: isMobileOrTablet ? 30 : 0 }}
            ref={ref}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
                background: 'rgba(8,15,30,0.82)',
                border: '1px solid rgba(96,165,250,0.12)',
                borderRadius: 20,
                padding: isMobile ? '28px 20px' : isTablet ? '36px 32px' : '44px 40px',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
        >
            <AnimatePresence mode="wait">
                {sent ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', padding: '60px 0' }}
                    >
                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 14 }}
                            style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', border: '2px solid #34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36, boxShadow: '0 0 40px rgba(52,211,153,0.25)' }}
                        >✓</motion.div>
                        <h3 style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff', marginBottom: 12 }}>Message Sent!</h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)', lineHeight: 1.8, marginBottom: 32 }}>
                            Thanks for reaching out. Our team will get back to you within 2 business hours.
                        </p>
                        <button className="btn-ghost" data-hover onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', company: '', message: '' }); setServices([]); setBudget(''); setFormErrors({}); }}>
                            Send Another Message
                        </button>
                    </motion.div>
                ) : (
                    <motion.form key="form" onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 32 }}>
                            <h3 style={{ fontSize: isMobile ? 18 : 22, fontFamily: 'var(--font-display)', fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Your Details</h3>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}>Tell us who you are so we can personalise our response.</p>
                        </div>

                        {formErrors.submit && (
                            <div style={{
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid #ef4444',
                                borderRadius: 8,
                                padding: '12px 16px',
                                marginBottom: 20,
                                fontSize: 13,
                                color: '#ef4444',
                                fontFamily: 'var(--font-body)'
                            }}>
                                {formErrors.submit}
                            </div>
                        )}

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                            gap: isMobile ? 0 : '0 18px',
                        }}>
                            <div className="error-field">
                                <Field
                                    label="Full Name"
                                    name="name"
                                    value={form.name}
                                    onChange={e => handleFieldChange('name', e.target.value)}
                                    required
                                    error={formErrors.name}
                                />
                            </div>
                            <Field
                                label="Email Address"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={e => handleFieldChange('email', e.target.value)}
                                required
                                error={formErrors.email}
                            />
                            <Field
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={form.phone}
                                // onChange={e => handleFieldChange('phone', e.target.value)}
                                onChange={e => {
                                    const value = e.target.value.replace(/\D/g, ""); // only numbers
                                    if (value.length <= 10) {
                                        handleFieldChange('phone', value);
                                    }
                                }}
                                error={formErrors.phone}
                            />
                            <Field
                                label="Company Name"
                                name="company"
                                value={form.company}
                                onChange={e => handleFieldChange('company', e.target.value)}
                            />
                        </div>

                        <TagSelect
                            options={SERVICES}
                            selected={services}
                            onToggle={toggleService}
                            multi
                            color="#60a5fa"
                            label="Step 2 — Services Needed"
                            error={formErrors.services}
                        />

                        <TagSelect
                            options={BUDGETS}
                            selected={budget}
                            onToggle={b => setBudget(prev => prev === b ? '' : b)}
                            color="#c084fc"
                            label="Step 3 — Estimated Budget"
                            error={formErrors.budget}
                        />

                        <Field
                            label="Tell us about your project"
                            type="textarea"
                            name="message"
                            value={form.message}
                            onChange={e => handleFieldChange('message', e.target.value)}
                            required
                            error={formErrors.message}
                        />

                        <button type="submit" className="btn-primary" data-hover
                            style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 14, letterSpacing: 0.5, position: 'relative', overflow: 'hidden' }}
                        >
                            {sending ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#020b18', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                                    Sending…
                                </span>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                    Send Message <Icons.ArrowRight />
                                </span>
                            )}
                        </button>

                        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 11.5, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>
                            🔒 Your information is 100% confidential. We never share your data.
                        </p>
                    </motion.form>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default ContactForm