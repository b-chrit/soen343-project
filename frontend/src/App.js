import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AttendeeDashBoard from "./attendee/AttendeeDashBoard";
import AdminDashboard from "./admin/AdminDashboard";
import OrganizerDashBoard from "./organizer/OrganizerDashBoard";
import StakeholderDashboard from "./stakeholder/StakeholderDashBoard";
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
import AccountsTable from "./admin/AccountsTable"; //Import accountsTable component
import GuestDashboard from "./guest/GuestDashboard";
import GuestEventsPage from "./guest/GuestEventsPage"; 

export default function App() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const userType = localStorage.getItem("user_type");

  const handleBack = () => navigate(-1);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={isAuthenticated ? (userType === "admin" ? <Navigate to="/admin-dashboard" /> : userType === "stakeholder" ? <Navigate to="/stakeholder-dashboard" /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/guest-dashboard" element={<GuestDashboard/>} /> {/* Guest dashboard route */}
          <Route path="/guest-events" element={<GuestEventsPage/>} /> {/* Guest events page route */}

          {/* ✅ Authenticated routes */}
          <Route path="/dashboard" element={isAuthenticated ? (userType === "attendee" ? <AttendeeDashBoard /> : <OrganizerDashBoard />) : <Navigate to="/login" />} />
          <Route path="/stakeholder-dashboard" element={isAuthenticated && userType === "stakeholder" ? <StakeholderDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin-dashboard" element={isAuthenticated && userType === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/manage-users" element={isAuthenticated && userType === "admin" ? <UserManagement /> : <Navigate to="/login" />} />
          <Route path="/calendar" element={isAuthenticated ? <CalendarView onBack={handleBack}/> : <Navigate to="/login" />} />
          <Route path="/events" element={isAuthenticated ? <EventsPage onBack={handleBack} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage onBack={handleBack} /> : <Navigate to="/login" />} />
          <Route path="/accounts-table" element={isAuthenticated ? <AccountsTable/> : <Navigate to="/login" />} />
          <Route path="/my-events" element={isAuthenticated ? <MyEvents /> : <Navigate to="/login" />} />
          <Route path="/admin-events" element={isAuthenticated ? <AdminEventsPage onBack={handleBack} /> : <Navigate to="/login" />} />
          <Route path="/sponsor-event" element={isAuthenticated && userType === "stakeholder" ? <SponsorEvent onBack={handleBack}/> : <Navigate to="/login" />} />
          <Route path="/analytics" element={isAuthenticated && (userType === "organizer" || userType === "stakeholder") ? <AnalyticsPage /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
