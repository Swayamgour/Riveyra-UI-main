import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { useGetPublishedBlogsQuery } from "../redux/api";

import BlogCard from "../components/ui/BlogCard";

// const STATS = [
// 	{
// 		val: "50+",
// 		label: "Articles",
// 		color: "var(--accent)",
// 	},
// 	{
// 		val: "10+",
// 		label: "Categories",
// 		color: "#34d399",
// 	},
// 	{
// 		val: "100K+",
// 		label: "Readers",
// 		color: "#c084fc",
// 	},
// 	{
// 		val: "Weekly",
// 		label: "Updates",
// 		color: "#fbbf24",
// 	},
// ];

// function StatStrip({ isMobile }) {
// 	return (
// 		<div
// 			style={{
// 				background: "rgba(255,255,255,.018)",
// 				borderTop: "1px solid rgba(96,165,250,.07)",
// 				borderBottom: "1px solid rgba(96,165,250,.07)",
// 			}}
// 		>
// 			<div
// 				style={{
// 					maxWidth: 1200,

// 					margin: "0 auto",

// 					padding: isMobile ? "36px 5%" : "48px 7%",

// 					display: "grid",

// 					gridTemplateColumns: isMobile
// 						? "repeat(2,1fr)"
// 						: "repeat(4,1fr)",

// 					gap: isMobile ? "25px 10px" : 0,
// 				}}
// 			>
// 				{STATS.map((item, index) => (
// 					<motion.div
// 						key={index}
// 						initial={{
// 							opacity: 0,
// 							y: 20,
// 						}}
// 						whileInView={{
// 							opacity: 1,
// 							y: 0,
// 						}}
// 						viewport={{
// 							once: true,
// 						}}
// 						transition={{
// 							delay: index * 0.08,
// 						}}
// 						style={{
// 							textAlign: "center",

// 							borderRight:
// 								!isMobile && index < 3
// 									? "1px solid rgba(255,255,255,.05)"
// 									: "none",
// 						}}
// 					>
// 						<div
// 							style={{
// 								fontSize: isMobile ? 34 : 48,

// 								fontFamily: "var(--font-display)",

// 								fontWeight: 800,

// 								color: item.color,

// 								textShadow: `0 0 30px ${item.color}55`,
// 							}}
// 						>
// 							{item.val}
// 						</div>

// 						<div
// 							style={{
// 								marginTop: 8,

// 								fontSize: 10,

// 								letterSpacing: 2.5,

// 								fontFamily: "var(--font-mono)",

// 								color: "rgba(255,255,255,.4)",
// 							}}
// 						>
// 							{item.label}
// 						</div>
// 					</motion.div>
// 				))}
// 			</div>
// 		</div>
// 	);
// }

function BlogPill({ active, label, onClick }) {
	return (
		<button
			onClick={onClick}
			style={{
				padding: "8px 18px",

				borderRadius: 100,

				fontSize: 11,

				fontFamily: "var(--font-mono)",

				fontWeight: 600,

				cursor: "pointer",

				border: active
					? "1px solid var(--border-hover)"
					: "1px solid var(--border)",

				background: active
					? "rgba(96,165,250,.08)"
					: "transparent",

				color: active
					? "var(--accent)"
					: "var(--muted)",
			}}
		>
			{label}
		</button>
	);
}

export default function BlogsPage() {
	const { isMobile, isTablet } = useBreakpoint();

	const [activeCategory, setActiveCategory] = useState("All");

	const heroRef = useRef(null);

	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ["start start", "end start"],
	});

	const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

	const { data, isLoading } = useGetPublishedBlogsQuery();

	const blogs = data?.data || [];
	
	const categories = [
    "All",
    ...new Set(
        blogs
            .map((b) => b.category?.name)
            .filter(Boolean)
    ),
];

	const filtered =
		activeCategory === "All"
			? blogs
			: blogs.filter((b) => b.category?.name === activeCategory);

	const px = isMobile ? "5%" : isTablet ? "6%" : "7%";

	return (
		<div
			style={{
				background: "var(--bg)",
				minHeight: "100vh",
				overflowX: "hidden",
			}}
		>
			{/* HERO */}

			<section
				ref={heroRef}
				style={{
					position: "relative",
					overflow: "hidden",
					minHeight: isMobile ? "unset" : "72vh",
					display: "flex",
					alignItems: "center",
					padding: isMobile ? "110px 5% 60px" : `130px ${px} 80px`,
				}}
			>
				<motion.div
					style={{
						opacity: heroOpacity,
						position: "relative",
						zIndex: 2,
						maxWidth: 800,
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
							marginBottom: 24,
						}}
					>
						<div
							style={{
								width: 30,
								height: 1,
								background: "var(--accent)",
							}}
						/>

						<span
							style={{
								fontSize: 10,
								letterSpacing: 4,
								color: "var(--accent)",
								fontFamily: "var(--font-mono)",
							}}
						>
							INSIGHTS
						</span>
					</div>

					<h1
						style={{
							fontSize: isMobile
								? "clamp(38px,10vw,58px)"
								: "clamp(52px,6vw,88px)",

							fontFamily: "var(--font-display)",
							fontWeight: 800,
							lineHeight: 0.95,
							color: "#fff",
						}}
					>
						Ideas That
						<br />
						Build <span className="gt">The Future</span>
					</h1>

					<p
						style={{
							marginTop: 24,
							maxWidth: 520,
							fontSize: 17,
							lineHeight: 1.8,
							color: "var(--muted)",
						}}
					>
						Explore technology insights, development tips, and
						industry knowledge from our experts.
					</p>
				</motion.div>
			</section>

			{/* <StatStrip isMobile={isMobile} /> */}

			{/* FILTER */}

			<div
				style={{
					padding: `25px ${px} 0`,
					display: "flex",
					justifyContent: "center",
				}}
			>
				<div
					style={{
						display: "flex",
						gap: 8,
						overflowX: "auto",
						padding: 10,
						background: "var(--card)",
						borderRadius: 100,
						border: "1px solid var(--border)",
					}}
				>
					{categories.map((cat, index) => (
						<BlogPill
							key={index}
							label={cat}
							active={activeCategory === cat}
							onClick={() => setActiveCategory(cat)}
						/>
					))}
				</div>
			</div>

			{/* BLOG GRID */}

			<div
				style={{
					maxWidth: 1200,
					margin: "0 auto",
					padding: isMobile ? "40px 5% 90px" : `50px ${px} 100px`,
				}}
			>
				{isLoading ? (
					<div
						style={{
								textAlign: "center",
								padding: "80px 0",
								color: "var(--muted)",
								fontSize: 16,
						}}
				>
						Loading blogs...
				</div>
				) : (
					<AnimatePresence mode="wait">
						<motion.div
							key={activeCategory}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							style={{
								display: "grid",
								gridTemplateColumns: isMobile
									? "1fr"
									: isTablet
										? "repeat(2,1fr)"
										: "repeat(3,1fr)",
								gap: 24,
							}}
							>
								{filtered.length === 0 ? (
									<div
										style={{
											textAlign: "center",
											padding: "80px 0",
											color: "var(--muted)",
										}}
									>
										No blogs found.
									</div>
								) : (
									filtered.map((blog, index) => (
										<BlogCard
											key={blog._id}
											blog={blog}
											index={index}
										/>
									)))}
						</motion.div>
					</AnimatePresence>
				)}
			</div>
		</div>
	);
}
