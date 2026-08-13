// models/Contact.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        company: String,
        message: { type: String, required: true },
        services: [String],
        budget: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);