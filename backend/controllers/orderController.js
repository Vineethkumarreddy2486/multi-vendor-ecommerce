const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Place new order
// @route   POST /api/orders
// @access  Private (Customer only)
exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for: ${product.title}` });
      }

      totalPrice += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        vendorId: product.vendor
      });

      // Reduce stock
      product.stockQuantity -= item.quantity;
      await product.save();
    }

    // Mock payment simulation
    const transactionId = 'TXN' + Date.now();

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalPrice,
      shippingAddress,
      paymentStatus: 'Paid',
      transactionId,
      status: 'Pending'
    });

    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer's own orders
// @route   GET /api/orders/my-orders
// @access  Private (Customer only)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.product', 'title images')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'title images price')
      .populate('customer', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (
      order.customer._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      req.user.role !== 'vendor'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get vendor orders
// @route   GET /api/orders/vendor-orders
// @access  Private (Vendor only)
exports.getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      'items.vendorId': req.user._id
    })
      .populate('customer', 'name email')
      .populate('items.product', 'title images')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Vendor/Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('items.product', 'title')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};