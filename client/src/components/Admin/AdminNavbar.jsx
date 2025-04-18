// components/Admin/AdminNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../Firebase";

export default function AdminNavbar() {
  const auth = getAuth(app);

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("Admin signed out.");
      })
      .catch((error) => {
        console.error("Sign out error", error);
      });
  };

  return (
    <div className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <div>
          <Link to="/admin-dashboard" className="text-blue-500 text-xl font-bold mr-4">Dashboard</Link>
          <Link to="/admin-order-list" className="text-blue-500 text-xl font-bold mr-4">Admin Order List</Link> {/* New Link */}
        </div>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 mt-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
