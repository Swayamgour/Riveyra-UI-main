// models/Project.js

const mongoose = require('mongoose')
const seoSchema = require('./schemas/seoSchema')

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        required: true,
        unique: true
    },

    link: String,
    category: String,
    color: String,
    description: String,

    // SEO
    seo: seoSchema,

    workImg: {
        type: String   // ✅ Cloudinary URL
    },

    detailImgs: [
        {
            type: String  // ✅ multiple Cloudinary URLs
        }
    ],

    year: String,

    tech: [
        {
            type: String
        }
    ]

}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema)