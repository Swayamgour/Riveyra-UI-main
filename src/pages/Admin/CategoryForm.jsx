import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const makeSlug = (text = "") =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

export default function CategoryForm({
    initialData,
    onSubmit,
    onCancel,
}) {
    const [form, setForm] = useState({
        name: "",
        slug: "",
    });

    const [manualSlug, setManualSlug] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || "",
                slug: initialData.slug || "",
            });

              setManualSlug(false);
        } else {
            setForm({
                name: "",
                slug: "",
            });

            setManualSlug(false);
        }
    }, [initialData]);

    const handleName = (e) => {
        const value = e.target.value;

        setForm((prev) => ({
            ...prev,
            name: value,
            slug: manualSlug ? prev.slug : makeSlug(value),
        }));
    };

    const handleSlug = (e) => {
        setManualSlug(true);

        setForm((prev) => ({
            ...prev,
            slug: makeSlug(e.target.value),
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            return alert("Category name is required.");
        }

        onSubmit(form);
    };

    return (
        <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .3 }}
            style={{
                background: "rgba(255,255,255,.02)",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 20,
                padding: 30,
                backdropFilter: "blur(12px)",
            }}
        >
            <h3
                style={{
                    marginBottom: 25,
                    fontSize: 24,
                    fontFamily: "var(--font-display)",
                }}
            >
                {initialData ? "Edit Category" : "Create Category"}
            </h3>

            {/* NAME */}

            <div style={{ marginBottom: 20 }}>
                <label
                    style={{
                        display: "block",
                        marginBottom: 8,
                        color: "#cbd5e1",
                        fontSize: 13,
                    }}
                >
                    Category Name
                </label>

                <input
                    value={form.name}
                    onChange={handleName}
                    placeholder="Example: Artificial Intelligence"
                    style={inputStyle}
                />
            </div>

            {/* SLUG */}

            <div style={{ marginBottom: 10 }}>
                <label
                    style={{
                        display: "block",
                        marginBottom: 8,
                        color: "#cbd5e1",
                        fontSize: 13,
                    }}
                >
                    Slug
                </label>

                <input
                    value={form.slug}
                    onChange={handleSlug}
                    placeholder="artificial-intelligence"
                    style={inputStyle}
                />
            </div>

            {/* BUTTONS */}

            <div
                style={{
                    display: "flex",
                    gap: 15,
                    justifyContent: "flex-end",
                }}
            >
                <button
                    type="button"
                    onClick={onCancel}
                    style={cancelBtn}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="btn-primary"
                >
                    {initialData
                        ? "Update Category"
                        : "Create Category"}
                </button>
            </div>
        </motion.form>
    );
}

const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.04)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
};

const cancelBtn = {
    padding: "12px 22px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,.12)",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
};