const router = require('express').Router()
const { protect } = require('../middleware/authMiddleware')
const { recommend } = require('../controllers/aiController')

router.post('/recommend', protect, recommend)

module.exports = router
