// routes/pageSeoRoutes.js

const express = require("express");
const router = express.Router();

const {
    getAllPageSeo,
    getPageSeoByKey,
    upsertPageSeo,
    deletePageSeo
} = require("../controllers/pageSeoController");

const authMiddleware = require("../middleware/authMiddleware");

// LIST (admin)
router.get("/", getAllPageSeo);

// GET ONE PAGE'S SEO (public — frontend SEO.jsx calls this)
router.get("/:page", getPageSeoByKey);

// CREATE/UPDATE ONE PAGE'S SEO (admin)
router.put("/:page", authMiddleware, upsertPageSeo);

// RESET ONE PAGE'S SEO (admin)
router.delete("/:page", authMiddleware, deletePageSeo);

module.exports = router;
