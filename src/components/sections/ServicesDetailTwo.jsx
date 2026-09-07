import React, { useRef, useEffect, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { useParams } from 'react-router-dom';
import { useGetServicesDetailTwoQuery, useGetNavDropdownItemsQuery } from '../../redux/api';
import './ServicesDetailTwo.css';
import FAQSection from './FAQSection';


import CountUp from 'react-countup';
import CTA from './CTA';

const formatIconUrl = (url, name = 'tech') => {
    if (!url) return `https://cdn.simpleicons.org/${encodeURIComponent(name.toLowerCase().replace(/[^a-z0-9]/g, ''))}`;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('/')) {
        return url;
    }
    return `https://cdn.simpleicons.org/${encodeURIComponent(name.toLowerCase().replace(/[^a-z0-9]/g, ''))}/${url.replace('#', '')}`;
};

function ServicesDetailTwo() {
    const sectionRef = useRef(null);
    const orbRef = useRef(null);
    const orbTitleRef = useRef(null);
    const orbDescRef = useRef(null);

    const [activeProcessStep, setActiveProcessStep] = useState(0);
    const [processProgress, setProcessProgress] = useState(0);
    const [pageData, setPageData] = useState(null);

    const params = useParams();
    const rawCategory = params.categorySlug || params.categoryName;
    const rawSubcategory = params.subcategorySlug || params.subcategoryName;

    // Fetch all nav items to resolve lowercase slugs to exact category & subcategory names
    const { data: allItemsResp } = useGetNavDropdownItemsQuery();
    const allServices = allItemsResp?.data || [];

    let resolvedCategory = rawCategory;
    let resolvedSubcategory = rawSubcategory;

    if (allServices.length > 0 && rawCategory && rawSubcategory) {
        const toSlug = (str) => (str || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const currentCatSlug = toSlug(rawCategory);
        const currentSubSlug = toSlug(rawSubcategory);

        const matchedCat = allServices.find(item => toSlug(item.categories) === currentCatSlug || item.categories.toLowerCase() === rawCategory.toLowerCase());
        if (matchedCat) {
            resolvedCategory = matchedCat.categories;
            const matchedSub = matchedCat.subcategories?.find(s => {
                const sName = typeof s === 'string' ? s : s.name;
                return toSlug(sName) === currentSubSlug || sName.toLowerCase() === rawSubcategory.toLowerCase();
            });
            if (matchedSub) {
                resolvedSubcategory = typeof matchedSub === 'string' ? matchedSub : matchedSub.name;
            }
        }
    }

    const { data: response, isLoading, error } = useGetServicesDetailTwoQuery(
        { categoryName: resolvedCategory, subcategoryName: resolvedSubcategory },
        { skip: !resolvedCategory || !resolvedSubcategory }
    );

    useEffect(() => {
        if (response?.success) {
            setPageData(response.data);
        }
    }, [response]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [rawCategory, rawSubcategory]);

    useEffect(() => {
        const duration = 5000;
        const updateInterval = 40;
        const stepIncrement = (updateInterval / duration) * 100;

        const interval = setInterval(() => {
            setProcessProgress(prev => {
                if (prev >= 100) {
                    setActiveProcessStep(curr => (curr + 1) % 5);
                    return 0;
                }
                return prev + stepIncrement;
            });
        }, updateInterval);

        return () => clearInterval(interval);
    }, [activeProcessStep]); // Restart interval if step changes manually

    const handleProcessClick = (index) => {
        setActiveProcessStep(index);
        setProcessProgress(0);
    };

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const boxes = section.querySelectorAll('.premium-box-5d');
        const orb = orbRef.current;
        const orbTitle = orbTitleRef.current;
        const orbDesc = orbDescRef.current;

        const handlers = [];

        boxes.forEach(box => {
            const handleMouseMove = (e) => {
                const rect = box.getBoundingClientRect();
                const width = rect.width;
                const height = rect.height;
                const mouseX = (e.clientX - rect.left) / width - 0.5;
                const mouseY = (e.clientY - rect.top) / height - 0.5;

                const tiltX = (mouseY * -12).toFixed(2);
                const tiltY = (mouseX * 12).toFixed(2);

                box.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
            };

            const handleMouseLeave = () => {
                box.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
            };

            const handleMouseEnter = () => {
                const title = box.getAttribute('data-title');
                const desc = box.getAttribute('data-desc');
                const gradient = box.getAttribute('data-gradient');
                const glowColor = box.getAttribute('data-glow');

                if (orbTitle && orbDesc) {
                    orbTitle.classList.add('fade-out-state');
                    orbDesc.classList.add('fade-out-state');

                    setTimeout(() => {
                        orbTitle.textContent = title;
                        orbDesc.textContent = desc;
                        orbTitle.classList.remove('fade-out-state');
                        orbDesc.classList.remove('fade-out-state');
                    }, 200);
                }

                section.style.setProperty('--active-glow', glowColor);
                if (orb) {
                    orb.style.background = gradient;
                    orb.style.boxShadow = `0 0 70px ${glowColor}, inset -20px -20px 60px rgba(0,0,0,0.8), inset 20px 20px 60px rgba(255,255,255,0.2)`;
                }
            };

            box.addEventListener('mousemove', handleMouseMove);
            box.addEventListener('mouseleave', handleMouseLeave);
            box.addEventListener('mouseenter', handleMouseEnter);

            handlers.push({ box, handleMouseMove, handleMouseLeave, handleMouseEnter });
        });

        return () => {
            handlers.forEach(({ box, handleMouseMove, handleMouseLeave, handleMouseEnter }) => {
                box.removeEventListener('mousemove', handleMouseMove);
                box.removeEventListener('mouseleave', handleMouseLeave);
                box.removeEventListener('mouseenter', handleMouseEnter);
            });
        };
    }, []);

    return (
        <>
            <section className="premium-seo-container">
                <div className="section-wrapper">
                    <div className="text-content-block">
                        <div className="pill-badge">
                            <span>{pageData?.heroBadge?.split(' ')[0] || '✦'}</span> {pageData?.heroBadge?.replace('✦ ', '') || 'Innovative Tech Solutions'}
                        </div>

                        <h1 className="hero-heading">
                            {pageData?.heroTitle || 'Build the Future.'}<br />
                            <TypeAnimation
                                sequence={pageData?.heroAnimatedText?.flatMap(text => [text, 1500]) || [
                                    'Digital Futures.', 1500,
                                    'Bold Products.', 1500,
                                    'Real Results.', 1500,
                                    'Your Vision.', 1500,
                                ]}
                                wrapper="span"
                                speed={50}
                                className="dynamic-text"
                                repeat={Infinity}
                            />
                        </h1>

                        <p className="hero-description">
                            {pageData?.heroDescription || 'Riveyra engineers high-performance web and software solutions that leverage innovation, technology, and consumer-centric strategies to build extraordinary digital products.'}
                        </p>

                        <div className="action-triggers">
                            <a href="/contact" className="btn-primary">
                                Consult Our Experts
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </a>
                            <a href="/portfolio" className="btn-ghost">
                                View Our Work
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </a>
                        </div>                    </div>

                    <div className="graphics-content-block">
                        <img
                            src={pageData?.heroimg || "/assets/ai softwaredevelopment.webp"}
                            alt="Hero Image"
                            style={{ width: '100%', height: 'auto', borderRadius: '12px', opacity: 0.95, transform: 'scale(1.1)' }}
                        />
                    </div>
                </div>

                <div className="metrics-panel-container" style={{ width: '100%', maxWidth: '1350px', zIndex: 5 }}>
                    <div className="metrics-panel">
                        {pageData?.metrics?.map((metric, idx) => {
                            const colors = ['#60a5fa', '#34d399', '#c084fc', '#fbbf24', '#f87171', '#38bdf8'];
                            const counterColor = metric.color || metric.accent || colors[idx % colors.length];

                            return (
                                <div className="metric-unit" key={idx}>
                                    <div className="unit-title">
                                        <span className="emoji">{metric.icon}</span>{' '}
                                        {metric.label}
                                    </div>
                                    <div className="unit-value" style={{ color: counterColor }}>
                                        <CountUp end={metric.value} decimals={metric.value % 1 !== 0 ? 1 : 0} duration={5} enableScrollSpy scrollSpyOnce />
                                        <span style={{ color: counterColor }}>{metric.suffix}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="wave-shape-divider">
                    <svg
                        viewBox="0 0 1440 180"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            className="shape-fill"
                            d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,80C960,96,1056,128,1152,122.7C1248,117,1344,75,1392,53.3L1440,32L1440,180L1392,180C1344,180,1248,180,1152,180C1056,180,960,180,864,180C768,180,672,180,576,180C480,180,384,180,288,180C192,180,96,180,48,180L0,180Z"
                        ></path>
                    </svg>
                </div>
            </section>

            <section className="clx-tech-section">
                <div className="clx-wrap">
                    <div className="clx-heading-block">
                        <span className="clx-tag">The Riveyra Engine</span>
                        <h2 className="clx-title">State-of-the-Art <span className="gt">Development Stack</span></h2>
                        <div className="clx-sub">Harnessing advanced motion, WebGL, and modern frontend architectures for immersive experiences.</div>
                    </div>

                    <div className="clx-grid">
                        {pageData?.techStack ? pageData.techStack.map((tech, idx) => (
                            <div className="clx-card" key={idx}>
                                <div className="logo"><img decoding="async" src={formatIconUrl(tech.iconUrl, tech.name)} alt={tech.name} /></div>
                                <h3>{tech.name}</h3>
                            </div>
                        )) : (
                            <>
                                <div className="clx-card">
                                    <div className="logo"><img decoding="async" src="https://cdn.simpleicons.org/react/61DAFB" alt="React" /></div>
                                    <h3>React.js</h3>
                                </div>
                                <div className="clx-card">
                                    <div className="logo"><img decoding="async" src="https://cdn.simpleicons.org/vite/646CFF" alt="Vite" /></div>
                                    <h3>Vite.js</h3>
                                </div>
                            </>
                        )}
                    </div>

                    
                </div>
            </section>

            <section className="services-section">
                <div className="services-container">

                    <div className="services-header-block">
                        <div className="services-sub-title">{pageData?.servicesTag || 'Our Capabilities'}</div>
                        <h2 className="services-main-title">{pageData?.servicesTitle || 'Everything Your Vision Needs to '}<span className="gt">{pageData?.servicesTitleHighlight || 'Scale Digitally'}</span></h2>
                        <p className="services-desc">{pageData?.servicesDesc || 'Six specialized engineering tracks, built with clean code and modern architecture to deliver flawless digital experiences.'}</p>
                    </div>

                    <div className="services-grid">
                        {pageData?.services?.map((service, idx) => (
                            <div className="service-card" key={idx}>
                                <div className="icon-box" dangerouslySetInnerHTML={{ __html: service.iconSvg }}></div>
                                <h3 className="card-title">{service.title}</h3>
                                <p className="card-body-text">{service.desc}</p>
                                <a href="/contact" className="contact-card-btn">
                                    Consult Experts
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </a>
                            </div>
                        ))}
                    </div>

                    <div className="footer-action-row">
                        <a href="/portfolio" className="btn-ghost">
                            View All Services
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </a>
                    </div>

                </div>
            </section>
            <section className="quantum-universe" style={{ '--active-glow': '#61dafb' }} ref={sectionRef}>
                <div className="clx-divider">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1095.63,10.28,1200,32.89V0Z" className="shape-fill"></path>
                    </svg>
                </div>

                <div className="universe-wrap">
                    <div className="header-system">
                        <div className="agency-badge">
                            <div className="pulse-node"></div>
                            <span>{pageData?.universeTag || 'Full-Stack Development Hub'}</span>
                        </div>
                        <h2 className="main-epic-title">{pageData?.universeTitle || 'Next-Gen Web '}<span className="gt">{pageData?.universeTitleHighlight || 'Domination Engine'}</span></h2>
                    </div>

                    <div className="showcase-engine">

                        <div className="cards-column">
                            {pageData?.universeCards?.slice(0, 2).map((card, idx) => (
                                <div className="premium-box-5d" data-service={card.id} data-title={card.title} data-desc={card.desc} data-glow={card.glowColor} data-gradient={card.gradient} key={idx}>
                                    <div className="box-meta">
                                        <div className="box-icon-wrapper">
                                            <img decoding="async" src={formatIconUrl(card.iconUrl, card.title)} alt={card.title} />
                                        </div>
                                        <h3>{card.title}</h3>
                                    </div>
                                    <p>{card.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="center-universe-core">
                            <div className="particle-glow-rail-outer"></div>
                            <div className="outer-orbit-container">
                                <div className="rail-particle p-out-1"></div>
                                <div className="rail-particle p-out-2"></div>
                                <div className="rail-particle p-out-3"></div>
                                <div className="rail-particle p-out-4"></div>
                                <div className="rail-particle p-out-5"></div>
                                <div className="rail-particle p-out-6"></div>
                            </div>

                            <div className="particle-glow-rail-inner"></div>
                            <div className="inner-orbit-container">
                                <div className="rail-particle p-in-1"></div>
                                <div className="rail-particle p-in-2"></div>
                                <div className="rail-particle p-in-3"></div>
                                <div className="rail-particle p-in-4"></div>
                                <div className="rail-particle p-in-5"></div>
                                <div className="rail-particle p-in-6"></div>
                            </div>

                            <div className="sphere-3d-fluid" ref={orbRef} style={{ background: 'linear-gradient(135deg, #222222, #20232a, #61dafb)' }}></div>

                            <div className="sphere-content-overlay">
                                <h4 className="dynamic-title" ref={orbTitleRef}>{pageData?.universecenter || 'React Architecture'}</h4>
                                <p className="dynamic-desc" ref={orbDescRef}>{pageData?.universecenterdesc || 'Build high-performance SPA ecosystems with reactive state flows.'}</p>
                            </div>
                        </div>

                        <div className="cards-column">
                            {pageData?.universeCards?.slice(2, 4).map((card, idx) => (
                                <div className="premium-box-5d" data-service={card.id} data-title={card.title} data-desc={card.desc} data-glow={card.glowColor} data-gradient={card.gradient} key={idx}>
                                    <div className="box-meta">
                                        <div className="box-icon-wrapper">
                                            <img decoding="async" src={formatIconUrl(card.iconUrl, card.title)} alt={card.title} />
                                        </div>
                                        <h3>{card.title}</h3>
                                    </div>
                                    <p>{card.desc}</p>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>
            </section>

            <section className="why-riveyra">
                <div className="why-riveyra-container">

                    <div className="why-section-heading">
                        <span className="why-section-tag">{pageData?.whyTag || 'Why Riveyra'}</span>
                        <h2>{pageData?.whyTitle || 'Built for Performance — '}<span className="gt">{pageData?.whyTitleHighlight || 'Not Just Promises.'}</span></h2>
                    </div>

                    <div className="why-grid">
                        {pageData?.whyCards?.map((card, idx) => (
                            <div className="why-card" key={idx}>
                                <div className="why-icon-box" dangerouslySetInnerHTML={{ __html: card.iconSvg }}></div>
                                <div className="why-card-content">
                                    <h3>{card.title}</h3>
                                    <p>{card.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="process-section-container">
                <div className="process-wrapper">

                    <div className="process-header">
                        <h2 className="process-main-heading">{pageData?.processTitle || 'Our Structural '}<span className="gt">{pageData?.processTitleHighlight || 'Development Workflow'}</span></h2>
                        <p className="process-sub-heading">{pageData?.processDesc || 'Engineered precision from strategic wireframing to high-performance deployments.'}</p>
                    </div>

                    <div className="process-grid">

                        <div className="steps-stack">
                            {pageData?.processSteps?.map((item, index) => (
                                <div
                                    key={index}
                                    className={`step-trigger-card ${activeProcessStep === index ? 'active' : ''}`}
                                    onClick={() => handleProcessClick(index)}
                                >
                                    <div className="step-left-meta">
                                        <div className="step-icon-box" dangerouslySetInnerHTML={{ __html: item.iconSvg }}></div>
                                        <div className="step-info-text">
                                            <span className="step-label">Step {item.step}</span>
                                            <span className="step-title">{item.title}</span>
                                        </div>
                                    </div>
                                    <div className="step-arrow">→</div>
                                    <div className="step-timeline-bar" style={{ width: activeProcessStep === index ? `${processProgress}%` : '0%' }}></div>
                                </div>
                            ))}
                        </div>

                        <div className="showcase-display-panel">
                            {pageData?.processSteps?.map((item, index) => (
                                <div key={index} className={`detail-content-node ${activeProcessStep === index ? 'active' : ''}`}>
                                    <div className="showcase-icon-badge" dangerouslySetInnerHTML={{ __html: item.iconSvg }}></div>
                                    <div className="showcase-meta-counter">Step {item.step} of {pageData.processSteps.length}</div>
                                    <h3 className="showcase-heading">{item.title}</h3>
                                    <p className="showcase-desc">{item.desc}</p>
                                    <span className="giant-watermark-num">{item.step}</span>
                                </div>
                            ))}

                            <div className="matrix-dots-indicator">
                                {[0, 1, 2, 3, 4].map(dot => (
                                    <div key={dot} className={`matrix-dot ${activeProcessStep === dot ? 'active' : ''}`}></div>
                                ))}
                            </div>

                        </div>

                    </div>
                </div>
            </section>

           

            <FAQSection faqs={pageData?.faqs} />

            <section className="custom-contact-section">
                <CTA/>
            </section>
        </>
    );
}

export default ServicesDetailTwo;