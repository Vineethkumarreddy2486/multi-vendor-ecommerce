const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true },
  category: {
    type: String, required: true,
    enum: ['Mobile Phones', 'Laptops', 'Audio', 'Wearables', 'Accessories']
  },
  price: { type: Number, required: true, min: 0.01 },
  stockQuantity: { type: Number, required: true, min: 0, default: 10 },
  images: [{ type: String, default: 'https://via.placeholder.com/500' }],
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);