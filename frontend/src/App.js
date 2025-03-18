import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AttendeeDashBoard from "./attendee/AttendeeDashBoard";
import OrganizerDashBoard from "./organizer/OrganizerDashBoard";
import CalendarView from "./attendee/CalendarView";
import EventsPage from "./attendee/EventsPage";
import ProfilePage from "./ProfilePage";
import Login from "./Login";
import Register from "./Register";
import MyEvents from "./organizer/MyEvents"; 

export default function App() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token"); // Simple auth check

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const userType = localStorage.getItem("user_type"); // Retrieve user_type

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <Routes>
          {/* ✅ Unauthenticated routes */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ Authenticated routes */}
          <Route path="/dashboard" element={isAuthenticated ? (userType === "attendee" ? <AttendeeDashBoard /> : <OrganizerDashBoard />) : <Navigate to="/login" />} />
          <Route path="/calendar" element={isAuthenticated ? <CalendarView /> : <Navigate to="/login" />} />
          <Route path="/events" element={isAuthenticated ? <EventsPage onBack={handleBack} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage onBack={handleBack} /> : <Navigate to="/login" />} />
          <Route path="/my-events" element={isAuthenticated ? <MyEvents /> : <Navigate to="/login" />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
