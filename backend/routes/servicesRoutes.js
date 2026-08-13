const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
    createService,
    getAllServices,
    getServiceDetail,
    updateService,
    deleteService,
    getServiceById
} = require("../controllers/serviceController");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE
// router.post("/", createService);
router.post(
    "/",
    upload.fields([
        { name: "heroImage", maxCount: 1 },
        { name: "blockImages", maxCount: 20 },
        { name: "icon", maxCount: 1 } // ✅ ADD THIS
    ]),
    authMiddleware,
    createService
);

// LIST
router.get("/", getAllServices);

// DETAIL
router.get("/:slug", getServiceDetail);

// GET
router.get("/id/:id", getServiceById);

// UPDATE
router.put(
    "/:id",
    upload.fields([
        { name: "heroImage", maxCount: 1 },
        { name: "blockImages", maxCount: 20 },
        { name: "icon", maxCount: 1 }
    ]),
    authMiddleware,
    updateService
);

// DELETE
router.delete("/:id", authMiddleware, deleteService);

module.exports = router;