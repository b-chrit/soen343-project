import { useState, useEffect } from "react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react"; // For the eye icon
import HeaderBar from "./HeaderBar";
import { useNavigate } from "react-router-dom";

export default function ProfilePage({ onBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // States for password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Separate status for profile and password update
  const [updateStatus, setUpdateStatus] = useState(""); // For profile and password update status
  const [updateError, setUpdateError] = useState(""); // For storing backend error messages

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to login...");
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5003/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch user data:", response.statusText);
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        setFormData({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => setIsEditing(false);
  
  const handleProfileUpdate = async () => {
    console.log("Changes confirmed:", formData);
    setIsEditing(false);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5003/update_profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Failed to update profile:", errorResponse.error);
        setUpdateStatus("error");
        setUpdateError(errorResponse.error || "An error occurred.");
        return;
      }

      console.log("Profile updated successfully");
      setUpdateStatus("success");
      setTimeout(() => {
        setUpdateStatus("");
        setUpdateError("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePasswordChangeClick = () => setIsChangingPassword(true);
  const handleCancelPasswordChange = () => setIsChangingPassword(false);

  const handleConfirmPasswordChange = async () => {
    console.log("Submitting password change:", formData);

    // Reset error message
    setUpdateError("");

    if (formData.newPassword !== formData.confirmPassword) {
      console.log("Passwords do not match!");
      setUpdateStatus("error");
      setUpdateError("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5003/update_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
          confirm_password: formData.confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Failed to update password:", errorResponse.error);
        setUpdateStatus("error");
        setUpdateError(errorResponse.error || "An error occurred.");
        throw new Error("Failed to update password");
      }

      console.log("Password updated successfully");
      setUpdateStatus("success");
      setIsChangingPassword(false);

      // Auto-hide success/error message after 3 seconds
      setTimeout(() => {
        setUpdateStatus("");
        setUpdateError("");
      }, 3000);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  // Toggle visibility for password fields
  const toggleCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);
  const toggleNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <HeaderBar
        menuOptions={[
          { label: "EVENTS", onClick: () => navigate("/events") },
          { label: "PROFILE", onClick: () => navigate("/profile") },
          {
            label: "LOGOUT",
            onClick: () => {
              localStorage.removeItem("token");
              navigate("/login");
            },
          },
        ]}
      />
      {/* MAIN CONTENT */}
      <div className="px-16 py-8 flex flex-col">
        {/* BACK BUTTON & TITLE */}
        <div className="flex items-center space-x-4 mb-8">
          <button onClick={onBack} className="p-2">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <h1 className="text-4xl font-bold uppercase">My Profile</h1>
        </div>

        {/* PROFILE CARD */}
        <div className="border border-black rounded-lg p-12 w-[600px] mx-auto">
          {/* Avatar (Top Left) */}
          <div className="flex items-start">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-4xl">👤</span>
            </div>
          </div>

          {/* Form Fields (Two per Row) */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            {Object.keys(formData).map((key) => {
              if (
                key !== "currentPassword" &&
                key !== "newPassword" &&
                key !== "confirmPassword"
              ) {
                return (
                  <div key={key} className="flex flex-col w-full">
                  <label className="text-sm text-gray-700">
                    {key.replace("_", " ").toUpperCase()}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="border border-gray-400 py-3 px-4 rounded-md w-full text-lg"
                    readOnly={!isEditing}
                    style={key === "email" ? { width: '100%' } : {}}
                  />
                </div>
                
                );
              }
            })}
          </div>

          {/* Password Change Section */}
          {isChangingPassword && (
            <div className="mt-6">
              <div className="flex flex-col">
                <label className="text-sm text-gray-700">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="border border-gray-400 py-3 px-4 rounded-md w-full text-lg"
                  />
                  <span
                    onClick={toggleCurrentPassword}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff /> : <Eye />}
                  </span>
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <label className="text-sm text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="border border-gray-400 py-3 px-4 rounded-md w-full text-lg"
                  />
                  <span
                    onClick={toggleNewPassword}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff /> : <Eye />}
                  </span>
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <label className="text-sm text-gray-700">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="border border-gray-400 py-3 px-4 rounded-md w-full text-lg"
                  />
                  <span
                    onClick={toggleConfirmPassword}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-4">
                <button
                  className="py-2 px-6 bg-gray-300 text-black font-medium border border-gray-500 transition hover:bg-gray-400"
                  onClick={handleCancelPasswordChange}
                >
                  Cancel
                </button>
                <button
                  className="py-2 px-6 bg-black text-white font-medium border border-black transition hover:bg-white hover:text-black"
                  onClick={handleConfirmPasswordChange}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}

          {/* Display Status (Success/Error Message) */}
          {updateStatus && (
            <div
              className={`mt-4 ${updateStatus === "success" ? "text-green-500" : "text-red-500"}`}
            >
              {updateStatus === "success"
                ? "Profile updated successfully!"
                : updateError || "An error occurred."}
            </div>
          )}

          {/* Action Buttons */}
          {!isChangingPassword && (
            <div className="flex justify-end mt-6 space-x-4">
              {isEditing ? (
                <>
                  <button
                    className="py-2 px-6 bg-gray-300 text-black font-medium border border-gray-500 transition hover:bg-gray-400"
                    onClick={handleCancelClick}
                  >
                    CANCEL
                  </button>
                  <button
                    className="py-2 px-6 bg-black text-white font-medium border border-black transition hover:bg-white hover:text-black"
                    onClick={handleProfileUpdate}
                  >
                    CONFIRM
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="py-2 px-6 bg-black text-white font-medium border border-black transition hover:bg-white hover:text-black"
                    onClick={handleEditClick}
                  >
                    EDIT
                  </button>
                  <button
                    className="py-2 px-6 bg-black text-white font-medium border border-black transition hover:bg-white hover:text-black"
                    onClick={handlePasswordChangeClick}
                  >
                    CHANGE PASSWORD
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-sm text-gray-600 p-4 pl-6 absolute bottom-0 left-0">
        LOGGED IN AS: ATTENDEE
      </footer>
    </div>
  );
}
