import { useState } from "react";
import GuestEventDescription from "./GuestEventDescription"


export default function GuestEventModal({ event, onClose}) {
  const [error, setError] = useState(null);

  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 w-full max-w-3xl h-[600px] rounded-lg relative flex flex-col shadow-lg border border-gray-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-3xl font-bold text-gray-600 hover:text-black transition"
        >
          &times;
        </button>

        <div className="w-full h-full">
            <GuestEventDescription 
              event={event} 
            />

        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
