import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AttendeeDashBoard from "./attendee/AttendeeDashBoard";
import AdminDashboard from "./admin/AdminDashboard";
import OrganizerDashBoard from "./organizer/OrganizerDashBoard";
import StakeholderDashboard from "./stakeholder/StakeholderDashBoard";
import SponsorshipRequests from "./stakeholder/SponsorshipRequests";
import SponsorEvent from "./stakeholder/SponsorEvent";
import CalendarView from "./CalendarView";
import EventsPage from "./attendee/EventsPage";
import ProfilePage from "./ProfilePage";
import Login from "./Login";
import Register from "./Register";
import MyEvents from "./organizer/MyEvents";
import AnalyticsPage from "./organizer/AnalyticsPage";
import UserManagement from "./admin/UserManagement";
import AdminEventsPage from "./admin/AdminEventsPage";
import AccountsTable from "./admin/AccountsTable";
import GuestEventsPage from "./guest/GuestEventsPage"; 
import Calendar from "./Calendar";

export default function App() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const userType = localStorage.getItem("user_type");

  const handleBack = () => navigate(-1);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <Routes>
          {/* Redirect root to appropriate pages */}
          <Route path="/" element={
            isAuthenticated 
              ? (userType === "admin" 
                  ? <Navigate to="/admin-dashboard" /> 
                  : userType === "stakeholder" 
                    ? <Navigate to="/stakeholder-dashboard" /> 
                    : <Navigate to="/dashboard" />)
              : <Navigate to="/guest-events" />} 
          />
          
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Guest route - only events page */}
          <Route path="/guest-events" element={<GuestEventsPage/>} />

          {/* Authenticated routes */}
          <Route path="/dashboard" element={isAuthenticated ? (userType === "attendee" ? <AttendeeDashBoard /> : <OrganizerDashBoard />) : <Navigate to="/login" />} />
          <Route path="/stakeholder-dashboard" element={isAuthenticated && userType === "stakeholder" ? <StakeholderDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin-dashboard" element={isAuthenticated && userType === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/manage-users" element={isAuthenticated && userType === "admin" ? <UserManagement /> : <Navigate to="/login" />} />
          <Route path="/calendar" element={isAuthenticated ? <CalendarView onBack={handleBack}/> : <Navigate to="/login" />} />
          <Route path="/event-calendar" element={isAuthenticated ? <Calendar/> : <Navigate to="/login" />} />
          <Route path="/events" element={isAuthenticated ? <EventsPage onBack={handleBack} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage onBack={handleBack} /> : <Navigate to="/login" />} />
          <Route path="/accounts-table" element={isAuthenticated ? <AccountsTable/> : <Navigate to="/login" />} />
          <Route path="/my-events" element={isAuthenticated ? <MyEvents /> : <Navigate to="/login" />} />
          <Route path="/admin-events" element={isAuthenticated ? <AdminEventsPage onBack={handleBack} /> : <Navigate to="/login" />} />
          <Route path="/sponsor-event" element={isAuthenticated && userType === "stakeholder" ? <SponsorEvent onBack={handleBack}/> : <Navigate to="/login" />} />
          <Route path="/sponsorship-requests" element={isAuthenticated && userType === "stakeholder" ? <SponsorshipRequests onBack={handleBack}/> : <Navigate to="/login" />} />
          <Route path="/analytics" element={isAuthenticated && (userType === "organizer" || userType === "stakeholder") ? <AnalyticsPage /> : <Navigate to="/login" />} />
          
          {/* Redirect any other path to appropriate page */}
          <Route path="*" element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/guest-events" />} />
        </Routes>
      </div>
    </div>
  );
}