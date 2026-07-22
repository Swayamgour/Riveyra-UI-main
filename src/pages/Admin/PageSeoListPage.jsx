// src/pages/admin/PageSeoListPage.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
	useGetAllPageSeoQuery,
	useDeletePageSeoMutation,
} from "../../redux/api";

// Static config for the 6 known pages (order + display labels/icons)
const PAGE_CONFIG = [
	{ page: "home", label: "Home", icon: "🏠", path: "/" },
	{ page: "about", label: "About", icon: "ℹ️", path: "/about" },
	{ page: "contact", label: "Contact", icon: "✉️", path: "/contact" },
	{ page: "career", label: "Career (Listing)", icon: "💼", path: "/career" },
	{
		page: "portfolio",
		label: "Portfolio (Listing)",
		icon: "🗂️",
		path: "/portfolio",
	},
	{ page: "blogs", label: "Blogs (Listing)", icon: "📰", path: "/blogs" },
];

const PageSeoListPage = () => {
	const navigate = useNavigate();
	const { data, isLoading, isError, refetch } = useGetAllPageSeoQuery();
	const [deletePageSeo] = useDeletePageSeoMutation();

	const [message, setMessage] = useState({ type: "", text: "" });
	const [resettingPage, setResettingPage] = useState(null);

	const configuredList = data?.data || [];

	// Merge static page config with whatever is actually saved in DB
	const rows = PAGE_CONFIG.map((cfg) => {
		const saved = configuredList.find((p) => p.page === cfg.page);
		return {
			...cfg,
			configured: Boolean(saved),
			metaTitle: saved?.seo?.metaTitle || "",
			metaDescription: saved?.seo?.metaDescription || "",
			updatedAt: saved?.updatedAt || null,
		};
	});

	const handleReset = async (page, label) => {
		const ok = window.confirm(
			`Reset SEO for "${label}" back to auto-generated defaults?`,
		);
		if (!ok) return;

		try {
			setResettingPage(page);
			await deletePageSeo(page).unwrap();
			setMessage({
				type: "success",
				text: `${label} SEO reset to defaults.`,
			});
			refetch();
		} catch (err) {
			setMessage({
				type: "error",
				text: err?.data?.message || "Failed to reset SEO.",
			});
		} finally {
			setResettingPage(null);
			setTimeout(() => setMessage({ type: "", text: "" }), 2500);
		}
	};

	const cardStyle = {
		background: "rgba(255,255,255,0.03)",
		border: "1px solid rgba(255,255,255,0.08)",
		borderRadius: 16,
		padding: "22px 22px",
		display: "flex",
		flexDirection: "column",
		gap: 12,
		position: "relative",
		overflow: "hidden",
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #0a0e1a 0%, #0f1422 100%)",
				padding: "40px 5%",
			}}
		>
			<div style={{ maxWidth: 1200, margin: "0 auto" }}>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					style={{
						marginBottom: 40,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-end",
						flexWrap: "wrap",
						gap: 16,
					}}
				>
					<div>
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
							Page SEO
						</h1>
						<p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}>
							Manage meta tags, Open Graph, and Twitter cards for
							your static pages.
						</p>
					</div>
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
								border: `1px solid ${
									message.type === "success"
										? "#22c55e"
										: "#ef4444"
								}`,
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

				{/* Loading */}
				{isLoading && (
					<div
						style={{
							textAlign: "center",
							padding: 60,
							color: "rgba(255,255,255,0.5)",
						}}
					>
						Loading pages...
					</div>
				)}

				{/* Error */}
				{isError && (
					<div
						style={{
							padding: "14px 18px",
							borderRadius: 10,
							background: "rgba(239,68,68,0.1)",
							border: "1px solid #ef4444",
							color: "#ef4444",
							fontSize: 14,
							marginBottom: 24,
						}}
					>
						Failed to load page SEO data.
					</div>
				)}

				{/* Grid */}
				{!isLoading && !isError && (
					<div
						style={{
							display: "grid",
							gridTemplateColumns:
								"repeat(auto-fill, minmax(300px, 1fr))",
							gap: 20,
						}}
					>
						{rows.map((row) => (
							<motion.div
								key={row.page}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								style={cardStyle}
							>
								{/* Status accent bar */}
								<div
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										right: 0,
										height: 3,
										background: row.configured
											? "linear-gradient(90deg, #22c55e, transparent)"
											: "linear-gradient(90deg, #f59e0b, transparent)",
									}}
								/>

								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "flex-start",
									}}
								>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: 10,
										}}
									>
										<span style={{ fontSize: 24 }}>
											{row.icon}
										</span>
										<div>
											<h3
												style={{
													color: "#fff",
													fontSize: 16,
													fontWeight: 700,
													marginBottom: 2,
												}}
											>
												{row.label}
											</h3>
											<span
												style={{
													fontSize: 11,
													color: "rgba(255,255,255,0.4)",
													fontFamily:
														"var(--font-mono, monospace)",
												}}
											>
												{row.path}
											</span>
										</div>
									</div>

									<span
										style={{
											fontSize: 10,
											padding: "4px 10px",
											borderRadius: 20,
											fontWeight: 600,
											letterSpacing: 0.5,
											textTransform: "uppercase",
											background: row.configured
												? "rgba(34,197,94,0.12)"
												: "rgba(245,158,11,0.12)",
											color: row.configured
												? "#22c55e"
												: "#f59e0b",
											border: `1px solid ${
												row.configured
													? "rgba(34,197,94,0.3)"
													: "rgba(245,158,11,0.3)"
											}`,
											whiteSpace: "nowrap",
										}}
									>
										{row.configured ? "Configured" : "Default"}
									</span>
								</div>

								<div
									style={{
										minHeight: 60,
										paddingTop: 4,
									}}
								>
									<p
										style={{
											color: "rgba(255,255,255,0.75)",
											fontSize: 13,
											fontWeight: 600,
											marginBottom: 4,
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
										}}
									>
										{row.metaTitle || "No meta title set"}
									</p>
									<p
										style={{
											color: "rgba(255,255,255,0.45)",
											fontSize: 12,
											lineHeight: 1.5,
											display: "-webkit-box",
											WebkitLineClamp: 2,
											WebkitBoxOrient: "vertical",
											overflow: "hidden",
										}}
									>
										{row.metaDescription ||
											"No meta description set — auto-generated defaults will be used on the live page."}
									</p>
								</div>

								<div
									style={{
										display: "flex",
										gap: 8,
										marginTop: 8,
										paddingTop: 12,
										borderTop:
											"1px solid rgba(255,255,255,0.06)",
									}}
								>
									<button
										onClick={() =>
											navigate(`/admin/page-seo/${row.page}/edit`)
										}
										style={{
											flex: 1,
											padding: "9px 14px",
											background: "rgba(96,165,250,0.12)",
											border: "1px solid rgba(96,165,250,0.3)",
											borderRadius: 8,
											color: "#60a5fa",
											fontSize: 13,
											fontWeight: 600,
											cursor: "pointer",
										}}
									>
										Edit SEO
									</button>

									<button
										onClick={() =>
											handleReset(row.page, row.label)
										}
										disabled={
											!row.configured ||
											resettingPage === row.page
										}
										style={{
											padding: "9px 14px",
											background: "rgba(248,113,113,0.1)",
											border: "1px solid rgba(248,113,113,0.3)",
											borderRadius: 8,
											color: "#f87171",
											fontSize: 13,
											fontWeight: 600,
											cursor:
												!row.configured ||
												resettingPage === row.page
													? "not-allowed"
													: "pointer",
											opacity:
												!row.configured ||
												resettingPage === row.page
													? 0.4
													: 1,
										}}
									>
										{resettingPage === row.page
											? "Resetting..."
											: "Reset"}
									</button>
								</div>
							</motion.div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default PageSeoListPage;