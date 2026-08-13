// models/PageSeo.js
// SEO for pages that are NOT tied to a Service/Blog/Project/Career
// document — Home, About, Contact, Career listing, Portfolio listing,
// Blogs listing, etc. One document per `page` key.

const mongoose = require("mongoose");
const seoSchema = require("./schemas/seoSchema");

const ALLOWED_PAGES = [
    "home",
    "about",
    "contact",
    "career",
    "portfolio",
    "blogs"
];

const pageSeoSchema = new mongoose.Schema(
    {
        page: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            enum: ALLOWED_PAGES
        },

        seo: seoSchema
    },
    { timestamps: true }
);

module.exports = mongoose.model("PageSeo", pageSeoSchema);
module.exports.ALLOWED_PAGES = ALLOWED_PAGES;
