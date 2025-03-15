import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeaderBar({ menuOptions = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="bg-black text-white p-2 flex justify-between items-center w-full relative">
      <h1 
        className="text-xl font-bold pl-4 cursor-pointer hover:text-gray-300 transition-all duration-300"
        onClick={handleLogoClick}
      >
        SEES
      </h1>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`border border-white px-4 py-1 rounded-md flex items-center transition-all text-sm
            ${isOpen ? "bg-white text-black" : "bg-black text-white"}
            hover:bg-gray-800 hover:text-white`}
        >
          MENU <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && menuOptions.length > 0 && (
          <div className="absolute right-0 mt-2 w-44 bg-white text-black border border-gray-300 rounded-md shadow-lg z-50">
            <ul className="divide-y divide-gray-300 text-xs">
              {menuOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={() => {
                    option.onClick();
                    setIsOpen(false);
                  }}
                  className={`p-2 cursor-pointer flex justify-between items-center 
                    transition-all duration-300 ease-in-out rounded-md
                    ${option.label === "LOGOUT"
                      ? "hover:bg-red-600 hover:text-white"
                      : "hover:bg-gray-800 hover:text-white"}
                    hover:scale-105 hover:shadow-md`}
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
