const Service = require("../models/Service");
const { parseJSONField, buildSeoDefaults } = require("../utils/seoHelpers");

const mongoose = require("mongoose");

// CREATE
exports.createService = async (req, res) => {
    try {
        const data = req.body;

        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        // 🔥 SAFE JSON PARSE FUNCTION
        const parseJSON = (field) => {
            try {
                return field ? JSON.parse(field) : undefined;
            } catch (err) {
                return field; // agar already object hai to wahi return
            }
        };

        // ✅ PARSE ALL JSON FIELDS
        data.tags = parseJSON(data.tags);
        data.hero = parseJSON(data.hero);
        data.blocks = parseJSON(data.blocks);
        data.comparison = parseJSON(data.comparison);
        data.whoNeeds = parseJSON(data.whoNeeds);
        data.approach = parseJSON(data.approach);
        data.faq = parseJSON(data.faq);
        data.cta = parseJSON(data.cta);
        data.seo = parseJSON(data.seo);

        // ✅ HERO IMAGE HANDLE
        if (req.files?.heroImage?.[0]) {
            data.hero = {
                ...data.hero,
                image: req.files.heroImage[0].path
            };
        }

        // ✅ ICON IMAGE HANDLE (single image)
        if (req.files?.icon?.[0]) {
            data.icons = req.files.icon[0].path;
        }

        // ✅ BLOCK IMAGES HANDLE
        if (data.blocks && req.files?.blockImages) {
            data.blocks = data.blocks.map((block, index) => ({
                ...block,
                image: req.files.blockImages?.[index]?.path || block.image || ""
            }));
        }

        // ✅ SEO DEFAULTS (auto-fill agar admin ne SEO fields khali chodi hain)
        data.seo = buildSeoDefaults({
            seo: data.seo,
            title: data.title,
            description: data.desc,
            path: `/ServiceDetail/${data.slug}`,
            image: data.hero?.image || ""
        });

        // ✅ CREATE SERVICE
        const service = await Service.create(data);

        res.status(201).json({
            success: true,
            data: service
        });

    } catch (err) {
        console.error("CREATE SERVICE ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message || "Server Error"
        });
    }
};




// GET ALL (LIST PAGE)
exports.getAllServices = async (req, res) => {
    try {
        const data = await Service.find().select(
            "title desc slug accent path tags icons subcategories"
        );

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


// GET DETAIL BY ID

//

exports.getServiceById = async (req, res) => {
    const { id } = req.params;

    console.log("ID:", id);

    // ✅ VALIDATE ID FORMAT
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid service ID"
        });
    }

    try {
        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.json({
            success: true,
            data: service
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// GET DETAIL BY SLUG
exports.getServiceDetail = async (req, res) => {
    try {
        const service = await Service.findOne({
            slug: req.params.slug
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.json({
            success: true,
            data: service
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// UPDATE
exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        console.log("UPDATE BODY:", req.body);
        console.log("UPDATE FILES:", req.files);

        // 🔥 SAFE PARSE
        const parseJSON = (field) => {
            try {
                return field ? JSON.parse(field) : undefined;
            } catch {
                return field;
            }
        };

        data.tags = parseJSON(data.tags);
        data.hero = parseJSON(data.hero);
        data.blocks = parseJSON(data.blocks);
        data.comparison = parseJSON(data.comparison);
        data.whoNeeds = parseJSON(data.whoNeeds);
        data.approach = parseJSON(data.approach);
        data.faq = parseJSON(data.faq);
        data.cta = parseJSON(data.cta);
        data.seo = parseJSON(data.seo);

        // 🔥 EXISTING SERVICE (important for old images)
        const existingService = await Service.findById(id);

        if (!existingService) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        // ✅ HERO IMAGE UPDATE
        if (req.files?.heroImage?.[0]) {
            data.hero = {
                ...data.hero,
                image: req.files.heroImage[0].path
            };
        } else {
            data.hero = {
                ...data.hero,
                image: existingService.hero?.image || ""
            };
        }

        // ✅ ICON UPDATE
        if (req.files?.icon?.[0]) {
            data.icons = req.files.icon[0].path;
        } else {
            data.icons = existingService.icons || "";
        }

        // ✅ BLOCK IMAGES UPDATE
        if (data.blocks) {
            data.blocks = data.blocks.map((block, index) => ({
                ...block,
                image:
                    req.files?.blockImages?.[index]?.path ||
                    existingService.blocks?.[index]?.image ||
                    ""
            }));
        }

        // ✅ SEO MERGE (old seo values ke upar naye/changed fields overwrite honge)
        data.seo = buildSeoDefaults({
            seo: { ...(existingService.seo?.toObject?.() || existingService.seo || {}), ...(data.seo || {}) },
            title: data.title || existingService.title,
            description: data.desc || existingService.desc,
            path: `/ServiceDetail/${data.slug || existingService.slug}`,
            image: data.hero?.image || existingService.hero?.image || ""
        });

        // ✅ UPDATE
        const updatedService = await Service.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        res.json({
            success: true,
            data: updatedService
        });

    } catch (err) {
        console.error("UPDATE ERROR:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// DELETE
exports.deleteService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};