const mongoose = require('mongoose');
const NavDropdownItem = require('../models/NavDropdownItem');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const NAV_DROPDOWN_DATA = [
    {
        categories: "Digital Marketing",
        desc: "Data-driven marketing strategies to accelerate your growth and online presence.",
        subcategories: [
            { name: "SEO", desc: "Optimize your website to rank higher and attract organic traffic." },
            { name: "Social Media Marketing", desc: "Engage your audience and build brand loyalty across social platforms." },
            { name: "Google Ads", desc: "Targeted advertising campaigns to maximize your ROI." },
            { name: "Meta Ads", desc: "Data-driven advertising on Facebook and Instagram." },
            { name: "Video Editing", desc: "Professional video editing to tell your brand's story." },
            { name: "Graphic designing", desc: "Creative graphic solutions that capture attention." }
        ],
        techTools: [
            {
                category: 'Analytics & SEO',
                tools: [
                    { name: 'Google Analytics', icon: 'https://cdn.simpleicons.org/googleanalytics/E37400' },
                    { name: 'Ahrefs', icon: 'https://cdn.simpleicons.org/ahrefs/FF9900' },
                    { name: 'SEMrush', icon: 'https://cdn.simpleicons.org/semrush/FF642D' },
                    { name: 'Moz', icon: 'https://cdn.simpleicons.org/moz/00A9E2' }
                ]
            },
            {
                category: 'Advertising',
                tools: [
                    { name: 'Google Ads', icon: 'https://cdn.simpleicons.org/googleads/0F9D58' },
                    { name: 'Meta Ads', icon: 'https://cdn.simpleicons.org/meta/0468FF' },
                    { name: 'LinkedIn', icon: 'https://cdn.simpleicons.org/linkedin/0A66C2' },
                    { name: 'TikTok', icon: 'https://cdn.simpleicons.org/tiktok/000000' }
                ]
            },
            {
                category: 'Social & Content',
                tools: [
                    { name: 'Hootsuite', icon: 'https://cdn.simpleicons.org/hootsuite/000000' },
                    { name: 'Buffer', icon: 'https://cdn.simpleicons.org/buffer/231F20' },
                    { name: 'Canva', icon: 'https://cdn.simpleicons.org/canva/00C4CC' },
                    { name: 'Mailchimp', icon: 'https://cdn.simpleicons.org/mailchimp/FFE01B' }
                ]
            }
        ]
    },
    {
        categories: "Web Development",
        desc: "Custom, scalable, and high-performance web applications tailored for your business.",
        subcategories: [
            { name: "E-commerce", desc: "Build powerful online stores that convert visitors into customers." },
            { name: "ERP", desc: "Enterprise Resource Planning systems to streamline your operations." },
            { name: "CRM", desc: "Customer Relationship Management tools to enhance client retention." },
            { name: "CMS", desc: "Content Management Systems for easy and flexible content updates." },
            { name: "Custom web development", desc: "Tailor-made web solutions designed for your specific needs." }
        ],
        techTools: [
            {
                category: 'Frontend',
                tools: [
                    { name: 'React', icon: 'https://cdn.simpleicons.org/react/61DAFB' },
                    { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs/000000' },
                    { name: 'Vue.js', icon: 'https://cdn.simpleicons.org/vuedotjs/4FC08D' },
                    { name: 'TailwindCSS', icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
                    { name: 'HTML5', icon: 'https://cdn.simpleicons.org/html5/E34F26' },
                    { name: 'CSS3', icon: 'https://cdn.simpleicons.org/css3/1572B6' }
                ]
            },
            {
                category: 'Backend',
                tools: [
                    { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs/339939' },
                    { name: 'Python', icon: 'https://cdn.simpleicons.org/python/3776AB' },
                    { name: 'Go', icon: 'https://cdn.simpleicons.org/go/00ADD8' },
                    { name: 'Express', icon: 'https://cdn.simpleicons.org/express/000000' }
                ]
            },
            {
                category: 'Database',
                tools: [
                    { name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb/47A248' },
                    { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/4169E1' },
                    { name: 'MySQL', icon: 'https://cdn.simpleicons.org/mysql/4479A1' },
                    { name: 'Redis', icon: 'https://cdn.simpleicons.org/redis/DC382D' }
                ]
            },
            {
                category: 'DevOps & Cloud',
                tools: [
                    { name: 'AWS', icon: 'https://cdn.simpleicons.org/amazonaws/232F3E' },
                    { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker/2496ED' },
                    { name: 'Vercel', icon: 'https://cdn.simpleicons.org/vercel/000000' },
                    { name: 'Nginx', icon: 'https://cdn.simpleicons.org/nginx/009639' }
                ]
            }
        ]
    },
    {
        categories: "App Development",
        desc: "Engaging and robust mobile experiences for iOS and Android platforms.",
        subcategories: [
            { name: "ios app development", desc: "Native applications tailored for the Apple ecosystem." },
            { name: "android app development", desc: "High-performance apps for the diverse Android market." },
            { name: "cross platform app development", desc: "Unified applications that run seamlessly on all platforms." }
        ],
        techTools: [
            {
                category: 'Cross-Platform',
                tools: [
                    { name: 'React Native', icon: 'https://cdn.simpleicons.org/react/61DAFB' },
                    { name: 'Flutter', icon: 'https://cdn.simpleicons.org/flutter/02569B' },
                    { name: 'Expo', icon: 'https://cdn.simpleicons.org/expo/000020' }
                ]
            },
            {
                category: 'iOS Native',
                tools: [
                    { name: 'Swift', icon: 'https://cdn.simpleicons.org/swift/F05138' },
                    { name: 'Xcode', icon: 'https://cdn.simpleicons.org/xcode/1565C0' }
                ]
            },
            {
                category: 'Android Native',
                tools: [
                    { name: 'Kotlin', icon: 'https://cdn.simpleicons.org/kotlin/7F52FF' },
                    { name: 'Android Studio', icon: 'https://cdn.simpleicons.org/androidstudio/3DDC84' },
                    { name: 'Java', icon: 'https://cdn.simpleicons.org/openjdk/437271' }
                ]
            },
            {
                category: 'Backend & BaaS',
                tools: [
                    { name: 'Firebase', icon: 'https://cdn.simpleicons.org/firebase/FFCA28' },
                    { name: 'Supabase', icon: 'https://cdn.simpleicons.org/supabase/3ECF8E' },
                    { name: 'Appwrite', icon: 'https://cdn.simpleicons.org/appwrite/F02E65' }
                ]
            }
        ]
    },
    {
        categories: "Cyber Security",
        desc: "Advanced security solutions to protect your digital assets from emerging threats.",
        subcategories: [
          { name: "software testing", desc: "Rigorous testing to identify vulnerabilities and ensure code quality." },
          { name: "database security", desc: "Comprehensive measures to protect your sensitive data stores." },
          { name: "network security", desc: "Robust defenses against network intrusions and cyber attacks." }
        ],
        techTools: [
            {
                category: 'Penetration Testing',
                tools: [
                    { name: 'Kali Linux', icon: 'https://cdn.simpleicons.org/kalilinux/557C94' },
                    { name: 'Metasploit', icon: 'https://cdn.simpleicons.org/metasploit/1032F0' },
                    { name: 'Burp Suite', icon: 'https://cdn.simpleicons.org/burpsuite/FF6633' },
                    { name: 'Nmap', icon: 'https://cdn.simpleicons.org/nmap/000000' }
                ]
            },
            {
                category: 'Network Security',
                tools: [
                    { name: 'Wireshark', icon: 'https://cdn.simpleicons.org/wireshark/1679A7' },
                    { name: 'Snort', icon: 'https://cdn.simpleicons.org/snort/000000' },
                    { name: 'Cisco', icon: 'https://cdn.simpleicons.org/cisco/1BA0D7' }
                ]
            },
            {
                category: 'SIEM & Monitoring',
                tools: [
                    { name: 'Splunk', icon: 'https://cdn.simpleicons.org/splunk/000000' },
                    { name: 'Datadog', icon: 'https://cdn.simpleicons.org/datadog/632CA6' }
                ]
            },
            {
                category: 'Cloud Security',
                tools: [
                    { name: 'AWS Security', icon: 'https://cdn.simpleicons.org/amazonaws/232F3E' },
                    { name: 'Azure Security', icon: 'https://cdn.simpleicons.org/microsoftazure/0089D6' }
                ]
            }
        ]
    }
];

// AI SERVICE DATA - Note: Image paths are stored as strings
// You'll need to handle the actual image files separately;

const seedNavDropdown = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await NavDropdownItem.deleteMany({});
        console.log('Cleared existing NavDropdown data');

        // Seed NAV_DROPDOWN_DATA
        for (const item of NAV_DROPDOWN_DATA) {
            await NavDropdownItem.create({
                categories: item.categories,
                desc: item.desc,
                icons: item.icons || "https://cdn-icons-png.flaticon.com/512/2885/2885417.png", // fallback
                subcategories: item.subcategories,
                techTools: item.techTools,
                order: item.order,
                isActive: item.isActive
            });
        }
        console.log(`✅ Seeded ${NAV_DROPDOWN_DATA.length} NavDropdown items`);

        console.log('✅ NavDropdown database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedNavDropdown();
