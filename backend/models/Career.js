// models/Career.js

const mongoose = require('mongoose')
const seoSchema = require('./schemas/seoSchema')

const careerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    location: String,
    type: String,
    experience: String,
    salary: String,

    description: String,

    // SEO
    seo: seoSchema,

    requirements: [String],
    benefits: [String],

    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },

    accent: String,
    postedDate: String

}, { timestamps: true })

module.exports = mongoose.model('Career', careerSchema)