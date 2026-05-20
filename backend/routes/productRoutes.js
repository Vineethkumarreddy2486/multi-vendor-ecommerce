const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts
} = require('../controllers/productController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/vendor/my-products', protect, restrictTo('vendor'), getVendorProducts);
router.get('/:id', getProduct);
router.post('/', protect, restrictTo('vendor'), createProduct);
router.put('/:id', protect, restrictTo('vendor', 'admin'), updateProduct);
router.delete('/:id', protect, restrictTo('vendor', 'admin'), deleteProduct);

module.exports = router;