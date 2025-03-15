import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventModal from "../EventModal";
import HeaderBar from "../HeaderBar";
import { useNavigate } from "react-router-dom";

const eventsPerPage = 5;

const categoryColors = {
  Technology: "bg-blue-100 text-blue-800",
  Finance: "bg-green-100 text-green-800",
  Business: "bg-yellow-100 text-yellow-800",
  Marketing: "bg-purple-100 text-purple-800",
  "AI & Tech": "bg-pink-100 text-pink-800",
  "Tech & Business": "bg-teal-100 text-teal-800",
};

export default function CalendarView({ onBack }) {
  const navigate = useNavigate();
  const [eventsData, setEventsData] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [month, setMonth] = useState(2); // March (0-based index)
  const [year, setYear] = useState(2025);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

        const mappedEvents = data.map((event) => {
          const start = event.start;
          const date = start ? start.split(" ")[0] : "N/A";
          const time = start ? start.split(" ")[1] : "N/A";
          const categoryColor =
            categoryColors[event.category] || "bg-gray-100 text-gray-800";

          return {
            id: event.id,
            title: event.title,
            organizer: event.organizer_name || "N/A",
            category: event.category || "N/A",
            color: categoryColor,
            date: date,
            time: time,
            sponsored: event.sponsor_name ? "Yes" : "No",
            sponsor: event.sponsor_name || "N/A",
            description: event.description,
            location: event.location,
            start: event.start,
            end: event.end,
          };
        });

        setEventsData(mappedEvents);
        setFilteredEvents(mappedEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate]);

  const handleEventClick = async (event) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5003/check_registration?event_id=${event.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check registration status");
      }

      const data = await response.json();
      const isRegistered = data.is_registered;

      setSelectedEvent({ ...event, isRegistered });
    } catch (err) {
      setError(err.message);
    }
  };

  const generateCalendar = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const nextMonthStart = 1;

    let calendar = [];
    let dayCounter = 1;
    let prevCounter = prevMonthDays - (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1) + 1;
    let nextCounter = nextMonthStart;

    for (let i = 0; i < 6; i++) {
      let week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1)) {
          week.push({ day: prevCounter, isGray: true });
          prevCounter++;
        } else if (dayCounter > daysInMonth) {
          week.push({ day: nextCounter, isGray: true });
          nextCounter++;
        } else {
          let dateKey = `${year}-${(month + 1).toString().padStart(2, "0")}-${dayCounter.toString().padStart(2, "0")}`;

          week.push({
            day: dayCounter,
            events: filteredEvents.filter(event => event.date === dateKey),
            isGray: false,
          });

          dayCounter++;
        }
      }
      calendar.push(week);
    }
    return calendar;
  };

  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      setMonth((prev) => (prev === 0 ? 11 : prev - 1));
      setYear((prev) => (month === 0 ? prev - 1 : prev));
    } else {
      setMonth((prev) => (prev === 11 ? 0 : prev + 1));
      setYear((prev) => (month === 11 ? prev + 1 : prev));
    }
  };

  const calendar = generateCalendar(year, month);

  return (
    <div className="h-screen flex flex-col">
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

      {/* MONTH NAVIGATION */}
      <div className="flex justify-between items-center px-6 py-4">
        <button onClick={onBack} className="flex items-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-4">
          <button onClick={() => handleMonthChange("prev")}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">
            {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
          </h2>
          <button onClick={() => handleMonthChange("next")}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="w-5" />
      </div>

      {/* CALENDAR GRID */}
      <div className="flex justify-center flex-grow items-center">
        <table className="border-collapse border w-3/4 text-center">
          <thead>
            <tr className="border border-black">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <th key={d} className="border border-black p-2 font-semibold">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendar.map((week, i) => (
              <tr key={i} className="border border-black">
                {week.map((day, j) => (
                  <td
                    key={j}
                    className="border border-black h-24 w-32 align-top p-2 relative"
                  >
                    <div
                      className={`absolute top-1 left-2 text-sm font-semibold ${
                        day.isGray ? "text-gray-400" : "text-black"
                      }`}
                    >
                      {day.day}
                    </div>

                    {day.events &&
                      day.events.map((event, idx) => (
                        <div
                          key={idx}
                          className={`text-xs ${event.color} mt-5 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md`}
                          onClick={() => handleEventClick(event)}
                        >
                          {event.title}
                        </div>
                      ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <footer className="text-sm text-gray-600 p-4 pl-6">
        LOGGED IN AS: ATTENDEE
      </footer>

      {/* EVENT MODAL */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
