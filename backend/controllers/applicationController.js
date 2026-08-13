const Application = require("../models/Application");

const cloudinary = require("../config/cloudinary");


exports.applyForJob = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            linkedin,
            portfolio,
            experience,
            noticePeriod,
            currentCtc,
            expectedCtc,
            jobTitle,
            jobId,
            coverLetter
        } = req.body;

        const resumePath = req.file ? req.file.path : null;

        if (!resumePath) {
            return res.status(400).json({
                success: false,
                message: "Resume is required"
            });
        }

        const application = await Application.create({
            fullName,
            email,
            phone,
            linkedin,
            portfolio,
            experience,
            noticePeriod,
            currentCtc,
            expectedCtc,
            jobTitle,
            jobId,
            coverLetter,
            resume: resumePath
        });

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: application
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getAllApplications = async (req, res) => {
    try {
        const data = await Application.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getApplicationById = async (req, res) => {
    try {
        const data = await Application.findById(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
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


exports.updateApplicationStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        // ✅ validation
        const allowedStatus = ['pending', 'reviewed', 'rejected', 'hired', 'shortlisted'];

        //       { value: 'pending', label: 'Pending', color: '#fbbf24', icon: FaClock },
        // { value: 'reviewed', label: 'Reviewed', color: '#60a5fa', icon: FaEye },
        // { value: 'shortlisted', label: 'Shortlisted', color: '#34d399', icon: FaCheckCircle },
        // { value: 'rejected', label: 'Rejected', color: '#f87171', icon: FaTimesCircle },
        // { value: 'hired', label: 'Hired', color: '#c084fc', icon: FaUserGraduate }

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        const updated = await Application.findByIdAndUpdate(
            id,
            { status }, // ✅ only status update
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        res.json({
            success: true,
            message: "Status updated successfully",
            data: updated
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.deleteApplication = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await Application.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        res.json({
            success: true,
            message: "Application deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// const extractPublicId = (public_id) => {
//     console.log(public_id)
//     return public_id?.split('/upload/')[1]?.replace(/^v\d+\//, '')?.split('.')[0];
// };


const extractPublicId = (input) => {
    console.log(input)
    if (!input) return null;

    // case 1: full URL
    if (input.includes('/upload/')) {
        return input
            .split('/upload/')[1]
            .replace(/^v\d+\//, '')
            .split('.')[0];
    }

    // case 2: already public_id with version
    return input
        .replace(/^v\d+\//, '')
        .split('.')[0];
};

// remove extension };

exports.getResumeDownloadUrl = async (req, res) => {
    try {
        const { public_id } = req.body;

        if (!public_id) {
            return res.status(400).json({
                success: false,
                message: "public_id is required"
            });
        }

        const cleanPublicId = extractPublicId(public_id) + ".pdf"

        if (!cleanPublicId) {
            return res.status(400).json({
                success: false,
                message: "Invalid public_id format"
            });
        }

        const timestamp = Math.floor(Date.now() / 1000);

        const signature = cloudinary.utils.api_sign_request(
            {
                public_id: cleanPublicId,
                timestamp,
                type: "upload",
                attachment: true
            },
            process.env.API_SECRET
        );

        const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/raw/download?public_id=${cleanPublicId}&timestamp=${timestamp}&signature=${signature}&api_key=${process.env.API_KEY}&type=upload&attachment=true`;

        res.json({
            success: true,
            url
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};