const mongoose = require('mongoose');

// Validate service data
exports.validateService = (req, res, next) => {
    const { title, desc, slug, path, tags, icon } = req.body;
    
    const errors = [];
    
    if (!title || title.trim().length < 3) {
        errors.push('Title is required and must be at least 3 characters');
    }
    
    if (!desc || desc.trim().length < 10) {
        errors.push('Description is required and must be at least 10 characters');
    }
    
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
        errors.push('Slug is required and must contain only lowercase letters, numbers, and hyphens');
    }
    
    if (!path || !path.startsWith('/')) {
        errors.push('Path is required and must start with /');
    }
    
    if (tags && !Array.isArray(tags)) {
        errors.push('Tags must be an array');
    }
    
    if (icon && typeof icon !== 'object') {
        errors.push('Icon must be an object');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ 
            success: false, 
            errors 
        });
    }
    
    next();
};

// Validate AI service data
exports.validateAiService = (req, res, next) => {
    const { slug, hero, blocks } = req.body;
    
    const errors = [];
    
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
        errors.push('Slug is required and must contain only lowercase letters, numbers, and hyphens');
    }
    
    if (!hero || !hero.title) {
        errors.push('Hero section with title is required');
    }
    
    if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
        errors.push('At least one block is required');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ 
            success: false, 
            errors 
        });
    }
    
    next();
};

// Validate MongoDB ObjectId
exports.validateObjectId = (req, res, next) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid ID format' 
        });
    }
    
    next();
};