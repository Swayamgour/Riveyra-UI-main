const express = require('express');
const router = express.Router();
const { 
    getServicesDetailTwo, 
    createServicesDetailTwo, 
    updateServicesDetailTwo, 
    deleteServicesDetailTwo 
} = require('../controllers/serviceDetailTwo');

router.get('/services-detail-two', getServicesDetailTwo);
router.post('/services-detail-two', createServicesDetailTwo);
router.put('/services-detail-two', updateServicesDetailTwo);
router.delete('/services-detail-two', deleteServicesDetailTwo);

module.exports = router;
