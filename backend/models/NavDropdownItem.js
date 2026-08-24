const mongoose = require("mongoose");

const techToolSchema = new mongoose.Schema({
    category: String,
    tools: [
        {
            name: String,
            icon: String
        }
    ]
}, { _id: false });

const navDropdownItemSchema = new mongoose.Schema({
    categories: { type: String, required: true, unique: true },
    desc: String,
    subcategories: [{
        name: String,
        desc: String
    }],
    techTools: [techToolSchema]
}, { timestamps: true });

module.exports = mongoose.model("NavDropdownItem", navDropdownItemSchema);
