// routes/careerRoutes.js

const express = require('express')
const router = express.Router()

const {
    createCareer,
    getCareers,
    // getCareerBySlug,
    updateCareer,
    deleteCareer,
    getCareerById
} = require('../controllers/careerController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, createCareer)
router.get('/:id', getCareerById)
router.get('/', getCareers)
router.put('/:id', authMiddleware, updateCareer)
router.delete('/:id', authMiddleware, deleteCareer)

module.exports = router