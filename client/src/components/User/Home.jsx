import React from 'react';
import {
  AiOutlineShoppingCart,
  AiOutlineThunderbolt,
  AiOutlineDollar,
  AiOutlineCheckCircle,
  AiOutlineMail
} from 'react-icons/ai';
import { FaFan, FaSnowflake, FaCogs, FaStar } from 'react-icons/fa';
import UserNavbar from './UserNavbar';
import Footer from './Footer';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <UserNavbar />

      {/* Hero Section */}
      <section className="text-center py-16 px-6 bg-gradient-to-r from-blue-100 via-white to-blue-100">
        <h1 className="text-5xl font-extrabold text-blue-900 drop-shadow-md">Stay Cool, Shop Smart</h1>
        <p className="mt-4 text-xl text-gray-700">Premium Fans & Air Conditioners delivered to your door.</p>
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-lg">
          Shop Now
        </button>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 px-6 py-12">
        <Feature icon={<AiOutlineThunderbolt />} title="High Efficiency" desc="Our ACs and fans are built with energy-saving technology." color="text-yellow-500" />
        <Feature icon={<AiOutlineDollar />} title="Affordable Prices" desc="Seasonal discounts and free shipping." color="text-green-500" />
        <Feature icon={<AiOutlineShoppingCart />} title="Easy Shopping" desc="Quick checkout and secure payments." color="text-blue-500" />
      </section>

      {/* Featured Products */}
      <section className="px-6 py-10 bg-white">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Featured Products</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductCard icon={<FaFan />} name="CoolBreeze Fan" desc="Silent. Stylish. Energy-efficient." />
          <ProductCard icon={<FaSnowflake />} name="FrostPro AC" desc="Smart tech & fast cooling." />
          <ProductCard icon={<FaCogs />} name="Accessories" desc="Stands, Remotes, Filters & more." />
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-14 bg-gradient-to-r from-blue-50 via-white to-blue-100">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-10">Explore Categories</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <CategoryCard title="Air Conditioners" image="https://aws-obg-image-lb-2.tcl.com/content/dam/brandsite/global/images-for-blog/ac-maintenance-for-lasting-system-pc.jpg" />
          <CategoryCard title="Ceiling & Table Fans" image="https://i.pinimg.com/736x/72/5b/29/725b29f1d18a0d706994b115ee414a4b.jpg" />
          <CategoryCard title="Accessories" image="https://i.pinimg.com/736x/2a/34/75/2a3475c77268a3919d57c1a16a178156.jpg" />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-6 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-10">Why Customers Love Us</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Reason icon={<AiOutlineCheckCircle />} text="Trusted by 50K+ customers" />
          <Reason icon={<AiOutlineCheckCircle />} text="Fast nationwide delivery" />
          <Reason icon={<AiOutlineCheckCircle />} text="24/7 support with live chat" />
        </div>
      </section>

      {/* Reviews Section */}
      <section className="px-6 py-16 bg-blue-50">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-10">Customer Reviews</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ReviewCard name="Anjali Sharma" review="Amazing cooling, fast delivery. Totally recommend!" />
          <ReviewCard name="Ravi Mehra" review="Fan design is sleek and very quiet. Great buy." />
          <ReviewCard name="Sneha Patel" review="Excellent customer service. Very responsive." />
        </div>
      </section>


      {/* Footer */}
      <Footer/>
    </div>
  );
}

// Reusable Feature Card
const Feature = ({ icon, title, desc, color }) => (
  <div className="flex flex-col items-center text-center bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
    <div className={`text-4xl mb-2 ${color}`}>{icon}</div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-gray-500">{desc}</p>
  </div>
);

// Reusable Product Card
const ProductCard = ({ icon, name, desc }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 text-center transition">
    <div className="text-6xl text-blue-400 mx-auto mb-4">{icon}</div>
    <h3 className="text-xl font-semibold">{name}</h3>
    <p className="text-gray-500">{desc}</p>
    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
      View Details
    </button>
  </div>
);

// Reusable Category Card
const CategoryCard = ({ title, image }) => (
  <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-105">
    <img src={image} alt={title} className="h-48 w-full object-cover" />
    <div className="p-4 bg-white">
      <h3 className="text-lg font-bold text-blue-800">{title}</h3>
    </div>
  </div>
);

// Reusable Reason Card
const Reason = ({ icon, text }) => (
  <div className="flex items-center space-x-4 bg-blue-100 p-4 rounded-lg">
    <div className="text-2xl text-green-600">{icon}</div>
    <p className="text-gray-700">{text}</p>
  </div>
);

// Reusable Review Card
const ReviewCard = ({ name, review }) => (
  <div className="bg-white rounded-xl shadow-md p-6 text-left">
    <div className="flex items-center mb-3">
      <FaStar className="text-yellow-400 mr-1" />
      <FaStar className="text-yellow-400 mr-1" />
      <FaStar className="text-yellow-400 mr-1" />
      <FaStar className="text-yellow-400 mr-1" />
      <FaStar className="text-yellow-400" />
    </div>
    <p className="text-gray-700">{review}</p>
    <p className="mt-2 font-semibold text-blue-700">– {name}</p>
  </div>
);
