import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./logo.jpg";

const Register = () => {
  const [roleSelected, setRoleSelected] = useState(false);
  const [role, setRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState(false);

  // Registration form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();

  const roles = ["Admin", "Attendee", "Organizer", "Stakeholder"];

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setError(false);
    setIsDropdownOpen(false);
  };

  const handleContinue = () => {
    if (!role) {
      setError(true);
      return;
    }
    setError(false);
    setRoleSelected(true);
  };

  const handleContinueAsGuest = () => {
    navigate("/events");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Build the payload dynamically
      const payload = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        user_type: role.toLowerCase(), // Normalize role to match backend expectations
      };

      // If the user is an Organizer, include additional fields
      if (role === "Organizer") {
        if (!organizationName || !phoneNumber) {
          setApiError("Organization name and phone number are required for organizers.");
          return;
        }
        payload.organization_name = organizationName;
        payload.phone_number = phoneNumber;
      }
      console.log("Payload: " + payload.user_type)
      const response = await fetch("http://localhost:5003/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const result = await response.json();
        setApiError(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      setApiError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Left Side */}
      <div className="w-1/2 h-screen relative">
        <img src={logo} alt="Logo" className="object-cover w-full h-full" />
        <h1 className="absolute top-8 left-8 text-white text-4xl font-extrabold drop-shadow-lg">
          SEES
        </h1>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white px-16 py-12">
        {!roleSelected ? (
          <div className="w-full max-w-md text-center flex flex-col space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl font-extrabold">WELCOME TO SEES!</h2>
              <p className="text-sm text-gray-700 leading-relaxed px-4">
                A platform for organizing and managing educational events with features like scheduling, attendee management, and analytics.
              </p>
            </div>

            {/* Dropdown */}
            <div className="relative w-full text-left space-y-2">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full flex justify-between items-center px-4 py-3 border text-sm font-medium uppercase tracking-wide transition-all duration-300
                ${error ? "border-red-500" : "border-black"}`}
              >
                {role || "REGISTER AS"}
                <span>{isDropdownOpen ? "▲" : "▼"}</span>
              </button>

              {isDropdownOpen && (
                <ul className="absolute w-full mt-1 border border-black bg-white z-10">
                  {roles.map((item) => (
                    <li
                      key={item}
                      onClick={() => handleRoleSelect(item)}
                      className={`px-4 py-3 text-sm uppercase cursor-pointer ${
                        role === item
                          ? "bg-black text-white"
                          : "hover:bg-black hover:text-white"
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {error && (
                <p className="text-red-500 text-xs font-medium">
                  Please select a role before continuing.
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col space-y-4 w-full">
              <button
                onClick={handleContinue}
                className="w-full py-3 bg-black text-white text-sm font-bold uppercase tracking-wider 
                border border-black rounded-md transition duration-300 ease-in-out transform
                hover:bg-white hover:text-black hover:scale-105 hover:shadow-md"
              >
                CONTINUE
              </button>

              <button
                onClick={handleContinueAsGuest}
                className="w-full py-3 bg-white text-black text-sm font-bold uppercase tracking-wider 
                border border-black rounded-md transition duration-300 ease-in-out transform
                hover:bg-black hover:text-white hover:scale-105 hover:shadow-md"
              >
                CONTINUE AS GUEST
              </button>
            </div>

            {/* Login Link */}
            <p className="text-xs text-black pt-2">
              ALREADY HAVE AN ACCOUNT?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-bold cursor-pointer"
              >
                LOG IN
              </span>
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md text-center flex flex-col space-y-8">
            {/* Title */}
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold">ENTER YOUR INFORMATION</h2>
              <p className="text-sm font-bold uppercase">REGISTER AS: {role.toUpperCase()}</p>
            </div>

            {apiError && (
              <div className="text-red-500 text-sm font-medium mb-4">{apiError}</div>
            )}

            <form onSubmit={handleRegister} className="flex flex-col space-y-6 text-left">
              {/* First Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase">First Name</label>
                <input
                  type="text"
                  placeholder="FIRST NAME"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-black text-xs uppercase placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase">Last Name</label>
                <input
                  type="text"
                  placeholder="LAST NAME"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-black text-xs uppercase placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase">Email</label>
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
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase">Password</label>
                <input
                  type="password"
                  placeholder="PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-black text-xs uppercase placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Organizer fields */}
              {role === "Organizer" && (
                <>
                  {/* Organization Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase">Organization Name</label>
                    <input
                      type="text"
                      placeholder="ORGANIZATION NAME"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-black text-xs uppercase placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase">Phone Number</label>
                    <input
                      type="text"
                      placeholder="PHONE NUMBER"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-black text-xs uppercase placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </>
              )}

              {/* CONTINUE Button */}
              <button
                type="submit"
                className="w-full py-3 mt-4 bg-black text-white text-sm font-bold uppercase tracking-wider 
                border border-black rounded-md transition-all duration-300 ease-in-out transform
                hover:bg-white hover:text-black hover:scale-105 hover:shadow-md"
              >
                CONTINUE
              </button>
            </form>

            {/* Login Link */}
            <p className="text-xs text-black pt-4">
              ALREADY HAVE AN ACCOUNT?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-bold cursor-pointer"
              >
                LOG IN
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
