const NavDropdownItem = require("../models/NavDropdownItem");

// @desc    Get all active NavDropdown items
// @route   GET /api/v1/nav-dropdown
// @access  Public
exports.getNavDropdownItems = async (req, res) => {
    try {
        const items = await NavDropdownItem.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: items.length, data: items });
    } catch (error) {
        console.error("Error fetching NavDropdown items:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Create new NavDropdown item
// @route   POST /api/v1/nav-dropdown
// @access  Private (Admin)
exports.createNavDropdownItem = async (req, res) => {
    try {
        const item = await NavDropdownItem.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        console.error("Error creating NavDropdown item:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get single NavDropdown item by category
// @route   GET /api/v1/nav-dropdown/:categories
// @access  Public
exports.getNavDropdownItemByCategory = async (req, res) => {
    try {
        const item = await NavDropdownItem.findOne({ categories: req.params.categories });
        
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        console.error("Error fetching NavDropdown item:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Update NavDropdown item
// @route   PUT /api/v1/nav-dropdown/:id
// @access  Private (Admin)
exports.updateNavDropdownItem = async (req, res) => {
    try {
        const item = await NavDropdownItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        res.status(200).json({ success: true, data: item });
    } catch (error) {
        console.error("Error updating NavDropdown item:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Delete NavDropdown item
// @route   DELETE /api/v1/nav-dropdown/:id
// @access  Private (Admin)
exports.deleteNavDropdownItem = async (req, res) => {
    try {
        const item = await NavDropdownItem.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error("Error deleting NavDropdown item:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
