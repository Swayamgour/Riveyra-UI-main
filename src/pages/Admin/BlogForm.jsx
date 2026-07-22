import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	useGetCategoriesQuery,
	useGetBlogByIdQuery,
	useCreateBlogMutation,
	useUpdateBlogMutation,
} from "../../redux/api";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../styles/Blog.css";

const makeSlug = (text = "") =>
	text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

const BlogForm = () => {
	const [form, setForm] = useState({
		title: "",
		slug: "",
		category: "",
		description: "",
		blogDate: "",
		status: "draft",

		image: null,
		imageAlt: "",

		// ✅ Structured SEO object (matches backend seoSchema, same as Service)
		seo: {
			metaTitle: "",
			metaDescription: "",
			keywords: [], // array of strings
			canonical: "",
			robots: "index, follow",
			openGraph: {
				title: "",
				description: "",
				image: "",
			},
			twitter: {
				title: "",
				description: "",
				image: "",
			},
			schema: "", // JSON-LD as raw text
		},
	});

	const [tempKeyword, setTempKeyword] = useState("");

	const [preview, setPreview] = useState("");
	const [message, setMessage] = useState({ type: "", text: "" });
	const [errors, setErrors] = useState({});
	const [manualSlug, setManualSlug] = useState(false);

	const navigate = useNavigate();
	const { id } = useParams();
	const isEdit = Boolean(id);

	const { data: categoriesData } = useGetCategoriesQuery();

	const { data: blogData, isLoading: loadingBlog } = useGetBlogByIdQuery(id, {
		skip: !isEdit,
	});

	const [createBlog, { isLoading: creating }] = useCreateBlogMutation();

	const [updateBlog, { isLoading: updating }] = useUpdateBlogMutation();

	const categories = categoriesData?.data || [];

	const isSubmitting = creating || updating;

	useEffect(() => {
		if (blogData?.data) {
			const blog = blogData.data;

			setForm({
				title: blog.title || "",
				slug: blog.slug || "",
				category: blog.category?._id || "",
				description: blog.description || "",
				blogDate: blog.blogDate ? blog.blogDate.split("T")[0] : "",
				status: blog.status || "draft",

				image: null,
				imageAlt: blog.imageAlt || "",

				// ✅ SEO
				seo: {
					metaTitle: blog.seo?.metaTitle || "",
					metaDescription: blog.seo?.metaDescription || "",
					keywords: blog.seo?.keywords || [],
					canonical: blog.seo?.canonical || "",
					robots: blog.seo?.robots || "index, follow",
					openGraph: {
						title: blog.seo?.openGraph?.title || "",
						description: blog.seo?.openGraph?.description || "",
						image: blog.seo?.openGraph?.image || "",
					},
					twitter: {
						title: blog.seo?.twitter?.title || "",
						description: blog.seo?.twitter?.description || "",
						image: blog.seo?.twitter?.image || "",
					},
					schema: blog.seo?.schema
						? typeof blog.seo.schema === "string"
							? blog.seo.schema
							: JSON.stringify(blog.seo.schema, null, 2)
						: "",
				},
			});

			if (blog.image) {
				setPreview(blog.image);
			}

			setManualSlug(true);
		}
	}, [blogData]);

	useEffect(() => {
		if (!manualSlug) {
			setForm((prev) => ({
				...prev,
				slug: makeSlug(prev.title),
			}));
		}
	}, [form.title, manualSlug]);

	// Validation function
	const validateForm = () => {
		const err = {};

		if (!form.title.trim()) err.title = "Title is required";

		if (!form.category) err.category = "Select category";

		const plainText = form.description.replace(/<[^>]*>/g, "").trim();

		if (!plainText) {
			err.description = "Description is required";
		}

		if (!form.blogDate) err.blogDate = "Select blog date";

		if (!form.slug.trim()) err.slug = "Slug is required";

		if (!isEdit && !form.image) err.image = "Image required";

		setErrors(err);

		return Object.keys(err).length === 0;
	};

	// Handle text input changes
	const handleChange = (e) => {
		const { name, value } = e.target;

		setForm((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === "slug") {
			setManualSlug(true);
		}

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const handleDescription = (value) => {
		setForm((prev) => ({
			...prev,
			description: value,
		}));

		if (errors.description) {
			setErrors((prev) => ({
				...prev,
				description: "",
			}));
		}
	};

	const handleImage = (e) => {
		const file = e.target.files[0];

		if (!file) return;

		if (!file.type.startsWith("image/")) {
			alert("Please select an image");
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			alert("Image size should be less than 5MB");
			return;
		}

		setForm((prev) => ({
			...prev,
			image: file,
		}));

		setPreview(URL.createObjectURL(file));

		if (errors.image) {
			setErrors((prev) => ({
				...prev,
				image: "",
			}));
		}
	};

	// ✅ Generic SEO top-level field change (metaTitle, metaDescription, canonical, robots, schema)
	const handleSeoChange = (field, value) => {
		setForm((prev) => ({
			...prev,
			seo: { ...prev.seo, [field]: value },
		}));
	};

	// ✅ Nested OG / Twitter change
	const handleSeoNestedChange = (section, field, value) => {
		setForm((prev) => ({
			...prev,
			seo: {
				...prev.seo,
				[section]: { ...prev.seo[section], [field]: value },
			},
		}));
	};

	// ✅ Keywords handlers
	const addKeyword = () => {
		if (
			tempKeyword.trim() &&
			!form.seo.keywords.includes(tempKeyword.trim())
		) {
			setForm((prev) => ({
				...prev,
				seo: {
					...prev.seo,
					keywords: [...prev.seo.keywords, tempKeyword.trim()],
				},
			}));
			setTempKeyword("");
		}
	};

	const removeKeyword = (kw) => {
		setForm((prev) => ({
			...prev,
			seo: {
				...prev.seo,
				keywords: prev.seo.keywords.filter((k) => k !== kw),
			},
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		try {
			const formData = new FormData();

			formData.append("title", form.title);
			formData.append("slug", form.slug);
			formData.append("category", form.category);
			formData.append("description", form.description);
			formData.append("blogDate", form.blogDate);
			formData.append("status", form.status);

			formData.append("imageAlt", form.imageAlt);

			// ✅ Structured SEO object as JSON string (backend parses via parseJSON + buildSeoDefaults)
			formData.append("seo", JSON.stringify(form.seo));

			if (form.image) {
				formData.append("image", form.image);
			}

			if (isEdit) {
				await updateBlog({ id, formData }).unwrap();
			} else {
				await createBlog(formData).unwrap();
			}

			setMessage({
				type: "success",
				text: isEdit
					? "Blog updated successfully."
					: "Blog created successfully.",
			});

			setTimeout(() => {
				setMessage({
					type: "",
					text: "",
				});

				navigate("/admin/blogs");
			}, 1500);
		} catch (err) {
			console.error(err);

			setMessage({
				type: "error",
				text: err?.data?.message || "Something went wrong.",
			});
		}
	};

	const handleCancel = () => {
		const ok = window.confirm("Discard your changes and go back?");

		if (ok) {
			navigate("/admin/blogs");
		}
	};

	const resetForm = () => {
		if (!window.confirm("Reset the form?")) return;

		setForm({
			title: "",
			slug: "",
			category: "",
			description: "",
			blogDate: "",
			status: "draft",

			image: null,
			imageAlt: "",

			seo: {
				metaTitle: "",
				metaDescription: "",
				keywords: [],
				canonical: "",
				robots: "index, follow",
				openGraph: { title: "", description: "", image: "" },
				twitter: { title: "", description: "", image: "" },
				schema: "",
			},
		});

		setTempKeyword("");

		// Remove image preview
		setPreview("");

		// Enable auto slug generation again
		setManualSlug(false);

		// Clear validation errors
		setErrors({});

		// Clear success/error message
		setMessage({
			type: "",
			text: "",
		});

		// Clear file input
		const fileInput = document.getElementById("blogImage");
		if (fileInput) {
			fileInput.value = "";
		}
	};

	const modules = useMemo(
		() => ({
			toolbar: [
				[{ font: [] }],
				[{ size: ["small", false, "large", "huge"] }],
				[{ header: [1, 2, 3, 4, 5, 6, false] }],

				["bold", "italic", "underline", "strike"],

				[{ color: [] }, { background: [] }],

				[{ script: "sub" }, { script: "super" }],

				[{ list: "ordered" }, { list: "bullet" }],
				[{ indent: "-1" }, { indent: "+1" }],

				[{ align: [] }],

				["blockquote", "code-block"],

				["link", "image", "video"],

				["clean"],
			],
		}),
		[],
	);

	const formats = useMemo(
		() => [
			"font",
			"size",
			"header",

			"bold",
			"italic",
			"underline",
			"strike",

			"color",
			"background",

			"script",

			"list",
			"bullet",
			"indent",

			"align",

			"blockquote",
			"code-block",

			"link",
			"image",
			"video",
		],
		[],
	);

	const cardStyle = {
		background: "rgba(255,255,255,0.03)",
		boxShadow: "0 8px 30px rgba(0,0,0,.18)",
		borderRadius: 20,
		padding: "32px 28px",
	};

	const sectionTitle = {
		color: "#fff",
		fontSize: 18,
		fontWeight: 700,
		marginBottom: 24,
	};

	const grid2 = {
		display: "grid",
		gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
		gap: 20,
	};

	const fullWidth = {
		gridColumn: "1 / -1",
	};

	const labelStyle = {
		display: "block",
		marginBottom: 8,
		color: "rgba(255,255,255,.75)",
		fontSize: 14,
		fontWeight: 600,
	};

	const inputStyle = {
		width: "100%",
		padding: "13px 16px",
		background: "rgba(255,255,255,0.04)",
		border: "1px solid rgba(255,255,255,0.1)",
		borderRadius: 10,
		color: "#fff",
		fontSize: 14,
		outline: "none",
		boxSizing: "border-box",
		transition: "all .25s ease",
	};

	const errorStyle = {
		color: "#ef4444",
		fontSize: 12,
		marginTop: 6,
	};

	if (isEdit && loadingBlog) {
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					color: "#fff",
					fontSize: 18,
				}}
			>
				Loading blog...
			</div>
		);
	}

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #0a0e1a 0%, #0f1422 100%)",
				padding: "40px 5%",
			}}
		>
			<div style={{ maxWidth: 900, margin: "0 auto" }}>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					style={{ marginBottom: 40 }}
				>
					<h1
						style={{
							fontSize: "clamp(28px, 5vw, 42px)",
							fontWeight: 800,
							background:
								"linear-gradient(135deg, #60a5fa, #a78bfa)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							marginBottom: 8,
						}}
					>
						{isEdit ? "Edit Blog" : "Create Blog"}
					</h1>

					<p
						style={{
							color: "rgba(255,255,255,0.6)",
							fontSize: 15,
						}}
					>
						{isEdit
							? "Update your blog details, content, SEO information, and publish settings."
							: "Create a new blog by adding its content, category, featured image, and SEO details."}
					</p>
				</motion.div>

				{/* Message */}
				<AnimatePresence>
					{message.text && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							style={{
								padding: "14px 18px",
								borderRadius: 10,
								marginBottom: 24,
								background:
									message.type === "success"
										? "rgba(34,197,94,0.1)"
										: "rgba(239,68,68,0.1)",
								border: `1px solid ${message.type === "success" ? "#22c55e" : "#ef4444"}`,
								color:
									message.type === "success"
										? "#22c55e"
										: "#ef4444",
								fontSize: 14,
							}}
						>
							{message.text}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Form */}
				<form
					onSubmit={handleSubmit}
					noValidate
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 32,
					}}
				>
					<div style={cardStyle}>
						<h2 style={sectionTitle}>Basic Information</h2>
						<div style={{ display: "grid", gap: 24 }}>
							{/* Title & Category */}
							<div style={grid2}>
								<div>
									<label style={labelStyle}>Blog Title *</label>

									<input
										type="text"
										name="title"
										value={form.title}
										onChange={handleChange}
										placeholder="Enter blog title"
										style={{
											...inputStyle,
											border: errors.title
												? "1px solid #ef4444"
												: inputStyle.border,
										}}
									/>

									{errors.title && (
										<p style={errorStyle}>{errors.title}</p>
									)}
								</div>

								<div>
									<label style={labelStyle}>Category *</label>

									<select
										name="category"
										value={form.category}
										onChange={handleChange}
										disabled={!categories.length}
										style={{
											...inputStyle,
											cursor: "pointer",
											border: errors.category
												? "1px solid #ef4444"
												: inputStyle.border,
										}}
									>
										<option
											value=""
											style={{
												background: "#0f1422",
												color: "#fff",
											}}
										>
											Select Category
										</option>

										{categories.map((cat) => (
											<option
												key={cat._id}
												value={cat._id}
												style={{
													background: "#0f1422",
													color: "#fff",
												}}
											>
												{cat.name}
											</option>
										))}
									</select>

									{errors.category && (
										<p style={errorStyle}>
											{errors.category}
										</p>
									)}
								</div>
							</div>

							{/* Slug & Status */}
							<div style={grid2}>
								<div>
									<label style={labelStyle}>Blog Date *</label>

									<input
										type="date"
										name="blogDate"
										value={form.blogDate}
										onChange={handleChange}
										style={{
											...inputStyle,
											border: errors.blogDate
												? "1px solid #ef4444"
												: inputStyle.border,
										}}
									/>

									{errors.blogDate && (
										<p style={errorStyle}>
											{errors.blogDate}
										</p>
									)}
								</div>

								<div>
									<label style={labelStyle}>Status</label>

									<select
										name="status"
										value={form.status}
										onChange={handleChange}
										style={{
											...inputStyle,
											cursor: "pointer",
										}}
									>
										<option
											value="draft"
											style={{ background: "#0f1422", color: "#fff" }}
										>
											Draft
										</option>

										<option
											value="published"
											style={{ background: "#0f1422", color: "#fff" }}
										>
											Published
										</option>
									</select>
								</div>
							</div>

							{/* Description */}

							<div style={fullWidth}>
								<label style={labelStyle}>Description *</label>

								<div
									className="editor-wrapper"
									style={{
										border: errors.description
											? "1px solid #ef4444"
											: "1px solid rgba(255,255,255,.1)",
										borderRadius: 12,
										overflow: "hidden",
										marginTop: 8,
										background: "rgba(255,255,255,.02)",
									}}
								>
									<ReactQuill
										theme="snow"
										value={form.description}
										onChange={handleDescription}
										modules={modules}
										formats={formats}
										placeholder="Write your blog content..."
										style={{ height: 320, marginBottom: 45 }}
									/>
								</div>

								{errors.description && (
									<p style={errorStyle}>
										{errors.description}
									</p>
								)}
							</div>
						</div>

						{/* ================= Featured Image ================= */}
						<div
							style={{
								marginTop: 32,
								paddingTop: 32,
								borderTop: "1px solid rgba(255,255,255,.1)",
							}}
						>
							<h2 style={sectionTitle}>Featured Image</h2>

							<div
								style={{
									border: `2px dashed ${errors.image
											? "#ef4444"
											: "rgba(255,255,255,.15)"
										}`,
									borderRadius: 12,
									padding: 36,
									textAlign: "center",
									background: "rgba(255,255,255,.02)",
									marginTop: 20,
								}}
							>
								{preview ? (
									<>
										<img
											src={preview}
											alt="Preview"
											style={{
												width: "100%",
												maxHeight: 280,
												objectFit: "cover",
												borderRadius: 10,
												marginBottom: 15,
											}}
										/>

										<button
											type="button"
											onClick={() => {
												setPreview("");
												setForm((prev) => ({
													...prev,
													image: null,
												}));
											}}
											style={{
												marginTop: 15,
												padding: "10px 18px",
												border: "none",
												borderRadius: 8,
												background: "#ef4444",
												color: "#fff",
												fontWeight: 600,
												cursor: "pointer",
											}}
										>
											Remove Image
										</button>
									</>
								) : (
									<>
										<input
											id="blogImage"
											hidden
											type="file"
											accept="image/*"
											onChange={handleImage}
										/>

										<label
											htmlFor="blogImage"
											style={{
												display: "inline-flex",
												alignItems: "center",
												justifyContent: "center",
												padding: "12px 26px",
												borderRadius: 10,
												cursor: "pointer",
												background:
													"linear-gradient(135deg,#60a5fa,#a78bfa)",
												color: "#fff",
												fontWeight: 600,
												fontSize: 14,
												marginBottom: 12,
											}}
										>
											Choose Image
										</label>

										<p
											style={{
												color: "rgba(255,255,255,.5)",
												marginTop: 12,
											}}
										>
											PNG, JPG, WEBP (Max 5MB)
										</p>
									</>
								)}
							</div>

							{errors.image && (
								<p style={errorStyle}>{errors.image}</p>
							)}
						</div>

						{/* ================= SEO Information ================= */}
						<div
							style={{
								marginTop: 32,
								paddingTop: 32,
								borderTop: "1px solid rgba(255,255,255,.1)",
							}}
						>
							<h2 style={sectionTitle}>SEO Information</h2>
							<p
								style={{
									color: "rgba(255,255,255,.45)",
									fontSize: 13,
									marginTop: -16,
									marginBottom: 24,
								}}
							>
								Sab fields optional hain — khali chodne par
								title/description se auto-fill ho jayega.
							</p>

							<div style={{ display: "grid", gap: 24 }}>
								{/* Slug & Image Alt */}
								<div style={grid2}>
									<div>
										<label style={labelStyle}>Slug *</label>

										<input
											type="text"
											name="slug"
											value={form.slug}
											onChange={handleChange}
											placeholder="blog-slug"
											style={{
												...inputStyle,
												border: errors.slug
													? "1px solid #ef4444"
													: inputStyle.border,
											}}
										/>

										{errors.slug && (
											<p style={errorStyle}>
												{errors.slug}
											</p>
										)}
									</div>

									<div>
										<label style={labelStyle}>
											Image Alt Text
										</label>

										<input
											type="text"
											name="imageAlt"
											value={form.imageAlt}
											onChange={handleChange}
											placeholder="Describe the featured image"
											style={inputStyle}
										/>
									</div>
								</div>

								{/* Meta Title */}
								<div>
									<label style={labelStyle}>Meta Title</label>

									<input
										type="text"
										value={form.seo.metaTitle}
										onChange={(e) =>
											handleSeoChange(
												"metaTitle",
												e.target.value,
											)
										}
										placeholder="SEO title"
										maxLength={60}
										style={inputStyle}
									/>
								</div>

								{/* Meta Description */}
								<div>
									<label style={labelStyle}>
										Meta Description
									</label>

									<textarea
										rows={4}
										value={form.seo.metaDescription}
										onChange={(e) =>
											handleSeoChange(
												"metaDescription",
												e.target.value,
											)
										}
										placeholder="SEO description"
										maxLength={160}
										style={{
											...inputStyle,
											resize: "vertical",
											minHeight: 120,
											fontFamily: "inherit",
										}}
									/>
								</div>

								{/* Keywords */}
								<div>
									<label style={labelStyle}>Keywords</label>

									<div style={{ display: "flex", gap: 8 }}>
										<input
											type="text"
											value={tempKeyword}
											onChange={(e) =>
												setTempKeyword(e.target.value)
											}
											onKeyPress={(e) =>
												e.key === "Enter" &&
												(e.preventDefault(), addKeyword())
											}
											placeholder="e.g., travel, goa, beaches"
											style={inputStyle}
										/>

										<button
											type="button"
											onClick={addKeyword}
											style={{
												padding: "0 20px",
												background:
													"rgba(96,165,250,0.2)",
												border: "1px solid #60a5fa",
												borderRadius: 8,
												color: "#60a5fa",
												cursor: "pointer",
												whiteSpace: "nowrap",
											}}
										>
											Add
										</button>
									</div>

									<div
										style={{
											display: "flex",
											flexWrap: "wrap",
											gap: 8,
											marginTop: 12,
										}}
									>
										{form.seo.keywords.map((kw) => (
											<span
												key={kw}
												style={{
													padding: "6px 12px",
													background:
														"rgba(96,165,250,0.15)",
													border:
														"1px solid rgba(96,165,250,0.3)",
													borderRadius: 6,
													color: "#60a5fa",
													fontSize: 13,
													display: "flex",
													alignItems: "center",
													gap: 8,
												}}
											>
												{kw}
												<button
													type="button"
													onClick={() =>
														removeKeyword(kw)
													}
													style={{
														background: "none",
														border: "none",
														color: "#ef4444",
														cursor: "pointer",
														fontSize: 16,
														lineHeight: 1,
													}}
												>
													×
												</button>
											</span>
										))}
									</div>

									<p
										style={{
											color: "rgba(255,255,255,.45)",
											fontSize: 12,
											marginTop: 8,
										}}
									>
										Press Enter or click Add to add a
										keyword.
									</p>
								</div>

								{/* Canonical URL */}
								<div>
									<label style={labelStyle}>
										Canonical URL
									</label>

									<input
										type="text"
										value={form.seo.canonical}
										onChange={(e) =>
											handleSeoChange(
												"canonical",
												e.target.value,
											)
										}
										placeholder="https://yoursite.com/blog/your-slug (auto-generated if empty)"
										style={inputStyle}
									/>
								</div>

								{/* Robots */}
								<div>
									<label style={labelStyle}>Robots</label>

									<select
										value={form.seo.robots}
										onChange={(e) =>
											handleSeoChange(
												"robots",
												e.target.value,
											)
										}
										style={{
											...inputStyle,
											cursor: "pointer",
										}}
									>
										<option
											value="index, follow"
											style={{
												background: "#0f1422",
												color: "#fff",
											}}
										>
											index, follow
										</option>
										<option
											value="noindex, follow"
											style={{
												background: "#0f1422",
												color: "#fff",
											}}
										>
											noindex, follow
										</option>
										<option
											value="index, nofollow"
											style={{
												background: "#0f1422",
												color: "#fff",
											}}
										>
											index, nofollow
										</option>
										<option
											value="noindex, nofollow"
											style={{
												background: "#0f1422",
												color: "#fff",
											}}
										>
											noindex, nofollow
										</option>
									</select>
								</div>

								<hr
									style={{
										border: "none",
										borderTop:
											"1px solid rgba(255,255,255,0.1)",
										margin: "8px 0",
									}}
								/>

								{/* Open Graph */}
								<h3
									style={{
										color: "#60a5fa",
										fontSize: 15,
										fontWeight: 600,
										margin: 0,
									}}
								>
									Open Graph (Facebook/LinkedIn)
								</h3>

								<div>
									<label style={labelStyle}>OG Title</label>
									<input
										type="text"
										value={form.seo.openGraph.title}
										onChange={(e) =>
											handleSeoNestedChange(
												"openGraph",
												"title",
												e.target.value,
											)
										}
										style={inputStyle}
									/>
								</div>

								<div>
									<label style={labelStyle}>
										OG Description
									</label>
									<textarea
										rows={2}
										value={form.seo.openGraph.description}
										onChange={(e) =>
											handleSeoNestedChange(
												"openGraph",
												"description",
												e.target.value,
											)
										}
										style={{
											...inputStyle,
											resize: "vertical",
											fontFamily: "inherit",
										}}
									/>
								</div>

								<div>
									<label style={labelStyle}>
										OG Image URL
									</label>
									<input
										type="text"
										value={form.seo.openGraph.image}
										onChange={(e) =>
											handleSeoNestedChange(
												"openGraph",
												"image",
												e.target.value,
											)
										}
										placeholder="Leave empty to use featured image"
										style={inputStyle}
									/>
								</div>

								<hr
									style={{
										border: "none",
										borderTop:
											"1px solid rgba(255,255,255,0.1)",
										margin: "8px 0",
									}}
								/>

								{/* Twitter */}
								<h3
									style={{
										color: "#60a5fa",
										fontSize: 15,
										fontWeight: 600,
										margin: 0,
									}}
								>
									Twitter Card
								</h3>

								<div>
									<label style={labelStyle}>
										Twitter Title
									</label>
									<input
										type="text"
										value={form.seo.twitter.title}
										onChange={(e) =>
											handleSeoNestedChange(
												"twitter",
												"title",
												e.target.value,
											)
										}
										style={inputStyle}
									/>
								</div>

								<div>
									<label style={labelStyle}>
										Twitter Description
									</label>
									<textarea
										rows={2}
										value={form.seo.twitter.description}
										onChange={(e) =>
											handleSeoNestedChange(
												"twitter",
												"description",
												e.target.value,
											)
										}
										style={{
											...inputStyle,
											resize: "vertical",
											fontFamily: "inherit",
										}}
									/>
								</div>

								<div>
									<label style={labelStyle}>
										Twitter Image URL
									</label>
									<input
										type="text"
										value={form.seo.twitter.image}
										onChange={(e) =>
											handleSeoNestedChange(
												"twitter",
												"image",
												e.target.value,
											)
										}
										placeholder="Leave empty to use featured image"
										style={inputStyle}
									/>
								</div>

								<hr
									style={{
										border: "none",
										borderTop:
											"1px solid rgba(255,255,255,0.1)",
										margin: "8px 0",
									}}
								/>

								{/* Schema JSON-LD */}
								<div>
									<label style={labelStyle}>
										Schema (JSON-LD) — optional, advanced
									</label>
									<textarea
										rows={6}
										value={form.seo.schema}
										onChange={(e) =>
											handleSeoChange(
												"schema",
												e.target.value,
											)
										}
										placeholder='{ "@context": "https://schema.org", "@type": "BlogPosting", ... }'
										style={{
											...inputStyle,
											fontSize: 13,
											fontFamily: "monospace",
											resize: "vertical",
										}}
									/>
								</div>
							</div>
						</div>

						{/* Form Actions */}
						<div
							style={{
								display: "flex",
								gap: 16,
								justifyContent: "flex-end",
								marginTop: 32,
								paddingTop: 24,
								borderTop: "1px solid rgba(255,255,255,0.1)",
							}}
						>
							{isEdit ? (
								<button
									type="button"
									onClick={handleCancel}
									disabled={isSubmitting}
									style={{
										padding: "12px 28px",
										background: "rgba(255,255,255,0.05)",
										border: "1px solid rgba(255,255,255,0.1)",
										borderRadius: 10,
										color: "rgba(255,255,255,0.7)",
										fontSize: 14,
										fontWeight: 500,
										cursor: isSubmitting
											? "not-allowed"
											: "pointer",
										opacity: isSubmitting ? 0.5 : 1,
										transition: "all 0.2s",
									}}
								>
									Cancel
								</button>
							) : (
								<button
									type="button"
									onClick={resetForm}
									disabled={isSubmitting}
									style={{
										padding: "12px 28px",
										background: "rgba(255,255,255,0.05)",
										border: "1px solid rgba(255,255,255,0.1)",
										borderRadius: 10,
										color: "rgba(255,255,255,0.7)",
										fontSize: 14,
										fontWeight: 500,
										cursor: isSubmitting
											? "not-allowed"
											: "pointer",
										opacity: isSubmitting ? 0.5 : 1,
										transition: "all 0.2s",
									}}
								>
									Reset Form
								</button>
							)}
							<button
								type="submit"
								disabled={isSubmitting}
								style={{
									padding: "12px 32px",
									background:
										"linear-gradient(135deg, #60a5fa, #a78bfa)",
									border: "none",
									borderRadius: 10,
									color: "#fff",
									fontSize: 14,
									fontWeight: 600,
									cursor: isSubmitting
										? "not-allowed"
										: "pointer",
									opacity: isSubmitting ? 0.7 : 1,
									transition: "all 0.2s",
									position: "relative",
								}}
							>
								{isSubmitting ? (
									<>
										<span style={{ opacity: 0.7 }}>
											{isEdit
												? "Updating..."
												: "Creating..."}
										</span>
										<span
											style={{
												position: "absolute",
												left: "50%",
												top: "50%",
												transform:
													"translate(-50%, -50%)",
											}}
										>
											⏳
										</span>
									</>
								) : isEdit ? (
									"Update Blog"
								) : (
									"Create Blog"
								)}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default BlogForm;