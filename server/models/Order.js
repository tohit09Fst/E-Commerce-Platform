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
    enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Undelivered'],
    default: 'Pending',
  },
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider' },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
  deliveryNotes: { type: String },
});
module.exports = mongoose.model('Order', orderSchema);