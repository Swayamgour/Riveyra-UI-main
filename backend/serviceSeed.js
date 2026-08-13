const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Service = require("./models/Service");

dotenv.config();

const SERVICES = [
    {
        title: "AI Software Development",
        desc: "We build intelligent applications powered by AI technologies.",
        slug: "ai-software-development",
        accent: "#4F8EF7",
        path: "/ServiceDetail/ai-software-development",
        tags: [
            "Custom Web & Mobile Apps",
            "SaaS Platforms",
            "AI Chatbots",
            "API Integrations",
            "Automation Systems"
        ],
        icons: "",

        // ✅ HERO
        hero: {
            badge: "✨ AI-Powered Solutions",
            title: "AI Software Development Services",
            subtitle: "for Small Businesses & Affordable",
            intro: "Let's be honest for a second.",
            desc: [
                "Most businesses struggle because systems are slow and disconnected.",
                "AI helps automate and simplify workflows.",
                "You don’t need a huge team to get started."
            ],
            questionsTitle: "You might be thinking:",
            questions: [
                "How can AI help my business?",
                "Is it expensive?",
                "Can I automate my workflow?"
            ],
            closing: [
                "AI makes your system smarter.",
                "Start small and scale fast."
            ]
        },

        // ✅ BLOCKS
        blocks: [
            {
                label: "What is AI Software?",
                title: "Simple Explanation",
                desc: "AI software helps automate tasks and make smart decisions.",
                image: "https://dummyimage.com/600x400/000/fff",
                features: [
                    "Automation",
                    "Smart decisions",
                    "User behavior tracking"
                ],
                extra: "Upgrade your system to smart mode.",
                example: "AI can auto-track leads and suggest follow-ups.",
                reverse: false
            },
            {
                label: "Why Choose AI?",
                title: "Business Growth",
                desc: "AI improves efficiency and reduces manual work.",
                image: "https://dummyimage.com/600x400/111/fff",
                features: [
                    "Faster operations",
                    "Better UX",
                    "Cost saving"
                ],
                extra: "Businesses are moving to AI rapidly.",
                example: "Automation increases productivity.",
                reverse: true
            }
        ],

        // ✅ COMPARISON
        comparison: {
            title: "Traditional vs AI Software",
            data: [
                { feature: "Decision", traditional: "Manual", ai: "Automated" },
                { feature: "Efficiency", traditional: "Low", ai: "High" },
                { feature: "Growth", traditional: "Slow", ai: "Fast" }
            ]
        },

        // ✅ WHO NEEDS
        whoNeeds: {
            title: "Who Needs This?",
            problems: [
                "Manual work",
                "Slow systems",
                "Disconnected tools"
            ],
            idealFor: [
                "Startups",
                "Small Businesses",
                "Agencies"
            ]
        },

        // ✅ APPROACH
        approach: {
            title: "Our Approach",
            steps: [
                { number: "01", title: "Understand", desc: "We analyze your needs." },
                { number: "02", title: "Plan", desc: "We design AI solutions." },
                { number: "03", title: "Build", desc: "We develop and integrate." },
                { number: "04", title: "Optimize", desc: "We improve continuously." }
            ],
            whyChoose: [
                { title: "Custom Solutions", desc: "Tailored for your business." },
                { title: "Affordable", desc: "Budget-friendly pricing." },
                { title: "Support", desc: "Long-term support." }
            ]
        },

        // ✅ FAQ
        faq: [
            {
                q: "What is AI software?",
                a: "AI software automates tasks and improves decision-making."
            },
            {
                q: "Is it expensive?",
                a: "Affordable solutions are available."
            }
        ],

        // ✅ CTA
        cta: {
            title: "Let's Build Something Smart",
            desc: "Start your AI journey today.",
            buttons: [
                { label: "Get Started", link: "/contact" },
                { label: "Contact Us", link: "/contact" }
            ]
        }
    },

    {
        title: "Machine Learning Solutions",
        desc: "Advanced ML solutions to predict and automate decisions.",
        slug: "machine-learning-solutions",
        accent: "#A78BFA",
        path: "/ServiceDetail/machine-learning-solutions",
        tags: [
            "Predictive Analytics",
            "Recommendation Engines",
            "NLP",
            "Computer Vision"
        ],
        icons: "",

        hero: {
            badge: "🚀 ML Solutions",
            title: "Machine Learning Services",
            subtitle: "Smart Data Driven Decisions",
            intro: "Turn your data into insights.",
            desc: [
                "ML helps predict future outcomes.",
                "It improves decision-making.",
                "Automates analysis."
            ],
            questionsTitle: "Common Questions",
            questions: [
                "What is ML?",
                "How does it help business?"
            ],
            closing: [
                "ML helps you grow faster.",
                "Make better decisions."
            ]
        },

        blocks: [
            {
                label: "Predictive Analytics",
                title: "Forecast Future",
                desc: "ML predicts trends using data.",
                image: "https://dummyimage.com/600x400/222/fff",
                features: [
                    "Sales prediction",
                    "Customer behavior",
                    "Trend analysis"
                ],
                extra: "Plan ahead with ML.",
                example: "Predict next month sales.",
                reverse: false
            }
        ],

        comparison: {
            title: "Analytics vs ML",
            data: [
                { feature: "Insight", traditional: "Limited", ai: "Deep" },
                { feature: "Speed", traditional: "Slow", ai: "Fast" }
            ]
        },

        whoNeeds: {
            title: "Who Needs ML?",
            problems: [
                "Too much data",
                "No insights"
            ],
            idealFor: [
                "Startups",
                "E-commerce",
                "SaaS"
            ]
        },

        approach: {
            title: "ML Approach",
            steps: [
                { number: "01", title: "Data Analysis", desc: "Understand data." },
                { number: "02", title: "Model Build", desc: "Create ML models." }
            ],
            whyChoose: [
                { title: "Accuracy", desc: "High precision models." },
                { title: "Scalable", desc: "Grow easily." }
            ]
        },

        faq: [
            {
                q: "What is ML?",
                a: "Machine learning uses data to make predictions."
            }
        ],

        cta: {
            title: "Start ML Today",
            desc: "Grow with data.",
            buttons: [
                { label: "Start Now", link: "/contact" }
            ]
        }
    }
];

// 🚀 SEED FUNCTION
const seedServices = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Connected ✅");

        await Service.deleteMany();
        console.log("Old services deleted ❌");

        await Service.insertMany(SERVICES);

        console.log("All Services Seeded 🚀");

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedServices();