import React, { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../../Firebase';
import { useNavigate } from 'react-router-dom';
import { registerRider } from '../../services/api';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function RiderLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Register or get rider from backend
      const response = await registerRider({
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        phone: user.phoneNumber || ''
      });
      
      // Store rider info in local storage
      localStorage.setItem('riderInfo', JSON.stringify(response.data));
      
      // Navigate to rider dashboard
      navigate('/rider/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check if rider is already logged in
  useEffect(() => {
    const riderInfo = localStorage.getItem('riderInfo');
    if (riderInfo) {
      navigate('/rider/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Rider Login</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-3 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mb-4"
        >
          <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1">
            <title>Google-color</title>
            <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="Color-" transform="translate(-401.000000, -860.000000)">
                <g id="Google" transform="translate(401.000000, 860.000000)">
                  <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"></path>
                  <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"></path>
                  <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"></path>
                  <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"></path>
                </g>
              </g>
            </g>
          </svg>
          <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
        </button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Are you a customer? <a href="/login" className="text-teal-600 hover:text-teal-800 transition-all duration-300">Login here</a>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Are you an admin? <a href="/login" className="text-teal-600 hover:text-teal-800 transition-all duration-300">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}