// routes/projectRoutes.js

const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')

const {
    createProject,
    getAllProjects,
    getProjectBySlug,
    updateProject,
    deleteProject
} = require('../controllers/projectController')
const authMiddleware = require('../middleware/authMiddleware')


// 🔥 CREATE
router.post(
    '/',
    upload.fields([
        { name: 'workImg', maxCount: 1 },
        { name: 'detailImgs', maxCount: 5 }
    ]), authMiddleware,
    createProject
)


// 🔥 GET ALL
router.get('/', getAllProjects)


// 🔥 GET SINGLE
router.get('/:slug', getProjectBySlug)


// 🔥 UPDATE
router.put(
    '/:id',
    upload.fields([
        { name: 'workImg', maxCount: 1 },
        { name: 'detailImgs', maxCount: 5 }
    ]),
    authMiddleware,
    updateProject
)


// 🔥 DELETE
router.delete('/:id', authMiddleware, deleteProject)


module.exports = router