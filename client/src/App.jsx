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

  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;


  return (
    <CartProvider user={user}>
      <Routes>
        {user ? (
          isAdmin ? (
            <>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-order-list" element={<ViewOrderList />} />
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