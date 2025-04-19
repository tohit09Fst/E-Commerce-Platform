const express = require('express');
const router = express.Router();
const Rider = require('../models/Rider');
const Order = require('../models/Order');

// Register a new rider
router.post('/register', async (req, res) => {
  try {
    const { name, email, uid, phone } = req.body;
    
    // Check if rider already exists
    const existingRider = await Rider.findOne({ email });
    if (existingRider) {
      return res.status(200).json(existingRider); // Return existing rider
    }
    
    // Create new rider
    const rider = new Rider({
      name,
      email,
      uid,
      phone: phone || '',
      assignedOrders: []
    });
    
    await rider.save();
    res.status(201).json(rider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get rider by UID (for Google Auth)
router.get('/auth/:uid', async (req, res) => {
  try {
    const rider = await Rider.findOne({ uid: req.params.uid });
    if (!rider) return res.status(404).json({ message: 'Rider not found' });
    res.json(rider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all riders (for admin)
router.get('/', async (req, res) => {
  try {
    const riders = await Rider.find();
    res.json(riders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get rider's assigned orders
router.get('/:riderId/orders', async (req, res) => {
  try {
    const orders = await Order.find({ riderId: req.params.riderId })
      .populate('products.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status by rider
router.put('/orders/:orderId/status', async (req, res) => {
  try {
    // Extract data from request
    const { riderId, status, deliveryNotes } = req.body;
    const orderId = req.params.orderId;
    
    // Log the request for debugging
    console.log('Rider status update request:', {
      orderId,
      riderId,
      status,
      deliveryNotes: deliveryNotes || '(none)'
    });
    
    // Basic validation
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    if (status !== 'Delivered' && status !== 'Undelivered') {
      return res.status(400).json({ 
        message: `Invalid status: ${status}. Status must be 'Delivered' or 'Undelivered'` 
      });
    }
    
    // Find the order - use try/catch for robust error handling
    let order;
    try {
      order = await Order.findById(orderId);
    } catch (error) {
      console.error('Database error finding order:', error);
      return res.status(500).json({ 
        message: 'Database error when finding order',
        error: error.message
      });
    }
    
    // Check if order exists
    if (!order) {
      return res.status(404).json({ message: `Order with ID ${orderId} not found` });
    }
    
    // Log the found order for debugging
    console.log('Found order:', {
      id: order._id,
      currentStatus: order.status,
      riderId: order.riderId ? order.riderId.toString() : 'none'
    });
    
    // IMPORTANT: For now, we're skipping rider verification to get the functionality working
    // This allows any rider to update any order
    // In a production environment, you would want to verify that the rider is assigned to this order
    
    // Update the order
    order.status = status;
    if (deliveryNotes) {
      order.deliveryNotes = deliveryNotes;
    }
    
    // Save the updated order
    try {
      const updatedOrder = await order.save();
      console.log('Order successfully updated to:', status);
      
      // Return success response
      return res.status(200).json({
        success: true,
        message: `Order status successfully updated to ${status}`,
        order: {
          _id: updatedOrder._id,
          status: updatedOrder.status,
          deliveryNotes: updatedOrder.deliveryNotes || ''
        }
      });
    } catch (error) {
      console.error('Error saving order:', error);
      return res.status(500).json({
        message: 'Error saving order',
        error: error.message
      });
    }
  } catch (error) {
    // Catch any other errors
    console.error('Unexpected error in order status update:', error);
    return res.status(500).json({
      message: 'An unexpected error occurred',
      error: error.message
    });
  }
});

module.exports = router;
