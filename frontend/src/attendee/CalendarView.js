import { useNavigate } from "react-router-dom";
import { CalendarPlus, BarChart, Users, FolderPlus } from "lucide-react";
import HeaderBar from "../HeaderBar"; // adjust the path as needed

export default function OrganizerLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HeaderBar Component */}
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
          <h2 className="text-4xl font-bold mb-4">Welcome, Organizer!</h2>
          <p className="text-gray-600 text-lg mb-6">
            Manage your events, sponsors, and view insights at a glance.
          </p>
          <button
            onClick={() => navigate("/create-event")}
            className="bg-black text-white py-3 px-8 rounded-lg transition-all duration-300 border border-black hover:bg-white hover:text-black hover:scale-105 hover:shadow-md"
          >
            Create New Event
          </button>
        </div>
        <div className="hidden md:block text-9xl font-extrabold text-gray-300">
          SEES
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-16 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        <ActionCard
          label="Create Event"
          icon={<CalendarPlus className="w-8 h-8" />}
          onClick={() => navigate("/create-event")}
        />
        <ActionCard
          label="My Events"
          icon={<FolderPlus className="w-8 h-8" />}
          onClick={() => navigate("/events")}
        />
        <ActionCard
          label="Manage Sponsors"
          icon={<Users className="w-8 h-8" />}
          onClick={() => navigate("/sponsors")}
        />
        <ActionCard
          label="View Analytics"
          icon={<BarChart className="w-8 h-8" />}
          onClick={() => navigate("/analytics")}
        />
      </section>

      {/* Events Summary */}
      <section className="px-16 py-10">
        <h3 className="text-2xl font-semibold mb-6">Your Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Example Event Cards */}
          <EventCard
            title="AI Summit 2025"
            date="March 24, 2025"
            location="Online"
            registrations={120}
            navigate={navigate}
          />
          <EventCard
            title="Finance Bootcamp"
            date="April 12, 2025"
            location="New York"
            registrations={85}
            navigate={navigate}
          />
          <EventCard
            title="Marketing Expo"
            date="May 7, 2025"
            location="Toronto"
            registrations={45}
            navigate={navigate}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-sm text-gray-600 p-4 pl-6">
        LOGGED IN AS: ORGANIZER
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

const EventCard = ({ title, date, location, registrations, navigate }) => (
  <div className="bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] p-6 flex flex-col justify-between">
    <div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-gray-600 text-sm mb-1">Date: {date}</p>
      <p className="text-gray-600 text-sm mb-1">Location: {location}</p>
      <p className="text-gray-600 text-sm">Registrations: {registrations}</p>
    </div>
    <div className="flex justify-end mt-6">
      <button
        onClick={() => navigate("/events")}
        className="bg-black text-white py-2 px-6 rounded-lg text-sm transition-all duration-300 hover:bg-white hover:text-black border border-black hover:scale-105"
      >
        Manage
      </button>
    </div>
  </div>
);
