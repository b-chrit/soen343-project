import { useState, useEffect } from "react";
import { Calendar, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categoryColors = {
  Technology: "bg-blue-100 text-blue-800",
  Finance: "bg-green-100 text-green-800",
  Business: "bg-yellow-100 text-yellow-800",
  Marketing: "bg-purple-100 text-purple-800",
  "AI & Tech": "bg-pink-100 text-pink-800",
  "Tech & Business": "bg-teal-100 text-teal-800",
};

const SuggestedEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
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

      const formatDate = (dateObj) => dateObj.toISOString().split("T")[0];

      const formattedEvents = data.map((event) => {
        const eventDateObj = new Date(event.start);
        const time = eventDateObj.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const date = eventDateObj.toLocaleDateString();

        return {
          ...event,
          color: categoryColors[event.category] || "bg-gray-200 text-gray-800",
          time,
          date,
        };
      });

      const randomEvent =
        formattedEvents[Math.floor(Math.random() * formattedEvents.length)];

      setEvents([randomEvent]);
      setCurrentIndex(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="border border-black rounded-lg p-12 w-[600px] mx-auto mt-12">
      <div className="flex justify-between items-center mb-6 relative">
        <h2 className="text-2xl font-bold text-center w-full">
          Suggested Events
        </h2>
        <button
          onClick={fetchEvents}
          className="absolute right-0 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition shadow"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5 text-gray-600 hover:text-black" />
        </button>
      </div>

      <div className="w-full max-w-md space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 px-2">
        {loading && <p className="text-gray-600 text-sm">Loading events...</p>}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && events.length === 0 && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center animate-fadeIn">
            <Calendar className="w-16 h-16 mx-auto text-gray-400" />
            <p className="text-lg font-medium text-gray-700 mt-4">
              No suggested events.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Check back later for updates!
            </p>
          </div>
        )}
        {!loading && !error && events.length > 0 && (
          <div
            key={currentIndex}
            className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-[1.02] px-4 py-3 animate-fadeIn"
          >
            <div
              className={`w-2 h-16 ${events[currentIndex].color} rounded-l-md`}
            />

            <div className="ml-4 flex flex-col">
              <h3 className="font-semibold text-gray-800">
                {events[currentIndex].title}
              </h3>
              <p className="text-xs text-gray-500">
                {events[currentIndex].category}
              </p>
              <p className="text-sm text-gray-600">
                {events[currentIndex].date} • {events[currentIndex].time}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestedEvents;
