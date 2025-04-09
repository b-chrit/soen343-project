import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, BarChart, Handshake, FolderPlus } from "lucide-react";
import HeaderBar from "../HeaderBar";
import CreateEventModal from "./CreateEventModal";

export default function OrganizerDashBoard() {
  const navigate = useNavigate();

  // State for Create Event Modal
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false); // For handling "View More" button

  const handleCreateEventClick = () => setShowCreateEventModal(true);
  const closeCreateEventModal = () => setShowCreateEventModal(false);

  // Fetch organizer's events from the backend
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5003/organizer/get_event", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();

      if (data.length > 3) {
        setHasMore(true);
        setEvents(data.slice(0, 3)); // Show maximum of 3 events initially
      } else {
        setEvents(data);
        setHasMore(false);
      }
    } catch (error) {
      setError("Failed to load events. Please try again later.");
    }
  };

  // Update the events when a new one is created
  const addNewEvent = (newEvent) => {
    setEvents((prevEvents) => [newEvent, ...prevEvents]); // Add the new event at the top
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Retrieve user type from local storage for footer
  const userType = localStorage.getItem("user_type");

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* ✅ HeaderBar */}
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

      {/* ✅ Hero Section */}
      <section className="px-16 py-12 bg-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold mb-4">Welcome, Organizer!</h2>
          <p className="text-gray-600 text-lg mb-6">
            Manage your events and view insights at a glance.
          </p>
          <button
            onClick={handleCreateEventClick}
            className="bg-black text-white py-3 px-8 rounded-lg transition-all duration-300 border border-black hover:bg-white hover:text-black hover:scale-105 hover:shadow-md"
          >
            Create New Event
          </button>
        </div>
        <div className="hidden md:block text-9xl font-extrabold text-gray-300 hover:text-black transition-colors duration-300">
          SEES
        </div>
      </section>

      {/* ✅ Quick Actions */}
      <section className="px-16 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        <ActionCard
          label="Create Event"
          icon={<CalendarPlus className="w-8 h-8" />}
          onClick={handleCreateEventClick}
        />
        <ActionCard
          label="My Events"
          icon={<FolderPlus className="w-8 h-8" />}
          onClick={() => navigate("/my-events")}
        />
        <ActionCard
          label="Request Sponsorship"
          icon={<Handshake className="w-8 h-8" />}
          onClick={() => navigate("/request-sponsorship")}
        />
        <ActionCard
          label="View Analytics"
          icon={<BarChart className="w-8 h-8" />}
          onClick={() => navigate("/analytics")}
        />
      </section>

      {/* ✅ Events Summary */}
      <section className="px-16 py-10">
        <h3 className="text-2xl font-semibold mb-6">Your Events</h3>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {events.length === 0 ? (
          <div className="text-center bg-gray-100 p-8 rounded-lg shadow-md">
            <p className="text-lg font-medium text-gray-700">You have no events yet.</p>
            <p className="text-sm text-gray-500 mt-2">Start by creating your first event!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <EventCard
                key={index}
                title={event.title}
                date={event.start}
                location={event.location}
                registrations={event.registrations}
                navigate={navigate}
              />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/my-events")}
              className="bg-black text-white py-3 px-8 rounded-lg transition-all duration-300 border border-black hover:bg-white hover:text-black hover:scale-105 hover:shadow-md"
            >
              View More
            </button>
          </div>
        )}
      </section>

      {/* ✅ Footer */}
      <footer className="text-sm text-gray-600 p-4 pl-6">
        LOGGED IN AS: {userType ? userType.toUpperCase() : "UNKNOWN"}
      </footer>

      {/* ✅ Create Event Modal */}
      {showCreateEventModal && (
        <CreateEventModal
          show={showCreateEventModal}
          onClose={closeCreateEventModal}
          onEventCreated={addNewEvent} // Pass the function to update events
        />
      )}
    </div>
  );
}

// ActionCard Component
const ActionCard = ({ label, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md cursor-pointer p-6 flex flex-col items-center transition-all duration-300 hover:scale-105"
  >
    <div className="mb-4 text-black">{icon}</div>
    <h4 className="text-lg font-semibold">{label}</h4>
  </div>
);

// EventCard Component
const EventCard = ({ title, date, location, registrations, navigate }) => (
  <div className="bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] p-6 flex flex-col justify-between">
    <div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-gray-600 text-sm mb-1">Date: {new Date(date).toLocaleDateString()}</p>
      <p className="text-gray-600 text-sm mb-1">Location: {location}</p>
      <p className="text-gray-600 text-sm">Registrations: {registrations}</p>
    </div>
  </div>
);
