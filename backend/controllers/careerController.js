const Career = require('../models/Career')
const slugify = require('slugify')
const { buildSeoDefaults } = require('../utils/seoHelpers')

// CREATE
exports.createCareer = async (req, res) => {
    try {
        const slug = slugify(req.body.title, { lower: true })

        const seo = buildSeoDefaults({
            seo: req.body.seo,
            title: req.body.title,
            description: req.body.description,
            path: `/career/${slug}`
        })

        const job = await Career.create({
            ...req.body,
            slug,
            seo
        })

        res.json({ success: true, data: job })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


// GET ALL
exports.getCareers = async (req, res) => {
    try {
        const data = await Career.find().sort({ createdAt: -1 })
        res.json({ success: true, data })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


// GET SINGLE
exports.getCareerById = async (req, res) => {
    try {
        const data = await Career.findById(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Career not found"
            });
        }

        res.json({
            success: true,
            data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE
exports.updateCareer = async (req, res) => {
    try {
        const job = await Career.findById(req.params.id)

        if (!job) return res.status(404).json({ success: false })

        if (req.body.title) {
            job.slug = slugify(req.body.title, { lower: true })
        }

        Object.assign(job, req.body)

        job.seo = buildSeoDefaults({
            seo: { ...(job.seo?.toObject?.() || job.seo || {}), ...(req.body.seo || {}) },
            title: job.title,
            description: job.description,
            path: `/career/${job.slug}`
        })

        await job.save()

        res.json({ success: true, data: job })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


// DELETE
exports.deleteCareer = async (req, res) => {
    try {
        await Career.findByIdAndDelete(req.params.id)
        res.json({ success: true, message: "Deleted" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}