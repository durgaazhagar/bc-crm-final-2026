const express = require('express');
const router = express.Router();

// Aggregate all API routes under /api
router.use('/auth', require('./auth'));
router.use('/donors', require('./donors'));
router.use('/emergency', require('./emergency'));
router.use('/dispatch', require('./dispatch'));
router.use('/analytics', require('./analytics'));
router.use('/ai', require('./ai'));
router.use('/chat', require('./chat'));
router.use('/reports', require('./reports'));

// Status endpoint
router.get('/status', (req, res) => {
  res.json({ status: 'ok', service: 'BloodConnect CRM AI Backend' });
});

module.exports = router;
