const mongoose = require("mongoose");



const navDropdownItemSchema = new mongoose.Schema({
    categories: { type: String, required: true, unique: true },
    desc: String,
    subcategories: [{
        name: String,
        desc: String
    }],
    techTools: [{
        name: String,
        icon: String
    }]
}, { timestamps: true });

module.exports = mongoose.model("NavDropdownItem", navDropdownItemSchema);
