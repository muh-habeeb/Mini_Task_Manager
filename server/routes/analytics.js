const express = require('express');
const { getProductivityData } = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.get('/productivity', getProductivityData);

module.exports = router;
