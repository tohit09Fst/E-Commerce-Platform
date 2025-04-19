import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from './Firebase';
import { CartProvider } from './context/CartContext';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Home from './components/User/Home';
import ItemList from './components/User/ItemList';
import ProductDetail from './components/User/ProductDetail';
import Cart from './components/User/Cart';
import Profile from './components/User/Profile';
import MyOrders from './components/User/MyOrders';
import ContactAdmin from './components/User/ContactAdmin';
import AdminDashboard from './components/Admin/AdminDashboard';
import ViewOrderList from './components/Admin/ViewOrderList';
import ManageRiders from './components/Admin/ManageRiders';
import RiderLogin from './components/Rider/RiderLogin';
import RiderDashboard from './components/Rider/RiderDashboard';
import OrderDetail from './components/Rider/OrderDetail';

const auth = getAuth(app);

export default function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) return <div>Loading...</div>;

  console.log('Current user email:', user?.email);
  // Make case-insensitive comparison using environment variable
  const isAdmin = user?.email?.toLowerCase() === (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase(); // Case-insensitive admin email check
  console.log('Is admin?', isAdmin, 'Admin email from env:', import.meta.env.VITE_ADMIN_EMAIL);
  
  // Check if we're on a rider route
  const isRiderRoute = window.location.pathname.startsWith('/rider');


  return (
    <CartProvider user={user}>
      <Routes>
        {/* Rider Routes - These don't depend on Firebase auth state */}
        <Route path="/rider/login" element={<RiderLogin />} />
        <Route path="/rider/dashboard" element={<RiderDashboard />} />
        <Route path="/rider/order/:orderId" element={<OrderDetail />} />
        
        {/* Regular User and Admin Routes */}
        {user ? (
          isAdmin ? (
            <>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-order-list" element={<ViewOrderList />} />
              <Route path="/admin-riders" element={<ManageRiders />} />
              <Route path="*" element={<Navigate to="/admin-dashboard" />} />
            </>
          ) : (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/items-list" element={<ItemList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/contact-admin" element={<ContactAdmin />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </>
          )
        ) : isRiderRoute ? (
          // If on rider route but not logged in, redirect to rider login
          <Route path="*" element={<Navigate to="/rider/login" />} />
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </CartProvider>
  );
}