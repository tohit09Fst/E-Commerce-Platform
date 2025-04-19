import React, { useState, useEffect } from 'react';
import { getRiders, getRiderOrders } from '../../services/api';
import AdminNavbar from './AdminNavbar';

export default function ManageRiders() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRider, setSelectedRider] = useState(null);
  const [riderOrders, setRiderOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      const response = await getRiders();
      setRiders(response.data);
    } catch (error) {
      console.error('Error fetching riders:', error);
      setError('Failed to load riders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRiderOrders = async (rider) => {
    try {
      setSelectedRider(rider);
      setLoadingOrders(true);
      const response = await getRiderOrders(rider._id);
      setRiderOrders(response.data);
    } catch (error) {
      console.error('Error fetching rider orders:', error);
      setError('Failed to load rider orders. Please try again.');
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Manage Riders</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold text-lg mb-4">Rider List</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading riders...</p>
              </div>
            ) : riders.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No riders found.</p>
            ) : (
              <ul className="divide-y">
                {riders.map((rider) => (
                  <li key={rider._id} className="py-3">
                    <button 
                      onClick={() => handleViewRiderOrders(rider)}
                      className={`w-full text-left px-3 py-2 rounded ${selectedRider?._id === rider._id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                    >
                      <div className="font-medium">{rider.name}</div>
                      <div className="text-sm text-gray-600">{rider.email}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {rider.assignedOrders?.length || 0} orders assigned
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4">
            {selectedRider ? (
              <>
                <h3 className="font-bold text-lg mb-4">Orders Assigned to {selectedRider.name}</h3>
                
                {loadingOrders ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading orders...</p>
                  </div>
                ) : riderOrders.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No orders assigned to this rider.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {riderOrders.map((order) => (
                          <tr key={order._id}>
                            <td className="px-4 py-4 whitespace-nowrap">
                              #{order._id.substring(order._id.length - 6)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {order.customerInfo.name}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' : order.status === 'Delivered' ? 'bg-green-100 text-green-800' : order.status === 'Undelivered' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right">
                              ${order.total.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Select a rider to view their assigned orders</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
