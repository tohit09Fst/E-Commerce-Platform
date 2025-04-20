import React, { useEffect, useState } from 'react';
import { getUserOrders } from '../../services/api';
import { getAuth } from 'firebase/auth';
import { app } from '../../Firebase';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import { FaCheckCircle, FaTruck, FaMoneyBillWave } from 'react-icons/fa'; // Importing icons
import Footer from './Footer';

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
    <div className='bg-blue-100'>
      <UserNavbar />
      <div className="container mx-auto p-6 bg-blue-100">
        <h1 className="text-3xl font-bold mb-6 text-teal-600 animate__animated animate__fadeInUp">
          My Orders
        </h1>
        {orders.length === 0 ? (
          <p className="text-xl text-gray-600">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg border-separate border-spacing-4">
              <thead>
                <tr className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                  <th className="p-4 text-left font-semibold">Order ID</th>
                  <th className="p-4 text-left font-semibold">Date</th>
                  <th className="p-4 text-left font-semibold">Total</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 transition-all duration-300"
                  >
                    <td className="p-4 text-gray-800">{order._id}</td>
                    <td className="p-4 text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-gray-800">₹{order.total}</td>
                    <td className="p-4">
                      <span
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
                          order.status === 'Paid'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status === 'Paid' && <FaMoneyBillWave className="text-xl" />}
                        {order.status === 'Shipped' && <FaTruck className="text-xl" />}
                        {order.status === 'Delivered' && <FaCheckCircle className="text-xl" />}
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
      <Footer />
    </div>
  );
}
