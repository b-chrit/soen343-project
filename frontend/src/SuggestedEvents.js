import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, RefreshCcw } from "lucide-react"; 
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
  const days = ["YESTERDAY", "TODAY", "TOMORROW"];
  const [dayIndex, setDayIndex] = useState(1);
  const [eventsData, setEventsData] = useState({
    yesterday: [],
    today: [],
    tomorrow: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userType = localStorage.getItem("user_type");

  const fetchSuggestedEvents = async () => {
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

      if (!response.ok) throw new Error("Failed to fetch suggested events");

      const data = await response.json();

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const formatDate = (dateObj) => dateObj.toISOString().split("T")[0];

      const eventsByDate = { yesterday: [], today: [], tomorrow: [] };

      data.forEach((event) => {
        const eventDateObj = new Date(event.date);
        const eventDateStr = formatDate(eventDateObj);

        const categoryColor =
          categoryColors[event.category] || "bg-gray-200 text-gray-800";

        const time = event.date.split(" ")[1];
        const date = event.date.split(" ")[0]; 

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
    fetchSuggestedEvents();
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
    <div className="border border-black rounded-lg p-12 w-[600px] mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-4 text-center">Suggested Events</h2>

      <div className="flex items-center justify-center mb-6 space-x-6">
        <button
          onClick={() => handleDayChange("prev")}
          disabled={dayIndex === 0}
          className={`p-2 rounded-full transition duration-300 ${
            dayIndex === 0 ? "cursor-not-allowed opacity-40" : "hover:bg-gray-200"
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h3 className="text-xl font-semibold text-gray-800">{currentDay}</h3>

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

      <div className="space-y-4">
        {loading && <p className="text-gray-600 text-sm">Loading events...</p>}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && eventsData[currentDay].length === 0 && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <Calendar className="w-16 h-16 mx-auto text-gray-400" />
            <p className="text-lg font-medium text-gray-700 mt-4">
              No events for {currentDay}.
            </p>
            <p className="text-sm text-gray-500 mt-1">Check back later!</p>
          </div>
        )}

        {!loading &&
          !error &&
          eventsData[currentDay].map((event) => (
            <div
              key={event.id}
              className="border border-gray-200 p-4 rounded-md flex justify-between items-start"
            >
              <div>
                <h3 className="text-xl font-semibold">{event.name}</h3>
                <p>{event.description}</p>
                <p className="mt-2 text-gray-500">
                  Date: {new Date(event.date).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => fetchSuggestedEvents()}
                className="p-2 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition"
              >
                <RefreshCcw className="w-7 h-7 text-gray-800" />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SuggestedEvents;
