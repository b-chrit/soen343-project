import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate input fields
    if (!email || !password) {
      setApiError('Please provide both email and password.');
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5003/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
      console.log('Login result:', result);
  
      if (response.ok) {
        // Save token and user_type in local storage
        localStorage.setItem("token", result.token);
        localStorage.setItem("user_type", result.user_type);
  
        // Console log for verification
        console.log("Logged in user type:", result.user_type);
  
        // Navigate to the correct dashboard
        if (result.user_type === "admin") {
          navigate("/admin-dashboard");
        } else if (result.user_type === "stakeholder") {
          navigate("/stakeholder-dashboard");
        } else {
          navigate("/dashboard");
        }        
      } else {
        setApiError(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.log("ERROR", error);
      setApiError("Something went wrong. Please try again later.");
    }
  };
  

  const handleGuestLogin = () => {
    setGuestMessage('You are continuing as a guest');
    navigate("/events");
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Left Side - Logo */}
      <div className="w-1/2 h-screen relative">
        <img
          src={logo}
          alt="Logo"
          className="object-cover w-full h-full"
        />
        <h1 className="absolute top-8 left-8 text-white text-4xl font-extrabold drop-shadow-lg">
          SEES
        </h1>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white px-12">
        <div className="w-full max-w-md text-center">
          <h2 className="text-4xl font-extrabold mb-6">WELCOME BACK!</h2>
          <p className="text-sm text-gray-700 mb-12 leading-relaxed">
            Login to manage events, view schedules, and explore educational experiences with SEES.
          </p>

          {/* Error message */}
          {apiError && (
            <p className="text-red-500 text-xs font-medium mb-4">{apiError}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 text-left">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase mb-2">Email</label>
              <input
                type="email"
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-black text-xs uppercase placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase mb-2">Password</label>
              <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-black text-xs uppercase placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-black text-white text-sm font-bold uppercase tracking-wider transition-all duration-300 border border-black rounded-md
                         hover:bg-white hover:text-black hover:scale-105 hover:shadow-md"
            >
              LOGIN
            </button>
          </form>

          {/* Continue as Guest */}
          <button
            onClick={handleGuestLogin}
            className="w-full py-3 mt-4 bg-white text-black text-sm font-bold uppercase tracking-wider border border-black transition-all duration-300 rounded-md
                       hover:bg-black hover:text-white hover:scale-105 hover:shadow-md"
          >
            CONTINUE AS GUEST
          </button>

          {/* Guest Message */}
          {guestMessage && (
            <p className="text-xs mt-4 text-green-600">{guestMessage}</p>
          )}

          {/* Register Link */}
          <p className="mt-8 text-xs text-black">
            NOT A MEMBER?{" "}
            <span
              onClick={() => navigate("/register")}
              className="font-bold cursor-pointer"
            >
              REGISTER NOW
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
