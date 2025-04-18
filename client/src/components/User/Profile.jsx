import React, { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { app } from '../../Firebase';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';

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
    <div>
      <UserNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="bg-white p-6 rounded shadow mb-6">
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full"
              />
            ) : (
              <p>{name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <p>{email}</p>
          </div>
          {isEditing ? (
            <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="bg-green-500 text-white px-4 py-2 rounded">
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}