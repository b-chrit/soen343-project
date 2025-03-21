import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function EventModal({ event, onClose, updateEvents }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRegistered, setIsRegistered] = useState(event.isRegistered);

  const handleRegistration = async () => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const url = isRegistered
        ? "http://localhost:5003/cancel_registration_for_event"
        : "http://localhost:5003/register_attendee_for_event";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: event.id }),
      });

      if (!response.ok) {
        // If response is not OK, we capture the error message from the response
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred");
      }

      setIsSuccess(true);
      setIsRegistered(!isRegistered);

      if (updateEvents) {
        updateEvents(event.id, !isRegistered);
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);  // Display the error message returned by the backend
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) return null;

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

        {/* Event Category Badge */}
        <p className={`mt-3 text-sm px-4 py-2 rounded-md inline-block ${event.categoryColor || "bg-gray-100 text-gray-800"}`}>
          {event.category}
        </p>

        {/* Event Details */}
        <div className="mt-6 grid grid-cols-2 gap-6 text-gray-700 text-sm">
          <div>
            <p className="font-semibold">Start:</p>
            <p>{event.start ? new Date(event.start).toLocaleString() : "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">End:</p>
            <p>{event.end ? new Date(event.end).toLocaleString() : "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Location:</p>
            <p>{event.location || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Organizer:</p>
            <p>{event.organizer_name || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Sponsor:</p>
            <p>{event.sponsor_name || "None"}</p>
          </div>
          <div>
            <p className="font-semibold">Capacity:</p>
            <p>{event.capacity || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Registrations:</p>
            <p>{event.registrations || 0}</p>
          </div>
        </div>

        {/* Event Description */}
        <p className="mt-6 text-gray-800 leading-relaxed">
          <strong>Description:</strong> {event.description || "No additional details available for this event."}
        </p>

        {/* Register / Cancel Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleRegistration}
            disabled={isLoading}
            className={`py-3 px-8 font-medium rounded-lg border transition-all duration-300 
              ${isLoading
              ? "bg-gray-300 cursor-not-allowed border-gray-300 text-gray-500"
              : isRegistered
              ? "bg-red-600 text-white border-red-600 hover:bg-white hover:text-red-600"
              : "bg-black text-white border-black hover:bg-white hover:text-black"}`}
          >
            {isLoading
              ? "Processing..."
              : isRegistered
                ? "CANCEL REGISTRATION"
                : "REGISTER FOR EVENT"}
          </button>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="mt-6 text-center text-green-600 animate__animated animate__fadeIn">
            <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
            <p className="text-xl font-semibold">
              {isRegistered ? "Registration Successful!" : "Cancellation Successful!"}
            </p>
            <p>
              {isRegistered
                ? "You have successfully registered for this event."
                : "Your registration has been canceled."}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
