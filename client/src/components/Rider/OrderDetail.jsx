import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetails, updateOrderStatusByRider } from '../../services/api';

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [rider, setRider] = useState(null);

  useEffect(() => {
    // Check if rider is logged in
    const riderInfo = localStorage.getItem('riderInfo');
    if (!riderInfo) {
      navigate('/rider/login');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const riderData = JSON.parse(riderInfo);
        setRider(riderData);

        // Fetch order details
        const response = await getOrderDetails(orderId);
        setOrder(response.data);
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  const handleUpdateStatus = async () => {
    // Validate input
    if (!status || status === order.status) {
      setError('Please select a different status');
      return;
    }

    // Make sure we have a valid rider ID
    if (!rider || !rider._id) {
      setError('Rider information is missing. Please log in again.');
      return;
    }

    try {
      // Start submission process
      setSubmitting(true);
      setError('');

      // Log the request details for debugging
      console.log('Attempting to update order status:', {
        orderId,
        riderId: rider._id,
        status,
        deliveryNotes: deliveryNotes || ''
      });

      // Make the API call with a timeout
      const response = await Promise.race([
        updateOrderStatusByRider(orderId, rider._id, status, deliveryNotes || ''),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out')), 10000)
        )
      ]);

      // Log successful response
      console.log('Status update successful:', response.data);
      
      // Show success message
      alert(`Order status updated to ${status} successfully!`);
      
      // Navigate back to dashboard
      navigate('/rider/dashboard');
    } catch (error) {
      // Log the full error for debugging
      console.error('Error updating order status:', error);
      
      // Extract the most useful error message to show to the user
      let errorMessage = 'Failed to update order status. Please try again.';
      
      if (error.message === 'Request timed out') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Set the error message for display
      setError(errorMessage);
    } finally {
      // Always reset the submitting state
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate('/rider/dashboard')}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <button
            onClick={() => navigate('/rider/dashboard')}
            className="mr-4 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Order Details</h1>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Order #{order._id.substring(order._id.length - 6)}</h2>
              <span className={`px-3 py-1 rounded text-sm font-bold ${order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' : order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>

          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{order.customerInfo.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{order.customerInfo.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{order.customerInfo.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Address</p>
                <p className="font-medium">{order.customerInfo.address}</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg mb-3">Products</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.products.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 py-4 whitespace-nowrap">{item.productId.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{item.quantity}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">${item.productId.price.toFixed(2)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">${(item.productId.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan="3" className="px-4 py-3 text-right font-bold">Total</td>
                    <td className="px-4 py-3 text-right font-bold">${order.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {order.status === 'Shipped' && (
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-3">Update Delivery Status</h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-blue-600"
                      name="status"
                      value="Delivered"
                      checked={status === 'Delivered'}
                      onChange={() => setStatus('Delivered')}
                    />
                    <span className="ml-2 text-gray-700">Delivered</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-red-600"
                      name="status"
                      value="Undelivered"
                      checked={status === 'Undelivered'}
                      onChange={() => setStatus('Undelivered')}
                    />
                    <span className="ml-2 text-gray-700">Undelivered</span>
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deliveryNotes">
                  Delivery Notes
                </label>
                <textarea
                  id="deliveryNotes"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  placeholder="Add any notes about the delivery..."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                ></textarea>
              </div>
              
              <button
                onClick={handleUpdateStatus}
                disabled={submitting || status === order.status}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
