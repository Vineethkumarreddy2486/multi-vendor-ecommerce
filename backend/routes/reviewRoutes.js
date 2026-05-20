const express = require('express');
const router = express.Router();
const { addReview, getProductReviews, deleteReview } = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/:productId', protect, restrictTo('customer'), addReview);
router.get('/:productId', getProductReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;