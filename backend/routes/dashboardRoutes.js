const express = require('express');
const router = express.Router();
const { getVendorStats, getAdminStats } = require('../controllers/dashboardController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/vendor', protect, restrictTo('vendor'), getVendorStats);
router.get('/admin', protect, restrictTo('admin'), getAdminStats);

module.exports = router;