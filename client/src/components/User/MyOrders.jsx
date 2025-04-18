import React, { useEffect, useState } from 'react';
import { getUserOrders } from '../../services/api';
import { getAuth } from 'firebase/auth';
import { app } from '../../Firebase';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';

const auth = getAuth(app);

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      getUserOrders(auth.currentUser.uid)
        .then((res) => setOrders(res.data))
        .catch(() => toast.error('Failed to fetch orders'));
    }
  }, []);

  return (
    <div>
      <UserNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-3">{order._id}</td>
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