const express = require('express');

const router = express.Router();

const {
    register,
    login,
    checkToken,
    getProfile
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');


// Register
router.post('/register', register);

// Login
router.post('/login', login);

router.get('/check-token', authMiddleware, checkToken);

router.get('/profile', authMiddleware, getProfile);

module.exports = router;