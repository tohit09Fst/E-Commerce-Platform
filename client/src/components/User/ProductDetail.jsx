import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../../services/api';
import { CartContext } from '../../context/CartContext';
import UserNavbar from './UserNavbar';
import { toast } from 'react-toastify';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error('Failed to fetch product'));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <UserNavbar />
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={product.image || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full md:w-1/2 h-60 object-cover rounded"
          />
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-green-500 font-bold text-xl">₹{product.price}</p>
            <p className="text-gray-500">Category: {product.category}</p>
            <p className="text-gray-500">Stock: {product.stock}</p>
            <button
              onClick={() => {
                addToCart(product);
                toast.success('Added to cart');
              }}
              className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}