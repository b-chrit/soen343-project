import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import EventModal from "./attendee/EventModal";
import SponserModal from "./stakeholder/SponserModal";

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
  const userType = localStorage.getItem("user_type");
  const ModalComponent = userType === "stakeholder" ? SponserModal : EventModal;

  const [eventsData, setEventsData] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [month, setMonth] = useState(2); // March
  const [year, setYear] = useState(2025);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const response = await fetch("http://localhost:5003/event/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        const mapped = data.map((event) => {
          const [date, time] = event.start?.split(" ") || ["N/A", "N/A"];
          return {
            id: event.id,
            title: event.title,
            organizer_name: event.organizer_name || "N/A",
            organization_name: event.organization_name || "N/A",
            category: event.category || "N/A",
            categoryColor: categoryColors[event.category] || "bg-gray-100 text-gray-800",
            date,
            time,
            sponsored: event.sponsor_name ? "Yes" : "No",
            sponsor: event.sponsor_name || "N/A",
            capacity: event.capacity || "N/A",
            registrations: event.registrations || 0,
            location: event.location,
            description: event.description,
            start: event.start,
            end: event.end,
            fee: event.fee,
            feeFormatted: event.fee === 0.0 ? "Free" : "$ " + event.fee.toFixed(2),
          };
        });

        setEventsData(mapped);
        setFilteredEvents(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate, registeredEvents]);

  const handleEventClick = async (event) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      if (userType === "attendee") {
        const res = await fetch(
          `http://localhost:5003/event/check_registration?event_id=${event.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to check registration");
        const data = await res.json();
        setSelectedEvent({ ...event, isRegistered: data.is_registered });
      } else {
        // Check if the stakeholder is sponsoring the event
        const res = await fetch(
          `http://localhost:5003/stakeholder/check_sponsorship?event_id=${event.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to check sponsorship");
        const data = await res.json();
        setSelectedEvent({ ...event, isSponsored: data.is_sponsoring });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const updateEvents = (eventId, isRegistered) => {
    if (isRegistered) {
      const updated = [...registeredEvents, eventsData.find((e) => e.id === eventId)];
      setRegisteredEvents(updated);
    } else {
      const updated = registeredEvents.filter((e) => e.id !== eventId);
      setRegisteredEvents(updated);
    }
  };

  const generateCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    let calendar = [];
    let dayCounter = 1;
    let prevCounter = prevMonthDays - (firstDay === 0 ? 6 : firstDay - 1) + 1;
    let nextCounter = 1;

    for (let i = 0; i < 6; i++) {
      let week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < (firstDay === 0 ? 6 : firstDay - 1)) {
          week.push({ day: prevCounter++, isGray: true });
        } else if (dayCounter > daysInMonth) {
          week.push({ day: nextCounter++, isGray: true });
        } else {
          let dateKey = `${year}-${(month + 1).toString().padStart(2, "0")}-${dayCounter
            .toString()
            .padStart(2, "0")}`;
          week.push({
            day: dayCounter,
            events: filteredEvents.filter((e) => e.date === dateKey),
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
              localStorage.clear();
              navigate("/login");
            },
          },
        ]}
      />

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
                  <td key={j} className="border border-black h-24 w-32 align-top p-2 relative">
                    <div className={`absolute top-1 left-2 text-sm font-semibold ${day.isGray ? "text-gray-400" : "text-black"}`}>
                      {day.day}
                    </div>
                    {day.events &&
                      day.events.map((event, idx) => (
                        <div
                          key={idx}
                          className={`text-xs ${event.categoryColor} mt-5 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md`}
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

      <footer className="text-sm text-gray-600 p-4 pl-6">
        LOGGED IN AS: {userType ? userType.toUpperCase() : "UNKNOWN"}
      </footer>

      {selectedEvent && (
        <ModalComponent
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          updateEvents={updateEvents}
        />
      )}
    </div>
  );
}
