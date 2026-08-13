// controllers/projectController.js

const Project = require('../models/Project')
const slugify = require('slugify')
const { parseJSONField, buildSeoDefaults } = require('../utils/seoHelpers')


// ✅ CREATE
exports.createProject = async (req, res) => {
    try {
        const { title, link, category, color, description, year, tech, seo } = req.body

        const slug = slugify(title, { lower: true })

        const workImg = req.files['workImg']?.[0]?.path || ''
        const detailImgs = req.files['detailImgs']?.map(file => file.path) || []

        const seoData = buildSeoDefaults({
            seo: parseJSONField(seo),
            title,
            description,
            path: `/portfolio/${slug}`,
            image: workImg
        })

        const project = await Project.create({
            title,
            slug,
            link,
            category,
            color,
            description,
            workImg,
            detailImgs,
            year,
            tech: JSON.parse(tech || '[]'),
            seo: seoData
        })

        res.status(201).json({ success: true, data: project })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


// ✅ GET ALL
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 })
        res.json({ success: true, data: projects })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


// ✅ GET SINGLE (by slug)
exports.getProjectBySlug = async (req, res) => {
    try {
        const project = await Project.findOne({ slug: req.params.slug })

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' })
        }

        res.json({ success: true, data: project })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


// ✅ UPDATE
exports.updateProject = async (req, res) => {
    try {
        const { title, link, category, color, description, year, tech, seo } = req.body

        const project = await Project.findById(req.params.id)

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' })
        }

        // 🔥 update slug if title changed
        if (title) {
            project.slug = slugify(title, { lower: true })
            project.title = title
        }

        project.link = link || project.link
        project.category = category || project.category
        project.color = color || project.color
        project.description = description || project.description
        project.year = year || project.year
        project.tech = tech ? JSON.parse(tech) : project.tech

        // 🔥 update images (optional)
        if (req.files['workImg']) {
            project.workImg = req.files['workImg'][0].path
        }

        if (req.files['detailImgs']) {
            project.detailImgs = req.files['detailImgs'].map(file => file.path)
        }

        // 🔥 update seo (old values ke upar naye/changed fields overwrite)
        project.seo = buildSeoDefaults({
            seo: { ...(project.seo?.toObject?.() || project.seo || {}), ...(parseJSONField(seo) || {}) },
            title: project.title,
            description: project.description,
            path: `/portfolio/${project.slug}`,
            image: project.workImg
        })

        await project.save()

        res.json({ success: true, data: project })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


// ✅ DELETE
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' })
        }

        await project.deleteOne()

        res.json({ success: true, message: 'Project deleted successfully' })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}