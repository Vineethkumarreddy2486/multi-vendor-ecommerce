const Wishlist = require('../models/Wishlist');

// @desc    Get wishlist
// @route   GET /api/wishlist
// @access  Private (Customer only)
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ customer: req.user._id })
      .populate('products', 'title price images ratings category');

    if (!wishlist) {
      wishlist = { products: [] };
    }

    return res.json({ success: true, data: wishlist });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Add to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private (Customer only)
exports.addToWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ customer: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        customer: req.user._id,
        products: [req.params.productId]
      });
    } else {
      if (wishlist.products.includes(req.params.productId)) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }
      wishlist.products.push(req.params.productId);
      await wishlist.save();
    }

    return res.json({ success: true, message: 'Added to wishlist', data: wishlist });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private (Customer only)
exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ customer: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      p => p.toString() !== req.params.productId
    );

    await wishlist.save();

    return res.json({ success: true, message: 'Removed from wishlist', data: wishlist });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};