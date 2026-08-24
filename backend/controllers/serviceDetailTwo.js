const ServicesDetailTwo = require('../models/ServicesDetailsTwo');

exports.getLatestTestimonials = async (req, res) => {
    try {
        const testimonials = await ServicesDetailTwo.aggregate([
            { $unwind: "$testimonials" },
            // Group by subcategory to ensure we only get one testimonial per subcategory
            {
                $group: {
                    _id: "$subcategoryName",
                    categoryName: { $first: "$categoryName" },
                    testimonial: { $first: "$testimonials" }
                }
            },
            // Safely project fields instead of using $mergeObjects (which can throw 500 if testimonial is a string)
            {
                $project: {
                    _id: 0,
                    subcategoryName: "$_id",
                    categoryName: "$categoryName",
                    name: "$testimonial.name",
                    role: "$testimonial.role",
                    company: "$testimonial.company",
                    content: "$testimonial.content",
                    rating: "$testimonial.rating",
                    imageUrl: "$testimonial.imageUrl",
                    accent: "$testimonial.accent"
                }
            },
            { $limit: 10 }
        ]);

        res.status(200).json({ success: true, data: testimonials });
    } catch (error) {
        console.error("Error in getLatestTestimonials:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getServicesDetailTwo = async (req, res) => {
    try {
        const { categoryName, subcategoryName } = req.query;

        if (!categoryName || !subcategoryName) {
            return res.status(400).json({ success: false, message: 'categoryName and subcategoryName are required' });
        }

        const pageData = await ServicesDetailTwo.findOne({ categoryName, subcategoryName });

        if (pageData) {
            return res.status(200).json({ success: true, data: pageData });
        }
        
        // --- TEMPORARY MOCK FALLBACK ---
        // If the database has no data (seed hasn't run yet or admin hasn't created it), return this static object so the UI still works
        console.log(`Database empty for ${categoryName} - ${subcategoryName}, sending mock data`);
        res.status(200).json({
            success: true,
            data: {
                categoryName,
                subcategoryName,
                pageTitle: `${subcategoryName} Services`,
                heroBadge: `✦ ${categoryName} Solutions`,
                heroTitle: `Mastering ${subcategoryName}.`,
                heroAnimatedText: ["Digital Futures.", "Bold Products.", "Real Results.", "Your Vision."],
                heroimg: "/assets/ai softwaredevelopment.webp",
                heroDescription: `Riveyra engineers high-performance ${subcategoryName} solutions that leverage innovation and consumer-centric strategies to build extraordinary products.`,
                metrics: [
                    { label: "Projects Launched", value: 250, suffix: "+", icon: "💻" },
                    { label: "Uptime Rate", value: 99.9, suffix: "%", icon: "⭐" },
                    { label: "Performance", value: 4.5, suffix: "x", icon: "📈" },
                    { label: "Stack Experts", value: 12, suffix: "+", icon: "⚡" }
                ],
                techStackTag: "The Riveyra Engine",
                techStackTitle: "State-of-the-Art ",
                techStackTitleHighlight: "Development Stack",
                techStackDesc: "Harnessing advanced motion, WebGL, and modern frontend architectures for immersive experiences.",
                techStack: [
                    { name: "React", iconUrl: "https://cdn.simpleicons.org/react/61DAFB" },
                    { name: "Node.js", iconUrl: "https://cdn.simpleicons.org/nodedotjs/339933" },
                    { name: "MongoDB", iconUrl: "https://cdn.simpleicons.org/mongodb/47A248" }
                ],
                techStats: [
                    { highlight: "3D & Motion", text: "Immersive Experiences" },
                    { highlight: "60 FPS", text: "Silky Smooth Animations" }
                ],
                servicesTag: "Our Capabilities",
                servicesTitle: "Everything Your Vision Needs to ",
                servicesTitleHighlight: "Scale Digitally",
                servicesDesc: "Six specialized engineering tracks, built with clean code and modern architecture to deliver flawless digital experiences.",
                services: [
                    { title: "Interactive UI/UX", desc: "Bespoke React frameworks, responsive layouts, and highly interactive interfaces designed for maximum user engagement.", iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>` },
                    { title: "High-Performance Frontends", desc: "Ultra-fast asset delivery, robust state management, and optimized rendering loops powered by Vite and Redux.", iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>` },
                    { title: "Immersive 3D Experiences", desc: "Breathtaking WebGL environments, custom shaders, and interactive 3D models seamlessly integrated using Three.js.", iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>` }
                ],
                universeTag: "Full-Stack Development Hub",
                universeTitle: "Next-Gen Web ",
                universeTitleHighlight: "Domination Engine",
                universecenter: "React Architecture",
                universecenterdesc: "Build high-performance SPA ecosystems with reactive state flows",
                universeCards: [
                    { id: "react", title: "React Core", desc: "Highly optimized custom component builds, scalable frontend architectures, and reactive state pipelines crafted for ultimate dynamic logic.", glowColor: "#61dafb", gradient: "linear-gradient(135deg, #222222, #20232a, #61dafb)", iconUrl: "https://cdn.simpleicons.org/react/61DAFB" },
                    { id: "threejs", title: "Three.js Canvas", desc: "Fluid WebGL execution, high-framerate 3D rendering setups, custom shaders, and immersive interactive digital experiences.", glowColor: "#ffffff", gradient: "linear-gradient(135deg, #000000, #111111, #ffffff)", iconUrl: "https://cdn.simpleicons.org/threedotjs/FFFFFF" },
                    { id: "gsap", title: "GSAP Engine", desc: "Next-level scroll-triggered animations, complex timeline mechanics, SVG morphing, and physics-based interactions.", glowColor: "#88CE02", gradient: "linear-gradient(135deg, #2a4001, #5e8e3e, #88CE02)", iconUrl: "https://cdn.simpleicons.org/greensock/88CE02" },
                    { id: "framer", title: "Framer Motion", desc: "Pixel-perfect semantic layout animations, custom fluid gestures, ultra-high performance keyframe mechanics, and dynamic React mounting.", glowColor: "#0055FF", gradient: "linear-gradient(135deg, #001133, #0033aa, #0055FF)", iconUrl: "https://cdn.simpleicons.org/framer/0055FF" }
                ],
                whyTag: "Why Riveyra",
                whyTitle: "Built for Performance — ",
                whyTitleHighlight: "Not Just Promises.",
                whyCards: [
                    { title: "Bespoke Custom Coding", desc: "We write optimized, clean code matching modern layouts, ensuring no heavy template bloating or sluggish themes.", iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>` },
                    { title: "Responsive Fluid Layouts", desc: "Engineered pixel-perfect components that scale dynamically across all screen matrix points, tablets, and phones.", iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>` }
                ],
                processTitle: "Our Structural ",
                processTitleHighlight: "Development Workflow",
                processDesc: "Engineered precision from strategic wireframing to high-performance deployments.",
                processSteps: [
                    { stepNumber: "01", title: "Discovery & Tech Stack Planning", desc: "We begin by auditing your business scope to outline technical parameters.", iconSvg: `<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>` },
                    { stepNumber: "02", title: "UI/UX Wireframing", desc: "Our design architects structure highly conversion-focused layout blueprints.", iconSvg: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>` }
                ],
                testimonials: [
                    { name: "Sarah Jenkins", role: "CTO", company: "TechFlow Solutions", content: "Riveyra completely transformed our backend architecture. The performance gains are incredible.", rating: 5, imageUrl: "https://i.pravatar.cc/150?img=47" }
                ],
                faqs: [
                    { question: "Do you offer custom web development?", answer: "We specialize exclusively in bespoke, custom-coded web solutions." }
                ],
                contactHeadings: ["Get In Touch", "Build Fast", "Scale Higher."],
                contactDesc: "Partner with elite developers to build fast, secure, and custom websites tailored to scale your brand online.",
                contactPhone: "+91 9919888269",
                contactEmail: "hr@riveyrainfotech.com",
                contactAddress: "Kanpur, Uttar Pradesh STPI."
            }
        });

    } catch (error) {
        console.error("Error in getServicesDetailTwo:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update existing configuration or create if not exists
exports.updateServicesDetailTwo = async (req, res) => {
    try {
        const { categoryName, subcategoryName } = req.body;
        
        if (!categoryName || !subcategoryName) {
            return res.status(400).json({ success: false, message: 'categoryName and subcategoryName are required in the body' });
        }

        const pageData = await ServicesDetailTwo.findOneAndUpdate(
            { categoryName, subcategoryName },
            req.body,
            { new: true, upsert: true, runValidators: true } // upsert creates it if it doesn't exist
        );

        res.status(200).json({ success: true, data: pageData });
    } catch (error) {
        console.error("Error in updateServicesDetailTwo:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Delete configuration
exports.deleteServicesDetailTwo = async (req, res) => {
    try {
        const { categoryName, subcategoryName } = req.query;

        if (!categoryName || !subcategoryName) {
            return res.status(400).json({ success: false, message: 'categoryName and subcategoryName are required' });
        }

        const pageData = await ServicesDetailTwo.findOneAndDelete({ categoryName, subcategoryName });
        
        if (!pageData) {
            return res.status(404).json({ success: false, message: 'Configuration not found' });
        }

        res.status(200).json({ success: true, message: 'Configuration deleted successfully', data: {} });
    } catch (error) {
        console.error("Error in deleteServicesDetailTwo:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
