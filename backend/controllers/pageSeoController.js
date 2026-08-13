const PageSeo = require("../models/PageSeo");
const { parseJSONField, buildSeoDefaults } = require("../utils/seoHelpers");

const PAGE_PATHS = {
    home: "/",
    about: "/about",
    contact: "/contact",
    career: "/career",
    portfolio: "/portfolio",
    blogs: "/blogs"
};

// GET ALL PAGE SEO (admin listing)
exports.getAllPageSeo = async (req, res) => {
    try {
        const data = await PageSeo.find();

        res.json({
            success: true,
            count: data.length,
            data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// GET SEO FOR ONE PAGE (frontend uses this — GET /api/v1/page-seo/home)
exports.getPageSeoByKey = async (req, res) => {
    try {
        const page = req.params.page?.toLowerCase();

        if (!PageSeo.ALLOWED_PAGES.includes(page)) {
            return res.status(400).json({
                success: false,
                message: `Invalid page key. Allowed: ${PageSeo.ALLOWED_PAGES.join(", ")}`
            });
        }

        const pageSeo = await PageSeo.findOne({ page });

        if (!pageSeo) {
            // Not configured yet in admin — still return sane defaults
            // instead of a 404, so the frontend always has something to render.
            return res.json({
                success: true,
                data: {
                    page,
                    seo: buildSeoDefaults({ path: PAGE_PATHS[page] || "/" })
                }
            });
        }

        res.json({
            success: true,
            data: pageSeo
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// CREATE OR UPDATE SEO FOR ONE PAGE (admin panel uses this — one form per page)
// PUT /api/v1/page-seo/home
exports.upsertPageSeo = async (req, res) => {
    try {
        const page = req.params.page?.toLowerCase();

        if (!PageSeo.ALLOWED_PAGES.includes(page)) {
            return res.status(400).json({
                success: false,
                message: `Invalid page key. Allowed: ${PageSeo.ALLOWED_PAGES.join(", ")}`
            });
        }

        const seo = buildSeoDefaults({
            seo: parseJSONField(req.body.seo),
            title: req.body.title || "",
            description: req.body.description || "",
            path: PAGE_PATHS[page] || "/",
            image: req.body.image || ""
        });

        const pageSeo = await PageSeo.findOneAndUpdate(
            { page },
            { page, seo },
            { new: true, upsert: true, runValidators: true }
        );

        res.json({
            success: true,
            data: pageSeo
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// DELETE (reset) A PAGE'S SEO
exports.deletePageSeo = async (req, res) => {
    try {
        const page = req.params.page?.toLowerCase();

        await PageSeo.findOneAndDelete({ page });

        res.json({
            success: true,
            message: "Page SEO reset to defaults"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
