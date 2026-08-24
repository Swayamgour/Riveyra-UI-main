const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema({
    label: { type: String, required: true },
    value: { type: Number, required: true },
    suffix: { type: String },
    icon: { type: String }
});

const TechStackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    iconUrl: { type: String, required: true }
});

const StatPanelSchema = new mongoose.Schema({
    label: String,
    value: String,
    sub: String
});

const ServiceCardSchema = new mongoose.Schema({
    title: String,
    desc: String,
    iconSvg: String
});

const UniverseCardSchema = new mongoose.Schema({
    id: String,
    title: String,
    desc: String,
    glowColor: String,
    gradient: String,
    iconUrl: String
});

const ProcessStepSchema = new mongoose.Schema({
    stepNumber: String,
    title: String,
    desc: String,
    iconSvg: String
});

const TestimonialSchema = new mongoose.Schema({
    name: String,
    role: String,
    company: String,
    content: String,
    rating: { type: Number, default: 5 },
    imageUrl: String
});

const FAQSchema = new mongoose.Schema({
    question: String,
    answer: String
});

const ServicesDetailTwoSchema = new mongoose.Schema({
    // Universal Category Identifiers
    categoryName: { type: String, required: true },
    subcategoryName: { type: String, required: true },
    
    pageTitle: { type: String, default: "Services Detail Two" },
    
    // Hero Section
    heroBadge: { type: String },
    heroTitle: { type: String },
    heroAnimatedText: [{ type: String }],
    heroimg: { type: String },
    heroDescription: { type: String },
    metrics: [MetricSchema],
    
    // Graphics Panel
    statsPanel: [StatPanelSchema],
    
    // Tech Stack Section
    techStackTag: String,
    techStackTitle: String,
    techStackTitleHighlight: String,
    techStackDesc: String,
    techStack: [TechStackSchema],
    techStats: [{ highlight: String, text: String }],
    
    // Services Section
    servicesTag: String,
    servicesTitle: String,
    servicesTitleHighlight: String,
    servicesDesc: String,
    services: [ServiceCardSchema],
    
    // Universe Section
    universeTag: String,
    universeTitle: String,
    universeTitleHighlight: String,
    universecenter: String,
    universecenterdesc: String,
    universeCards: [UniverseCardSchema],
    
    // Why Riveyra Section
    whyTag: String,
    whyTitle: String,
    whyTitleHighlight: String,
    whyCards: [ServiceCardSchema],
    
    // Process Section
    processTitle: String,
    processTitleHighlight: String,
    processDesc: String,
    processSteps: [ProcessStepSchema],
    
    // Testimonials
    testimonials: [TestimonialSchema],
    
    // FAQs
    faqs: [FAQSchema],
    
    // Contact Section
    contactHeadings: [{ type: String }],
    contactDesc: String,
    contactPhone: String,
    contactEmail: String,
    contactAddress: String
});

// Ensure uniqueness so we only have one detail page per subcategory
ServicesDetailTwoSchema.index({ categoryName: 1, subcategoryName: 1 }, { unique: true });

// Forcing exact collection name to prevent pluralization issues
module.exports = mongoose.model('ServiceDetailTwo', ServicesDetailTwoSchema, 'serviceDetailTwo');
