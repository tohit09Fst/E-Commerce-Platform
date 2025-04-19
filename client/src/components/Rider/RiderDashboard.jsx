import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../../Firebase';
import { useNavigate } from 'react-router-dom';
import { getRiderOrders } from '../../services/api';

const auth = getAuth(app);

export default function RiderDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rider, setRider] = useState(null);

  useEffect(() => {
    // Check if rider is logged in
    const riderInfo = localStorage.getItem('riderInfo');
    if (!riderInfo) {
      navigate('/rider/login');
      return;
    }

    const fetchRiderOrders = async () => {
      try {
        setLoading(true);
        const riderData = JSON.parse(riderInfo);
        setRider(riderData);

        // Fetch orders assigned to this rider
        const response = await getRiderOrders(riderData._id);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRiderOrders();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('riderInfo');
      navigate('/rider/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Rider Dashboard</h1>
          {rider && (
            <div className="flex items-center">
              <span className="mr-4">{rider.name}</span>
              <button 
                onClick={handleLogout}
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Your Assigned Orders</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No orders assigned to you yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">Order #{order._id.substring(order._id.length - 6)}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' : order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <p><span className="font-medium">Name:</span> {order.customerInfo.name}</p>
                  <p><span className="font-medium">Address:</span> {order.customerInfo.address}</p>
                  <p><span className="font-medium">Phone:</span> {order.customerInfo.phone || 'N/A'}</p>
                </div>
                
                <div className="p-4 border-t">
                  <h4 className="font-semibold mb-2">Products</h4>
                  <ul className="space-y-2">
                    {order.products.map((item) => (
                      <li key={item._id} className="flex justify-between">
                        <span>{item.productId.name} × {item.quantity}</span>
                        <span>${(item.productId.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-2 border-t flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
                
                {order.status === 'Shipped' && (
                  <div className="p-4 bg-gray-50 border-t">
                    <button 
                      onClick={() => navigate(`/rider/order/${order._id}`)}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      Update Delivery Status
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
