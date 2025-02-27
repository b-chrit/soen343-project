import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventModal from "./EventModal"; 
import HeaderBar from "./HeaderBar";
const calendarEvents = {
  "2025-03-02": [{ title: "MARKETING & MEDIA", color: "text-pink-500" }],
  "2025-03-06": [
    {
      title: "ETHICAL AI IN BUSINESS",
      category: "AI AND THE FUTURE OF WORK",
      date: "MARCH 6, 2025",
      time: "09:00 AM - 12:00 PM",
      organizer: "XYZ",
      color: "text-purple-500",
      description:
        "Explore how artificial intelligence is reshaping industries, redefining job roles, and influencing workplace dynamics. This event brings together industry leaders, AI researchers, and business executives to discuss automation, workforce adaptation, and the skills needed for the future.",
    },
  ],
  "2025-03-16": [{ title: "DIGITAL HEALTHCARE", color: "text-blue-500" }],
  "2025-03-20": [{ title: "MARKETING & MEDIA", color: "text-pink-500" }],
  "2025-03-25": [
    { title: "AI AND THE FUTURE OF WORK", color: "text-green-500" },
    { title: "E-COMMERCE AND DATA", color: "text-indigo-500" },
  ],
  "2025-03-27": [{ title: "E-COMMERCE AND DATA", color: "text-green-500" }],
};

// Function to generate a complete calendar grid
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
        week.push({ day: dayCounter, events: calendarEvents[dateKey] || [], isGray: false });
        dayCounter++;
      }
    }
    calendar.push(week);
  }
  return calendar;
};

export default function CalendarView({ onBack, onNavigateEvents, onNavigateProfile }) {
  const [month, setMonth] = useState(2); // March (0-based index)
  const [year, setYear] = useState(2025);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const calendar = generateCalendar(year, month);

  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      setMonth((prev) => (prev === 0 ? 11 : prev - 1));
      setYear((prev) => (month === 0 ? prev - 1 : prev));
    } else {
      setMonth((prev) => (prev === 11 ? 0 : prev + 1));
      setYear((prev) => (month === 11 ? prev + 1 : prev));
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <HeaderBar
        menuOptions={[
          { label: "EVENTS", onClick: onNavigateEvents },
          { label: "PROFILE", onClick: onNavigateProfile  },
          { label: "LOGOUT", onClick: () => console.log("Logging Out") },
        ]}
      />

      {/* MONTH NAVIGATION */}
      <div className="flex justify-between items-center px-6 py-4">
        <button onClick={onBack} className="flex items-center">
          <ChevronLeft className="w-5 h-5" /> {/* Back Button */}
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
                <th key={d} className="border border-black p-2 font-semibold">{d}</th>
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
                          className={`text-xs ${event.color} mt-5 cursor-pointer`}
                          onClick={() => setSelectedEvent(event)}
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
      <footer className="text-sm text-gray-600 p-4 pl-6">LOGGED IN AS: ATTENDEE</footer>

      {/* EVENT MODAL */}
      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}
