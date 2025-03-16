import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import HeaderBar from "../HeaderBar";
import { useNavigate } from "react-router-dom";

// Category color mapping
const categoryColors = {
  Technology: "bg-blue-100 text-blue-800",
  Finance: "bg-green-100 text-green-800",
  Business: "bg-yellow-100 text-yellow-800",
  Marketing: "bg-purple-100 text-purple-800",
  "AI & Tech": "bg-pink-100 text-pink-800",
  "Tech & Business": "bg-teal-100 text-teal-800",
};

export default function EventDashboard() {
  const navigate = useNavigate();
  const days = ["yesterday", "today", "tomorrow"];
  const [dayIndex, setDayIndex] = useState(1);
  const [eventsData, setEventsData] = useState({
    yesterday: [],
    today: [],
    tomorrow: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from the backend and categorize them
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5003/get_event", {
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
      yesterday.setDate(today.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const formatDate = (dateObj) => dateObj.toISOString().split("T")[0];

      const eventsByDate = { yesterday: [], today: [], tomorrow: [] };

      data.forEach((event) => {
        const eventDateObj = new Date(event.start);
        const eventDateStr = formatDate(eventDateObj);

        const categoryColor =
          categoryColors[event.category] || "bg-gray-200 text-gray-800";

        const time = event.start.split(" ")[1]; // Extract time part
        const date = event.start.split(" ")[0]; // Extract date part

        const formattedEvent = {
          ...event,
          color: categoryColor,
          time,
          date,
        };

        if (eventDateStr === formatDate(yesterday)) {
          eventsByDate.yesterday.push(formattedEvent);
        } else if (eventDateStr === formatDate(today)) {
          eventsByDate.today.push(formattedEvent);
        } else if (eventDateStr === formatDate(tomorrow)) {
          eventsByDate.tomorrow.push(formattedEvent);
        }
      });

      setEventsData(eventsByDate);
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
    if (direction === "prev" && dayIndex > 0) {
      setDayIndex(dayIndex - 1);
    } else if (direction === "next" && dayIndex < days.length - 1) {
      setDayIndex(dayIndex + 1);
    }
  };

  const currentDay = days[dayIndex];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative">
      {/* HEADER BAR */}
      <HeaderBar
        menuOptions={[
          { label: "EVENTS", onClick: () => navigate("/events") },
          { label: "PROFILE", onClick: () => navigate("/profile") },
          {
            label: "LOGOUT",
            onClick: () => {
              localStorage.removeItem("token");
              navigate("/login");
            },
          },
        ]}
      />

      {/* MAIN CONTENT */}
      <div className="flex flex-grow items-center justify-center px-6 py-10 bg-gray-50">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* LEFT SIDE - SEES LOGO */}
          <div className="flex items-center justify-center">
            <h1 className="text-9xl font-extrabold text-gray-800 tracking-tight hover:text-black transition-all duration-300">
              SEES
            </h1>
          </div>

          {/* RIGHT SIDE - EVENTS */}
          <div className="flex flex-col items-center">
            {/* DAY NAVIGATION */}
            <div className="flex items-center mb-6 space-x-6">
              <button
                onClick={() => handleDayChange("prev")}
                disabled={dayIndex === 0}
                className={`p-2 rounded-full transition duration-300 ${
                  dayIndex === 0
                    ? "cursor-not-allowed opacity-40"
                    : "hover:bg-gray-200"
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <h2 className="text-xl md:text-2xl font-semibold uppercase tracking-wide text-gray-800">
                {currentDay}
              </h2>

              <button
                onClick={() => handleDayChange("next")}
                disabled={dayIndex === days.length - 1}
                className={`p-2 rounded-full transition duration-300 ${
                  dayIndex === days.length - 1
                    ? "cursor-not-allowed opacity-40"
                    : "hover:bg-gray-200"
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* EVENTS LIST */}
            <div className="w-full max-w-md space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 px-2">
              {loading && (
                <p className="text-gray-600 text-sm">Loading events...</p>
              )}

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {!loading && !error && eventsData[currentDay].length === 0 && (
                <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center animate-fadeIn">
                  <Calendar className="w-16 h-16 mx-auto text-gray-400" />
                  <p className="text-lg font-medium text-gray-700 mt-4">
                    No events for {currentDay}.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Check back later for updates!
                  </p>
                </div>
              )}

              {!loading &&
                !error &&
                eventsData[currentDay].map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-[1.02] px-4 py-3 animate-fadeIn"
                  >
                    {/* Category color bar */}
                    <div className={`w-2 h-16 ${event.color} rounded-l-md`} />

                    {/* Event Info */}
                    <div className="ml-4 flex flex-col">
                      <h3 className="font-semibold text-gray-800">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-500">{event.category}</p>
                      <p className="text-sm text-gray-600">
                        {event.date} • {event.time}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* VIEW CALENDAR BUTTON */}
            <div className="mt-10">
              <button
                onClick={() => navigate("/calendar")}
                className="bg-black text-white py-2 px-8 rounded-lg transition-all duration-300 border border-black hover:bg-white hover:text-black hover:scale-105 hover:shadow-lg"
              >
                View Events Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-sm text-gray-600 p-4 pl-6 absolute bottom-0 left-0">
        LOGGED IN AS: ATTENDEE
      </footer>
    </div>
  );
}
