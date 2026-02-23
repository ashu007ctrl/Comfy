const express = require('express');
const { getUserTrends, getAdminAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/trends', protect, getUserTrends);
router.get('/admin/analytics', protect, authorize('admin'), getAdminAnalytics);

module.exports = router;
