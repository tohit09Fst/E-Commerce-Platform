import React from 'react';
import { FaRegHandshake, FaRegLightbulb, FaUserFriends } from 'react-icons/fa'; // Import React Icons
import UserNavbar from './UserNavbar';
import Footer from './Footer';

export default function ContactAdmin() {
  return (
    <div>
      <UserNavbar /> {/* Include UserNavbar */}
      
      {/* About Section */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-6 animate__animated animate__fadeInUp">
            Welcome to About Us!
          </h1>
          <p className="text-xl mb-6 animate__animated animate__fadeInUp animate__delay-1s">
            Our mission is to offer high-quality products and services to our customers, ensuring complete satisfaction with every order.
          </p>
          
          <div className="flex justify-center gap-12 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out">
              <FaRegHandshake className="text-4xl mb-4 text-teal-500" />
              <h3 className="text-2xl font-semibold">Customer Satisfaction</h3>
              <p className="text-lg text-gray-700 mt-2">
                We value our customers and strive to provide excellent service, ensuring a seamless shopping experience.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out">
              <FaRegLightbulb className="text-4xl mb-4 text-teal-500" />
              <h3 className="text-2xl font-semibold">Innovation</h3>
              <p className="text-lg text-gray-700 mt-2">
                We are constantly evolving and introducing innovative solutions to enhance our products and services.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out">
              <FaUserFriends className="text-4xl mb-4 text-teal-500" />
              <h3 className="text-2xl font-semibold">Community</h3>
              <p className="text-lg text-gray-700 mt-2">
                Building a strong community where our customers can interact and connect with each other is our priority.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-teal-500 mb-6">Our Values</h2>
          <ul className="list-disc pl-5 space-y-3 text-lg text-gray-800">
            <li>Customer-first approach</li>
            <li>Integrity and Transparency</li>
            <li>Continuous Improvement</li>
            <li>Environmental Sustainability</li>
          </ul>

         
        </div>
      </div>
      <Footer/>
    </div>
  );
}
