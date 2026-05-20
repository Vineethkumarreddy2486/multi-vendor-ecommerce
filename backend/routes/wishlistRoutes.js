const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/', protect, restrictTo('customer'), getWishlist);
router.post('/:productId', protect, restrictTo('customer'), addToWishlist);
router.delete('/:productId', protect, restrictTo('customer'), removeFromWishlist);

module.exports = router;