import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../../Firebase';

const auth = getAuth(app);

export default function RiderNavbar() {
  const navigate = useNavigate();
  const rider = JSON.parse(localStorage.getItem('riderInfo'));

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
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/rider/dashboard" className="text-xl font-bold">Rider Portal</Link>
          
          <div className="flex items-center space-x-4">
            {rider && (
              <>
                <span className="hidden md:inline">{rider.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
