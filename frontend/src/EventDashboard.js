import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeaderBar from "./HeaderBar";
import { useNavigate } from "react-router-dom";

const eventsData = {
  yesterday: [
    {
      title: "Cybersecurity & AI Panel",
      time: "08:00 AM - 10:00 AM",
      category: "TECH & SECURITY",
      color: "bg-purple-500",
    },
    {
      title: "Remote Work & The Future",
      time: "11:00 AM - 01:00 PM",
      category: "BUSINESS & WORK",
      color: "bg-yellow-500",
    },
  ],
  today: [
    {
      title: "Healthcare Leadership & Innovation Forum",
      time: "08:00 AM - 10:00 AM",
      category: "HEALTHCARE & MEDICAL",
      color: "bg-blue-500",
    },
    {
      title: "AI & THE FUTURE OF WORK",
      time: "09:00 AM - 12:00 PM",
      category: "TECHNOLOGY & INNOVATION",
      color: "bg-pink-500",
    },
    {
      title: "Women in Business Leadership Summit",
      time: "10:00 AM - 1:00 PM",
      category: "PROFESSIONAL DEVELOPMENT & LEADERSHIP",
      color: "bg-green-500",
    },
    {
      title: "FutureTech Summit 2025",
      time: "04:00 PM - 06:00 PM",
      category: "TECHNOLOGY & INNOVATION",
      color: "bg-pink-500",
    },
  ],
  tomorrow: [
    {
      title: "Blockchain & Web3 Conference",
      time: "10:00 AM - 12:00 PM",
      category: "TECH & INNOVATION",
      color: "bg-indigo-500",
    },
    {
      title: "Ethical AI Development",
      time: "01:00 PM - 03:00 PM",
      category: "ARTIFICIAL INTELLIGENCE",
      color: "bg-red-500",
    },
  ],
};

export default function EventDashboard() {
  const navigate = useNavigate(); // Use navigate for navigation
  const days = ["yesterday", "today", "tomorrow"];
  const [dayIndex, setDayIndex] = useState(1);

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
          { label: "LOGOUT", onClick: () => console.log("Logging Out") },
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
              {eventsData[currentDay].map((event, index) => (
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

            {/* BUTTON TO SWITCH TO CALENDAR VIEW */}
            <div className="mt-8">
              <button
                className="bg-black text-white py-2 px-8 rounded-lg"
                onClick={() => navigate("/calendar")} // Handle calendar navigation here
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
