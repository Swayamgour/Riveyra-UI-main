const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Project = require('./models/Project')

dotenv.config()

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err))


const PORTFOLIO = [
    { link: "https://dgfasli.gov.in/", title: 'DGFASLI', cat: 'Web Redesign', color: '#60a5fa', desc: 'Full government portal redesign with 24/7 cross-device accessibility, WCAG compliance, and dramatic load-time improvements.' },
    { link: "https://sdrfup.in/", title: 'SDRF', cat: 'ERP System', color: '#c084fc', desc: 'State-wide file management platform with one-click retrieval, audit trails, and enterprise-grade security.' },
    { link: "https://niedo.in/", title: 'NIEDO', cat: 'Web Development', color: '#34d399', desc: 'Seamless UX that set a new benchmark for excellence in public-sector digital experiences.' },
    { link: "https://martoliagroup.com/", title: 'Martolia Group', cat: 'Real Estate App', color: '#f87171', desc: 'RealEstate platform with property listings, virtual tours, and seamless booking capabilities.' },
]

const PROJECT_DATA = {
    'DGFASLI': {
        year: '2023', tech: ['React', 'Node.js', 'AWS'],
    },
    'SDRF': {
        year: '2023', tech: ['Custom ERP', 'PHP', 'MySQL'],
    },
    'NIEDO': {
        year: '2022', tech: ['Next.js', 'TailwindCSS', 'CMS'],
    },
    'Martolia Group': {
        year: '2024', tech: ['Flutter', 'Firebase', 'Maps API'],
    },
}


// 🔥 MERGE DATA
const seedData = PORTFOLIO.map(item => {
    const details = PROJECT_DATA[item.title]

    return {
        title: item.title,
        slug: item.title.toLowerCase().replace(/\s+/g, '-'),

        link: item.link,
        category: item.cat,
        color: item.color,
        description: item.desc,

        year: details?.year || '',
        tech: details?.tech || [],

        // ❌ images skip
        workImg: '',
        detailImgs: []
    }
})


// 🚀 SEED FUNCTION
const seedProjects = async () => {
    try {
        await Project.deleteMany() // optional (clear old data)

        await Project.insertMany(seedData)

        console.log("🔥 Projects seeded successfully")
        process.exit()

    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

seedProjects()