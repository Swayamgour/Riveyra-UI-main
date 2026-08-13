// const express = require("express");
// const router = express.Router();

// const { applyForJob } = require("../controllers/applicationController");
// const upload = require("../middleware/upload");

// // POST API
// router.post("/", upload.single("resume"), applyForJob);

// module.exports = router;


const express = require("express");
const router = express.Router();

const {
    applyForJob,
    getAllApplications,
    getApplicationById,
    // updateApplication,
    deleteApplication,
    updateApplicationStatus,
    getResumeDownloadUrl

} = require("../controllers/applicationController");

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE
router.post("/", upload.single("resume"), authMiddleware, applyForJob);

// GET ALL
router.get("/", getAllApplications);

// GET SINGLE
router.get("/:id", getApplicationById);

// UPDATE
router.patch("/:id", authMiddleware, updateApplicationStatus);

// DELETE
router.delete("/:id", authMiddleware, deleteApplication);


router.post("/download-url", getResumeDownloadUrl);

module.exports = router;