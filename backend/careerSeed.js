const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Career = require('./models/Career')

dotenv.config()

// 🔗 DB connect
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err))





const JOB_OPENINGS = [
    {
        // id: 'fe-dev',
        title: 'Frontend Developer',
        dept: 'Engineering',
        type: 'Full-Time',
        mode: 'Hybrid',
        location: 'Kanpur, India',
        experience: '1–3 Years',
        accent: '#60a5fa',
        requirements: ['React', 'JavaScript', 'CSS', 'Figma'],
        description: "Build pixel-perfect, high-performance web interfaces for government and enterprise clients. You'll work directly with our design team to ship products used by millions.",
        benefits: ['Flexible hours', 'MacBook Pro', 'Health cover'],
        salary: '₹5L - ₹8L / year',
        postedDate: '2025-02-28',
        status: 'closed',


    },
    {
        // id: 'be-dev',
        title: 'Backend Developer',
        dept: 'Engineering',
        type: 'Full-Time',
        mode: 'On-site',
        location: 'Kanpur, India',
        experience: '2–4 Years',
        accent: '#34d399',
        requirements: ['Node.js', 'PHP', 'MySQL', 'AWS'],
        description: 'Architect and build scalable APIs, ERP systems, and cloud infrastructure powering mission-critical government and enterprise platforms.',
        benefits: ['Competitive pay', 'Annual bonus', 'Learning budget'],
        salary: '₹5L - ₹8L / year',
        postedDate: '2025-02-28',
        status: 'closed',


    },
    {
        // id: 'flutter-dev',
        title: 'Flutter Developer',
        dept: 'Mobile',
        type: 'Full-Time',
        mode: 'Hybrid',
        location: 'Kanpur, India',
        experience: '1–3 Years',
        accent: '#c084fc',
        requirements: ['Flutter', 'Dart', 'Firebase', 'REST APIs'],
        description: 'Craft beautiful, performant cross-platform apps for Android and iOS. Our mobile products are used by thousands of users every day.',
        benefits: ['Remote-friendly', 'Stock options', 'Gym allowance'],
        salary: '₹5L - ₹8L / year',
        postedDate: '2025-02-28',
        status: 'closed',


    },
    {
        // id: 'ui-ux',
        title: 'UI/UX Designer',
        dept: 'Design',
        type: 'Full-Time',
        mode: 'Hybrid',
        location: 'Kanpur, India',
        experience: '1–3 Years',
        accent: '#fbbf24',
        requirements: ['Figma', 'Prototyping', 'Research', 'Motion'],
        description: "Design intuitive experiences for complex government and enterprise products. You'll own full design flows from user research through to polished handoff.",
        benefits: ['Creative freedom', 'Conf tickets', 'MacBook Pro'],
        salary: '₹5L - ₹8L / year',
        postedDate: '2025-02-28',
        status: 'closed',


    },
    {
        // id: 'seo',
        title: 'SEO & Growth Specialist',
        dept: 'Marketing',
        type: 'Full-Time',
        mode: 'On-site',
        location: 'Kanpur, India',
        experience: '1–2 Years',
        accent: '#f87171',
        requirements: ['SEO', 'Google Ads', 'Analytics', 'Content'],
        description: 'Drive organic growth and digital visibility for Riveyra and our clients. Combine technical SEO, content strategy, and paid media to deliver measurable ROI.',
        benefits: ['Performance bonus', 'Flexible hours', 'Health cover'],
        salary: '₹5L - ₹8L / year',
        postedDate: '2025-02-28',
        status: 'closed',


    },
    {
        // id: 'pm',
        title: 'Project Manager',
        dept: 'Operations',
        type: 'Full-Time',
        mode: 'On-site',
        location: 'Kanpur, India',
        experience: '3–5 Years',
        accent: '#38bdf8',
        requirements: ['Agile', 'JIRA', 'Client Mgmt', 'Risk Mgmt'],
        description: "Lead cross-functional teams to deliver complex technology projects on time and on budget. You'll be the bridge between clients, designers, and developers.",
        benefits: ['Leadership track', 'Annual bonus', 'Laptop provided'],
        salary: '₹5L - ₹8L / year',
        postedDate: '2025-02-28',
        status: 'closed',


    },
]

// 🔥 SEED FUNCTION
const seedCareers = async () => {
    try {
        await Career.deleteMany()

        const data = JOB_OPENINGS.map(job => ({
            ...job,
            slug: job.title.toLowerCase().replace(/\s+/g, '-')
        }))

        await Career.insertMany(data)

        console.log("🔥 Career data seeded successfully")
        process.exit()

    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

seedCareers()