import { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";

function BlogCard({ blog, index, isMobile, onEdit, onDelete, onToggleStatus }) {
	const [hov, setHov] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{
				delay: index * 0.08,
				duration: 0.6,
				ease: [0.16, 1, 0.3, 1],
			}}
			onMouseEnter={() => setHov(true)}
			onMouseLeave={() => setHov(false)}
			style={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				borderRadius: 20,
				overflow: "hidden",
				cursor: "pointer",
				position: "relative",

				background: hov
					? `rgba(96,165,250,0.04)`
					: "rgba(255,255,255,0.02)",
				border: `1px solid ${hov ? "rgba(96,165,250,0.3)" : "rgba(255,255,255,0.07)"}`,

				backdropFilter: "blur(12px)",
				transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
				transform: hov ? "translateY(-6px)" : "none",
				boxShadow: hov ? "0 20px 40px rgba(0,0,0,.35)" : "none",
			}}
		>
			{/* Top Accent */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: 3,
					background: "linear-gradient(90deg,#60a5fa,#a78bfa)",
					opacity: hov ? 1 : 0,
					transition: "opacity 0.3s",
					zIndex: 5,
				}}
			/>

			{/* Image */}
			<div
				style={{
					position: "relative",
					height: isMobile ? 190 : 220,
					overflow: "hidden",
				}}
			>
				<img
					src={blog?.image}
					alt={blog?.title}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						transition: "transform 0.5s ease",
						transform: hov ? "scale(1.08)" : "scale(1)",
					}}
				/>

				<div
					style={{
						position: "absolute",
						inset: 0,
						background: `linear-gradient(to top, rgba(2,8,18,0.9) 0%, rgba(2,8,18,0.3) 50%, transparent 100%)`,
					}}
				/>

				{/* Category */}
				<div
					style={{
						position: "absolute",
						top: 16,
						left: 16,
						padding: "4px 12px",
						borderRadius: 20,
						background: "rgba(96,165,250,.15)",
						border: "1px solid rgba(96,165,250,.3)",
						// color: "#a8caf4",
						color: "var(--accent3)",
						fontSize: 10,
						fontFamily: "var(--font-mono)",
						fontWeight: 600,
						letterSpacing: 0.5,
					}}
				>
					{blog?.category?.name}
				</div>

				{/* Status */}
				<div
					style={{
						position: "absolute",
						top: 16,
						right: 16,
						padding: "5px 12px",
						borderRadius: 20,
						background:
							blog?.status === "published"
								? "rgba(34,197,94,.15)"
								: "rgba(251,191,36,.15)",

						border:
							blog?.status === "published"
								? "1px solid rgba(34,197,94,.4)"
								: "1px solid rgba(251,191,36,.4)",

						color:
							blog?.status === "published"
								? "#22c55e"
								: "#fbbf24",

						fontSize: 11,
						fontWeight: 600,
					}}
				>
					{blog?.status}
				</div>

				{/* Date */}
				<div
					style={{
						position: "absolute",
						bottom: 16,
						right: 16,
						padding: "4px 10px",
						borderRadius: 8,
						background: "rgba(0,0,0,.5)",
						color: "#fff",
						fontSize: 11,
					}}
				>
					{new Date(blog?.blogDate).toLocaleDateString("en-GB", {
						day: "2-digit",
						month: "short",
						year: "numeric",
					})}
				</div>
			</div>

			{/* Content */}

			<div
				style={{
					padding: 20,
					flex: 1,
					display: "flex",
					flexDirection: "column",
					position: "relative",
					paddingBottom: 60, // reserve space for buttons
				}}
			>
				<h3
					style={{
						color: "#fff",
						fontSize: 18,
						fontWeight: 700,
					}}
				>
					{blog?.title}
				</h3>

				

				{/* Buttons */}
				<div
					style={{
						position: "absolute",
						bottom: 12,
						right: 12,
						display: "flex",
						gap: 12,
						zIndex: 10,
					}}
				>
					<button
						onClick={(e) => {
							e.stopPropagation();
							onEdit(blog);
						}}
						style={{
							padding: "7px 12px",
							borderRadius: 8,
							background: "rgba(96,165,250,.1)",
							border: "1px solid rgba(96,165,250,.3)",
							color: "#60a5fa",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							fontSize: 14,
							gap: 8,
						}}
					>
						<FaEdit />
						Edit
					</button>

					<button
						onClick={(e) => {
							e.stopPropagation();
							onDelete(blog._id);
						}}
						style={{
							padding: "7px 12px",
							borderRadius: 8,
							background: "rgba(248,113,113,.1)",
							border: "1px solid rgba(248,113,113,.3)",
							color: "#f87171",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							fontSize: 14,
							gap: 6,
						}}
					>
						<FaTrash />
						Delete
					</button>
				</div>
			</div>
		</motion.div>
	);
}

export default BlogCard;
