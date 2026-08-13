const Service = require("../models/Service");
const AiService = require("../models/AiService");
const Project = require("../models/Project");
const Career = require("../models/Career");
const Application = require("../models/Application");

exports.getDashboardCounts = async (req, res) => {
    try {
        const [
            services,
            aiServices,
            projects,
            careers,
            applications
        ] = await Promise.all([
            Service.countDocuments(),
            AiService.countDocuments(),
            Project.countDocuments(),
            Career.countDocuments(),
            Application.countDocuments()
        ]);

        res.json({
            success: true,
            data: {
                services,
                aiServices,
                projects,
                careers,
                applications
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};