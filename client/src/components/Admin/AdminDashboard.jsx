import React, { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import { getProducts, getUserOrders } from '../../services/api';
import { toast } from 'react-toastify';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => toast.error('Failed to fetch products'));
    getUserOrders('all')
      .then((res) => setOrders(res.data))
      .catch(() => toast.error('Failed to fetch orders'));
  }, []);

  // Prepare data for charts
  const orderDates = orders.map((order) => new Date(order.createdAt).toLocaleDateString());
  const orderTotals = orders.map((order) => order.total);
  const statusCounts = {
    Pending: orders.filter((o) => o.status === 'Pending').length,
    Paid: orders.filter((o) => o.status === 'Paid').length,
    Shipped: orders.filter((o) => o.status === 'Shipped').length,
    Delivered: orders.filter((o) => o.status === 'Delivered').length,
  };

  // Chart data and options
  const lineChartData = {
    labels: orderDates,
    datasets: [
      {
        label: 'Order Total',
        data: orderTotals,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#333' } },
      title: { display: true, text: 'Order Trends', color: '#333' },
    },
    scales: { y: { beginAtZero: true, title: { display: true, text: 'Total (₹)' } } },
  };

  const barChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Order Count',
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#333' } },
      title: { display: true, text: 'Order Status Distribution', color: '#333' },
    },
    scales: { y: { beginAtZero: true, title: { display: true, text: 'Count' } } },
  };

  return (
    <div>
      <AdminNavbar />
      <div className="container mx-auto p-4 min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
            <h2 className="text-xl font-semibold">Total Products</h2>
            <p className="text-4xl font-bold mt-2">{products.length}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
            <h2 className="text-xl font-semibold">Total Orders</h2>
            <p className="text-4xl font-bold mt-2">{orders.length}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
            <h2 className="text-xl font-semibold">Revenue</h2>
            <p className="text-4xl font-bold mt-2">
              ₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart - Order Trends */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>

          {/* Bar Chart - Order Status Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}