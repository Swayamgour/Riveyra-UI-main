const mongoose = require("mongoose");

const seoSchema = new mongoose.Schema(
    {
        metaTitle: String,
        metaDescription: String,

        keywords: {
            type: [String],
            default: []
        },

        canonical: String,
        robots: String,

        openGraph: {
            title: String,
            description: String,
            image: String,
            type: {
                type: String,
                default: "website"
            }
        },

        twitter: {
            card: {
                type: String,
                default: "summary_large_image"
            },
            title: String,
            description: String,
            image: String
        },

        structuredData: mongoose.Schema.Types.Mixed
    },
    { _id: false }
);

module.exports = seoSchema;