import React, { useState, useEffect } from "react";
import { ChevronLeft, Trash2, CalendarX, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../HeaderBar";
import SearchAndFilter from "../SearchAndFilter";

const usersPerPage = 5;

export default function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("attendee"); // Default: 'attendee'

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // States for delete modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const userType = localStorage.getItem("user_type");

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5003/admin/get_users", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setUserTypeFilter("attendee");
    setCurrentPage(1);
  };

  // Filter + paginate
  useEffect(() => {
    let filtered = users.filter((user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedCategory) {
      filtered = filtered.filter((user) =>
        user.user_type.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (user) => user.user_type.toLowerCase() === userTypeFilter.toLowerCase()
    );

    const newTotalPages = Math.ceil(filtered.length / usersPerPage);
    setTotalPages(newTotalPages);

    const startIndex = (currentPage - 1) * usersPerPage;
    const pageUsers = filtered.slice(startIndex, startIndex + usersPerPage);
    setFilteredUsers(pageUsers);
  }, [users, searchQuery, selectedCategory, userTypeFilter, currentPage]);

  // Open Delete Modal
  const handleDeleteClick = (user) => {
    console.log(user);
    setSelectedUser(user);
    setShowModal(true);
    setIsSuccess(false); // Reset success message every time we open a fresh modal
  };

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(selectedUser);
      const response = await fetch("http://localhost:5003/admin/delete_user", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: selectedUser.id }),
      });

      if (response.ok) {
        // Remove from local state
        setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
        setIsSuccess(true); // Show success message

        // After some delay, close the modal automatically
        setTimeout(() => {
          setShowModal(false);
        }, 2000);
      } else {
        setError("Failed to delete the user.");
      }
    } catch (error) {
      setError("Failed to delete the user.");
    }
  };

  // Cancel Delete
  const handleDeleteCancel = () => {
    // Close the modal + reset success
    setShowModal(false);
    setIsSuccess(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <HeaderBar
        menuOptions={[
          { label: "EVENTS", onClick: () => navigate("/events") },
          { label: "PROFILE", onClick: () => navigate("/profile") },
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

      <div className="px-10 py-6">
        {/* Title and Back Button */}
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold uppercase">User Management</h1>
        </div>

        {/* Top Controls: Dropdown on the LEFT, Search/Filter on the RIGHT */}
        <div className="flex items-center justify-between mb-4">
          {/* Dropdown on Left */}
  {/* Dropdown on Left */}
<div className="relative group">
  <select
    value={userTypeFilter}
    onChange={(e) => setUserTypeFilter(e.target.value)}
    className="
      block appearance-none w-48 px-4 py-2 text-sm bg-white text-black 
      border border-black rounded-md shadow-sm cursor-pointer
      transition-all duration-300 focus:outline-none focus:ring-2 
      focus:ring-blue-500 focus:border-blue-500
      "
  >
    <option value="attendee">Attendee</option>
    <option value="organizer">Organizer</option>
    <option value="stakeholder">Stakeholder</option>
  </select>
  {/* Chevron Icon */}
  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-black">
    <ChevronLeft className="w-5 h-5 rotate-180" />
  </div>
</div>


          {/* Search and Filter on Right */}
          <div>
            <SearchAndFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              resetFilters={resetFilters}
            />
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="border border-gray-300 rounded-lg overflow-hidden w-full">
            {filteredUsers.length > 0 ? (
              <table className="w-full text-left table-fixed">
                <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                  <tr>
                    <th className="py-3 px-4 w-1/4">First Name</th>
                    <th className="py-3 px-4 w-1/4">Last Name</th>
                    <th className="py-3 px-4 w-1/4">Email</th>
                    {userTypeFilter === "organizer" && (
                      <>
                        <th className="py-3 px-4 w-1/4">Organization</th>
                        <th className="py-3 px-4 w-1/4">Phone Number</th>
                      </>
                    )}
                    <th className="py-3 px-4 w-1/12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-200 transition duration-200"
                    >
                      <td className="py-3 px-4">{user.first_name}</td>
                      <td className="py-3 px-4">{user.last_name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      {userTypeFilter === "organizer" && (
                        <>
                          <td className="py-3 px-4">
                            {user.organization_name}
                          </td>
                          <td className="py-3 px-4">{user.phone_number}</td>
                        </>
                      )}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="p-2 rounded-full bg-red-500 text-white hover:bg-red-700 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center w-full">
                <CalendarX className="w-20 h-20 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Users Found
                </h3>
                <p className="text-gray-500 text-sm max-w-xs mb-4">
                  We couldn’t find any users matching your search or filters.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-black text-white px-5 py-2 rounded-lg text-sm transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 border border-black"
                >
                  Clear Filters & Refresh
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="flex justify-start items-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`py-2 px-4 rounded-lg transition-all duration-300 border
                ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-300 text-gray-700 hover:bg-black hover:text-white hover:scale-105 hover:shadow-md"
                }`}
            >
              Previous
            </button>

            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`py-2 px-4 rounded-lg transition-all duration-300 border
                      ${
                        num === currentPage
                          ? "bg-black text-white"
                          : "bg-gray-300 text-gray-700 hover:bg-black hover:text-white hover:scale-105 hover:shadow-md"
                      }`}
                  >
                    {num}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`py-2 px-4 rounded-lg transition-all duration-300 border
                ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-300 text-gray-700 hover:bg-black hover:text-white hover:scale-105 hover:shadow-md"
                }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 w-full max-w-md rounded-lg relative shadow-lg border border-gray-300">
            {/* Close Modal Button */}
            <button
              onClick={handleDeleteCancel}
              className="absolute top-3 right-4 text-3xl font-bold text-gray-600 hover:text-black transition"
            >
              &times;
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-black">
              Confirm Deletion
            </h2>

            {/* Info */}
            <p className="mt-3 text-gray-700 text-sm">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {selectedUser?.first_name} {selectedUser?.last_name}
              </span>
              ?
            </p>

            {/* Buttons */}
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={handleDeleteCancel}
                className="bg-gray-300 text-black px-5 py-2 rounded-lg text-sm transition-all duration-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm transition-all duration-300 hover:bg-white hover:text-red-600 border border-red-600"
              >
                Delete
              </button>
            </div>

            {/* Success Message */}
            {isSuccess && (
              <div className="mt-6 text-center text-green-600">
                <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
                <p className="text-xl font-semibold">User Deleted Successfully!</p>
              </div>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </div>
        </div>
      )}

      <footer className="text-sm text-gray-600 p-4 pl-6 absolute bottom-0 left-0">
        LOGGED IN AS: {userType ? userType.toUpperCase() : "UNKNOWN"}
      </footer>
    </div>
  );
}
