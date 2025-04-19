import { useState, useEffect } from "react";
import { ChevronLeft, Eye, EyeOff, User, Mail, Phone, Building, Check, AlertCircle } from "lucide-react";
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
    phone_number: "",
    organization_name: "",
  });
  const [initialFormData, setInitialFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    organization_name: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [updateStatus, setUpdateStatus] = useState("");
  const [updateError, setUpdateError] = useState("");

  const navigate = useNavigate();

  // Get the user type from localStorage
  const userType = localStorage.getItem("user_type");
  const isOrganizer = userType?.toLowerCase() === "organizer";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to login...");
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5003/user/get_profile", {
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

        setInitialFormData({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          phone_number: userData.phone_number || "",
          organization_name: userData.organization_name || "",
        });

        setFormData({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          phone_number: userData.phone_number || "",
          organization_name: userData.organization_name || "",
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
  
  const handleCancelClick = () => {
    setFormData({
      ...initialFormData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditing(false);
  };

  const handleProfileUpdate = async () => {
    console.log("Changes confirmed:", formData);
    setIsEditing(false);

    try {
      const token = localStorage.getItem("token");
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
      };

      // Only include organizer fields if user is an organizer
      if (isOrganizer) {
        updateData.phone_number = formData.phone_number;
        updateData.organization_name = formData.organization_name;
      }

      const response = await fetch("http://localhost:5003/user/edit_profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
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
      
      // Update initialFormData to reflect the changes
      setInitialFormData({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        organization_name: formData.organization_name,
      });
      
      setTimeout(() => {
        setUpdateStatus("");
        setUpdateError("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePasswordChangeClick = () => setIsChangingPassword(true);
  
  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleConfirmPasswordChange = async () => {
    console.log("Submitting password change:", formData);

    setUpdateError("");

    if (formData.newPassword !== formData.confirmPassword) {
      console.log("Passwords do not match!");
      setUpdateStatus("error");
      setUpdateError("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5003/user/reset_password", {
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
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setUpdateStatus("");
        setUpdateError("");
      }, 3000);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

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
              localStorage.removeItem("user_type");
              navigate("/login");
            },
          },
        ]}
      />

      <div className="px-16 py-8 flex flex-col">
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={onBack} 
            className="p-2 hover:bg-gray-100 rounded-full transition duration-200"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <h1 className="text-4xl font-bold uppercase">My Profile</h1>
        </div>

        <div className="border border-black rounded-lg p-12 w-[600px] mx-auto shadow-md bg-white">
          {/* Profile header with avatar */}
          <div className="flex items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center shadow-md">
              <User className="w-12 h-12" />
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold">
                {formData.first_name} {formData.last_name}
              </h2>
              <div className="mt-1 inline-flex items-center px-3 py-1 rounded-full bg-gray-200 text-gray-800 text-sm font-semibold">
                {userType ? userType.toUpperCase() : "USER"}
              </div>
            </div>
          </div>

          {/* Status message */}
          {updateStatus && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center ${
                updateStatus === "success" 
                ? "bg-gray-100 border-l-4 border-green-500 text-green-700" 
                : "bg-gray-100 border-l-4 border-red-500 text-red-700"
              }`}
            >
              {updateStatus === "success" ? (
                <Check className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              <span>
                {updateStatus === "success"
                  ? "Profile updated successfully!"
                  : updateError || "An error occurred."}
              </span>
            </div>
          )}

          {/* Profile edit form */}
          {!isChangingPassword ? (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">FIRST NAME</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className={`border ${isEditing ? 'border-black' : 'border-gray-400'} py-3 px-4 rounded-md w-full text-lg focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200`}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">LAST NAME</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className={`border ${isEditing ? 'border-black' : 'border-gray-400'} py-3 px-4 rounded-md w-full text-lg focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200`}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-semibold text-gray-700">EMAIL</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`border ${isEditing ? 'border-black' : 'border-gray-400'} py-3 px-4 rounded-md w-full text-lg focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200 pl-10`}
                      readOnly={!isEditing}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  </div>
                </div>

                {/* Organizer-specific fields */}
                {isOrganizer && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">PHONE NUMBER</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          className={`border ${isEditing ? 'border-black' : 'border-gray-400'} py-3 px-4 rounded-md w-full text-lg focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200 pl-10`}
                          readOnly={!isEditing}
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">ORGANIZATION NAME</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="organization_name"
                          value={formData.organization_name}
                          onChange={handleChange}
                          className={`border ${isEditing ? 'border-black' : 'border-gray-400'} py-3 px-4 rounded-md w-full text-lg focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200 pl-10`}
                          readOnly={!isEditing}
                        />
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                {isEditing ? (
                  <>
                    <button
                      className="py-3 px-8 rounded bg-gray-100 text-black font-medium border border-gray-300 hover:bg-gray-200 transition duration-200"
                      onClick={handleCancelClick}
                    >
                      CANCEL
                    </button>
                    <button
                      className="py-3 px-8 rounded bg-black text-white font-medium border border-black hover:bg-white hover:text-black transition duration-200"
                      onClick={handleProfileUpdate}
                    >
                      SAVE CHANGES
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="py-3 px-8 rounded bg-gray-100 text-black font-medium border border-gray-300 hover:bg-gray-200 transition duration-200"
                      onClick={handlePasswordChangeClick}
                    >
                      CHANGE PASSWORD
                    </button>
                    <button
                      className="py-3 px-8 rounded bg-black text-white font-medium border border-black hover:bg-white hover:text-black transition duration-200"
                      onClick={handleEditClick}
                    >
                      EDIT PROFILE
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Password change form */
            <div className="space-y-6">
              <h3 className="text-xl font-bold border-b border-gray-200 pb-2">Change Password</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">CURRENT PASSWORD</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="border border-gray-400 py-3 px-4 rounded-md w-full text-lg focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={toggleCurrentPassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition duration-200"
                    >
                      {showCurrentPassword ? 
                        <EyeOff className="w-5 h-5" /> : 
                        <Eye className="w-5 h-5" />
                      }
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">NEW PASSWORD</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="border border-gray-400 py-3 px-4 rounded-md w-full text-lg focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={toggleNewPassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition duration-200"
                    >
                      {showNewPassword ? 
                        <EyeOff className="w-5 h-5" /> : 
                        <Eye className="w-5 h-5" />
                      }
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">CONFIRM NEW PASSWORD</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="border border-gray-400 py-3 px-4 rounded-md w-full text-lg focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition duration-200"
                    >
                      {showConfirmPassword ? 
                        <EyeOff className="w-5 h-5" /> : 
                        <Eye className="w-5 h-5" />
                      }
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  className="py-3 px-8 rounded bg-gray-100 text-black font-medium border border-gray-300 hover:bg-gray-200 transition duration-200"
                  onClick={handleCancelPasswordChange}
                >
                  CANCEL
                </button>
                <button
                  className="py-3 px-8 rounded bg-black text-white font-medium border border-black hover:bg-white hover:text-black transition duration-200"
                  onClick={handleConfirmPasswordChange}
                >
                  UPDATE PASSWORD
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-sm text-gray-600 p-4 pl-6 absolute bottom-0 left-0">
        LOGGED IN AS: {userType ? userType.toUpperCase() : "UNKNOWN"}
      </footer>
    </div>
  );
}