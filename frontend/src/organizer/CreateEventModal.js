import { useState } from "react";

export default function CreateEventModal({ show, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
    category: "",
    description: "",
    location: "",
    capacity: "",
    event_type: "",
    registration_fee: "0"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Format datetime to match exactly what the backend expects: yyyy-MM-ddThh:mm
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    
    try {
      const date = new Date(dateTimeString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateTimeString;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate fields
    const requiredFields = Object.values(formData).every((v) => v.toString().trim() !== "");
    if (!requiredFields) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // Format the data to match what the backend expects
      const formattedData = {
        ...formData,
        start: formatDateTime(formData.start),
        end: formatDateTime(formData.end),
        capacity: parseInt(formData.capacity),
        registration_fee: parseFloat(formData.registration_fee)
      };
      
      console.log("Sending data:", formattedData);

      const response = await fetch("http://localhost:5003/event/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        setSuccess("Event created successfully!");
        // Reset form data
        setFormData({
          title: "",
          start: "",
          end: "",
          category: "",
          description: "",
          location: "",
          capacity: "",
          event_type: "",
          registration_fee: "0"
        });
        
        // Close modal after delay
        setTimeout(() => {
          onClose();
          // If there's a callback to refresh events list
          if (typeof onSubmit === 'function') {
            onSubmit();
          }
        }, 1500);
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        setError(errorData.code || "Failed to create event. Try again.");
      }
    } catch (err) {
      console.error("Request error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-3xl font-bold text-gray-600 hover:text-black transition"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6">Create New Event</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event Title"
              className="border border-gray-300 rounded-md py-2 px-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Start</label>
              <input
                type="datetime-local"
                name="start"
                value={formData.start}
                onChange={handleChange}
                className="border border-gray-300 rounded-md py-2 px-3"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">End</label>
              <input
                type="datetime-local"
                name="end"
                value={formData.end}
                onChange={handleChange}
                className="border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border border-gray-300 rounded-md py-2 px-3"
            >
              <option value="">Select Category</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Business">Business</option>
              <option value="Marketing">Marketing</option>
              <option value="AI & Tech">AI & Tech</option>
              <option value="Tech & Business">Tech & Business</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="border border-gray-300 rounded-md py-2 px-3"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Description"
              className="border border-gray-300 rounded-md py-2 px-3"
            ></textarea>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Max attendees"
                min="1"
                className="border border-gray-300 rounded-md py-2 px-3"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Event Type</label>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
                className="border border-gray-300 rounded-md py-2 px-3"
              >
                <option value="">Select Type</option>
                <option value="Online">Online</option>
                <option value="In-Person">In-Person</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Fee ($)</label>
              <input
                type="number"
                name="registration_fee"
                value={formData.registration_fee}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black text-white py-3 px-6 rounded-lg hover:bg-white hover:text-black border border-black transition-all duration-300 hover:scale-105"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}