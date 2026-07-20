import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdFolder } from "react-icons/md";

export default function CategoryCard({
    category,
    index,
    isMobile,
    onEdit,
    onDelete,
}) {
    const [hover, setHover] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                delay: index * 0.08,
                duration: 0.45,
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 20,
                padding: isMobile ? 22 : 26,
                background: hover
                    ? "rgba(96,165,250,.05)"
                    : "rgba(255,255,255,.02)",
                border: hover
                    ? "1px solid rgba(96,165,250,.28)"
                    : "1px solid rgba(255,255,255,.08)",
                transition: ".3s",
                backdropFilter: "blur(12px)",
                transform: hover ? "translateY(-5px)" : "none",
                boxShadow: hover
                    ? "0 18px 40px rgba(0,0,0,.35)"
                    : "none",
                display: "flex",
                flexDirection: "column",
                minHeight: 220,
            }}
        >
            {/* top accent */}

            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background:
                        "linear-gradient(90deg,#60a5fa,#a855f7)",
                    opacity: hover ? 1 : 0,
                    transition: ".3s",
                }}
            />

            {/* icon */}

            <div
                style={{
                    width: 62,
                    height: 62,
                    borderRadius: 18,
                    background: "rgba(96,165,250,.12)",
                    border: "1px solid rgba(96,165,250,.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 22,
                    transition: ".3s",
                    transform: hover
                        ? "scale(1.08)"
                        : "scale(1)",
                }}
            >
                <MdFolder
                    size={34}
                    color="#60a5fa"
                />
            </div>

            {/* title */}

            <h3
                style={{
                    fontSize: 22,
                    fontFamily: "var(--font-display)",
                    marginBottom: 8,
                    color: "#fff",
                }}
            >
                {category.name}
            </h3>

            {/* slug */}

            <div
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    width: "fit-content",
                    padding: "6px 12px",
                    borderRadius: 30,
                    background:
                        "rgba(96,165,250,.08)",
                    border:
                        "1px solid rgba(96,165,250,.18)",
                    color: "#60a5fa",
                    fontSize: 12,
                    marginBottom: 18,
                    fontFamily: "monospace",
                }}
            >
                /{category.slug}
            </div>

            {/* created */}

            <div
                style={{
                    marginTop: "auto",
                    color: "rgba(255,255,255,.5)",
                    fontSize: 12,
                    marginBottom: 18,
                }}
            >
                Created{" "}
                {new Date(
                    category.createdAt
                ).toLocaleDateString()}
            </div>

            {/* actions */}

            <div
                style={{
                    display: "flex",
                    gap: 10,
                }}
            >
                <button
                    onClick={() =>
                        onEdit(category)
                    }
                    style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: 8,
                        border:
                            "1px solid rgba(96,165,250,.25)",
                        background:
                            "rgba(96,165,250,.08)",
                        color: "#60a5fa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        cursor: "pointer",
                    }}
                >
                    <FaEdit />
                    Edit
                </button>

                <button
                    onClick={() =>
                        onDelete(category._id)
                    }
                    style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: 8,
                        border:
                            "1px solid rgba(248,113,113,.25)",
                        background:
                            "rgba(248,113,113,.08)",
                        color: "#f87171",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        cursor: "pointer",
                    }}
                >
                    <FaTrash />
                    Delete
                </button>
            </div>
        </motion.div>
    );
}