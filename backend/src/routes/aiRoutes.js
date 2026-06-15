const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/generate', aiController.generateLayout);
router.post('/generate-prototype', aiController.generatePrototype);
router.post('/test-connection', aiController.testConnection);
router.get('/providers', aiController.getProviders);

module.exports = router;
