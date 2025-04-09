import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Users, BarChart, CreditCard, CalendarPlus, ArrowRight  } from "lucide-react";
import HeaderBar from "../HeaderBar";

// Admin Dashboard component
export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation(); // Use location to check current path

  // States for users and error handling
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [hasMoreUsers, setHasMoreUsers] = useState(false); // For handling "View More" button
  const [loading, setLoading] = useState(false);

  // Fetch users from the backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5003/admin/get_users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      console.log(data);

      // Show only the first 3 users
      if (data.length > 3) {
        setHasMoreUsers(true);
        setUsers(data.slice(0, 3));
      } else {
        setUsers(data);
        setHasMoreUsers(false);
      }
    } catch (error) {
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle navigation to manage users
  const handleNavigateToUsers = () => {
    if (location.pathname !== "/manage-users") {
      navigate("/manage-users");
    }
  };

  // Get the user type from localStorage to display in the footer
  const userType = localStorage.getItem("user_type");

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* ✅ HeaderBar */}
      <HeaderBar
        menuOptions={[
          { label: "MANAGE USERS", onClick: handleNavigateToUsers },
          { label: "MANAGE EVENTS", onClick: () => navigate("/manage-events") },
          { label: "MANAGE PAYMENTS", onClick: () => navigate("/manage-payments") },
          { label: "VIEW ANALYTICS", onClick: () => navigate("/view-analytics") },
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

      {/* ✅ Hero Section */}
      <section className="px-16 py-12 bg-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold mb-4">Welcome, Admin!</h2>
          <p className="text-gray-600 text-lg mb-6">Manage the platform and users efficiently.</p>
        </div>
        <div className="hidden md:block text-9xl font-extrabold text-gray-300 hover:text-black transition-colors duration-300">
          SEES
        </div>
      </section>

      {/* ✅ Quick Actions */}
      <section className="px-16 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        <ActionCard
          label="Manage Users"
          icon={<Users className="w-8 h-8" />}
          onClick={handleNavigateToUsers}
        />
        <ActionCard
          label="Manage Events"
          icon={<CalendarPlus className="w-8 h-8" />}
          onClick={() => navigate("/admin-events")}
        />
        <ActionCard
          label="Manage Payments"
          icon={<CreditCard className="w-8 h-8" />}
          onClick={() => navigate("/manage-payments")}
        />
        <ActionCard
          label="View Analytics"
          icon={<BarChart className="w-8 h-8" />}
          onClick={() => navigate("/view-analytics")}
        />
      </section>

      {/* ✅ Users Summary */}
      <section className="px-16 py-10">
        <h3 className="text-2xl font-semibold mb-6">User Management</h3>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading && <div className="text-center">Loading...</div>}
        {users.length === 0 ? (
          <div className="text-center bg-gray-100 p-8 rounded-lg shadow-md">
            <p className="text-lg font-medium text-gray-700">No users found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {users.map((user, index) => (
              <UserCard
                key={index}
                name={`${user.first_name} ${user.last_name}`}
                email={user.email}
                status={user.type}
                navigate={navigate}
              />
            ))}
          </div>
        )}

        {hasMoreUsers && (
          <div className="text-center mt-4">
        <button
  onClick={() => navigate("/manage-users")}
  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white font-semibold tracking-wide py-3 px-8 rounded-full border border-black shadow-sm hover:from-white hover:to-white hover:text-black hover:shadow-lg hover:scale-105 transition-all duration-300"
>
  View More
  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
</button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-sm text-gray-600 p-4 pl-6">
        LOGGED IN AS: {userType ? userType.toUpperCase() : "UNKNOWN"}
      </footer>
    </div>
  );
}

// ActionCard Component
const ActionCard = ({ label, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md cursor-pointer p-6 flex flex-col items-center transition-all duration-300 hover:scale-105"
  >
    <div className="mb-4 text-black">{icon}</div>
    <h4 className="text-lg font-semibold">{label}</h4>
  </div>
);

// UserCard Component
const UserCard = ({ name, email, status, navigate }) => (
  <div className="bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] p-6 flex flex-col justify-between">
    <div>
      <h4 className="text-xl font-bold mb-2">{name}</h4>
      <p className="text-gray-600 text-sm mb-1">Email: {email}</p>
      <p className="text-gray-600 text-sm">Status: {status}</p>
    </div>
  </div>
);
