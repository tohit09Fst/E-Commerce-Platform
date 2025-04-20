import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../../Firebase';
import { toast } from 'react-toastify';
import { getUserOrders } from '../../services/api';
import {
  AiOutlineHome,
  AiOutlineAppstore,
  AiOutlineShoppingCart,
  AiOutlineInfoCircle,
  AiOutlineUser,
  AiOutlineProfile,
  AiOutlineLogout,
} from 'react-icons/ai';

const auth = getAuth(app);

export default function UserNavbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (auth.currentUser && !orders.length) {
      try {
        const res = await getUserOrders(auth.currentUser.uid);
        setOrders(res.data);
      } catch (error) {
        toast.error('Failed to fetch orders');
      }
    }
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        toast.success('Logged out successfully');
        navigate('/login');
        setOrders([]);
      })
      .catch(() => toast.error('Logout failed'));
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-50 to-blue-100 shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="https://img.freepik.com/free-vector/colorful-letter-m-gradient-logo-design_474888-2270.jpg"
              alt="Logo"
              className="h-10 w-10 rounded-full group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-2xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors">
              MegaCool
            </span>
          </Link>

          {/* Center Links */}
          <div className="flex space-x-4">
            <Link
              to="/home"
              className="flex items-center space-x-2 px-4 py-2 text-blue-800 hover:bg-blue-200 rounded-lg transition-colors group"
            >
              <AiOutlineHome className="h-5 w-5 group-hover:text-blue-600" />
              <span className="group-hover:text-blue-900">Home</span>
            </Link>
            <Link
              to="/items-list"
              className="flex items-center space-x-2 px-4 py-2 text-blue-800 hover:bg-blue-200 rounded-lg transition-colors group"
            >
              <AiOutlineAppstore className="h-5 w-5 group-hover:text-blue-600" />
              <span className="group-hover:text-blue-900">Products</span>
            </Link>
            <Link
              to="/cart"
              className="flex items-center space-x-2 px-4 py-2 text-blue-800 hover:bg-blue-200 rounded-lg transition-colors group"
            >
              <AiOutlineShoppingCart className="h-5 w-5 group-hover:text-blue-600" />
              <span className="group-hover:text-blue-900">Cart</span>
            </Link>
            <Link
              to="/contact-admin"
              className="flex items-center space-x-2 px-4 py-2 text-blue-800 hover:bg-blue-200 rounded-lg transition-colors group"
            >
              <AiOutlineInfoCircle className="h-5 w-5 group-hover:text-blue-600" />
              <span className="group-hover:text-blue-900">About</span>
            </Link>
          </div>

          {/* Profile */}
         {/* Profile */}
<div className="relative">
  <img
    src={auth.currentUser?.photoURL || 'https://via.placeholder.com/40'}
    alt="Profile"
    className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-300 hover:scale-110 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
    onClick={() => {
      setShowProfile(!showProfile);
      if (!showProfile) fetchOrders();
    }}
  />

  {showProfile && (
    <div
      className="absolute right-0 mt-3 w-64 animate-fade-slide bg-white/90 backdrop-blur-md text-black rounded-xl shadow-xl border border-gray-200 transition-all duration-300"
    >
      <Link
        to="/profile"
        className="flex items-center px-4 py-3 space-x-3 hover:bg-blue-50 transition-all duration-200 rounded-t-xl"
      >
        <AiOutlineUser className="text-xl text-blue-600" />
        <span className="font-medium">View Profile</span>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          setShowProfile(false);
          navigate('/my-orders');
        }}
        className="flex items-center w-full text-left px-4 py-3 space-x-3 hover:bg-blue-50 transition-all duration-200"
      >
        <AiOutlineProfile className="text-xl text-green-600" />
        <span className="font-medium">My Orders</span>
      </button>

      <button
        onClick={logout}
        className="flex items-center w-full text-left px-4 py-3 space-x-3 hover:bg-red-50 transition-all duration-200 rounded-b-xl"
      >
        <AiOutlineLogout className="text-xl text-red-600" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  )}
</div>

        </div>
      </div>
    </nav>
  );
}
