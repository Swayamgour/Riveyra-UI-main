const Category = require("../models/Category");
const slugify = require("slugify");

// CREATE
exports.createCategory = async (req, res) => {
	try {
		const { name, slug } = req.body;

		const finalSlug =
			slug && slug.trim() !== ""
				? slugify(slug, { lower: true, strict: true })
				: slugify(name, { lower: true, strict: true });

		const exists = await Category.findOne({ slug: finalSlug });

		if (exists) {
			return res.status(400).json({
				success: false,
				message: "Category slug already exists",
			});
		}

		const category = await Category.create({
			name,
			slug: finalSlug,
		});

		res.status(201).json({
			success: true,
			data: category,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

// GET ALL
exports.getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find().sort({ createdAt: -1 });

		res.json({
			success: true,
			count: categories.length,
			data: categories,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

// GET BY ID
exports.getCategoryById = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);

		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}

		res.json({
			success: true,
			data: category,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

// UPDATE
exports.updateCategory = async (req, res) => {
	try {
		const { name, slug } = req.body;

		const finalSlug =
			slug && slug.trim() !== ""
				? slugify(slug, { lower: true, strict: true })
				: slugify(name, { lower: true, strict: true });

		const exists = await Category.findOne({
			slug: finalSlug,
			_id: { $ne: req.params.id },
		});

		if (exists) {
			return res.status(400).json({
				success: false,
				message: "Category slug already exists",
			});
		}

		const updated = await Category.findByIdAndUpdate(
			req.params.id,
			{
				name,
				slug: finalSlug,
			},
			{ new: true },
		);

		res.json({
			success: true,
			data: updated,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

// DELETE
exports.deleteCategory = async (req, res) => {
	try {
		await Category.findByIdAndDelete(req.params.id);

		res.json({
			success: true,
			message: "Category deleted successfully",
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};
