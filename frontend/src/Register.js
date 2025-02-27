import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo.jpg";  // Import your image

const Register = () => {
  const [roleSelected, setRoleSelected] = useState(false);
  const [role, setRole] = useState('');

  const handleRoleSelect = (event) => {
    setRole(event.target.value);
    setRoleSelected(true);
  };

  const handleContinueAsGuest = () => {
    alert('You are continuing as a guest!');
  };

  return (
    <div className="register-container">
      {/* Left Side - Image */}
      <div className="register-image">
        <div className="register-title">SEES</div>  {/* Added title */}
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
            <form>
              <input type="text" placeholder="Name" className="form-control my-2" />
              <input type="email" placeholder="Email" className="form-control my-2" />
              <input type="password" placeholder="Password" className="form-control my-2" />
              <button className="btn btn-dark w-100 mt-2">CONTINUE</button>
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
