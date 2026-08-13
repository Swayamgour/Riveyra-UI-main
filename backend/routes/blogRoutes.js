const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const {
    createBlog,
    getAllBlogs,
    getPublishedBlogs,
    getBlogById,
    getBlogBySlug,
    updateBlog,
    toggleBlogStatus,
    deleteBlog,
} = require("../controllers/blogController");

router.post("/", upload.single("image"), authMiddleware, createBlog);

router.get("/", getAllBlogs);

router.get("/published", getPublishedBlogs);

router.get("/id/:id", getBlogById);

router.get("/:slug", getBlogBySlug);

router.patch("/:id/status", authMiddleware, toggleBlogStatus);

router.put("/:id", upload.single("image"), authMiddleware, updateBlog);

router.delete("/:id", authMiddleware, deleteBlog);

module.exports = router;
