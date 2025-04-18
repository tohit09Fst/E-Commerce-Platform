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
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Login</h2>
      <input className="block border p-2 my-2 w-full" 
       placeholder="Email"
       value={email} 
       onChange={(e) => setEmail(e.target.value)} 
       type={email}
       />

      <input className="block border p-2 my-2 w-full" 
      placeholder="Enter your password"
      type="password" 
      value={password} 
      onChange={(e) => setPassword(e.target.value)}  />

      <button onClick={handleLogin} 
      className="bg-green-500 text-white px-4 py-2 rounded">Login</button>

<button onClick={SignInWithGoogle} 
      className="bg-orange-500 text-white px-4 py-2 rounded">
        signInWithGoogle
      </button>

      
    </div>
  );
}
