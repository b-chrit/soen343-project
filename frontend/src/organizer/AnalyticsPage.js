import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import HeaderBar from "../HeaderBar";
import { ChevronLeft, BarChart2 } from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const selectRef = useRef(null);

  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [data, setData] = useState(null);

  const userType = localStorage.getItem("user_type");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5003/get_organizer_events", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch events");

      const result = await response.json();
      setEvents(result);
    } catch (error) {
      setError("Failed to load events. Please try again later.");
    }
  };

  const fetchAnalyticsData = async (eventId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5003/get_event_registration_over_time?event_id=${eventId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch registration data");

      const result = await response.json();
      setData(result.registrations_over_time);
    } catch (error) {
      setError("Failed to load analytics data. Please try again later.");
    }
  };

  const handleEventSelect = (eventId) => {
    setSelectedEvent(eventId);
    fetchAnalyticsData(eventId);
  };

  const chartData = {
    labels: data ? data.map((entry) => entry.date) : [],
    datasets: [
      {
        label: "Registrations Over Time",
        data: data ? data.map((entry) => entry.registrations) : [],
        borderColor: "rgb(99, 102, 241)", // Indigo
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        pointBackgroundColor: "rgb(99, 102, 241)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Event Registration Over Time",
        color: "#000",
        font: { size: 20, weight: "bold" },
      },
      legend: {
        labels: { color: "#000", font: { size: 14 } },
      },
      tooltip: {
        backgroundColor: "#000",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} registrations`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: "#000",
          font: { weight: "bold" },
        },
        ticks: { color: "#000" },
        grid: { color: "#e5e5e5" },
      },
      y: {
        title: {
          display: true,
          text: "Registrations",
          color: "#000",
          font: { weight: "bold" },
        },
        ticks: { color: "#000" },
        grid: { color: "#e5e5e5" },
      },
    },
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* ✅ Header */}
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

      {/* ✅ Main Content */}
      <div className="px-10 py-8 flex-1">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full border border-black hover:bg-black hover:text-white transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold uppercase tracking-wide">
            Event Registration Analytics
          </h1>
        </div>

        {error && <div className="text-red-500 mb-6">{error}</div>}

        {/* ✅ Dropdown */}
        <div className="mb-10 relative">
          <div className="relative">
            <select
              ref={selectRef}
              value={selectedEvent}
              onChange={(e) => handleEventSelect(e.target.value)}
              className={`block w-full appearance-none p-4 border border-black rounded-lg bg-white text-black text-lg font-medium focus:outline-none focus:ring-2 focus:ring-black transition cursor-pointer ${
                !selectedEvent ? "text-gray-400" : ""
              }`}
            >
              <option value="" disabled hidden>
                Select an event
              </option>

              {events.map((event) => (
                <option
                  key={event.id}
                  value={event.id}
                  className="text-black text-lg"
                >
                  {event.title}
                </option>
              ))}
            </select>

            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-black text-lg">
              ▼
            </div>
          </div>
        </div>

        {/* ✅ Chart or Empty State */}
        {data ? (
          <div
            className="bg-white border border-black p-8 rounded-xl shadow-xl transition hover:shadow-2xl"
            style={{ height: "500px", width: "100%" }}
          >
            <Line data={chartData} options={options} />
          </div>
        ) : selectedEvent ? (
          <p className="text-center text-gray-600 text-lg">Loading analytics data...</p>
        ) : (
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-16 shadow-inner border border-black">
            <BarChart2 className="w-24 h-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-black mb-2">No Event Selected</h2>
            <p className="text-gray-600 text-center max-w-md mb-6">
              Please select an event from the dropdown above to view detailed registration analytics.
            </p>
            <button
              onClick={() => {
                if (selectRef.current) {
                  selectRef.current.focus();
                  const event = new KeyboardEvent("keydown", { key: "ArrowDown" });
                  selectRef.current.dispatchEvent(event);
                }
              }}
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-white hover:text-black border border-black transition-all duration-300 hover:scale-105"
            >
              Select Event
            </button>
          </div>
        )}
      </div>

      {/* ✅ Footer */}
      <footer className="text-sm text-gray-600 p-4 pl-6 border-t border-gray-200">
        LOGGED IN AS: {userType ? userType.toUpperCase() : "UNKNOWN"}
      </footer>
    </div>
  );
}
