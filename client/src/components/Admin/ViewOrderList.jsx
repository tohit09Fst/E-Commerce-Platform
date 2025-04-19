import React, { useEffect, useState } from 'react';
import { getUserOrders, updateOrderStatus, getRiders } from '../../services/api';
import AdminNavbar from './AdminNavbar';
import { toast } from 'react-toastify';

export default function ViewOrderList() {
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRiderModal, setShowRiderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRider, setSelectedRider] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch orders and riders in parallel
        const [ordersRes, ridersRes] = await Promise.all([
          getUserOrders('all'),
          getRiders()
        ]);
        
        setOrders(ordersRes.data);
        setRiders(ridersRes.data);
      } catch (err) {
        console.error('Fetch error:', err);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusUpdate = (id, status) => {
    // For non-shipped status, just update without rider assignment
    if (status !== 'Shipped') {
      updateOrderStatus(id, status)
        .then(() => {
          toast.success('Status updated');
          setOrders((prev) =>
            prev.map((order) => (order._id === id ? { ...order, status } : order))
          );
        })
        .catch(() => toast.error('Status update failed'));
      return;
    }
    
    // For 'Shipped' status, open the rider assignment modal
    const order = orders.find(o => o._id === id);
    setSelectedOrder(order);
    setShowRiderModal(true);
  };
  
  const handleAssignRider = () => {
    if (!selectedRider) {
      toast.error('Please select a rider');
      return;
    }
    
    updateOrderStatus(selectedOrder._id, 'Shipped', selectedRider)
      .then(() => {
        toast.success('Order marked as shipped and assigned to rider');
        // Update the orders list
        setOrders((prev) =>
          prev.map((order) => 
            order._id === selectedOrder._id 
              ? { ...order, status: 'Shipped', riderId: selectedRider } 
              : order
          )
        );
        // Close the modal and reset selection
        setShowRiderModal(false);
        setSelectedOrder(null);
        setSelectedRider('');
      })
      .catch(() => toast.error('Failed to update order status'));
  };
  
  const closeModal = () => {
    setShowRiderModal(false);
    setSelectedOrder(null);
    setSelectedRider('');
  };

  return (
    <div>
      <AdminNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Order List</h1>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Rider</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-3">{order._id.substring(order._id.length - 6)}</td>
                    <td className="p-3">{order.customerInfo?.name || order.userId}</td>
                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">₹{order.total}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded ${
                          order.status === 'Paid'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Undelivered'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {order.riderId ? (
                        <span className="text-sm">
                          {riders.find(r => r._id === order.riderId)?.name || 'Assigned'}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Not assigned</span>
                      )}
                    </td>
                    <td className="p-3">
                      {order.status === 'Paid' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'Shipped')}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Ship & Assign Rider
                        </button>
                      )}
                      {order.status === 'Shipped' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Rider Assignment Modal */}
        {showRiderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Assign Rider to Order</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Order #{selectedOrder._id.substring(selectedOrder._id.length - 6)}
                </p>
                
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Rider
                </label>
                
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={selectedRider}
                  onChange={(e) => setSelectedRider(e.target.value)}
                >
                  <option value="">-- Select a Rider --</option>
                  {riders.map((rider) => (
                    <option key={rider._id} value={rider._id}>
                      {rider.name} ({rider.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignRider}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Assign & Ship
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}