import picture1 from '../../public/services/ai-software-development-services.webp'
import picture2 from '../../public/services/ai-web-mobile-app-development.webp'
import picture3 from '../../public/services/ai-saas-platform-development.webp'
import picture4 from '../../public/services/ai-chatbot-integration-services.webp'
import picture5 from '../../public/services/ai-api-integration-automation.webp'
import picture6 from '../../public/services/ai-business-automation-solutions.webp'

export const SERVICES = [
    {
        title: "AI Software Development",
        desc: "We build intelligent applications powered by AI technologies.",
        slug: 'ai-ml',

        // tagline: 'Intelligent systems that learn and adapt',

        accent: "#4F8EF7",
        path: "/ServiceDetail/ai-software-development",

        tags: [
            "Custom Web & Mobile Apps",
            "SaaS Platforms",
            "AI Chatbots",
            "API Integrations",
            "Automation Systems"
        ],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z" />
                <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
                <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
            </svg>
        )
    },
    {
        title: "Machine Learning Solutions",
        desc: "Advanced ML solutions to predict and automate decisions.",
        accent: "#A78BFA",
        slug: 'generative-ai',
        path: "/ServiceDetail/machine-learning-solutions",
        tags: [
            "Predictive Analytics",
            "Recommendation Engines",
            "NLP Solutions",
            "Computer Vision"
        ],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                <path d="M4 12h4M16 12h4M12 4v4M12 16v4" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        )
    },
    {
        title: "AI Web Development",
        desc: "Modern websites optimized for speed, UX, and AI search.",
        accent: "#34D399",
        slug: 'web-development',

        path: "/ServiceDetail/ai-software-development",
        tags: [
            "React / Next.js",
            "Personalization Engines",
            "PWA",
            "Performance Optimization"
        ],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <path d="M8 20h8" />
            </svg>
        )
    },
    {
        title: "AI Data Analytics & BI",
        desc: "Transform raw data into actionable insights.",
        slug: 'mobile-apps',

        accent: "#F87171",
        path: "/ServiceDetail/ai-software-development",
        tags: [
            "Dashboards",
            "Data Visualization",
            "Business Intelligence",
            "Predictive Insights"
        ],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                <path d="M4 19V5M10 19V9M16 19v-6M22 19V3" />
            </svg>
        )
    },
    {
        title: "AI Cybersecurity",
        desc: "Secure systems with intelligent threat detection.",
        slug: 'blockchain-web3',

        accent: "#38BDF8",
        path: "/ServiceDetail/ai-software-development",
        tags: [
            "Threat Detection",
            "Fraud Prevention",
            "Monitoring Systems"
        ],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                <path d="M12 3l8 3.5v5C20 16 16.5 20.5 12 22 7.5 20.5 4 16 4 11.5v-5z" />
                <path d="M9 12l2 2 4-4" />
            </svg>
        )
    },
    {
        title: "Automation & RPA",
        desc: "Automate repetitive business processes.",
        accent: "#FB923C",
        slug: 'cybersecurity',

        path: "/ServiceDetail/ai-software-development",
        tags: [
            "Workflow Automation",
            "CRM/ERP Automation",
            "Task Automation"
        ],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                <path d="M12 2v6M12 16v6M4 12h6M14 12h6" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        )
    },
    {
        title: "Conversational AI",
        desc: "Improve customer interaction with AI chat systems.",
        slug: 'cloud-devops',

        accent: "#F472B6",
        path: "/ServiceDetail/ai-software-development",
        tags: [
            "Website Chatbots",
            "WhatsApp Bots",
            "Voice Assistants"
        ],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.5-4A4 4 0 0 1 3 15V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            </svg>
        )
    },
    {
        title: "AI SEO, AEO, GEO, LLMO",
        desc: "Optimize for search engines and AI platforms.",
        slug: 'erp',

        accent: "#FBBF24",
        path: "/ServiceDetail/ai-software-development",
        tags: [
            "AI SEO",
            "Answer Engine Optimization",
            "Generative Engine Optimization",
            "LLM Optimization"
        ],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
            </svg>
        )
    },
    {
        title: "AI E-commerce",
        desc: "Enhance online stores using AI.",
        accent: "#6EE7B7",
        slug: 'ui-ux',

        path: "/ServiceDetail/ai-software-development",
        tags: [
            "Recommendation Engines",
            "Smart Search",
            "Personalization"
        ],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                <path d="M6 6h15l-1.5 9h-12z" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
            </svg>
        )
    },
    {
        title: "AI Digital Marketing",
        desc: "Growth-focused marketing powered by AI.",
        accent: "#60A5FA",
        path: "/ServiceDetail/ai-software-development",
        tags: [
            "Ad Optimization",
            "Lead Generation",
            "Funnel Automation"
        ],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                <path d="M3 11l18-5v12l-18-5v-2z" />
                <path d="M11 11v6" />
            </svg>
        )
    },
    {
        title: "Enterprise AI Solutions",
        desc: "End-to-end AI transformation for enterprises.",
        accent: "#C084FC",
        path: "/ServiceDetail/ai-software-development",
        tags: [
            "System Integration",
            "Automation",
            "Digital Transformation"
        ],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
            </svg>
        )
    }
];


export const AI_SERVICE_DATA = [
    {
        slug: "ai-software-development",

        hero: {
            badge: "✨ AI-Powered Solutions",

            title: "AI Software Development Services",

            subtitle: "for Small Businesses & Affordable",

            intro: "Let's be honest for a second.",

            desc: [
                "Most businesses don't fail because they lack ideas. They struggle because their systems are slow, disconnected, and… honestly, exhausting to manage.",

                "You might already be using multiple tools—CRM, support software, billing systems—but still feel like things aren't flowing smoothly.",

                "That's exactly where AI software development services for small businesses start making a real difference.",

                "Instead of adding more tools, AI connects, simplifies, and improves everything you already do.",

                "And the best part? You don't need a huge team or budget to get started."
            ]
        },


        blocks: [
            {
                label: "What is AI Software Development?",
                title: "Simple Explanation for Business Owners",
                desc: `AI software development means creating smart applications that can:`,
                image: picture1,
                features: [
                    "Learn from user behavior",
                    "Automate repetitive work",
                    "Make data-driven decisions"
                ],
                extra: `In simple words, it's like upgrading your business systems from manual mode to smart mode.`,
                example: `For example, instead of manually tracking leads, your system can automatically identify serious customers, suggest follow-ups, and even trigger responses. That's not futuristic. That's happening right now.`
            },

            {
                label: "Why Businesses Are Choosing AI Software Development Services in India",
                title: "Businesses—especially startups and growing companies—are moving towards AI software development services in India because they want",
                desc: `There's a clear shift happening.`,
                image: picture6,
                features: [
                    "Faster operations without hiring more people",
                    "Better customer experience without delays",
                    "Smarter decision-making using real data",
                    "Cost-effective automation solutions"
                ],
                extra: `smarter systems, faster growth, and better efficiency.`,
                example: `And honestly, once businesses experience even a small part of AI automation, they don't go back.`,
                reverse: true
            },

            {
                label: "Custom AI Applications",
                title: "Custom AI Web & Mobile Application Development Services for Businesses",
                desc: `Let's start with the core.`,
                image: picture2,
                features: [
                    "They track user behavior in real time",
                    "They personalize content automatically",
                    "They recommend products or services",
                    "They improve engagement and conversions"
                ],
                extra: `We build custom AI web and mobile applications that don't just display information—they interact, learn, and improve over time.

            What Makes These Applications Powerful?`,
                example: `Real-Life Scenario
                
            Imagine a user visits your website twice.
                
            A normal app shows the same content again.
                
            But an AI-powered application?
            It remembers their behavior and shows what they're most likely interested           in.
                
            That small change can dramatically increase conversions.`
            },

            {
                label: "AI SaaS Platform Development",
                title: "AI SaaS Platform Development Services for Startups",
                desc: `If you're planning to build a product, this is where things get exciting.`,
                image: picture3,
                features: [
                    "Cloud-based scalable platforms",
                    "Subscription and billing systems",
                    "AI-powered analytics and insights",
                    "Automated workflows"
                ],
                extra: `We create AI SaaS platform development solutions that go beyond dashboards and reports.

                What You Get:`,
                example: `Example
                    
                Let's say you build a CRM tool.
                    
                Instead of just storing data, your system can:
                    
                Predict which leads will convert  
                Suggest next actions  
                Automate follow-ups  
                    
                Now your SaaS product becomes a smart assistant, not just software.`,
                reverse: true
            },

            {
                label: "AI Chatbot Integration",
                title: "AI Chatbot Integration for Website & WhatsApp Business",
                desc: `Customers don't like waiting. And you can't be online 24/7.`,
                image: picture4,
                features: [
                    "Answer customer queries instantly",
                    "Handle multi-step conversations",
                    "Book appointments or generate leads",
                    "Learn and improve over time"
                ],
                extra: `That's where AI chatbot integration for websites and WhatsApp becomes a game changer.

            What Our AI Chatbots Can Do:`,
                example: `Example
                
            A service business integrated a chatbot just to answer FAQs.
                
            Within a month:
                
            Response time dropped to seconds  
            Leads increased  
            Support workload reduced  
                
            Simple change. Big impact.`
            },

            {
                label: "AI API Integration",
                title: "AI API Integration Services for Business Automation",
                desc: `Most businesses use multiple tools—but they don't work together.`,
                image: picture5,
                features: [
                    "Your CRM, payment system, and marketing tools sync automatically",
                    "Data flows between platforms without manual effort",
                    "Actions trigger instantly"
                ],
                extra: `We provide AI API integration services for startups and businesses to connect everything smoothly.

        What This Means for You:`,
                example: `Example Workflow
            
        When a customer places an order:
            
        CRM updates  
        Invoice generates  
        WhatsApp message sends  
        Team gets notified  
            
        All automatically.`,
                reverse: true
            },

            {
                label: "Business Process Automation",
                title: "Business Process Automation Using AI Tools",
                desc: `This is where you save real time.`,
                image: picture6,
                features: [
                    "Lead management",
                    "Customer follow-ups",
                    "Email marketing workflows",
                    "Data entry processes"
                ],
                extra: `We build business automation systems using AI that remove repetitive work from your daily operations.

        What We Automate:`,
                example: `Real Example
            
        A company automated its lead handling process.
            
        The system:
            
        Categorized leads  
        Prioritized high-value prospects  
        Scheduled follow-ups  
            
        Result? Higher conversions without extra effort.`
            }
        ],

        comparison: {
            title: "Traditional vs AI Software",
            data: [
                { feature: "Decision Making", traditional: "Manual", ai: "Automated" },
                { feature: "Learning", traditional: "None", ai: "Continuous" },
                { feature: "Efficiency", traditional: "Limited", ai: "High" },
                { feature: "User Experience", traditional: "Static", ai: "Personalized" },
                { feature: "Growth", traditional: "Slow", ai: "Scalable" }
            ]
        },

        whoNeeds: {
            title: "Who Needs AI Software Development Services?",

            problems: [
                "Too much manual work",
                "Disconnected systems",
                "Slow response",
                "Scaling issues",
                "Repetitive tasks"
            ],
            idealFor: [
                "Small businesses",
                "Startups",
                "SaaS founders",
                "E-commerce",
                "Service companies"
            ]
        },

        approach: {
            title: "Simple, Practical & Results-Focused — We don't over complicate things.",
            steps: [
                { number: "01", title: "Understand Your Business", desc: "We identify where time and efficiency are being lost." },
                { number: "02", title: "Plan Smart Solutions", desc: "We design AI systems based on your workflow." },
                { number: "03", title: "Build & Integrate", desc: "Everything is connected and tested." },
                { number: "04", title: "Optimize Continuously", desc: "We improve based on real data and usage." }
            ],

            whyChoose: [
                { title: "🎯 Business Outcomes First", desc: "We focus on business outcomes, not just features." },
                { title: "🔧 Custom AI Solutions", desc: "We build custom AI solutions (no templates)." },
                { title: "✨ Simple & Practical", desc: "We keep things simple and practical." },
                { title: "🔄 Long-term Support", desc: "We provide long-term support." }
            ]


        },

        faq: [
            { q: "What are AI software development services for small businesses?", a: "AI software development services help small businesses automate tasks, improve efficiency, and build smart applications using artificial intelligence. These services transform how businesses operate by removing complexity and manual work." },
            { q: "How much do AI software development services cost in India?", a: "Costs depend on project scope, but affordable AI solutions are available for startups and small businesses. Basic automation starts from affordable packages, while larger custom solutions are priced based on requirements." },
            { q: "Can AI be used for business automation?", a: "Yes, AI is widely used for automating workflows, customer support, data management, lead qualification, and repetitive tasks that slow down business operations and drain team resources." },
            { q: "Which industries benefit from AI software development?", a: "Healthcare, e-commerce, education, SaaS, fintech, logistics, manufacturing, and service-based businesses benefit the most from AI-powered solutions and intelligent automation." },
            { q: "Is AI chatbot integration useful for lead generation?", a: "Absolutely. AI chatbots can capture leads 24/7, qualify them instantly, answer queries, and schedule follow-ups—significantly improving conversion rates and reducing response time to seconds." }
        ],

        cta: {
            title: "Let's Build Something Smart",
            desc: "Start small and scale with AI.",
            buttons: [
                { label: "Get AI Solution", link: "/contact" },
                { label: "Automate Business", link: "/contact" }
            ]
        }
    },
    {
        slug: "machine-learning-solutions",

        hero: {
            badge: "🚀",

            title: "Machine Learning Solutions for Small Businesses & Startups",

            subtitle: "in India (Affordable & Scalable)",

            intro: "Let’s start with something real.",

            desc: [
                "Most businesses today don’t have a data problem. They have a clarity problem.",

                "If you're searching for machine learning solutions for small businesses, chances are you already have data—sales reports, customer behavior, website traffic—but you’re not getting clear answers from it."
            ],

            questionsTitle: "You might be asking:",

            questions: [
                "Why are sales inconsistent?",
                "Which customers will actually convert?",
                "What should we focus on next?"
            ],

            closing: [
                "That’s exactly where custom machine learning solutions for businesses start making a real difference.",
                "Instead of guessing, you begin making confident, data-driven decisions."
            ]
        },

        blocks: [
            {
                label: "What Are Machine Learning Solutions?",
                title: "Quick Featured Answer",
                desc: "Machine learning solutions are systems that analyze business data, learn patterns, and help companies make smarter decisions automatically without manual effort.",
                image: picture1,
                features: [
                    "Predictions",
                    "Insights",
                    "Actions"
                ],
                extra: "In simple words, they turn your raw data into:",
                example: "And once implemented properly, they improve over time."
            },

            {
                label: "Why Businesses Are Choosing Machine Learning Solutions in India",
                title: "Growth, Efficiency, and Cost Savings",
                desc: "There’s a strong reason why companies are moving toward machine learning development services in India.",
                image: picture2,
                features: [
                    "Affordable machine learning solutions",
                    "Faster decision-making",
                    "Better customer insights",
                    "Scalable automation"
                ],
                extra: "It’s not just about technology—it’s about growth, efficiency, and cost savings.",
                example: "And the truth is, even small improvements can create a big impact.",
                reverse: true
            },

            {
                label: "Predictive Analytics Using Machine Learning for Business Growth",
                title: "Understand What Will Happen Next",
                desc: "This is one of the most powerful applications.",
                image: picture3,
                features: [
                    "Forecast future sales",
                    "Identify high-value customers",
                    "Reduce risks and losses",
                    "Optimize inventory planning"
                ],
                extra: "Predictive analytics using machine learning helps businesses understand what is likely to happen next.",
                example: `Real-Life Example

                Imagine you run an online store.

                Instead of guessing demand, your system analyzes:
                Past purchases
                Seasonal trends
                Customer behavior

                Then it predicts which products will sell next month.

                👉 Result: Better planning, higher profits, less waste.`
            },

            {
                label: "Recommendation Engine Development Using Machine                 Learning",
                title: "Personalized Suggestions That Convert",
                desc: "You’ve seen this everywhere.",
                image: picture4,
                features: [
                    "Suggest personalized products",
                    "Increase user engagement",
                    "Improve conversion rates"
                ],
                extra: "Platforms suggesting products, videos, or               services that feel surprisingly relevant.",
                example: `Practical Scenario
                            
                A visitor browses a product on your website.
                            
                Instead of showing random items, your system recommends:
                Similar products
                Trending items
                Frequently bought combinations
                            
                👉 This improves user experience and increases sales naturally.`,
                reverse: true
            },

            {
                label: "NLP Solutions Using Machine Learning for                Business Automation",
                title: "Understanding Human Language",
                desc: "Now let’s talk about something more human.",
                image: picture5,
                features: [
                    "AI chatbots",
                    "Customer support systems",
                    "Email automation",
                    "Feedback analysis"
                ],
                extra: "NLP solutions using machine learning help               systems understand human language—text or voice.",
                example: `Real Example
                            
                Let’s say you receive hundreds of customer reviews.
                            
                Instead of reading each one, NLP:
                Identifies common complaints
                Highlights positive feedback
                Detects customer sentiment
                            
                👉 This gives you faster insights without manual effort.`
            },

            {
                label: "Computer Vision Solutions for Smart Business                Operations",
                title: "Making Machines See",
                desc: "This is where machine learning becomes visual.",
                image: picture6,
                features: [
                    "Detect objects automatically",
                    "Monitor operations",
                    "Track inventory",
                    "Improve security systems"
                ],
                extra: "Computer vision solutions for businesses allow              systems to analyze images and videos.",
                example: `Practical Example
                            
                A warehouse uses cameras to track stock.
                            
                Instead of manual checks, the system:
                Detects stock levels
                Identifies missing items
                Alerts the team instantly
                            
                👉 This reduces errors and improves efficiency.`,
                reverse: true
            },

            {
                label: "AI and Machine Learning Solutions for Startups",
                title: "Built for Speed and Growth",
                desc: "Startups need speed and efficiency.",
                image: picture1,
                features: [
                    "Automate processes",
                    "Reduce operational costs",
                    "Improve decision-making",
                    "Scale faster"
                ],
                extra: "That’s why AI and machine learning solutions for                startups are becoming essential.",
                example: "And the best part? You don’t need a large team                to start."
            },

            {
                label: "Business Process Automation Using Machine               Learning Tools",
                title: "Remove Repetitive Work",
                desc: "Repetitive tasks slow down growth.",
                image: picture2,
                features: [
                    "Lead scoring and management",
                    "Customer follow-ups",
                    "Email campaigns",
                    "Reporting and analytics"
                ],
                extra: "We provide machine learning automation tools for                business that eliminate manual work.",
                example: `Example
                            
                A company automated lead handling using machine learning.
                            
                The system:
                Prioritized high-value leads
                Scheduled follow-ups
                Improved conversion rates
                            
                👉 Less effort, better results.`
            }
        ],

        comparison: {
            title: "Traditional Analytics vs Machine Learning Solutions",
            data: [
                { feature: "Decision Making", traditional: "Manual", ai: "Automated" },
                { feature: "Insights", traditional: "Limited", ai: "Deep" },
                { feature: "Adaptability", traditional: "Fixed", ai: "Learns over time" },
                { feature: "Efficiency", traditional: "Moderate", ai: "High" },
                { feature: "Growth Support", traditional: "Limited", ai: "Scalable" }
            ]
        },

        whoNeeds: {
            title: "Who Needs Machine Learning Solutions?",
            problems: [
                "Too much data but no insights",
                "Decisions based on guesswork",
                "Repetitive manual analysis",
                "Slow business growth"
            ]
        },

        approach: {
            title: "Our Approach to Machine Learning Development                Services",
            steps: [
                { number: "01", title: "Understand Your Business", desc: "We analyze your data and challenges." },
                { number: "02", title: "Identify Opportunities", desc: "We find high-impact use cases." },
                { number: "03", title: "Build Custom Solutions", desc: "We develop tailored machine learning models." },
                { number: "04", title: "Optimize Continuously", desc: "We improve performance over time." }
            ],

            whyChoose: [
                { title: "Custom machine learning solutions company                 approach", desc: "" },
                { title: "Affordable pricing for startups", desc: "" },
                { title: "Focus on real business outcomes", desc: "" },
                { title: "Long-term support", desc: "" }
            ]
        },

        faq: [
            {
                q: "What are machine learning solutions for small               businesses?",
                a: "They help businesses analyze data, predict outcomes,                and automate decisions using intelligent systems."
            },
            {
                q: "How much do machine learning development services               cost in India?",
                a: "Costs vary depending on project scope, but              affordable solutions are available for startups."
            },
            {
                q: "Can machine learning improve business automation?",
                a: "Yes, it automates processes like lead management,               customer support, and analytics."
            },
            {
                q: "What is predictive analytics using machine learning?                ",
                a: "It uses historical data to predict future trends and                behaviors."
            },
            {
                q: "Are machine learning solutions suitable for startups?               ",
                a: "Yes, they help startups scale faster with fewer                 resources."
            }
        ],

        cta: {
            title: "Let’s Build Something Smart",
            desc: "You don’t need to start big. Start small and scale               with machine learning.",
            buttons: [
                { label: "Get ML Solution", link: "/contact" },
                { label: "Contact Us", link: "/contact" }
            ]
        }
    }
];




export const tabs = [
    { id: 'basic', label: 'Basic Info', icon: '📝' },
    { id: 'hero', label: 'Hero Section', icon: '🎯' },
    { id: 'blocks', label: 'Content Blocks', icon: '📦' },
    { id: 'comparison', label: 'Comparison', icon: '⚖️' },
    { id: 'whoNeeds', label: 'Who Needs', icon: '👥' },
    { id: 'approach', label: 'Approach', icon: '🔄' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'cta', label: 'CTA', icon: '🎯' }
]