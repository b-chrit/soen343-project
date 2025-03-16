import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"; // Added icon
import HeaderBar from "../HeaderBar";
import { useNavigate } from "react-router-dom";

// Define category colors
const categoryColors = {
  Technology: "bg-blue-100 text-blue-800",
  Finance: "bg-green-100 text-green-800",
  Business: "bg-yellow-100 text-yellow-800",
  Marketing: "bg-purple-100 text-purple-800",
  "AI & Tech": "bg-pink-100 text-pink-800",
  "Tech & Business": "bg-teal-100 text-teal-800",
};

export default function EventDashboard() {
  const navigate = useNavigate(); // Use navigate for navigation
  const days = ["yesterday", "today", "tomorrow"];
  const [dayIndex, setDayIndex] = useState(1);
  const [eventsData, setEventsData] = useState({
    yesterday: [],
    today: [],
    tomorrow: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events and categorize them by date
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

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      // Filter events by date
      const eventsByDate = {
        yesterday: [],
        today: [],
        tomorrow: [],
      };

      data.forEach((event) => {
        const eventDate = new Date(event.start);
        const eventDateString = eventDate.toISOString().split("T")[0];

        // Map event categories to colors
        const eventCategoryColor = categoryColors[event.category] || "bg-gray-200 text-gray-800"; // Default color if category is not found

        const eventWithColor = { ...event, color: eventCategoryColor };

        if (eventDateString === yesterday.toISOString().split("T")[0]) {
          eventsByDate.yesterday.push(eventWithColor);
        } else if (eventDateString === today.toISOString().split("T")[0]) {
          eventsByDate.today.push(eventWithColor);
        } else if (eventDateString === tomorrow.toISOString().split("T")[0]) {
          eventsByDate.tomorrow.push(eventWithColor);
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
  }, [navigate]);

  const handleDayChange = (direction) => {
    if (direction === "prev" && dayIndex > 0) {
      setDayIndex(dayIndex - 1);
    } else if (direction === "next" && dayIndex < days.length - 1) {
      setDayIndex(dayIndex + 1);
    }
  };

  const currentDay = days[dayIndex];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* REUSABLE HEADER WITH MENU OPTIONS */}
       <HeaderBar
         menuOptions={[ 
           { label: "EVENTS", onClick: () => navigate("/events") }, 
           { label: "PROFILE", onClick: () => navigate("/profile") }, 
           { label: "LOGOUT", onClick: () => { localStorage.removeItem("token"); navigate("/login"); } }
         ]}
       />

      {/* MAIN CONTENT */}
      <div className="flex flex-grow items-center justify-center px-20 py-12">
        <div className="w-full max-w-6xl flex">
          {/* LEFT SECTION (Equal Width) */}
          <div className="w-1/2 flex items-center justify-center">
            <h1 className="text-9xl font-bold">SEES</h1>
          </div>

          {/* RIGHT SECTION (Equal Width) */}
          <div className="w-1/2 flex flex-col items-center">
            {/* DAY NAVIGATION */}
            <div className="flex items-center justify-center mb-8 space-x-6">
              <button
                onClick={() => handleDayChange("prev")}
                disabled={dayIndex === 0}
                className={`p-2 ${dayIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-semibold uppercase">{currentDay}</h2>
              <button
                onClick={() => handleDayChange("next")}
                disabled={dayIndex === days.length - 1}
                className={`p-2 ${dayIndex === days.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* EVENTS LIST */}
            <div className="w-full max-w-md space-y-3 max-h-80 overflow-y-auto">
              {loading && <p>Loading events...</p>}
              {error && <p className="text-red-500">{error}</p>}

              {!loading && !error && eventsData[currentDay].length === 0 && (
                <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                  <Calendar className="w-16 h-16 mx-auto text-gray-500" />
                  <p className="text-xl text-gray-700 mt-4">No events for {currentDay}.</p>
                  <p className="text-gray-500 mt-2">Check back later for updates!</p>
                </div>
              )}

              {!loading &&
                !error &&
                eventsData[currentDay].map((event, index) => (
                  <div key={index} className="flex border rounded-lg p-4 items-center shadow-md">
                    <div className={`w-2 h-16 ${event.color} rounded-l-lg`} />
                    <div className="ml-4 flex flex-col">
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.time}</p>
                      <p className="text-xs text-gray-400">{event.category}</p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-8">
            <button
  className="bg-black text-white py-2 px-8 rounded-lg transition-all duration-300 border border-black hover:bg-white hover:text-black hover:scale-105 hover:shadow-md"
  onClick={() => navigate("/calendar")}
>
  View Events Calendar
</button>

            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-sm text-gray-600 p-4 pl-6">
        LOGGED IN AS: ATTENDEE
      </footer>
    </div>
  );
}
