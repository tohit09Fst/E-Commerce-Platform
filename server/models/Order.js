const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Shipped', 'Delivered'],
    default: 'Pending',
  },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Order', orderSchema);