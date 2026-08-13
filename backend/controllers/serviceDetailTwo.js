const ServicesDetailTwo = require('../models/ServicesDetailsTwo');

exports.getServicesDetailTwo = async (req, res) => {
    try {
        const pageData = await ServicesDetailTwo.findOne();

        if (pageData) {
            return res.status(200).json({ success: true, data: pageData });
        }
        
        // --- TEMPORARY MOCK FALLBACK ---
        // If the database has no data (seed hasn't run yet), return this static object so the UI still works
        console.log("Database empty, sending mock data for ServicesDetailTwo");
        res.status(200).json({
            success: true,
            data: {
                pageTitle: "Services Detail Two",
                heroBadge: "✦ Innovative Tech Solutions",
                heroTitle: "Build the Future.",
                heroAnimatedText: ["Digital Futures.", "Bold Products.", "Real Results.", "Your Vision."],
                heroDescription: "Riveyra engineers high-performance web and software solutions that leverage innovation, technology, and consumer-centric strategies to build extraordinary digital products.",
                metrics: [
                    { label: "Projects Launched", value: 250, suffix: "+", icon: "💻" },
                    { label: "Uptime Rate", value: 99.9, suffix: "%", icon: "⭐" },
                    { label: "Performance", value: 4.5, suffix: "x", icon: "📈" },
                    { label: "Stack Experts", value: 12, suffix: "+", icon: "⚡" }
                ],
                techStack: [
                    { name: "React.js", iconUrl: "https://cdn.simpleicons.org/react/61DAFB" },
                    { name: "Vite.js", iconUrl: "https://cdn.simpleicons.org/vite/646CFF" },
                    { name: "Redux", iconUrl: "https://cdn.simpleicons.org/redux/764ABC" },
                    { name: "Framer Motion", iconUrl: "https://cdn.simpleicons.org/framer/0055FF" },
                    { name: "GSAP", iconUrl: "https://cdn.simpleicons.org/greensock/88CE02" },
                    { name: "Three.js", iconUrl: "https://cdn.simpleicons.org/threedotjs/000000" },
                    { name: "Node.js", iconUrl: "https://cdn.simpleicons.org/nodedotjs/339933" },
                    { name: "JavaScript", iconUrl: "https://cdn.simpleicons.org/javascript/F7DF1E" },
                    { name: "React Router", iconUrl: "https://cdn.simpleicons.org/reactrouter/CA4245" },
                    { name: "Swiper.js", iconUrl: "https://cdn.simpleicons.org/swiper/6332F6" },
                    { name: "Git", iconUrl: "https://cdn.simpleicons.org/git/F05032" },
                    { name: "GitHub", iconUrl: "https://cdn.simpleicons.org/github/181717" }
                ]
            }
        });

    } catch (error) {
        console.error("Error in getServicesDetailTwo:", error);
        // Fallback on error too
        res.status(200).json({
            success: true,
            data: {
                pageTitle: "Services Detail Two",
                heroBadge: "✦ Innovative Tech Solutions",
                heroTitle: "Build the Future.",
                heroAnimatedText: ["Digital Futures."],
                heroDescription: "Fallback Description",
                metrics: [],
                techStack: []
            }
        });
    }
};

// Create a new configuration (POST)
exports.createServicesDetailTwo = async (req, res) => {
    try {
        const existingData = await ServicesDetailTwo.findOne();
        if (existingData) {
            return res.status(400).json({ success: false, message: 'Configuration already exists. Use PUT/PATCH to update.' });
        }

        const newData = await ServicesDetailTwo.create(req.body);
        res.status(201).json({ success: true, data: newData });
    } catch (error) {
        console.error("Error in createServicesDetailTwo:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update existing configuration (PUT/PATCH)
exports.updateServicesDetailTwo = async (req, res) => {
    try {
        let pageData = await ServicesDetailTwo.findOne();
        
        if (!pageData) {
            // If it doesn't exist, create it
            pageData = await ServicesDetailTwo.create(req.body);
            return res.status(201).json({ success: true, data: pageData });
        }

        pageData = await ServicesDetailTwo.findOneAndUpdate({}, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: pageData });
    } catch (error) {
        console.error("Error in updateServicesDetailTwo:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Delete configuration (DELETE)
exports.deleteServicesDetailTwo = async (req, res) => {
    try {
        const pageData = await ServicesDetailTwo.findOneAndDelete();
        
        if (!pageData) {
            return res.status(404).json({ success: false, message: 'Configuration not found' });
        }

        res.status(200).json({ success: true, message: 'Configuration deleted successfully', data: {} });
    } catch (error) {
        console.error("Error in deleteServicesDetailTwo:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
