import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";  // Import useNavigate hook
import logo from "./logo.jpg";  

const Register = () => {
  const [roleSelected, setRoleSelected] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();  // Initialize navigate

  const handleRoleSelect = (event) => {
    setRole(event.target.value);
    setRoleSelected(true);
  };

  const handleContinueAsGuest = () => {
    alert('You are continuing as a guest!');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    //we can save the user data to database here

    // After successful registration, navigate to the login page
    navigate('/login');  // Redirect to login page after successful registration
  };

  return (
    <div className="register-container">
      {/* Left Side - Image */}
      <div className="register-image">
        <div className="register-title"></div>  {/* Added title */}
        <img src={logo} alt="Background" />
      </div>

      {/* Right Side - Registration Form */}
      <div className="register-box">
        {!roleSelected ? (
          <>
            <h2 className="fw-bold">WELCOME TO SEES!</h2>
            <p className="text-muted">
              A platform for organizing and managing educational events with features
              like scheduling, attendee management, and analytics.
            </p>

            <select className="form-select my-3" value={role} onChange={handleRoleSelect}>
              <option value="">REGISTER AS</option>
              <option value="Administrator">Administrator</option>
              <option value="Attendee">Attendee</option>
              <option value="Organizer">Organizer</option>
              <option value="Stakeholder">Stakeholder</option>
            </select>

            <button className="btn btn-dark w-100 mt-2">CONTINUE</button>
            <button className="btn btn-outline-dark w-100 mt-2" onClick={handleContinueAsGuest}>
              CONTINUE AS GUEST
            </button>

            <p className="mt-3">
              Already have an account? <a href="/login" className="fw-bold">LOG IN</a>
            </p>
          </>
        ) : (
          <>
            <p id="info">ENTER YOUR INFORMATION</p>
            <h2 className="fw-bold">Register as {role}</h2>
            <form onSubmit={handleRegister}>  {/* On form submission, call handleRegister */}
              <input type="text" placeholder="Name" className="form-control my-2" />
              <input type="email" placeholder="Email" className="form-control my-2" />
              <input type="password" placeholder="Password" className="form-control my-2" />
              <button type="submit" className="btn btn-dark w-100 mt-2">CONTINUE</button>  {/* Submit the form */}
            </form>
            <p className="mt-3">
              Already have an account? <a href="/login" className="fw-bold">LOG IN</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
