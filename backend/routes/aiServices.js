const express = require('express');
const router = express.Router();
const aiServiceController = require('../controllers/aiServiceController');
const { validateAiService, validateObjectId } = require('../middleware/validation');

// Public routes
router.get('/', aiServiceController.getAllAiServices);
router.get('/:slug/faq', aiServiceController.getFaqByServiceSlug);
router.get('/:slug/cta', aiServiceController.getCtaByServiceSlug);
router.get('/:slug', aiServiceController.getAiServiceBySlug);
router.get('/id/:id', validateObjectId, aiServiceController.getAiServiceById);

// Admin routes (add auth middleware in production)
router.post('/', validateAiService, aiServiceController.createAiService);
router.put('/:id', validateObjectId, validateAiService, aiServiceController.updateAiService);
router.delete('/:id', validateObjectId, aiServiceController.deleteAiService);

module.exports = router;