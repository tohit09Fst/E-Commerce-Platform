import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, });

export const getProducts = () => API.get('/products');
export const getProduct = (id) => API.get(`/products/${id}`);
export const createOrder = (order) => API.post('/orders', order);
export const getUserOrders = (userId) => {
  if (userId === 'all') return API.get('/orders');
  return API.get(`/orders/user/${userId}`);
};
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}`, { status });