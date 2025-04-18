const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Fan', 'AC'], required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String },
  stock: { type: Number, default: 0 },
});
module.exports = mongoose.model('Product', productSchema);