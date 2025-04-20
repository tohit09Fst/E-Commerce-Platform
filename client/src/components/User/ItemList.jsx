import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../services/api';
import UserNavbar from './UserNavbar';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import Footer from './Footer';

export default function ItemList() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then((res) => {
        setProducts(res.data);
        setFiltered(res.data);
      })
      .catch(() => toast.error('Failed to fetch products'));
  }, []);

  useEffect(() => {
    let result = [...products];

    // Search Filter
    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category Filter
    if (category !== 'All') {
      result = result.filter((product) => product.category === category);
    }

    // Sort by Price
    if (sort === 'low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'high') {
      result.sort((a, b) => b.price - a.price);
    }

    setFiltered(result);
  }, [searchTerm, category, sort, products]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <UserNavbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-blue-900 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Premium Fans & ACs Collection
          </span>
        </h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full px-4 py-2 rounded-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-blue-500" />
          </div>

          {/* Category Filter */}
          <select
            className="px-4 py-2 rounded-full border border-blue-300 bg-white text-blue-800 focus:outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Fan">Fans</option>
            <option value="AC">ACs</option>
          </select>

          {/* Sort by price */}
          <select
            className="px-4 py-2 rounded-full border border-blue-300 bg-white text-blue-800 focus:outline-none"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort by Price</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative group">
                <img
                  src={product.image || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-green-600">₹{product.price}</p>
                  <button
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center mt-10 text-gray-500 text-lg">No products found.</div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
