const mongoose = require("mongoose");



const navDropdownItemSchema = new mongoose.Schema({
    categories: { type: String, required: true, unique: true },
    desc: String,
    iconName: { type: String, default: "" },
    color: { type: String, default: "" },
    accent: { type: String, default: "" },
    tag: { type: String, default: "" },
    subcategories: [{
        name: String,
        desc: String,
        iconName: String
    }],
    techTools: [{
        name: String,
        icon: String
    }]
}, { timestamps: true });

module.exports = mongoose.model("NavDropdownItem", navDropdownItemSchema);
