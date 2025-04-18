
// components/Home.js
import React from 'react';
import UserNavbar from './UserNavbar';

export default function Home() {
  return (
    <div>
      <UserNavbar/> {/* Include UserNavbar */}
      <div className="p-4">
        <h1 className="text-3xl font-bold">Welcome to Home!</h1>
      </div>
    </div>
  );
}
