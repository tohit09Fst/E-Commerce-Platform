import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { createOrder } from '../../services/api';
import { getAuth } from 'firebase/auth';
import { app } from '../../Firebase';
import UserNavbar from './UserNavbar';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const auth = getAuth(app);

export default function Cart() {
  const { cart, removeFromCart, setCart } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryPincode, setDeliveryPincode] = useState('');
  const [installation, setInstallation] = useState(false);
  const [protectionPlan, setProtectionPlan] = useState(false);
  const navigate = useNavigate();

  // Price calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.floor(subtotal * 0.51); // 51% discount as per image
  const deliveryCharge = deliveryPincode ? 0 : 40; // Free if pincode entered
  const installationFee = installation ? 1350 : 0;
  const protectionFee = protectionPlan ? 1399 : 0;
  const total = subtotal - discount + deliveryCharge + installationFee + protectionFee;

  const handleOrder = () => {
    if (!paymentMethod) {
      toast.error('Select a payment method');
      return;
    }
    if (!deliveryPincode) {
      toast.error('Enter delivery pincode');
      return;
    }

    const order = {
      userId: auth.currentUser.uid,
      products: cart.map((item) => ({ productId: item._id, quantity: item.quantity })),
      total,
      status: 'Paid',
    };

    createOrder(order)
      .then(() => {
        toast.success('Order placed successfully');
        setCart([]);
        navigate('/profile');
      })
      .catch(() => toast.error('Order placement failed'));
  };

  return (
    <div>
      <UserNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Summary */}
            <div className="bg-white p-4 rounded shadow">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center mb-4 border-b pb-4">
                  <img
                    src={item.image || 'https://via.placeholder.com/100'}
                    alt={item.name}
                    className="w-24 h-24 object-cover mr-4"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-green-600 font-bold">₹{item.price * item.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="mt-4">
                <button className="text-blue-500 mr-4">Save for Later</button>
                <button className="text-red-500">Remove</button>
              </div>
            </div>

            {/* Price Details and Actions */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Price Details</h2>
              <div className="space-y-2">
                <p>Price ({cart.length} item{cart.length > 1 ? 's' : ''}) <span className="float-right">₹{subtotal}</span></p>
                <p className="text-green-600">
                  Discount <span className="float-right">-₹{discount}</span>
                </p>
                <p>
                  Delivery Charges{' '}
                  <span className="float-right">
                    {deliveryPincode ? '₹40 Free' : '₹40'}
                  </span>
                </p>
                {installation && <p>Installation Fee <span className="float-right">₹1,350</span></p>}
                {protectionPlan && <p>Protection Plan <span className="float-right">₹1,399</span></p>}
                <p className="text-lg font-bold mt-4">
                  Total Amount <span className="float-right">₹{total}</span>
                </p>
                <p className="text-green-600">
                  You will save ₹{discount} on this order
                </p>
              </div>

              {/* Delivery Pincode */}
              <div className="mt-4">
                <label className="block text-gray-700">Enter Delivery Pincode</label>
                <input
                  type="text"
                  value={deliveryPincode}
                  onChange={(e) => setDeliveryPincode(e.target.value)}
                  className="border p-2 w-full mt-1"
                  placeholder="Enter pincode"
                />
              </div>

              {/* Additional Services */}
              <div className="mt-4">
                <div className="border p-4 mb-4">
                  <h3 className="text-md font-semibold">Installation and Demo</h3>
                  <p>₹1,350 • Installation & Demo by Sat, Apr 26</p>
                  <button
                    onClick={() => setInstallation(!installation)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded mt-2"
                  >
                    {installation ? 'Remove' : 'Add'}
                  </button>
                </div>
                <div className="border p-4">
                  <h3 className="text-md font-semibold">Complete Appliance Protection (3 years)</h3>
                  <p>₹1,399 ₹2,699 48% off</p>
                  <p className="text-gray-600">Save money on repair and maintenance...</p>
                  <button
                    onClick={() => setProtectionPlan(!protectionPlan)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded mt-2"
                  >
                    {protectionPlan ? 'Remove' : 'Add'}
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-4">
                <label className="block text-gray-700">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="border p-2 w-full mt-1"
                >
                  <option value="">Select</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleOrder}
                className="bg-orange-500 text-white px-4 py-2 rounded w-full mt-4"
                disabled={!paymentMethod || !deliveryPincode}
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}