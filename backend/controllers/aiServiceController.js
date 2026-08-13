const AiService = require('../models/AiService');
const { buildSeoDefaults } = require('../utils/seoHelpers');

// Get all AI services
exports.getAllAiServices = async (req, res) => {
    try {
        const { activeOnly = true } = req.query;
        const query = activeOnly === 'true' ? { isActive: true } : {};

        const services = await AiService.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get AI service by slug
exports.getAiServiceBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const service = await AiService.findOne({ slug, isActive: true });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'AI Service not found'
            });
        }

        res.status(200).json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get AI service by ID
exports.getAiServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await AiService.findById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'AI Service not found'
            });
        }

        res.status(200).json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create AI service
exports.createAiService = async (req, res) => {
    try {
        const body = { ...req.body };

        body.seo = buildSeoDefaults({
            seo: body.seo,
            title: body.hero?.title || body.slug,
            description: body.hero?.intro || "",
            path: `/ServiceDetail/${body.slug}`,
            image: body.hero?.image || ""
        });

        const service = new AiService(body);
        await service.save();
        res.status(201).json({ success: true, data: service });
    } catch (error) {
        // if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'AI Service with this slug already exists'
            });
        // }
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update AI service
exports.updateAiService = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await AiService.findById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'AI Service not found'
            });
        }

        const body = { ...req.body };

        body.seo = buildSeoDefaults({
            seo: { ...(existing.seo?.toObject?.() || existing.seo || {}), ...(body.seo || {}) },
            title: body.hero?.title || existing.hero?.title || body.slug || existing.slug,
            description: body.hero?.intro || existing.hero?.intro || "",
            path: `/ServiceDetail/${body.slug || existing.slug}`,
            image: body.hero?.image || existing.hero?.image || ""
        });

        const service = await AiService.findByIdAndUpdate(
            id,
            { ...body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'AI Service not found'
            });
        }

        res.status(200).json({ success: true, data: service });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete AI service (soft delete)
exports.deleteAiService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await AiService.findByIdAndUpdate(
            id,
            { isActive: false, updatedAt: Date.now() },
            { new: true }
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'AI Service not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'AI Service deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get FAQ by service slug
exports.getFaqByServiceSlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const service = await AiService.findOne({ slug, isActive: true });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json({
            success: true,
            data: service.faq,
            count: service.faq.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get CTA by service slug
exports.getCtaByServiceSlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const service = await AiService.findOne({ slug, isActive: true });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json({ success: true, data: service.cta });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};