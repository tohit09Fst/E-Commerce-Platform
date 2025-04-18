import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../../Firebase';
import { toast } from 'react-toastify';
import { getUserOrders } from '../../services/api';

const auth = getAuth(app);

export default function UserNavbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Fetch user orders when the dropdown opens
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
        setOrders([]); // Clear orders on logout
      })
      .catch((error) => toast.error('Logout failed'));
  };

  return (
    <nav className="bg-white text-white p-4 sticky top-0 z-10 shadow-md">
    
      <div className="container mx-auto flex justify-between items-center">
      <div className="w-24 h-10 rounded-full overflow-hidden flex items-center justify-center">
  <img
    src="https://img.freepik.com/free-vector/colorful-letter-m-gradient-logo-design_474888-2270.jpg?semt=ais_hybrid&w=740"
    alt="Logo"
    className="w-14 h-16 object-cover"
  />
</div>
        {/* Centered Navigation Links */}
        <div className="flex-1 flex justify-center space-x-6">
          <Link to="/home" className="text-blue-300 hover:text-blue-500 transition duration-300 font-medium">
            Home
          </Link>
          <Link to="/items-list" className="text-blue-300 hover:text-blue-500 transition duration-300 font-medium">
            Products
          </Link>
          <Link to="/cart" className="text-blue-300 hover:text-blue-500 transition duration-300 font-medium">
            Cart
          </Link>
          <Link to="/contact-admin" className="text-blue-300 hover:text-blue-500 transition duration-300 font-medium">
            About
          </Link>
        </div>

        {/* Logo on the Right */}
        <div className="flex items-center space-x-4">
          
          <div className="relative">
            <img
              src={auth.currentUser?.photoURL || 'https://via.placeholder.com/40'}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-300 hover:border-blue-500 transition duration-300"
              onClick={() => {
                setShowProfile(!showProfile);
                if (!showProfile) fetchOrders(); // Fetch orders only when opening
              }}
            />
            {showProfile && (
              <div className="absolute right-0 mt-2 w-60 bg-white text-black rounded-lg shadow-lg border border-gray-200">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
                >
                  View Profile
                </Link>
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowProfile(false);
                    navigate('/my-orders'); // Navigate to My Orders page (to be created)
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
                >
                  My Orders
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-200"
                >
                  Logout
                </button>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}