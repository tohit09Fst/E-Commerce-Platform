import React, { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { app } from '../../Firebase';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import { FaEdit, FaSave, FaUserCircle } from 'react-icons/fa'; // Importing icons

const auth = getAuth(app);

export default function Profile() {
  const [name, setName] = useState(auth.currentUser?.displayName || '');
  const [email] = useState(auth.currentUser?.email || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = () => {
    updateProfile(auth.currentUser, { displayName: name })
      .then(() => {
        toast.success('Profile updated');
        setIsEditing(false);
      })
      .catch(() => toast.error('Update failed'));
  };

  return (
    <div className="bg-blue-100 min-h-screen">
      <UserNavbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-teal-600 mb-6">My Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-6">
            <FaUserCircle className="text-teal-600 text-5xl mr-4" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
              <p className="text-gray-600">{email}</p>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-teal-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
              />
            ) : (
              <p className="text-xl font-medium text-gray-700">{name}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Email</label>
            <p className="text-xl text-gray-700">{email}</p>
          </div>
          <div className="flex justify-end gap-4">
            {isEditing ? (
              <button
                onClick={handleUpdate}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-all duration-300"
              >
                <FaSave /> Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-all duration-300"
              >
                <FaEdit /> Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
