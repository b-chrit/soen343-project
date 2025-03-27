import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyEventsModal({
  event,
  onClose,
  onDeleteEvent,
  onEditEvent,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedEvent, setUpdatedEvent] = useState({
    title: event.title,
    category: event.category,
    start: event.start,
    end: event.end,
    location: event.location,
    description: event.description,
    capacity: event.capacity,
    event_type: event.event_type,
    registration_fee: event.registration_fee
  });

  const navigate = useNavigate();

  // Handle Edit Event
  const handleEdit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5003/event/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: event.id, ...updatedEvent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to edit event");
      }

      setIsSuccess(true);
      onEditEvent(event.id, updatedEvent);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete Event
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:5003/event/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: event.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete event");
      }

      setIsSuccess(true);
      onDeleteEvent(event.id);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update Event state when editing
  useEffect(() => {
    if (!isEditing) {
      setUpdatedEvent({
        title: event.title,
        category: event.category,
        start: event.start,
        end: event.end,
        location: event.location,
        description: event.description,
        capacity: event.capacity,
        registration_fee: event.registration_fee,
        event_type: event.event_type
      });
    }
  }, [isEditing, event]);

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

        {/* Edit or View Mode */}
        <div className="mt-6">
          {isEditing ? (
            <div className="space-y-4">
              {/* Editable Inputs for Event */}
              <div>
                <label className="block font-semibold text-sm text-gray-700 mb-2">Event Title</label>
                <input
                  type="text"
                  value={updatedEvent.title}
                  onChange={(e) =>
                    setUpdatedEvent({ ...updatedEvent, title: e.target.value })
                  }
                  placeholder="Enter event title"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-sm text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={updatedEvent.category}
                  onChange={(e) =>
                    setUpdatedEvent({ ...updatedEvent, category: e.target.value })
                  }
                  placeholder="Enter event category"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-sm text-gray-700 mb-2">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={updatedEvent.start}
                  onChange={(e) =>
                    setUpdatedEvent({ ...updatedEvent, start: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-sm text-gray-700 mb-2">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={updatedEvent.end}
                  onChange={(e) =>
                    setUpdatedEvent({ ...updatedEvent, end: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-sm text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={updatedEvent.location}
                  onChange={(e) =>
                    setUpdatedEvent({ ...updatedEvent, location: e.target.value })
                  }
                  placeholder="Enter event location"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-sm text-gray-700 mb-2">Description</label>
                <textarea
                  value={updatedEvent.description}
                  onChange={(e) =>
                    setUpdatedEvent({ ...updatedEvent, description: e.target.value })
                  }
                  placeholder="Enter event description"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-sm text-gray-700 mb-2">Capacity</label>
                <input
                  type="number"
                  value={updatedEvent.capacity}
                  onChange={(e) =>
                    setUpdatedEvent({ ...updatedEvent, capacity: e.target.value })
                  }
                  placeholder="Enter event capacity"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-sm text-gray-700 mb-2">Fee</label>
                <input
                  type="number"
                  value={updatedEvent.registration_fee}
                  onChange={(e) =>
                    setUpdatedEvent({ ...updatedEvent, registration_fee: e.target.value })
                  }
                  placeholder="Enter registration fee"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
              <div>
                <p className="font-semibold">Category:</p>
                <p>{event.category}</p>
              </div>
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
                <p className="font-semibold">Description:</p>
                <p>{event.description}</p>
              </div>
              <div>
                <p className="font-semibold">Capacity:</p>
                <p>{event.capacity}</p>
              </div>
              <div>
                <p className="font-semibold">Registrations:</p>
                <p>{event.registrations}</p>
              </div>
              <div>
                <p className="font-semibold">Sponsor:</p>
                <p>{event.sponsor_name || "No Sponsor"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="mt-6 text-center text-green-600">
            <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
            <p className="text-xl font-semibold">
              Event Updated Successfully!
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {/* Action Buttons */}
<div className="mt-6 flex justify-between">
  {isEditing ? (
    <>
      <button
        onClick={handleEdit}
        className={`bg-black text-white py-2 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:bg-gray-900 hover:scale-105 hover:shadow-lg ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </button>

      <button
        onClick={() => setIsEditing(false)}
        className="bg-white text-black border border-black py-2 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:bg-gray-100 hover:scale-105 hover:shadow-lg"
      >
        Cancel Edit
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => setIsEditing(true)}
        className="bg-black text-white py-2 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:bg-gray-900 hover:scale-105 hover:shadow-lg"
      >
        Edit
      </button>

      <button
        onClick={handleDelete}
        className="bg-red-600 text-white py-2 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:bg-red-700 hover:scale-105 hover:shadow-lg"
      >
        Delete
      </button>
    </>
  )}
</div>

      </div>
    </div>
  );
}
