const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrder,
  getVendorOrders,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/', protect, restrictTo('customer'), placeOrder);
router.get('/my-orders', protect, restrictTo('customer'), getMyOrders);
router.get('/vendor-orders', protect, restrictTo('vendor'), getVendorOrders);
router.get('/', protect, restrictTo('admin'), getAllOrders);
router.get('/:id', protect, getOrder);
router.patch('/:id/status', protect, restrictTo('vendor', 'admin'), updateOrderStatus);

module.exports = router;