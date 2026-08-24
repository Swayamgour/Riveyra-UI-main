const express = require('express');
const router = express.Router();
const { 
    getServicesDetailTwo, 
    updateServicesDetailTwo, 
    deleteServicesDetailTwo,
    getLatestTestimonials
} = require('../controllers/serviceDetailTwo');

// Fetch latest testimonials across subcategories
router.get('/services-detail-two/testimonials/latest', getLatestTestimonials);

// We use the same path, but rely on query parameters (e.g. ?categoryName=X&subcategoryName=Y)
router.get('/services-detail-two', getServicesDetailTwo);

// We use POST or PUT to create/update. In the controller we use upsert, so one route handles both.
router.post('/services-detail-two', updateServicesDetailTwo);
router.put('/services-detail-two', updateServicesDetailTwo);

router.delete('/services-detail-two', deleteServicesDetailTwo);

module.exports = router;
