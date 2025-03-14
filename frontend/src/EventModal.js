import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react"; // Success icon for better feedback

export default function EventModal({ event, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false); // State for success message

  if (!event) return null;

  const registerForEvent = async () => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false); // Reset success message before attempting registration

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        // Redirect to login if no token is found
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:5003/register_attendee_for_event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id: event.id,  // Send event ID for registration
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register for event");
      }

      // Successfully registered
      setIsSuccess(true);  // Show success message

      // Optional: close the modal after a brief delay for the user to see the success
      setTimeout(() => {
        onClose(); // Close the modal after success
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 w-full max-w-3xl rounded-lg relative shadow-lg border border-gray-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-3xl font-bold text-gray-600 hover:text-black transition"
        >
          &times;
        </button>

        {/* Event Title */}
        <h2 className="text-3xl font-bold text-black">{event.title}</h2>

        {/* Event Category */}
        <p className={`mt-3 text-sm px-4 py-2 ${event.color || "bg-blue-100 text-blue-800"} rounded-md inline-block`}>
          {event.category}
        </p>

        {/* Event Details */}
        <div className="mt-6 grid grid-cols-2 gap-6 text-gray-700 text-sm">
          <div>
            <p className="font-semibold">Start:</p>
            <p>{new Date(event.start).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-semibold">End:</p>
            <p>{new Date(event.end).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-semibold">Location:</p>
            <p>{event.location}</p>
          </div>
          <div>
            <p className="font-semibold">Organizer:</p>
            <p>{event.organizer_name || "Not available"}</p>
          </div>
          <div>
            <p className="font-semibold">Sponsor:</p>
            <p>{event.sponsor_name || "Not available"}</p>
          </div>
        </div>

        {/* Event Description */}
        <p className="mt-6 text-gray-800 leading-relaxed">
          <strong>Description:</strong> {event.description || "No additional details available for this event."}
        </p>

        {/* Button - Initially Black, Hover to White */}
        <div className="flex justify-center mt-8">
          <button
            onClick={registerForEvent}
            disabled={isLoading}
            className={`py-3 px-8 ${isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-black text-white"} font-medium rounded-lg border border-black transition-all duration-300 hover:bg-white hover:text-black`}
          >
            {isLoading ? "Registering..." : "REGISTER FOR EVENT"}
          </button>
        </div>

        {/* Show Success Message */}
        {isSuccess && (
          <div className="mt-6 text-center text-green-600 animate__animated animate__fadeIn">
            <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
            <p className="text-xl font-semibold">Registration Successful!</p>
            <p>Your registration for the event was completed successfully.</p>
          </div>
        )}

        {/* Show Error Message */}
        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
