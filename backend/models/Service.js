const mongoose = require("mongoose");
const seoSchema = require("./schemas/seoSchema");

const blockSchema = new mongoose.Schema({
    label: String,
    title: String,
    desc: String,
    image: String, // Cloudinary URL
    features: [String],
    extra: String,
    example: String,
    reverse: Boolean
}, { _id: false });

const heroSchema = new mongoose.Schema({
    badge: String,
    title: String,
    subtitle: String,
    intro: String,
    desc: [String],
    questionsTitle: String,
    questions: [String],
    closing: [String]
}, { _id: false });

const comparisonSchema = new mongoose.Schema({
    title: String,
    data: [
        {
            feature: String,
            traditional: String,
            ai: String
        }
    ]
}, { _id: false });

const whoNeedsSchema = new mongoose.Schema({
    title: String,
    problems: [String],
    idealFor: [String]
}, { _id: false });

const approachSchema = new mongoose.Schema({
    title: String,
    steps: [
        {
            number: String,
            title: String,
            desc: String
        }
    ],
    whyChoose: [
        {
            title: String,
            desc: String
        }
    ]
}, { _id: false });

const faqSchema = new mongoose.Schema({
    q: String,
    a: String
}, { _id: false });

const ctaSchema = new mongoose.Schema({
    title: String,
    desc: String,
    buttons: [
        {
            label: String,
            link: String
        }
    ]
}, { _id: false });

const serviceSchema = new mongoose.Schema({
    title: String,
    desc: String,
    slug: { type: String, unique: true },

    accent: String,
    path: String,
    tags: [String],
    subcategories: [String],
    icons: String,

    // SEO
    seo: seoSchema,

    // DETAIL PAGE
    hero: heroSchema,
    blocks: [blockSchema],
    comparison: comparisonSchema,
    whoNeeds: whoNeedsSchema,
    approach: approachSchema,
    faq: [faqSchema],
    cta: ctaSchema

}, { timestamps: true });

// console.log(Service.schema.path("seo.keywords"));

module.exports = mongoose.model("Service", serviceSchema);