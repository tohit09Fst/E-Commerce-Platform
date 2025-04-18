import React, { useEffect, useState } from 'react';
import { getUserOrders, updateOrderStatus } from '../../services/api';
import AdminNavbar from './AdminNavbar';
import { toast } from 'react-toastify';

export default function ViewOrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getUserOrders('all')
      .then((res) => {
        console.log('Orders fetched:', res.data); // Debug log
        setOrders(res.data);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        toast.error('Failed to fetch orders');
      });
  }, []);

  const handleStatusUpdate = (id, status) => {
    updateOrderStatus(id, status)
      .then(() => {
        toast.success('Status updated');
        setOrders((prev) =>
          prev.map((order) => (order._id === id ? { ...order, status } : order))
        );
      })
      .catch(() => toast.error('Status update failed'));
  };

  return (
    <div>
      <AdminNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Order List</h1>
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">User ID</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-3">{order._id}</td>
                    <td className="p-3">{order.userId}</td>
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
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {order.status === 'Paid' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'Shipped')}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Mark as Shipped
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
      </div>
    </div>
  );
}