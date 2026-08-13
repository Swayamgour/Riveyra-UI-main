// utils/seoHelpers.js
// Shared helpers so every controller fills SEO fields the same way.

const SITE_URL = "https://riveyrainfotech.com";

/**
 * Safely parse a field that may arrive as a JSON string (multipart
 * form-data / multer requests) or may already be an object (plain
 * JSON requests). Never throws.
 */
function parseJSONField(field) {
    if (typeof field !== "string") return field;

    try {
        return JSON.parse(field);
    } catch (err) {
        return field; // wasn't JSON, return as-is
    }
}

/**
 * Merge admin-provided SEO data with sensible auto-generated
 * fallbacks, so a page is never missing meta tags just because the
 * admin left the SEO section empty. Admin-entered values always win.
 *
 * @param {Object} opts
 * @param {Object} opts.seo         - raw seo object from req.body (already parsed)
 * @param {String} opts.title       - fallback title (page/service/blog title)
 * @param {String} opts.description - fallback description
 * @param {String} opts.path        - url path, e.g. `/ServiceDetail/${slug}`
 * @param {String} opts.image       - fallback OG/Twitter image
 */
function buildSeoDefaults({ seo = {}, title = "", description = "", path = "", image = "" } = {}) {
    seo = seo || {};

    const metaTitle = seo.metaTitle || title;
    const metaDescription = seo.metaDescription || description;
    const canonical = seo.canonical || `${SITE_URL}${path}`;

    return {
        metaTitle,
        metaDescription,
        keywords: Array.isArray(seo.keywords) ? seo.keywords : (seo.keywords ? [seo.keywords] : []),
        canonical,
        robots: seo.robots || "index,follow",

        openGraph: {
            title: seo.openGraph?.title || metaTitle,
            description: seo.openGraph?.description || metaDescription,
            image: seo.openGraph?.image || image || "",
            type: seo.openGraph?.type || "website"
        },

        twitter: {
            card: seo.twitter?.card || "summary_large_image",
            title: seo.twitter?.title || metaTitle,
            description: seo.twitter?.description || metaDescription,
            image: seo.twitter?.image || image || ""
        },

        schema: seo.schema || {}
    };
}

module.exports = { SITE_URL, parseJSONField, buildSeoDefaults };
