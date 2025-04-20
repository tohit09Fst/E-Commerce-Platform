import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../../services/api';
import { CartContext } from '../../context/CartContext';
import UserNavbar from './UserNavbar';
import { toast } from 'react-toastify';
import Footer from './Footer';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  // Function to calculate the dynamic delivery date (7 days from today)
  const calculateDeliveryDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 7); // Add 7 days to current date
    return today.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  useEffect(() => {
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error('Failed to fetch product'));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <UserNavbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 shadow-xl rounded-lg  overflow-hidden">
          {/* Product Image */}
          <div className="w-full md:w-1/2 h-96 overflow-hidden relative">
            <img
              src={product.image || 'https://via.placeholder.com/300'}
              alt={product.name}
              className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg transform transition duration-500 hover:scale-105"
            />
            
          </div>
          

          {/* Product Details */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
            <h1 className="text-3xl font-semibold text-blue-900 mb-4">{product.name}</h1>
            <p className="text-gray-700 text-lg mb-4 line-clamp-3">{product.description}</p>

            {/* Price & Discount */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <p className="text-green-600 font-bold text-2xl">₹{product.price}</p>
                {product.originalPrice && (
                  <p className="line-through text-gray-500 text-lg">₹{product.originalPrice}</p>
                )}
              </div>
              {product.discount && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.discount}% off
                </span>
              )}
            </div>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400">⭐⭐⭐⭐</span>
              <span className="text-gray-600">4.2 | 1,558 Ratings & 5,606 Reviews</span>
            </div>

            {/* Offers Section */}
            <div className="border-t pt-4 mt-4 border-gray-300">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Available Offers</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>5% Unlimited Cashback on Flipkart Axis Bank Credit Card</li>
                <li>10% instant discount on SBI Credit Card Transactions, up to ₹1,250 on orders above ₹4,990</li>
                <li>10% instant discount on SBI Credit Card EMI Transactions, up to ₹1,500 on orders above ₹4,990</li>
                <li>Get extra 20% off (price inclusive of cashback/coupon)</li>
              </ul>
            </div>

            {/* Warranty & Delivery */}
            <div className="border-t pt-4 mt-4 border-gray-300">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Warranty & Delivery</h3>
              <p className="text-gray-600 mb-2">Warranty: 2 Year Assured Replacement Warranty Of Motor From Our Authorized Service Center Only.</p>
              <p className="text-gray-600 mb-2">Motor Technology: Induction</p>
              <div className="flex gap-4 items-center mb-2">
                <p className="text-gray-600">Secure delivery by <strong>{calculateDeliveryDate()}</strong></p>
                <p className="text-gray-600">Installation ₹199</p>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => {
                addToCart(product);
                toast.success('Added to cart');
              }}
              className="bg-green-500 text-white text-lg font-semibold px-6 py-2 rounded-full shadow-md hover:bg-green-600 transform transition-all duration-300 mt-4"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Description Highlights */}
        <div className="mt-8  p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">Highlights</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Blade Sweep: 1200 mm</li>
            <li>Design: Economy</li>
            <li>Energy Saving</li>
            <li>Easy Payment Options (Cash on Delivery, Net banking, Credit/Debit/ATM Card)</li>
          </ul>
        </div>

        {/* Product Seller Info */}
        <div className="mt-6 flex items-center gap-4">
          <p className="text-gray-800">Seller: <strong>ACTIVAHOME</strong></p>
          <p className="text-green-500">Rating: 4.1/5 (10 Days Replacement Policy)</p>
        </div>

        {/* Product Description */}
        <div className="mt-6  p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">Product Description</h2>
          <p className="text-gray-700">
            Give a new and complete look to your room by adding a stylish ceiling fan from our wide range. Digismart builds innovative products that provide meaningful solutions to consumer needs. 
            <br /><br />
            Digismart Dust-Free Fans help you stay cool and comfortable at all times. This motor gives instant drive to the appliance which avoids any delay when you switch on the fan. With an aerodynamic design, you get amazing air delivery, and the anti-dust technology reduces dust collection by 50%. The powerful motor works at 390 RPM, producing high-speed airflow for your comfort.
          </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
