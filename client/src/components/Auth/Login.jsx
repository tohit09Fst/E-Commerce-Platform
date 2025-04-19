import { useState } from "react";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {app} from "../../Firebase";

const auth =getAuth(app);
const googleProvider =new GoogleAuthProvider();


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
 
const handleLogin = ()=>{
signInWithEmailAndPassword(auth,email,password)
.then(() => alert ('Success'))
.catch((err) => console.log(err));
}
const SignInWithGoogle =()=>{
signInWithPopup(auth,googleProvider)
  }
 

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Customer Login</h2>
      
      <input className="block border p-2 my-4 w-full rounded" 
       placeholder="Email"
       value={email} 
       onChange={(e) => setEmail(e.target.value)} 
       type="email"
       />

      <input className="block border p-2 my-4 w-full rounded" 
      placeholder="Enter your password"
      type="password" 
      value={password} 
      onChange={(e) => setPassword(e.target.value)}  />

      <button onClick={handleLogin} 
      className="bg-green-500 text-white px-4 py-2 rounded w-full mb-4 hover:bg-green-600">Login</button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <button onClick={SignInWithGoogle} 
      className="flex items-center justify-center w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">
        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032
            s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2
            C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#4285F4"/>
        </svg>
        Sign in with Google
      </button>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account? <a href="/register" className="text-blue-500 hover:text-blue-700">Register here</a>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Are you a rider? <a href="/rider/login" className="text-blue-500 hover:text-blue-700">Login to Rider Portal</a>
        </p>
      </div>
    </div>
  );
}
