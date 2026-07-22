// src/components/legal/LegalPageLayout.jsx
// Shared wrapper for all legal pages (Privacy Policy, Terms of Service,
// Cookie Policy, Disclaimer) so styling stays consistent and each page
// only has to pass in its title + sections.

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LegalPageLayout = ({ title, badge = "Legal", lastUpdated, sections = [] }) => {
	const [activeId, setActiveId] = useState(sections[0]?.id || "");

	// Highlight the active TOC item based on scroll position
	useEffect(() => {
		const handleScroll = () => {
			let current = sections[0]?.id;
			for (const s of sections) {
				const el = document.getElementById(s.id);
				if (el && el.getBoundingClientRect().top <= 140) {
					current = s.id;
				}
			}
			setActiveId(current);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, [sections]);

	const scrollToSection = (id) => {
		const el = document.getElementById(id);
		if (el) {
			window.scrollTo({
				top: el.offsetTop - 100,
				behavior: "smooth",
			});
		}
	};

	return (
		<div style={{ background: "var(--bg)", minHeight: "100vh" }}>
			{/* Hero */}
			<section
				style={{
					padding: "80px 8% 56px",
					borderBottom: "1px solid rgba(255,255,255,0.07)",
				}}
			>
				<div style={{ maxWidth: 1000, margin: "0 auto" }}>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
					>
						<span
							style={{
								fontSize: 11,
								letterSpacing: 3,
								color: "#60a5fa",
								textTransform: "uppercase",
								display: "inline-block",
								marginBottom: 16,
								fontFamily: "var(--font-mono)",
							}}
						>
							{badge}
						</span>

						<h1
							style={{
								fontSize: "clamp(32px, 5vw, 52px)",
								fontFamily: "var(--font-display)",
								fontWeight: 700,
								color: "#fff",
								lineHeight: 1.15,
								marginBottom: 16,
							}}
						>
							{title}
						</h1>

						{lastUpdated && (
							<p
								style={{
									color: "rgba(255,255,255,0.5)",
									fontSize: 14,
									fontFamily: "var(--font-mono)",
								}}
							>
								Last updated: {lastUpdated}
							</p>
						)}
					</motion.div>
				</div>
			</section>

			{/* Body */}
			<section style={{ padding: "56px 8% 100px" }}>
				<div
					style={{
						maxWidth: 1000,
						margin: "0 auto",
						display: "grid",
						gridTemplateColumns: "220px 1fr",
						gap: 56,
						alignItems: "start",
					}}
					className="legal-layout-grid"
				>
					{/* Table of contents */}
					<motion.nav
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						style={{
							position: "sticky",
							top: 100,
							display: "flex",
							flexDirection: "column",
							gap: 4,
						}}
					>
						<span
							style={{
								fontSize: 11,
								letterSpacing: 1.5,
								color: "rgba(255,255,255,0.4)",
								textTransform: "uppercase",
								marginBottom: 8,
								fontFamily: "var(--font-mono)",
							}}
						>
							On this page
						</span>

						{sections.map((s) => (
							<button
								key={s.id}
								onClick={() => scrollToSection(s.id)}
								style={{
									textAlign: "left",
									background: "none",
									border: "none",
									padding: "7px 10px",
									borderRadius: 8,
									cursor: "pointer",
									fontSize: 13,
									lineHeight: 1.4,
									color:
										activeId === s.id
											? "#60a5fa"
											: "rgba(255,255,255,0.55)",
									background:
										activeId === s.id
											? "rgba(96,165,250,0.08)"
											: "transparent",
									fontWeight: activeId === s.id ? 600 : 400,
									transition: "all 0.2s",
								}}
							>
								{s.heading}
							</button>
						))}
					</motion.nav>

					{/* Sections */}
					<div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
						{sections.map((s, i) => (
							<motion.div
								key={s.id}
								id={s.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-60px" }}
								transition={{ delay: i * 0.03, duration: 0.5 }}
								style={{ scrollMarginTop: 100 }}
							>
								<h2
									style={{
										fontSize: 20,
										fontFamily: "var(--font-display)",
										fontWeight: 700,
										color: "#fff",
										marginBottom: 14,
									}}
								>
									{s.heading}
								</h2>

								<div
									style={{
										fontSize: 14.5,
										lineHeight: 1.85,
										color: "rgba(255,255,255,0.65)",
										fontFamily: "var(--font-body)",
										display: "flex",
										flexDirection: "column",
										gap: 14,
									}}
								>
									{s.content}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			<style>{`
				@media (max-width: 860px) {
					.legal-layout-grid {
						grid-template-columns: 1fr !important;
					}
					.legal-layout-grid nav {
						position: relative !important;
						top: 0 !important;
						flex-direction: row !important;
						flex-wrap: wrap !important;
						margin-bottom: 8px;
					}
				}
			`}</style>
		</div>
	);
};

export default LegalPageLayout;
