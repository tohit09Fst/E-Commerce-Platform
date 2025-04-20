import React, { useEffect, useState } from 'react';
import { getUserOrders, updateOrderStatus, getRiders } from '../../services/api';
import AdminNavbar from './AdminNavbar';
import { toast } from 'react-toastify';
import { FaShippingFast, FaCheckCircle, FaUserAlt, FaRegCalendarAlt, FaRupeeSign } from 'react-icons/fa';
import { MdAssignmentInd, MdCancel } from 'react-icons/md';
import { motion } from 'framer-motion';

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
        setOrders((prev) =>
          prev.map((order) =>
            order._id === selectedOrder._id
              ? { ...order, status: 'Shipped', riderId: selectedRider }
              : order
          )
        );
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
    <div className="bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">📦 Order Management</h1>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <motion.table
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full bg-white shadow-lg rounded-lg"
            >
              <thead>
                <tr className="bg-blue-100 text-blue-900">
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left  "><FaUserAlt className="inline mr-1"/> Customer</th>
                  <th className="p-3 text-left "><FaRegCalendarAlt className="inline mr-1"/> Date</th>
                  <th className="p-3 text-left "><FaRupeeSign className="inline mr-1"/> Total</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left"><MdAssignmentInd className="inline mr-1" /> Rider</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <motion.tr
                    key={order._id}
                    whileHover={{ scale: 1.02 }}
                    className="border-b transition duration-200"
                  >
                    <td className="p-3">{order._id.slice(-6)}</td>
                    <td className="p-3">{order.customerInfo?.name || order.userId}</td>
                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 font-semibold text-green-600">₹{order.total}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
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
                        <span className="text-sm text-gray-700">
                          {riders.find(r => r._id === order.riderId)?.name || 'Assigned'}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500 italic">Not assigned</span>
                      )}
                    </td>
                    <td className="p-3 flex gap-2">
                      {order.status === 'Paid' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'Shipped')}
                          className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        >
                          <FaShippingFast /> Ship
                        </button>
                      )}
                      {order.status === 'Shipped' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                          className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                        >
                          <FaCheckCircle /> Delivered
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        )}

        {showRiderModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Assign Rider</h3>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Order #{selectedOrder._id.slice(-6)}
                </p>

                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Choose Rider
                </label>

                <select
                  className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
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

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="flex items-center gap-1 px-4 py-2 border text-gray-600 rounded hover:bg-gray-100"
                >
                  <MdCancel /> Cancel
                </button>
                <button
                  onClick={handleAssignRider}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FaShippingFast /> Assign & Ship
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
