const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { requireAuth } = require('../middleware/auth');

// All AI routes require authentication
router.post('/generate', requireAuth, aiController.generateLayout);
router.post('/generate-prototype', requireAuth, aiController.generatePrototype);
router.post('/test-connection', requireAuth, aiController.testConnection);
router.get('/providers', requireAuth, aiController.getProviders);

module.exports = router;
