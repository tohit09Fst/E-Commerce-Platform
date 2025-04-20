import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetails, updateOrderStatusByRider } from '../../services/api';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBoxOpen, FaTruck } from 'react-icons/fa';

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
    if (!status || status === order.status) {
      setError('Please select a different status');
      return;
    }

    if (!rider || !rider._id) {
      setError('Rider information is missing. Please log in again.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const response = await Promise.race([
        updateOrderStatusByRider(orderId, rider._id, status, deliveryNotes || ''),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 10000)
        )
      ]);

      alert(`Order status updated to ${status} successfully!`);
      navigate('/rider/dashboard');
    } catch (error) {
      let errorMessage = 'Failed to update order status. Please try again.';
      if (error.message === 'Request timed out') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-pulse">
            {error}
          </div>
          <button
            onClick={() => navigate('/rider/dashboard')}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center">
          <button
            onClick={() => navigate('/rider/dashboard')}
            className="mr-4 text-white hover:scale-110 transition-transform"
          >
            <FaArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold">Order Details</h1>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-pulse">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 transition-shadow hover:shadow-xl">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <div>
  <h2 className="text-xl font-bold flex items-center gap-2">
    <FaBoxOpen /> Order #{order._id.slice(-6)}
  </h2>
  <p className="text-sm text-gray-500 mt-1">
    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
  </p>
</div>
            <span className={`px-3 py-1 rounded text-sm font-bold transition-all duration-300 ${order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' : order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {order.status}
            </span>
          </div>

          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <FaUser /> Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 flex items-center gap-1"><FaUser /> Name</p>
                <p className="font-medium">{order.customerInfo.name}</p>
              </div>
              <div>
                <p className="text-gray-600 flex items-center gap-1"><FaEnvelope /> Email</p>
                <p className="font-medium">{order.customerInfo.email}</p>
              </div>
              <div>
                <p className="text-gray-600 flex items-center gap-1"><FaPhone /> Phone</p>
                <p className="font-medium">{order.customerInfo.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 flex items-center gap-1"><FaMapMarkerAlt /> Address</p>
                <p className="font-medium">{order.customerInfo.address}</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <FaTruck /> Products
            </h3>
            <div className="overflow-x-auto text-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Quantity</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {order.products.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 py-2">{item.productId.name}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">${item.productId.price.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right">${(item.productId.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan="3" className="px-4 py-3 text-right">Total</td>
                    <td className="px-4 py-3 text-right">${order.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {order.status === 'Shipped' && (
            <div className="p-4 animate-fade-in">
              <h3 className="font-semibold text-lg mb-3">Update Delivery Status</h3>
              <div className="mb-4 flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="Delivered"
                    checked={status === 'Delivered'}
                    onChange={() => setStatus('Delivered')}
                    className="form-radio text-green-600 h-5 w-5"
                  />
                  <span>Delivered</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="Undelivered"
                    checked={status === 'Undelivered'}
                    onChange={() => setStatus('Undelivered')}
                    className="form-radio text-red-600 h-5 w-5"
                  />
                  <span>Undelivered</span>
                </label>
              </div>
              <textarea
                rows="3"
                placeholder="Add any notes about the delivery..."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200 transition"
              />
              <button
                onClick={handleUpdateStatus}
                disabled={submitting || status === order.status}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-all"
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
