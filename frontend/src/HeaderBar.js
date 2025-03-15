import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeaderBar({ menuOptions = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();  // Use navigate directly here

  const handleLogoClick = () => {
    navigate("/");  // Always navigate to the homepage
  };

  return (
    <header className="bg-black text-white p-2 flex justify-between items-center w-full relative">
      <h1 
        className="text-xl font-bold pl-4 cursor-pointer" 
        onClick={handleLogoClick}  // Navigate to homepage when logo is clicked
      >
        SEES
      </h1>

      {/* MENU BUTTON */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`border border-white px-4 py-1 rounded-md flex items-center transition-all text-sm ${
            isOpen ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          MENU <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
        </button>

        {/* DROPDOWN MENU */}
        {isOpen && menuOptions.length > 0 && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black border border-gray-300 rounded-md shadow-lg z-50">
            <ul className="divide-y divide-gray-300 text-sm">
              {menuOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={() => {
                    option.onClick(); // Execute the navigation function
                    setIsOpen(false); // Close the menu
                  }}
                  className={`p-2 cursor-pointer transition-all ${
                    option.label === "LOGOUT"
                      ? "hover:bg-red-600 hover:text-white"
                      : "hover:bg-black hover:text-white"
                  }`}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
