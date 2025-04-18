import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {app} from "../../Firebase";
import { Link } from 'react-router-dom';

const auth =getAuth(app);
const googleProvider =new GoogleAuthProvider();

export default function Register() {
    const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

  

  const handleRegister = () => {
  createUserWithEmailAndPassword(auth,email,password)
  .then(() => alert ('Success'))
  .catch((err) => alert(err.message));
  };

  const SignUpWithGoogle =()=>{
signInWithPopup(auth,googleProvider)
  }

  return (
    <div className="">
      <h2 className="text-2xl font-bold">Register</h2>
      <input className="block border p-2 my-2 w-full" 
      placeholder="Name" 
      value={name} 
      type="text"  
      onChange={(e) => setName(e.target.value)}  />

      <input className="block border p-2 my-2 w-full"
       placeholder="Email"
       value={email} 
       onChange={(e) => setEmail(e.target.value)} 
       type={email} />

      <input className="block border p-2 my-2 w-full" 
      placeholder="Enter your password"
      type="password" 
      value={password} 
      onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleRegister} 
      className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>

      <button onClick={SignUpWithGoogle} 
      className="bg-orange-500 text-white px-4 py-2 rounded">
        signInWithGoogle
      </button>

      <Link to="/register">Don't have an account? Register here</Link>
    </div>

  );
}
