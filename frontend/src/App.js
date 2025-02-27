import { useState } from "react";
import EventDashboard from "./EventDashboard";
import CalendarView from "./CalendarView";
import EventsPage from "./EventsPage";
import ProfilePage from "./ProfilePage";
import EventData from "./EventData";

export default function App() {
  const [view, setView] = useState("dashboard"); // Track current page

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Main View Container */}
      <div className="flex-1 overflow-auto">
        {view === "dashboard" && (
          <EventDashboard
            onViewCalendar={() => setView("calendar")}
            onNavigateEvents={() => setView("events")}
            onNavigateProfile={() => setView("profile")}
          />
        )}
        {view === "calendar" && (
          <CalendarView
            onBack={() => setView("dashboard")}
            onNavigateEvents={() => setView("events")}
            onNavigateProfile={() => setView("profile")}
          />
        )}
        {view === "events" && (
          <EventsPage
            onBack={() => setView("dashboard")}
            onNavigateProfile={() => setView("profile")}
            eventsData={EventData}
          />
        )}
        {view === "profile" && (
          <ProfilePage onBack={() => setView("dashboard")} />
        )}
      </div>
    </div>
  );
}
