import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Handshake,
  BarChart,
  FolderKanban,
  ArrowRight
} from "lucide-react";
import HeaderBar from "../HeaderBar";
export default function StakeholderDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);

  const fetchAllEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5003/event/get", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();

      if (data.length > 3) {
        setHasMore(true);
        setEvents(data.slice(0, 3));
      } else {
        setEvents(data);
        setHasMore(false);
      }
    } catch (error) {
      setError("Failed to load events. Please try again later.");
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const userType = localStorage.getItem("user_type");

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

      {/* Hero Section */}
      <section className="px-16 py-12 bg-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold mb-4">Welcome, Stakeholder!</h2>
          <p className="text-gray-600 text-lg mb-6">
            Support impactful events and track your sponsorships.
          </p>
          <button
            onClick={() => navigate("/sponsor-event")}
            className="bg-black text-white py-3 px-8 rounded-lg transition-all duration-300 border border-black hover:bg-white hover:text-black hover:scale-105 hover:shadow-md"
          >
            Sponsor an Event
          </button>
        </div>
        <div className="hidden md:block text-9xl font-extrabold text-gray-300 hover:text-black transition-colors duration-300">
          SEES
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-16 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard
          label="Sponsor & View My Events"
          icon={<FolderKanban className="w-8 h-8" />}
          onClick={() => navigate("/sponsor-event")}
        />
        <ActionCard
          label="Sponsorship Requests"
          icon={<Handshake className="w-8 h-8" />}
          onClick={() => navigate("/sponsorship-requests")}
        />
        <ActionCard
          label="View Analytics"
          icon={<BarChart className="w-8 h-8" />}
          onClick={() => navigate("/analytics")}
        />
      </section>

      {/* Events Summary */}
      <section className="px-16 py-10">
        <h3 className="text-2xl font-semibold mb-6">Available Events</h3>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {events.length === 0 ? (
          <div className="text-center bg-gray-100 p-8 rounded-lg shadow-md">
            <p className="text-lg font-medium text-gray-700">No events available.</p>
            <p className="text-sm text-gray-500 mt-2">Check back later to sponsor events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <EventCard
                key={index}
                title={event.title}
                date={event.start}
                location={event.location}
                organizer={event.organizer_name}
                onSponsorClick={() => navigate("/sponsor-event")}
              />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="text-center mt-4">
           <button
  onClick={() => navigate("/events")}
  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white font-semibold tracking-wide py-3 px-8 rounded-full border border-black shadow-sm hover:from-white hover:to-white hover:text-black hover:shadow-lg hover:scale-105 transition-all duration-300"
>
  View More
  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
</button>
          </div>
        )}
      </section>

      <footer className="text-sm text-gray-600 p-4 pl-6">
        LOGGED IN AS: {userType ? userType.toUpperCase() : "UNKNOWN"}
      </footer>
    </div>
  );
}

const ActionCard = ({ label, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md cursor-pointer p-6 flex flex-col items-center transition-all duration-300 hover:scale-105"
  >
    <div className="mb-4 text-black">{icon}</div>
    <h4 className="text-lg font-semibold">{label}</h4>
  </div>
);

const EventCard = ({ title, date, location, organizer, onSponsorClick }) => (
  <div className="bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] p-6 flex flex-col justify-between">
    <div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-gray-600 text-sm mb-1">Date: {new Date(date).toLocaleDateString()}</p>
      <p className="text-gray-600 text-sm mb-1">Location: {location}</p>
      <p className="text-gray-600 text-sm">Organizer: {organizer}</p>
    </div>
  </div>
);
