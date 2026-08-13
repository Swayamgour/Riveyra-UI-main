const Blog = require("../models/Blog");
const slugify = require("slugify");
const mongoose = require("mongoose");
const { parseJSONField, buildSeoDefaults } = require("../utils/seoHelpers");

const generateSlug = (title, slug) => {
	return slug && slug.trim() !== ""
		? slugify(slug, { lower: true, strict: true })
		: slugify(title, { lower: true, strict: true });
};

const checkDuplicateSlug = async (slug, id = null) => {
	const query = id ? { slug, _id: { $ne: id } } : { slug };

	return await Blog.findOne(query);
};

// CREATE
exports.createBlog = async (req, res) => {
	try {
		const data = req.body;

		data.slug = generateSlug(data.title, data.slug);

		if (await checkDuplicateSlug(data.slug)) {
			return res.status(400).json({
				success: false,
				message: "Blog slug already exists",
			});
		}

		if (req.file) {
			data.image = req.file.path;
		}

		data.seo = parseJSONField(data.seo);
		data.seo = buildSeoDefaults({
			seo: data.seo,
			title: data.metaTitle || data.title,
			description: data.metaDescription || data.description,
			path: `/blogs/${data.slug}`,
			image: data.image || ""
		});

		const blog = await Blog.create(data);

		res.status(201).json({
			success: true,
			data: blog,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

// GET ALL
exports.getAllBlogs = async (req, res) => {
	try {
		const blogs = await Blog.find()
			.populate("category", "name slug")
			.sort({ blogDate: -1 });

		res.json({
			success: true,
			count: blogs.length,
			data: blogs,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

exports.getPublishedBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({
            status: "published",
        })
            .populate("category", "name slug")
            .sort({ blogDate: -1 });

        res.json({
            success: true,
            count: blogs.length,
            data: blogs,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// GET BY ID
exports.getBlogById = async (req, res) => {
	try {
		const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog id",
      });
    }

    const blog = await Blog.findById(id).populate("category", "name slug");

		if (!blog) {
			return res.status(404).json({
				success: false,
				message: "Blog not found",
			});
		}

		res.json({
			success: true,
			data: blog,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

// GET BLOG BY SLUG
exports.getBlogBySlug = async (req, res) => {
	try {
		const blog = await Blog.findOne({
        slug: req.params.slug,
        status: "published",
    }).populate("category", "name slug");

		if (!blog) {
			return res.status(404).json({
				success: false,
				message: "Blog not found",
			});
		}

		res.json({
			success: true,
			blog,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};

// UPDATE
exports.updateBlog = async (req, res) => {
	try {
		const data = req.body;

		// Get existing blog
		const existingBlog = await Blog.findById(req.params.id);

		if (!existingBlog) {
			return res.status(404).json({
				success: false,
				message: "Blog not found",
			});
		}

		data.slug = generateSlug(data.title || existingBlog.title, data.slug);

		if (await checkDuplicateSlug(data.slug, req.params.id)) {
			return res.status(400).json({
				success: false,
				message: "Blog slug already exists",
			});
		}

		// Keep old image if new one isn't uploaded
		data.image = req.file ? req.file.path : existingBlog.image;

		data.seo = parseJSONField(data.seo);
		data.seo = buildSeoDefaults({
			seo: { ...(existingBlog.seo?.toObject?.() || existingBlog.seo || {}), ...(data.seo || {}) },
			title: data.metaTitle || data.title || existingBlog.title,
			description: data.metaDescription || data.description || existingBlog.description,
			path: `/blogs/${data.slug}`,
			image: data.image || ""
		});

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    ).populate("category", "name slug");

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

exports.toggleBlogStatus = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        blog.status =
            blog.status === "published"
                ? "draft"
                : "published";

        await blog.save();

        res.json({
            success: true,
            message:
            blog.status === "published"
              ? "Blog published successfully"
              : "Blog moved to draft",
            data: blog,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// DELETE
exports.deleteBlog = async (req, res) => {
	try {
		await Blog.findByIdAndDelete(req.params.id);

		res.json({
			success: true,
			message: "Blog deleted successfully",
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message,
		});
	}
};
