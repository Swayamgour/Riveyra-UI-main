const mongoose = require('mongoose');
const seoSchema = require('./schemas/seoSchema');

const heroSchema = new mongoose.Schema({
    badge: String,
    title: String,
    subtitle: String,
    intro: String,
    desc: [String],
    questionsTitle: String,
    questions: [String],
    closing: [String]
});

const blockSchema = new mongoose.Schema({
    label: String,
    title: String,
    desc: String,
    image: String,
    features: [String],
    extra: String,
    example: String,
    reverse: Boolean
});

const comparisonSchema = new mongoose.Schema({
    title: String,
    data: [{
        feature: String,
        traditional: String,
        ai: String
    }]
});

const whoNeedsSchema = new mongoose.Schema({
    title: String,
    problems: [String],
    idealFor: [String]
});

const approachSchema = new mongoose.Schema({
    title: String,
    steps: [{
        number: String,
        title: String,
        desc: String
    }],
    whyChoose: [{
        title: String,
        desc: String
    }]
});

const faqSchema = new mongoose.Schema({
    q: String,
    a: String
});

const ctaSchema = new mongoose.Schema({
    title: String,
    desc: String,
    buttons: [{
        label: String,
        link: String
    }]
});

const aiServiceSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true, lowercase: true },

    // SEO
    seo: seoSchema,

    hero: heroSchema,
    blocks: [blockSchema],
    comparison: comparisonSchema,
    whoNeeds: whoNeedsSchema,
    approach: approachSchema,
    faq: [faqSchema],
    cta: ctaSchema,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

aiServiceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('AiService', aiServiceSchema);