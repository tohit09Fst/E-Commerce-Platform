import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-blue-100 text-blue-900 pt-10 pb-6 border-t mt-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo and Description */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <img
              src="https://img.freepik.com/free-vector/colorful-letter-m-gradient-logo-design_474888-2270.jpg"
              alt="Logo"
              className="w-12 h-12 rounded-full"
            />
            <h2 className="text-2xl font-bold">MegaCool</h2>
          </div>
          <p className="text-sm">Your one-stop shop for premium ACs and fans, delivering comfort to your home with style and reliability.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-blue-700 transition">Home</Link></li>
            <li><Link to="/items-list" className="hover:text-blue-700 transition">Products</Link></li>
            <li><Link to="/cart" className="hover:text-blue-700 transition">Cart</Link></li>
            <li><Link to="/contact-admin" className="hover:text-blue-700 transition">About</Link></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <p className="text-sm mb-2">Email: support@megacool.com</p>
          <p className="text-sm mb-4">Phone: +91 98765 43210</p>
          <div className="flex space-x-4 text-blue-800">
            <a href="#" className="hover:text-blue-600"><FaFacebookF /></a>
            <a href="#" className="hover:text-blue-600"><FaTwitter /></a>
            <a href="#" className="hover:text-blue-600"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-600"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 text-sm text-blue-700">
        © {new Date().getFullYear()} MegaCool. All rights reserved.
      </div>
    </footer>
  );
}
