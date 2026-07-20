import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";

function BlogCard({ blog, index }) {
	const [hov, setHov] = useState(false);

	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-50px" });

	const navigate = useNavigate();

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 44 }}
			animate={inView ? { opacity: 1, y: 0 } : {}}
			transition={{
				delay: index * 0.11,
				duration: 0.78,
				ease: [0.16, 1, 0.3, 1],
			}}
			onMouseEnter={() => setHov(true)}
			onMouseLeave={() => setHov(false)}
			onClick={() => navigate(`/blogs/${blog.slug}`)}
			data-hover
			style={{
				borderRadius: 20,
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				background: "rgba(8,14,28,0.9)",
				border: `1px solid ${
					hov ? "rgba(96,165,250,0.35)" : "rgba(255,255,255,0.07)"
				}`,
				boxShadow: hov
					? "0 32px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(96,165,250,.08), 0 0 60px rgba(96,165,250,.08)"
					: "0 12px 40px rgba(0,0,0,.35)",
				transform: hov ? "translateY(-10px)" : "translateY(0)",
				transition:
					"transform 0.38s cubic-bezier(0.16,1,0.3,1), box-shadow 0.38s cubic-bezier(0.16,1,0.3,1)",
				backdropFilter: "blur(14px)",
				cursor: "pointer",
			}}
		>
			{/* TOP LINE */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: 3,
					zIndex: 5,

					background: "linear-gradient(90deg,#60a5fa,#a78bfa)",

					opacity: hov ? 1 : 0.6,

					transition: "opacity .3s",
				}}
			/>

			{/* IMAGE */}

			<div
				style={{
					position: "relative",
					height: 210,
					overflow: "hidden",
					flexShrink: 0,
				}}
			>
				<img
					src={blog?.image}
					alt={blog?.imageAlt || blog?.title}
					loading="lazy"
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",

						filter: hov
							? "brightness(0.9) saturate(1.3)"
							: "brightness(0.65) saturate(1.0)",
						transform: hov ? "scale(1.07)" : "scale(1)",
						transition:
							"transform 0.55s cubic-bezier(0.16,1,0.3,1), filter 0.4s",
					}}
					onError={(e) => {
						e.currentTarget.style.display = "none";

						e.currentTarget.parentElement.style.background =
							"linear-gradient(135deg,#60a5fa22,#020812)";
					}}
				/>

				{/* IMAGE OVERLAY */}

				<div
					style={{
						position: "absolute",
						inset: 0,
						background:
							"linear-gradient(140deg,rgba(96,165,250,.12),transparent 60%)",
						opacity: hov ? 1 : 0,
						transition: "opacity .4s",
					}}
				/>
				

				{/* CATEGORY */}

				<div
					style={{
						position: "absolute",
						top: 14,
						left: 14,
						padding: "4px 12px",
						borderRadius: 20,
						background: "rgba(96,165,250,.08)",
						border: "1px solid var(--border-hover)",
						color: "var(--accent3)",
						fontSize: 11,
						fontFamily: "var(--font-mono)",
						fontWeight: 600,
						letterSpacing: 1.4,
						backdropFilter: "blur(10px)",
					}}
				>
					{blog?.category?.name}
				</div>

				{/* DATE */}

				<div
					style={{
						position: "absolute",
						top: 14,
						right: 14,
						padding: "5px 10px",
						borderRadius: 8,
						background: "rgba(4,9,20,.8)",
						color: "rgba(255,255,255,.5)",
						fontSize: 11,
						fontFamily: "var(--font-mono)",
					}}
				>
					{new Date(blog?.blogDate).toLocaleDateString("en-GB", {
						day: "2-digit",
						month: "short",
						year: "numeric",
					})}
				</div>
			</div>

			{/* BODY */}

			<div
				style={{
					padding: "20px 22px 24px",
					display: "flex",
					flexDirection: "column",
					flex: 1,
					position: "relative",
				}}
			>
				{/* glow */}

				<div
					style={{
						position: "absolute",
						inset: 0,
						pointerEvents: "none",
						background:"radial-gradient(ellipse at 50% 110%,rgba(96,165,250,.1),transparent 65%)",
						opacity: hov ? 1 : 0,
						transition: "opacity .4s",
					}}
				/>

				{/* TITLE */}

				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						gap: 10,
						marginBottom: 8,
					}}
				>
					<h3
						style={{
							fontFamily: "var(--font-display)",
							fontSize: 21,
							fontWeight: 800,
							lineHeight: 1.08,
							color: "var(--text)",
						}}
					>
						{blog?.title}
					</h3>
				</div>

				{/* DESCRIPTION */}
				<p
					style={{
						fontSize: 14,
						lineHeight: 1.75,
						color: "var(--muted)",
						fontFamily: "var(--font-body)",
						flex: 1,
					}}
				>
					{blog?.description?.replace(/<[^>]*>/g, "")?.slice(0, 140)}
					...
				</p>

				{/* READ BUTTON */}

				<div
					style={{
						marginTop: 10,
						display: "flex",
						alignItems: "center",
						gap: 6,
						color: "var(--accent)",
						fontSize: 14,
						fontWeight: 600,
						fontFamily: "var(--font-mono)",
						letterSpacing: 1,
						opacity: hov ? 1 : 0.7,
						transition: ".3s",
					}}
				>
					Read Blog →
				</div>
			</div>

			{/* BOTTOM LINE */}

			<div
				style={{
					height: 2,
					background:"linear-gradient(90deg,var(--accent),var(--accent2),transparent)",
					transform: hov ? "scaleX(1)" : "scaleX(0)",
					transformOrigin: "left",
					transition: ".42s cubic-bezier(.16,1,.3,1)",
				}}
			/>
		</motion.div>
	);
}

export default BlogCard;
