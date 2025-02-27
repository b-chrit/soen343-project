import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [guestMessage, setGuestMessage] = useState('');  // State for guest message
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('User Logged In:', { email, password });
    
  };

  const handleGuestLogin = () => {
    setGuestMessage('You are continuing as a guest');  // Set message when guest logs in

  };

  return (
    <div className="register-container">
      {/* Left Half - Background Image */}
      <div className="register-image">
        <div className="register-title"></div>
      </div>

      {/* Right Half - Login Box */}
      <div className="register-box">
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input
              type="email"
              placeholder="USERNAME"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="button-container">
            <button type="submit" className="btn-dark">LOGIN</button>
            <p>NOT A MEMBER? <a href="/register" className="fw-bold">REGISTER NOW</a></p>
          </div>
        </form>

        {/* Continue as Guest Button */}
        <button onClick={handleGuestLogin} className="btn-outline-dark">
          CONTINUE AS A GUEST
        </button>

        {/* Guest message */}
        {guestMessage && (
          <p className="guest-message">
            {guestMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
