import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../services/api';
import UserNavbar from './UserNavbar';
import { toast } from 'react-toastify';

export default function ItemList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => toast.error('Failed to fetch products'));
  }, []);

  return (
    <div>
      <UserNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Fans & ACs</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white p-4 rounded shadow">
              <img
                src={product.image || 'https://via.placeholder.com/150'}
                alt={product.name}
                className="w-full h-40 object-cover mb-4"
              />
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-green-500 font-bold">₹{product.price}</p>
              <button
                onClick={() => navigate(`/product/${product._id}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}