const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Vendor dashboard stats
// @route   GET /api/dashboard/vendor
// @access  Private (Vendor only)
exports.getVendorStats = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user._id });
    const productIds = products.map(p => p._id);

    const orders = await Order.find({ 'items.vendorId': req.user._id });

    let revenue = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.vendorId && item.vendorId.toString() === req.user._id.toString()) {
          revenue += item.price * item.quantity;
        }
      });
    });

    const lowStock = products.filter(p => p.stockQuantity < 5);

    return res.json({
      success: true,
      data: {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: revenue,
        lowStockProducts: lowStock.length,
        recentOrders: orders.slice(0, 5)
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin only)
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalVendors,
        totalCustomers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};