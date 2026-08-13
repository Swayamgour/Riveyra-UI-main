const mongoose = require('mongoose');
require('dotenv').config();
const ServiceDetailTwo = require('../models/ServicesDetailsTwo');

const PAGE_DATA = {
    pageTitle: "Services Detail Two",
    
    // Hero Section
    heroBadge: "✦ Innovative Tech Solutions",
    heroTitle: "Build the Future.",
    heroAnimatedText: [
        "Digital Futures.",
        "Bold Products.",
        "Real Results.",
        "Your Vision."
    ],
    heroimg: "/assets/ai softwaredevelopment.webp",
    heroDescription: "Riveyra engineers high-performance web and software solutions that leverage innovation, technology, and consumer-centric strategies to build extraordinary digital products.",
    metrics: [
        { label: "Projects Launched", value: 250, suffix: "+", icon: "💻" },
        { label: "Uptime Rate", value: 99.9, suffix: "%", icon: "⭐" },
        { label: "Performance", value: 4.5, suffix: "x", icon: "📈" },
        { label: "Stack Experts", value: 12, suffix: "+", icon: "⚡" }
    ],
    

    
    // Tech Stack Section
    techStackTag: "The Riveyra Engine",
    techStackTitle: "State-of-the-Art ",
    techStackTitleHighlight: "Development Stack",
    techStackDesc: "Harnessing advanced motion, WebGL, and modern frontend architectures for immersive experiences.",
    techStack: [
        { name: "React", iconUrl: "https://cdn.simpleicons.org/react/61DAFB" },
        { name: "Node.js", iconUrl: "https://cdn.simpleicons.org/nodedotjs/339933" },
        { name: "MongoDB", iconUrl: "https://cdn.simpleicons.org/mongodb/47A248" },
        { name: "AWS", iconUrl: "https://cdn.simpleicons.org/amazonaws/232F3E" },
        { name: "Three.js", iconUrl: "https://cdn.simpleicons.org/threedotjs/000000" },
        { name: "Vite", iconUrl: "https://cdn.simpleicons.org/vite/646CFF" },
        { name: "Next.js", iconUrl: "https://cdn.simpleicons.org/nextdotjs/000000" },
        { name: "Framer", iconUrl: "https://cdn.simpleicons.org/framer/0055FF" }
    ],
    techStats: [
        { highlight: "3D & Motion", text: "Immersive Experiences" },
        { highlight: "60 FPS", text: "Silky Smooth Animations" },
        { highlight: "Zero", text: "Layout Shifts (CLS)" },
        { highlight: "100%", text: "Modern Architecture" }
    ],
    
    // Services Section
    servicesTag: "Our Capabilities",
    servicesTitle: "Everything Your Vision Needs to ",
    servicesTitleHighlight: "Scale Digitally",
    servicesDesc: "Six specialized engineering tracks, built with clean code and modern architecture to deliver flawless digital experiences.",
    services: [
        { title: "Interactive UI/UX", desc: "Bespoke React frameworks, responsive layouts, and highly interactive interfaces designed for maximum user engagement.", iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>` },
        { title: "High-Performance Frontends", desc: "Ultra-fast asset delivery, robust state management, and optimized rendering loops powered by Vite and Redux.", iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>` },
        { title: "Immersive 3D Experiences", desc: "Breathtaking WebGL environments, custom shaders, and interactive 3D models seamlessly integrated using Three.js.", iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>` },
        { title: "Advanced Animations", desc: "Silky smooth, physics-based micro-interactions and complex scroll-triggered animations powered by GSAP and Framer Motion.", iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>` },
        { title: "Full-Stack Architecture", desc: "Scalable backend engines, custom dynamic routing, and headless architectures designed to scale flawlessly.", iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>` },
        { title: "API & System Syncs", desc: "Secure RESTful webhooks, seamless third-party service integration, and automated real-time data pipelines.", iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>` }
    ],
    
    // Universe Section
    universeTag: "Full-Stack Development Hub",
    universeTitle: "Next-Gen Web ",
    universeTitleHighlight: "Domination Engine",
    universecenter:"React Architecture",
    universecenterdesc:"Build high-performance SPA ecosystems with reactive state flows",
    universeCards: [
        { id: "react", title: "React Core", desc: "Highly optimized custom component builds, scalable frontend architectures, and reactive state pipelines crafted for ultimate dynamic logic.", glowColor: "#61dafb", gradient: "linear-gradient(135deg, #222222, #20232a, #61dafb)", iconUrl: "https://cdn.simpleicons.org/react/61DAFB" },
        { id: "threejs", title: "Three.js Canvas", desc: "Fluid WebGL execution, high-framerate 3D rendering setups, custom shaders, and immersive interactive digital experiences.", glowColor: "#ffffff", gradient: "linear-gradient(135deg, #000000, #111111, #ffffff)", iconUrl: "https://cdn.simpleicons.org/threedotjs/FFFFFF" },
        { id: "gsap", title: "GSAP Engine", desc: "Next-level scroll-triggered animations, complex timeline mechanics, SVG morphing, and physics-based interactions.", glowColor: "#88CE02", gradient: "linear-gradient(135deg, #2a4001, #5e8e3e, #88CE02)", iconUrl: "https://cdn.simpleicons.org/greensock/88CE02" },
        { id: "framer", title: "Framer Motion", desc: "Pixel-perfect semantic layout animations, custom fluid gestures, ultra-high performance keyframe mechanics, and dynamic React mounting.", glowColor: "#0055FF", gradient: "linear-gradient(135deg, #001133, #0033aa, #0055FF)", iconUrl: "https://cdn.simpleicons.org/framer/0055FF" }
    ],
    
    // Why Riveyra Section
    whyTag: "Why Riveyra",
    whyTitle: "Built for Performance — ",
    whyTitleHighlight: "Not Just Promises.",
    whyCards: [
        { title: "Bespoke Custom Coding", desc: "We write optimized, clean code matching modern layouts, ensuring no heavy template bloating or sluggish themes.", iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>` },
        { title: "WordPress & Shopify Setup", desc: "Complete control systems using flexible admin layouts, tailored Gutenberg modules, and enterprise storefront modules.", iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>` },
        { title: "Advanced E-Commerce Logic", desc: "Robust inventory automation, complex API data pipelines, secure checkout triggers, and custom payment processors.", iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>` },
        { title: "Responsive Fluid Layouts", desc: "Engineered pixel-perfect components that scale dynamically across all screen matrix points, tablets, and phones.", iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>` },
        { title: "High-Speed Performance", desc: "Optimized image scripts, rigid caching protocols, minimized styling nodes, and stellar Core Web Vital benchmark metrics.", iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>` },
        { title: "Enterprise Level Security", desc: "Hardened data structures, active SSL encryption protocols, firewall patches, and automated data mirror backups.", iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>` }
    ],
    
    // Process Section
    processTitle: "Our Structural ",
    processTitleHighlight: "Development Workflow",
    processDesc: "Engineered precision from strategic wireframing to high-performance deployments.",
    processSteps: [
        { stepNumber: "01", title: "Discovery & Tech Stack Planning", desc: "We begin by auditing your business scope to outline technical parameters. Based on requirement analysis, we blueprint the perfect framework solution, choosing between a tailored custom React/Next.js ecosystem or highly specific scalable enterprise architectures.", iconSvg: `<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>` },
        { stepNumber: "02", title: "UI/UX Wireframing & Design Prototype", desc: "Our design architects structure highly conversion-focused layout blueprints. We systematically sketch custom navigation models, user interaction systems, high-fidelity responsive wireframes, and flexible grid systems tailored to maximize user retention and engagement matrices.", iconSvg: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>` },
        { stepNumber: "03", title: "Custom Development & Build", desc: "Our core developers transform layouts into fully modular, clean-coded solutions. We engineer pristine backend structures, create bespoke scalable workflows, and develop optimized fluid applications designed for maximum performance speeds and seamless cross-platform functionality.", iconSvg: `<svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>` },
        { stepNumber: "04", title: "Business Integration & Custom Logic", desc: "We unlock complete digital features, integrating complex third-party APIs, rigid payment processors, robust database management configurations, scalable data flows, and fully customized dashboard control access points customized for your organization.", iconSvg: `<svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>` },
        { stepNumber: "05", title: "Quality Assurance & Live Launch", desc: "Before migration to production servers, we test codebases via comprehensive stress-tests, mobile performance evaluations, and secure loop audits. We optimize rendering scripts, launch asset structures, and execute a flawlessly polished web deployment.", iconSvg: `<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>` }
    ],
    
    // Testimonials
    testimonials: [
        { name: "Sarah Jenkins", role: "CTO", company: "TechFlow Solutions", content: "Riveyra completely transformed our backend architecture. The performance gains are incredible, cutting our load times in half while supporting 10x the concurrent users. The team's expertise is unmatched.", rating: 5, imageUrl: "https://i.pravatar.cc/150?img=47" },
        { name: "David Chen", role: "Founder", company: "Elevate Startup", content: "Working with Riveyra was a game-changer. They built our entire React frontend from scratch. The 3D elements and smooth animations give us the premium feel we desperately needed to stand out.", rating: 5, imageUrl: "https://i.pravatar.cc/150?img=11" },
        { name: "Emily Watson", role: "Product Manager", company: "GlobalRetail", content: "Their API integrations and headless e-commerce setup are flawless. We haven't had a single drop in uptime since launch. True professionals who write exceptionally clean code.", rating: 5, imageUrl: "https://i.pravatar.cc/150?img=5" }
    ],
    
    // FAQs
    faqs: [
        { question: "Do you offer custom web development or use templates?", answer: "We specialize exclusively in bespoke, custom-coded web solutions. We do not rely on pre-built bloated templates. Every line of code is engineered from the ground up to match your exact business requirements, ensuring maximum performance, security, and scalability." },
        { question: "What technologies do you use for development?", answer: "Our primary tech stack focuses on high-performance JavaScript frameworks including React, Next.js, and Vite for the frontend. For the backend, we leverage Node.js, Express, and MongoDB. We also utilize WebGL/Three.js for 3D elements and GSAP/Framer Motion for advanced animations." },
        { question: "How long does a typical project take?", answer: "Project timelines vary greatly depending on scope and complexity. A standard corporate landing page might take 2-4 weeks, while a full-scale web application with custom backend logic, user dashboards, and third-party API integrations can take 3-6 months. We provide detailed timelines during the Discovery phase." },
        { question: "Do you provide ongoing maintenance and support?", answer: "Absolutely. We offer dedicated post-launch support and retainer packages. This includes server monitoring, security patching, performance optimization, and regular code updates to ensure your digital product remains secure and operates at peak efficiency." }
    ],
    
    // Contact Section
    contactHeadings: ["Get In Touch", "Build Fast", "Scale Higher."],
    contactDesc: "Partner with elite developers to build fast, secure, and custom websites tailored to scale your brand online.",
    contactPhone: "+91 9919888269",
    contactEmail: "hr@riveyrainfotech.com",
    contactAddress: "Kanpur, Uttar Pradesh STPI,8th floor, A-1/4 UPSIDC Complex, Lakhanpur, 208024."
};

const seedDB = async () => {
    try {
        console.log("⏳ Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB");

        console.log("🧹 Clearing old data...");
        await ServiceDetailTwo.deleteMany({});

        console.log("🌱 Seeding new data...");
        await ServiceDetailTwo.create(PAGE_DATA);

        console.log("🎉 Seed successful! Data is ready.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
};

seedDB();
