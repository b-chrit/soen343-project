import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import HeaderBar from "./HeaderBar";
export default function ProfilePage({ onBack, onNavigateEvents, onNavigateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "JANE DOE",
    email: "JANE.DOE@GMAIL.COM",
    phone: "(123) 456-7890",
    role: "ATTENDEE",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => setIsEditing(false);
  const handleConfirmClick = () => {
    // Save changes (can be extended for API calls)
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <HeaderBar
          menuOptions={[
              { label: "EVENTS", onClick: onNavigateEvents },
              { label: "PROFILE", onClick: onNavigateProfile  },
              { label: "LOGOUT", onClick: () => console.log("Logging Out") },
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
            {Object.keys(formData).map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm text-gray-700">{key.toUpperCase()}</label>
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="border border-gray-400 py-3 px-4 rounded-md w-full text-lg"
                  readOnly={!isEditing}
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
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
                  onClick={handleConfirmClick}
                >
                  CONFIRM
                </button>
              </>
            ) : (
              <button
                className="py-2 px-6 bg-black text-white font-medium border border-black transition hover:bg-white hover:text-black"
                onClick={handleEditClick}
              >
                EDIT
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-sm text-gray-600 p-4 pl-6 absolute bottom-0 left-0">
        LOGGED IN AS: ATTENDEE
      </footer>
    </div>
  );
}
