const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
	createCategory,
	getAllCategories,
	getCategoryById,
	updateCategory,
	deleteCategory,
} = require("../controllers/categoryController");

router.post("/", authMiddleware, createCategory);

router.get("/", getAllCategories);

router.get("/:id", getCategoryById);

router.put("/:id", authMiddleware, updateCategory);

router.delete("/:id", authMiddleware, deleteCategory);

module.exports = router;
