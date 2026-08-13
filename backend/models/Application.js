const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    linkedin: String,
    portfolio: String,
    experience: String,
    noticePeriod: String,
    currentCtc: String,
    expectedCtc: String,
    jobTitle: String,
    jobId: String,
    coverLetter: String,
    resume: String,
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'rejected', 'hired', 'shortlisted'],
        default: 'pending'
    }

    


}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);