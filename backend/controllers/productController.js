const Product = require('../models/Product');

// @desc    Get all products with search and filters
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, inStock } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (inStock === 'true') query.stockQuantity = { $gt: 0 };

    const products = await Product.find(query)
      .populate('vendor', 'name email')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Vendor only)
exports.createProduct = async (req, res) => {
  try {
    const { title, description, category, price, stockQuantity, images } = req.body;

    if (!title || !description || !category || !price) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const product = await Product.create({
      title,
      description,
      category,
      price,
      stockQuantity,
      images,
      vendor: req.user._id
    });

    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Vendor only - own products)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendor only - own products)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get vendor's own products
// @route   GET /api/products/vendor/my-products
// @access  Private (Vendor only)
exports.getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user._id })
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};