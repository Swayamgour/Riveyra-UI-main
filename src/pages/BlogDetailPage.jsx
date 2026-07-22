import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGetBlogBySlugQuery, useGetPublishedBlogsQuery } from "../redux/api";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { useEffect } from "react";
import "../styles/Blog.css";
import SEO from "../components/SEO";

function BlogDetail() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { isMobile } = useBreakpoint();

	const { data, isLoading, isError } = useGetBlogBySlugQuery(slug);

	const blog = data?.blog || data;

	// console.log(blog?.seo)
	let seo = blog?.seo

	const { data: blogsData } = useGetPublishedBlogsQuery();

	const recentBlogs =
		blogsData?.data?.filter((item) => item.slug !== slug).slice(0, 5) || [];

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}, [slug]);

	if (isLoading) {
		return (
			<div
				style={{
					minHeight: "100vh",
					background: "var(--bg)",
					color: "var(--text)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: 18,
				}}
			>
				Loading blog...
			</div>
		);
	}

	if (isError || !blog) {
		return (
			<div
				style={{
					minHeight: "100vh",
					background: "var(--bg)",
					color: "var(--text)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				Blog not found
			</div>
		);
	}

	return (
		<>

			{!isLoading &&
				(<SEO
					title={seo?.metaTitle}
					description={seo?.metaDescription}
					keywords={seo?.keywords}
					canonical={seo?.canonical}
					robots={seo?.robots}

					openGraph={seo?.openGraph}
					twitter={seo?.twitter}

					schema={seo?.schema}
				/>)
			}

			<div
				style={{
					minHeight: "100vh",
					background: "var(--bg)",
					color: "var(--text)",
					padding: "80px 20px",
				}}
			>
				<div
					style={{
						maxWidth: 1200,
						margin: "auto",
						display: "grid",
						gridTemplateColumns: isMobile ? "1fr" : "1fr 330px",
						gap: 40,
					}}
				>
					{/* ================= BLOG CONTENT ================= */}
					<motion.div
						initial={{
							opacity: 0,
							y: 40,
						}}
						animate={{
							opacity: 1,
							y: 0,
						}}
						transition={{
							duration: 0.7,
						}}
					>
						{/* Back */}
						<Link
							to="/blogs"
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 8,
								fontSize: 13,
								fontWeight: 600,
								color: "var(--accent)",
								transition: "all .3s ease",
							}}
						>
							← Back to Blogs
						</Link>

						{/* Image */}
						<div
							style={{
								marginTop: 30,
								height: isMobile ? 260 : 450,
								borderRadius: 24,
								overflow: "hidden",
								border: "1px solid rgba(255,255,255,.1)",
							}}
						>
							<img
								src={blog.image}
								alt={blog.imageAlt || blog.title}
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
								}}
							/>
						</div>

						{/* Category + Date */}

						<div
							style={{
								display: "flex",
								gap: 15,
								marginTop: 25,
								alignItems: "center",
							}}
						>
							<span
								style={{
									padding: "6px 14px",
									borderRadius: 20,
									background: "rgba(96,165,250,.08)",
									border: "1px solid var(--border-hover)",
									color: "var(--accent)",
									fontSize: 12,
								}}
							>
								{blog.category?.name}
							</span>

							<span
								style={{
									color: "rgba(255,255,255,.5)",
									fontSize: 13,
								}}
							>
								{new Date(blog.blogDate).toLocaleDateString(
									"en-GB",
									{
										day: "2-digit",
										month: "short",
										year: "numeric",
									},
								)}
							</span>
						</div>

						{/* Title */}

						<h1
							style={{
								marginTop: 25,
								fontSize: "clamp(32px,5vw,52px)",
								lineHeight: 1.15,
								fontFamily: "var(--font-display)",
								fontWeight: 700,
								letterSpacing: "-0.03em",
								color: "var(--text)",
							}}
						>
							{blog.title}
						</h1>

						{/* Content */}

						<div
							style={{
								marginTop: 35,
								color: "var(--text-sub)",
								fontFamily: "var(--font-body)",
								fontSize: 17,
								lineHeight: 1.9,
							}}
							// backend description contains HTML from React Quill
							dangerouslySetInnerHTML={{
								__html: blog.description,
							}}
						/>
					</motion.div>

					{/* ================= RECENT BLOG SIDEBAR ================= */}

					<div
						style={{
							position: "sticky",
							top: 130,
							height: "fit-content",
							background: "var(--card)",
							border: "1px solid var(--border)",
							borderRadius: 22,
							backdropFilter: "blur(10px)",
							padding: 15,
						}}
					>
						<h3
							style={{
								fontSize: 22,
								fontWeight: 800,
								marginBottom: 10,
							}}
						>
							Recent Blogs
						</h3>

						{recentBlogs.map((item, index) => (
							<div
								key={item._id}
								onClick={() => {
									navigate(`/blogs/${item.slug}`);
								}}
								className="recent-blog-item"
								style={{
									display: "flex",
									gap: 12,
									borderBottom:
										index !== recentBlogs.length - 1
											? "1px solid rgba(255,255,255,.08)"
											: "none",
								}}
							>
								<img
									src={item.image}
									alt={item.imageAlt}
									loading="lazy"
									style={{
										width: 75,
										height: 65,
										borderRadius: 12,
										objectFit: "cover",
										border: "1px solid var(--border)",
									}}
								/>

								<div>
									<h4
										className="recent-blog-title"
										style={{
											fontFamily: "var(--font-body)",
											fontSize: 15,
											fontWeight: 600,
											lineHeight: 1.45,
											color: "var(--text)",
											transition: "color .3s ease",
											margin: 0,
										}}
									>
										{/* {item.title.length > 45
											? item.title.slice(0, 45) + "..."
											: item.title} */}

										{item.title}
									</h4>

									<div
										style={{
											display: "flex",
											flexDirection: "column",
											justifyContent: "space-between",
											flex: 1,
										}}
									>
										<p
											style={{
												marginTop: 8,
												fontSize: 11,
												color: "var(--muted)",
												lineHeight: 1.4,
											}}
										>
											{new Date(
												item.blogDate,
											).toLocaleDateString("en-GB", {
												day: "2-digit",
												month: "short",
												year: "numeric",
											})}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export default BlogDetail;
