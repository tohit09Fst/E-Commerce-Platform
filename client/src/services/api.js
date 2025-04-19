import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, });

// Product APIs
export const getProducts = () => API.get('/products');
export const getProduct = (id) => API.get(`/products/${id}`);

// Order APIs
export const createOrder = async (order) => {
  try {
    // Log the order data for debugging
    console.log('Creating order with data:', order);
    
    // Make the API call
    const response = await API.post('/orders', order);
    
    // Log the response for debugging
    console.log('Order created successfully:', response.data);
    
    return response;
  } catch (error) {
    // Log the error for debugging
    console.error('Order creation error:', error.response ? error.response.data : error.message);
    throw error;
  }
};
export const getUserOrders = (userId) => {
  if (userId === 'all') return API.get('/orders');
  return API.get(`/orders/user/${userId}`);
};
export const getOrderDetails = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, status, riderId = null) => 
  API.put(`/orders/${id}`, { status, riderId });

// Rider APIs
export const getRiders = () => API.get('/riders');
export const getRiderById = (id) => API.get(`/riders/${id}`);
export const getRiderByUid = (uid) => API.get(`/riders/auth/${uid}`);
export const registerRider = (riderData) => API.post('/riders/register', riderData);
export const getRiderOrders = (riderId) => API.get(`/riders/${riderId}/orders`);
export const updateOrderStatusByRider = async (orderId, riderId, status, deliveryNotes) => {
  // Validate inputs
  if (!orderId) throw new Error('Order ID is required');
  if (!riderId) throw new Error('Rider ID is required');
  if (!status) throw new Error('Status is required');
  
  // Log the request for debugging
  console.log('Making API call to update order status:', { 
    orderId, 
    riderId: typeof riderId === 'object' ? riderId.toString() : riderId, 
    status, 
    deliveryNotes
  });
  
  try {
    // Make the API call
    const response = await API.put(`/riders/orders/${orderId}/status`, {
      riderId: typeof riderId === 'object' ? riderId.toString() : riderId, // Ensure riderId is a string
      status,
      deliveryNotes: deliveryNotes || ''
    });
    
    // Log the response for debugging
    console.log('API response:', response.data);
    
    return response;
  } catch (error) {
    // Log the error for debugging
    console.error('API error:', error.response ? error.response.data : error.message);
    throw error;
  }
};