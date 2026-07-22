// src/pages/admin/PageSeoForm.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
    useGetPageSeoQuery,
    useUpdatePageSeoMutation,
} from "../../redux/api";

const ALLOWED_PAGES = [
    "home",
    "about",
    "contact",
    "career",
    "portfolio",
    "blogs",
];

const PAGE_LABELS = {
    home: "Home",
    about: "About",
    contact: "Contact",
    career: "Career (Listing)",
    portfolio: "Portfolio (Listing)",
    blogs: "Blogs (Listing)",
};

const emptySeo = () => ({
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    canonical: "",
    robots: "index, follow",
    openGraph: { title: "", description: "", image: "" },
    twitter: { title: "", description: "", image: "" },
    schema: "",
});

const PageSeoForm = () => {
    const { page } = useParams();
    const navigate = useNavigate();
    const pageKey = page?.toLowerCase();
    const isValidPage = ALLOWED_PAGES.includes(pageKey);

    const { data, isLoading, isFetching } = useGetPageSeoQuery(pageKey, {
        skip: !isValidPage,
    });

    const [updatePageSeo, { isLoading: isSaving }] = useUpdatePageSeoMutation();

    const [form, setForm] = useState({
        title: "",
        description: "",
        image: "",
        seo: emptySeo(),
    });

    const [tempKeyword, setTempKeyword] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });
    const [errors, setErrors] = useState({});
    const [loadedOnce, setLoadedOnce] = useState(false);

    // Load data whenever the query resolves (works for both "configured"
    // docs and the default-defaults payload the backend returns).
    useEffect(() => {
        if (data?.data) {
            const record = data.data;
            const seo = record.seo || {};

            setForm({
                title: record.title || seo.metaTitle || "",
                description: record.description || seo.metaDescription || "",
                image: record.image || seo.openGraph?.image || "",
                seo: {
                    metaTitle: seo.metaTitle || "",
                    metaDescription: seo.metaDescription || "",
                    keywords: seo.keywords || [],
                    canonical: seo.canonical || "",
                    robots: seo.robots || "index, follow",
                    openGraph: {
                        title: seo.openGraph?.title || "",
                        description: seo.openGraph?.description || "",
                        image: seo.openGraph?.image || "",
                    },
                    twitter: {
                        title: seo.twitter?.title || "",
                        description: seo.twitter?.description || "",
                        image: seo.twitter?.image || "",
                    },
                    schema: seo.schema
                        ? typeof seo.schema === "string"
                            ? seo.schema
                            : JSON.stringify(seo.schema, null, 2)
                        : "",
                },
            });
            setLoadedOnce(true);
        }
    }, [data]);

    const handleTopChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleSeoChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            seo: { ...prev.seo, [field]: value },
        }));
    };

    const handleSeoNestedChange = (section, field, value) => {
        setForm((prev) => ({
            ...prev,
            seo: {
                ...prev.seo,
                [section]: { ...prev.seo[section], [field]: value },
            },
        }));
    };

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

    const validate = () => {
        const err = {};
        if (form.seo.schema?.trim()) {
            try {
                JSON.parse(form.seo.schema);
            } catch {
                err.schema = "Schema must be valid JSON (or leave it empty).";
            }
        }
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (!validate()) {
            setMessage({
                type: "error",
                text: "Please fix the errors below before saving.",
            });
            return;
        }

        try {
            await updatePageSeo({
                page: pageKey,
                data: {
                    title: form.title,
                    description: form.description,
                    image: form.image,
                    seo: form.seo,
                },
            }).unwrap();

            setMessage({ type: "success", text: "Page SEO saved successfully!" });
            setTimeout(() => navigate("/admin/page-seo"), 1200);
        } catch (err) {
            setMessage({
                type: "error",
                text: err?.data?.message || "Something went wrong while saving.",
            });
        }
    };

    const cardStyle = {
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20,
        padding: "32px 28px",
    };

    const sectionTitle = {
        color: "#fff",
        fontSize: 18,
        fontWeight: 700,
        marginBottom: 8,
    };

    const grid2 = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
        gap: 20,
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

    const errorStyle = { color: "#ef4444", fontSize: 12, marginTop: 6 };

    if (!isValidPage) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    background:
                        "linear-gradient(135deg, #0a0e1a 0%, #0f1422 100%)",
                }}
            >
                <p style={{ fontSize: 18 }}>
                    Invalid page key "{page}". Allowed: {ALLOWED_PAGES.join(", ")}
                </p>
                <button
                    onClick={() => navigate("/admin/page-seo")}
                    style={{
                        padding: "10px 24px",
                        background: "rgba(96,165,250,0.2)",
                        border: "1px solid #60a5fa",
                        borderRadius: 8,
                        color: "#60a5fa",
                        cursor: "pointer",
                    }}
                >
                    Back to Page SEO
                </button>
            </div>
        );
    }

    if (isLoading && !loadedOnce) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    fontSize: 18,
                    background:
                        "linear-gradient(135deg, #0a0e1a 0%, #0f1422 100%)",
                }}
            >
                Loading page SEO...
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
                        {PAGE_LABELS[pageKey]} SEO
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}>
                        Edit meta tags, Open Graph, and Twitter card settings for
                        this page. Leave fields empty to fall back to
                        auto-generated defaults.
                        {isFetching && " (refreshing...)"}
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
                                border: `1px solid ${message.type === "success"
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

                <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: 32 }}
                >
                    <div style={cardStyle}>
                        {/* Page-level basics */}
                        <h2 style={sectionTitle}>Page Basics</h2>
                        <p
                            style={{
                                color: "rgba(255,255,255,.45)",
                                fontSize: 13,
                                marginBottom: 20,
                            }}
                        >
                            Used as the fallback source when meta title /
                            description / OG image are left empty below.
                        </p>

                        <div style={{ display: "grid", gap: 20 }}>
                            <div>
                                <label style={labelStyle}>Page Title</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) =>
                                        handleTopChange("title", e.target.value)
                                    }
                                    placeholder={`e.g., ${PAGE_LABELS[pageKey]} | YourBrand`}
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Page Description</label>
                                <textarea
                                    rows={3}
                                    value={form.description}
                                    onChange={(e) =>
                                        handleTopChange(
                                            "description",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Short description of this page"
                                    style={{
                                        ...inputStyle,
                                        resize: "vertical",
                                        fontFamily: "inherit",
                                    }}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>
                                    Fallback Image URL
                                </label>
                                <input
                                    type="text"
                                    value={form.image}
                                    onChange={(e) =>
                                        handleTopChange("image", e.target.value)
                                    }
                                    placeholder="https://yoursite.com/images/og-default.jpg"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* SEO section */}
                        <div
                            style={{
                                marginTop: 32,
                                paddingTop: 32,
                                borderTop: "1px solid rgba(255,255,255,.1)",
                            }}
                        >
                            <h2 style={sectionTitle}>SEO Settings</h2>
                            <p
                                style={{
                                    color: "rgba(255,255,255,.45)",
                                    fontSize: 13,
                                    marginBottom: 24,
                                }}
                            >
                                Sab fields optional hain — khali chodne par
                                title/description se auto-fill ho jayega.
                            </p>

                            <div style={{ display: "grid", gap: 24 }}>
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
                                            minHeight: 110,
                                            fontFamily: "inherit",
                                        }}
                                    />
                                </div>

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
                                            placeholder="e.g., web development, digital agency"
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
                                </div>

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
                                        placeholder="Leave empty to auto-generate"
                                        style={inputStyle}
                                    />
                                </div>

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
                                        style={{ ...inputStyle, cursor: "pointer" }}
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
                                        placeholder="Leave empty to use fallback image above"
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
                                        placeholder="Leave empty to use fallback image above"
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
                                        placeholder='{ "@context": "https://schema.org", "@type": "WebPage", ... }'
                                        style={{
                                            ...inputStyle,
                                            fontSize: 13,
                                            fontFamily: "monospace",
                                            resize: "vertical",
                                            border: errors.schema
                                                ? "1px solid #ef4444"
                                                : inputStyle.border,
                                        }}
                                    />
                                    {errors.schema && (
                                        <p style={errorStyle}>{errors.schema}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
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
                            <button
                                type="button"
                                onClick={() => navigate("/admin/page-seo")}
                                disabled={isSaving}
                                style={{
                                    padding: "12px 28px",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 10,
                                    color: "rgba(255,255,255,0.7)",
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: isSaving ? "not-allowed" : "pointer",
                                    opacity: isSaving ? 0.5 : 1,
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                style={{
                                    padding: "12px 32px",
                                    background:
                                        "linear-gradient(135deg, #60a5fa, #a78bfa)",
                                    border: "none",
                                    borderRadius: 10,
                                    color: "#fff",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: isSaving ? "not-allowed" : "pointer",
                                    opacity: isSaving ? 0.7 : 1,
                                }}
                            >
                                {isSaving ? "Saving..." : "Save SEO"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PageSeoForm;