import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import HeaderBar from "../HeaderBar";

const categoryColors = {
  Technology: "bg-blue-100 text-blue-800",
  Finance: "bg-green-100 text-green-800",
  Business: "bg-yellow-100 text-yellow-800",
  Marketing: "bg-purple-100 text-purple-800",
  "AI & Tech": "bg-pink-100 text-pink-800",
  "Tech & Business": "bg-teal-100 text-teal-800",
};

export default function AttendeeDashboard() {
  const navigate = useNavigate();
  const userType = localStorage.getItem("user_type");

  const days = ["yesterday", "today", "tomorrow"];
  const [dayIndex, setDayIndex] = useState(1);
  const [eventsData, setEventsData] = useState({ yesterday: [], today: [], tomorrow: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
  
      if (!token) {
        navigate("/login");
        return;
      }
  
      const response = await fetch("http://localhost:5003/event/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("Failed to fetch events");
  
      const data = await response.json();
  
      const today = new Date();
      const yesterday = new Date(today);
      const tomorrow = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      tomorrow.setDate(today.getDate() + 1);
  
      // ✅ Use local time formatting
      const formatDate = (d) =>
        `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
          .getDate()
          .toString()
          .padStart(2, '0')}`;
  
      const grouped = { yesterday: [], today: [], tomorrow: [] };
  
      data.forEach((event) => {
        const date = event.start?.split(" ")[0];
        const time = event.start?.split(" ")[1];
        const color = categoryColors[event.category] || "bg-gray-200 text-gray-800";
  
        const formatted = { ...event, date, time, color };
  
        if (date === formatDate(yesterday)) grouped.yesterday.push(formatted);
        else if (date === formatDate(today)) grouped.today.push(formatted);
        else if (date === formatDate(tomorrow)) grouped.tomorrow.push(formatted);
      });
  
      setEventsData(grouped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDayChange = (direction) => {
    if (direction === "prev" && dayIndex > 0) setDayIndex(dayIndex - 1);
    if (direction === "next" && dayIndex < days.length - 1) setDayIndex(dayIndex + 1);
  };

  const currentDay = days[dayIndex];

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* HEADER */}
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

      {/* HERO */}
      <section className="px-16 py-12 bg-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold mb-4">Welcome, Attendee!</h2>
          <p className="text-gray-600 text-lg mb-6">
            Explore what's happening around you. Stay informed and involved.
          </p>
          <button
            onClick={() => navigate("/events")}
            className="bg-black text-white py-3 px-8 rounded-lg transition-all duration-300 border border-black hover:bg-white hover:text-black hover:scale-105 hover:shadow-md"
          >
            Register for an Event
          </button>
        </div>
        <div className="hidden md:block text-9xl font-extrabold text-gray-300 hover:text-black transition-colors duration-300">
          SEES
        </div>
      </section>

      {/* DAY NAVIGATION */}
      <section className="px-16 py-10 flex items-center justify-center space-x-6">
        <button
          onClick={() => handleDayChange("prev")}
          disabled={dayIndex === 0}
          className={`p-2 rounded-full transition duration-300 ${
            dayIndex === 0 ? "cursor-not-allowed opacity-40" : "hover:bg-gray-200"
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold uppercase tracking-wide text-gray-800">
          {currentDay}
        </h2>
        <button
          onClick={() => handleDayChange("next")}
          disabled={dayIndex === days.length - 1}
          className={`p-2 rounded-full transition duration-300 ${
            dayIndex === days.length - 1 ? "cursor-not-allowed opacity-40" : "hover:bg-gray-200"
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* EVENTS LIST */}
      <section className="px-16 pb-20">
        {loading && <p className="text-gray-500 text-sm">Loading events...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && eventsData[currentDay].length === 0 && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center animate-fadeIn">
            <Calendar className="w-16 h-16 mx-auto text-gray-400" />
            <p className="text-lg font-medium text-gray-700 mt-4">
              No events for {currentDay}.
            </p>
            <p className="text-sm text-gray-500 mt-1">Check back later for updates!</p>
          </div>
        )}

        {!loading && !error && eventsData[currentDay].length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventsData[currentDay].map((event, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] p-6"
              >
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${event.color} mb-2`}
                >
                  {event.category}
                </span>
                <p className="text-sm text-gray-600">Date: {event.date}</p>
                <p className="text-sm text-gray-600">Time: {event.time}</p>
                <p className="text-sm text-gray-600">Location: {event.location}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="text-sm text-gray-600 p-4 pl-6">
        LOGGED IN AS: {userType ? userType.toUpperCase() : "UNKNOWN"}
      </footer>
    </div>
  );
}
