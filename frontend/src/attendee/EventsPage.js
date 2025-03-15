import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, Filter, Eye } from "lucide-react";
import EventModal from "../EventModal";
import HeaderBar from "../HeaderBar";
import { useNavigate } from "react-router-dom";

const eventsPerPage = 5;

const categoryColors = {
  Technology: "bg-blue-100 text-blue-800",
  Finance: "bg-green-100 text-green-800",
  Business: "bg-yellow-100 text-yellow-800",
  Marketing: "bg-purple-100 text-purple-800",
  "AI & Tech": "bg-pink-100 text-pink-800",
  "Tech & Business": "bg-teal-100 text-teal-800",
};

export default function EventsPage({ onBack }) {
  const navigate = useNavigate();
  const [eventsData, setEventsData] = useState([]); // List of all events
  const [filteredEvents, setFilteredEvents] = useState([]); // Filtered events (for search & category filtering)
  const [registeredEvents, setRegisteredEvents] = useState([]); // Registered events for the user
  const [selectedEvent, setSelectedEvent] = useState(null); // Selected event for modal
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [viewingRegistrations, setViewingRegistrations] = useState(false); // Track view state
  const searchRef = useRef(null);
  const resetFilters = () => {
    setSelectedCategory("");  // Reset category filter
    setSelectedDate("");      // Reset date filter
    setSelectedTime("");      // Reset time filter
    setSearchQuery("");       // Reset search query
    setFilteredEvents(eventsData);  // Reset filtered events to all events
  };
  const filterRef = useRef(null); 
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false); // Close the filter modal
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch events from backend on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5003/get_event", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        console.log("Event Data:", data);

        const mappedEvents = data.map((event) => {
          const start = event.start;
          const date = start ? start.split(" ")[0] : "N/A";
          const time = start ? start.split(" ")[1] : "N/A";
          const categoryColor =
            categoryColors[event.category] || "bg-gray-100 text-gray-800";

          return {
            id: event.id,
            title: event.title,
            organizer: event.organizer_name || "N/A",
            category: event.category || "N/A",
            categoryColor: categoryColor,
            date: date,
            time: time,
            sponsored: event.sponsor_name ? "Yes" : "No",
            sponsor: event.sponsor_name || "N/A",
            organizer_name: event.organizer_name,
            sponsor_name: event.sponsor_name,
            description: event.description,
            location: event.location,
            start: event.start,
            end: event.end,
          };
        });

        setEventsData(mappedEvents);
        setFilteredEvents(mappedEvents); // Initialize the filtered events to all events
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate]);

  // Search function to filter events
  useEffect(() => {
    let filtered = (viewingRegistrations ? registeredEvents : eventsData).filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.sponsor_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedCategory) {
      filtered = filtered.filter((event) =>
        event.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((event) => event.date === selectedDate);
    }

    if (selectedTime) {
      filtered = filtered.filter((event) => event.time === selectedTime);
    }

    setFilteredEvents(filtered);
  }, [searchQuery, eventsData, selectedCategory, selectedDate, selectedTime, registeredEvents, viewingRegistrations]);

  // Fetch registered events for the attendee
  const fetchRegisteredEvents = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5003/get_registered_events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch registered events");
      }

      const registeredEvents = await response.json();
      console.log(`REGISTERED EVENTS:`, registeredEvents);

      const mappedRegisteredEvents = registeredEvents.map((event) => {
        const start = event.start;
        const date = start ? start.split(" ")[0] : "N/A";
        const time = start ? start.split(" ")[1] : "N/A";
        const categoryColor =
          categoryColors[event.category] || "bg-gray-100 text-gray-800";

        return {
          id: event.id,
          title: event.title,
          organizer: event.organizer_name || "N/A",
          category: event.category || "N/A",
          categoryColor: categoryColor,
          date: date,
          time: time,
          sponsored: event.sponsor_name ? "Yes" : "No",
          sponsor: event.sponsor_name || "N/A",
          organizer_name: event.organizer_name,
          sponsor_name: event.sponsor_name,
          description: event.description,
          location: event.location,
          start: event.start,
          end: event.end,
        };
      });

      setRegisteredEvents(mappedRegisteredEvents); // Update state with mapped events
      setViewingRegistrations(true); // Change to viewing registrations
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleView = () => {
    if (!viewingRegistrations) {
      fetchRegisteredEvents(); // Fetch registered events when switching to "My Registrations"
    } else {
      setFilteredEvents(eventsData); // Reset to all events when viewing registrations
    }
    setViewingRegistrations(!viewingRegistrations);
  };
  

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsSearchActive(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsSearchActive(false);
    }
  };

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const displayedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  // Fetch the registration status when an event is clicked
  const handleEventClick = async (event) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5003/check_registration?event_id=${event.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to check registration status");
      }

      const data = await response.json();
      const isRegistered = data.is_registered; // Assuming the response has `is_registered`

      setSelectedEvent({ ...event, isRegistered }); // Pass registration status to the modal
    } catch (err) {
      setError(err.message);
    }
  };

  // Update the registered events list after registration or cancellation
  const updateEvents = (eventId, isRegistered) => {
    if (isRegistered) {
      // Add event to registered events if newly registered
      const updatedRegisteredEvents = [...registeredEvents, eventsData.find(event => event.id === eventId)];
      setRegisteredEvents(updatedRegisteredEvents);
    } else {
      // Remove event from registered events if canceled
      const updatedRegisteredEvents = registeredEvents.filter(event => event.id !== eventId);
      setRegisteredEvents(updatedRegisteredEvents);
    }
    
    // Update the filtered events list
    setFilteredEvents(registeredEvents); // Update the filtered event list
  };

  return (
    <div
      className="min-h-screen bg-white flex flex-col relative"
      onClick={handleClickOutside}
    >
      <HeaderBar
        menuOptions={[ 
          { label: "EVENTS", onClick: () => navigate("/events") }, 
          { label: "PROFILE", onClick: () => navigate("/profile") }, 
          { label: "LOGOUT", onClick: () => { localStorage.removeItem("token"); navigate("/login"); } }
        ]}
      />

      <div className="px-10 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={onBack} className="p-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold uppercase">Events</h1>
        </div>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={toggleView} // Toggle view between registered and all events
            className="bg-black text-white py-2 px-6 rounded-lg transition-all duration-300 border border-black hover:bg-white hover:text-black hover:scale-105 hover:shadow-md"
          >
            {viewingRegistrations ? "View All Events" : "View My Registrations"}
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)} // Toggle filter menu visibility
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>

            <div ref={searchRef} className="relative">
              {isSearchActive ? (
                <input
                  type="text"
                  autoFocus
                  placeholder="Search"
                  className="border border-gray-300 py-2 px-4 rounded-lg"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              ) : (
                <button
                  onClick={() => setIsSearchActive(true)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg flex items-center space-x-2"
                >
                  <span>Search</span>
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Menu */}
        {isFilterOpen && (
  <div ref={filterRef} className="bg-white shadow-md p-4 rounded-lg absolute top-20 left-1/2 transform -translate-x-1/2 w-80 z-10">
    <div className="mb-4">
      <label
        htmlFor="category"
        className="block text-sm font-semibold text-gray-700"
      >
        Category
      </label>
      <input
        id="category"
        type="text"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        placeholder="Filter by category"
        className="w-full mt-2 p-2 border border-gray-300 rounded"
      />
    </div>
    <div className="mb-4">
      <label
        htmlFor="date"
        className="block text-sm font-semibold text-gray-700"
      >
        Date
      </label>
      <input
        id="date"
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="w-full mt-2 p-2 border border-gray-300 rounded"
      />
    </div>
    <div className="mb-4">
      <label
        htmlFor="time"
        className="block text-sm font-semibold text-gray-700"
      >
        Time
      </label>
      <input
        id="time"
        type="time"
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
        className="w-full mt-2 p-2 border border-gray-300 rounded"
      />
    </div>

    {/* Flex container for the buttons */}
    <div className="flex space-x-2 mt-4">
      {/* Apply Filters Button */}
      <button
        onClick={() => setIsFilterOpen(false)}
        className="bg-black text-white py-2 px-6 rounded-lg w-full transition-all duration-300 ease-in-out transform hover:bg-white hover:text-black hover:scale-105 hover:shadow-lg"
      >
        Apply Filters
      </button>

      {/* Reset Filters Button */}
      <button
        onClick={resetFilters}
        className="bg-red-500 text-white py-2 px-6 rounded-lg w-full transition-all duration-300 ease-in-out transform hover:bg-white hover:text-red-500 hover:scale-105 hover:shadow-lg"
      >
        Reset Filters
      </button>
    </div>
  </div>
)}


        {loading && <p>Loading events...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                  <tr>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Organizer</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Sponsored</th>
                    <th className="py-3 px-4">Sponsor</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {displayedEvents.map((event, index) => (
                    <tr key={index} className="hover:bg-gray-200 transition duration-200">
                      <td className="py-3 px-4">{event.title}</td>
                      <td className="py-3 px-4">{event.organizer}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-lg text-xs ${event.categoryColor}`}>
                          {event.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">{event.date}</td>
                      <td className="py-3 px-4">{event.time}</td>
                      <td className="py-3 px-4">{event.sponsored}</td>
                      <td className="py-3 px-4">{event.sponsor}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleEventClick(event)} // Updated to fetch registration status
                          className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
                        >
                          <Eye className="w-6 h-6" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-start items-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`py-2 px-4 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-300 text-gray-700"
                }`}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`py-2 px-4 rounded-lg ${
                      num === currentPage ? "bg-black text-white" : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={`py-2 px-4 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-300 text-gray-700"
                }`}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          updateEvents={updateEvents}  // Pass updateEvents to modal for instant UI update
        />
      )}

      <footer className="text-sm text-gray-600 p-4 pl-6 absolute bottom-0 left-0">
        LOGGED IN AS: ATTENDEE
      </footer>
    </div>
  );
}
