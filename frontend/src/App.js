import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import EventDashboard from "./EventDashboard";
import CalendarView from "./CalendarView";
import EventsPage from "./EventsPage";
import ProfilePage from "./ProfilePage";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token"); // Simple auth check

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <Routes>
          {/* Unauthenticated routes */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated routes */}
          <Route path="/dashboard" element={isAuthenticated ? <EventDashboard /> : <Navigate to="/login" />} />
          <Route path="/calendar" element={isAuthenticated ? <CalendarView /> : <Navigate to="/login" />} />
          <Route path="/events" element={isAuthenticated ? <EventsPage onBack={handleBack} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage onBack={handleBack} /> : <Navigate to="/login" />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
