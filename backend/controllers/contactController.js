// controllers/contactController.js
const Contact = require("../models/Contact");

exports.createContact = async (req, res) => {
    try {
        const { name, email, phone, company, message, services, budget } = req.body;

        // ✅ Validation (same as frontend)
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email",
            });
        }

        if (phone) {
            const cleaned = phone.replace(/\D/g, "");
            if (cleaned.length !== 10) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid phone number",
                });
            }
        }

        // ✅ Save to DB
        const contact = await Contact.create({
            name,
            email,
            phone,
            company,
            message,
            services,
            budget,
        });

        return res.status(201).json({
            success: true,
            message: "Form submitted successfully",
            data: contact,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// GET ALL CONTACTS
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};