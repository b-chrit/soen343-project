import { useState, useEffect } from "react";
import { ChevronLeft, Users, Calendar, MapPin, DollarSign } from "lucide-react";
import HeaderBar from "../HeaderBar";
import EventsTable from "../EventsTable";
import SearchAndFilter from "../SearchAndFilter";
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

const getSponsorshipColor = (status) => {
  const sponsorshipColors = {
    "N/A": "bg-gray-200 text-gray-700",
    PENDING: "bg-yellow-200 text-yellow-800",
    ACCEPTED: "bg-green-200 text-green-800",
    REJECTED: "bg-red-200 text-red-800",
  };
  return sponsorshipColors[status] || "bg-gray-200 text-gray-700";
};

export default function MyEvents() {
  const navigate = useNavigate();

  const [eventsData, setEventsData] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [stakeholders, setStakeholders] = useState([]);
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);
  
  // New state variables
  const [sponsorshipMode, setSponsorshipMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);

  const userType = localStorage.getItem("user_type");

  useEffect(() => {
    fetchMyEvents();
    fetchStakeholders();
  }, [navigate]);

  // Fetch events for the organizer
  const fetchMyEvents = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5003/organizer/get_event", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch your events");
      }
      const data = await response.json();

      const mappedEvents = data.map((event) => {
        const start = event.start || "";
        const end = event.end || "";
        const date = start.split(" ")[0] || "N/A";
        const time = start.split(" ")[1] || "N/A";
        const categoryColor =
          categoryColors[event.category] || "bg-gray-100 text-gray-800";
        const sponsorshipStatus = event.sponsorship_status || "N/A";
        const sponsorshipColor = getSponsorshipColor(sponsorshipStatus);

        const formattedStart = new Date(start).toISOString().slice(0, 16);
        const formattedEnd = new Date(end).toISOString().slice(0, 16);

        return {
          id: event.id,
          title: event.title,
          category: event.category || "N/A",
          categoryColor,
          date,
          time,
          start: formattedStart,
          end: formattedEnd,
          sponsorshipStatus,
          sponsorshipColor,
          sponsor: event.sponsor_name || "None",
          capacity: event.capacity || "N/A",
          registrations: event.registrations || 0,
          location: event.location || "N/A",
          description: event.description || "",
          event_type: event.event_type || "N/A",
          registration_fee: event.fee || 0,
        };
      });

      setEventsData(mappedEvents);
      setFilteredEvents(mappedEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all stakeholders
  const fetchStakeholders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch("http://localhost:5003/stakeholder/get_all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch stakeholders");
      }
      const data = await response.json();
      setStakeholders(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter events by search & filters
  useEffect(() => {
    let filtered = eventsData.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [searchQuery, selectedCategory, selectedDate, selectedTime, eventsData]);

  const handleSponsorshipRequest = async () => {
    // Ensure an event and a stakeholder have been selected
    if (!selectedEvent) {
      alert("Please select an event to sponsor.");
      return;
    }
    
    if (!selectedStakeholder) {
      alert("Please select a stakeholder to sponsor this event.");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5003/organizer/request_sponsorship", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id: selectedEvent.id,
          stakeholder_id: selectedStakeholder.id,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Request failed");
      }
  
      const data = await response.json();
      
      // Update the event's sponsorship status
      const updatedEvents = eventsData.map((e) =>
        e.id === selectedEvent.id
          ? { 
              ...e, 
              sponsorshipStatus: "PENDING", 
              sponsorshipColor: getSponsorshipColor("PENDING"),
              sponsor: selectedStakeholder ? `${selectedStakeholder.first_name} ${selectedStakeholder.last_name} (Pending)` : "Pending"
            }
          : e
      );
  
      setEventsData(updatedEvents);
      setFilteredEvents(updatedEvents);
      
      // Reset selection mode
      resetSponsorshipMode();
      
      alert("Sponsorship request sent successfully!");
    } catch (err) {
      alert(err.message);
    }
  };
  
  const handleCancelRequest = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    // Find the event to get associated stakeholder information if needed
    const eventToCancel = eventsData.find(e => e.id === eventId);
    if (!eventToCancel) return;
  
    try {
      const response = await fetch("http://localhost:5003/organizer/cancel_request", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id: eventId,
          // If needed, we would include stakeholder_id here
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Cancellation failed");
      }
  
      // Update the event's sponsorship status
      const updatedEvents = eventsData.map((e) =>
        e.id === eventId
          ? { 
              ...e, 
              sponsorshipStatus: "N/A", 
              sponsorshipColor: getSponsorshipColor("N/A"),
              sponsor: "None"
            }
          : e
      );
  
      setEventsData(updatedEvents);
      setFilteredEvents(updatedEvents);
      
      alert("Sponsorship request cancelled successfully.");
    } catch (err) {
      alert(err.message);
    }
  };
  
  const enterSponsorshipMode = () => {
    setSponsorshipMode(true);
    setSelectedStakeholder(null);
    setSelectedEvent(null);
  };
  
  const resetSponsorshipMode = () => {
    setSponsorshipMode(false);
    setSelectedStakeholder(null);
    setSelectedEvent(null);
  };
  
  const selectEvent = (evt) => {
    // Only allow selection of events with N/A sponsorship status
    if (evt.sponsorshipStatus === "N/A") {
      setSelectedEvent(evt);
    }
  };
  

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedDate("");
    setSelectedTime("");
    setFilteredEvents(eventsData);
  };

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const displayedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Header */}
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

      <div className="px-10 py-8 flex-1">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full border border-black hover:bg-black hover:text-white transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold uppercase tracking-wide">My Events</h1>
        </div>

        {/* Search & Filter or Sponsorship UI */}
        <div className="flex justify-between items-center mb-6">
          {!sponsorshipMode ? (
            <>
              <button
                onClick={enterSponsorshipMode}
                className="bg-black text-white py-2 px-6 rounded-lg transition-all duration-300 border border-black hover:bg-white hover:text-black hover:scale-105 hover:shadow-md flex items-center space-x-2"
              >
                <DollarSign className="w-5 h-5" />
                <span>Request Sponsorship</span>
              </button>
              <SearchAndFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                resetFilters={resetFilters}
              />
            </>
          ) : (
            <div className="w-full">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Request Event Sponsorship</h2>
                
                {selectedEvent && (
                  <div className="mb-6 bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">{selectedEvent.title}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{selectedEvent.date} at {selectedEvent.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{selectedEvent.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Capacity: {selectedEvent.capacity}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-lg text-xs ${selectedEvent.categoryColor}`}>
                          {selectedEvent.category}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-4 mb-6">
                  <label className="text-gray-700 font-medium w-40">Select Stakeholder:</label>
                  <select
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setSelectedStakeholder(id ? stakeholders.find(s => s.id === id) : null);
                    }}
                    className="flex-1 h-10 p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-black focus:border-transparent"
                    value={selectedStakeholder?.id || ""}
                  >
                    <option value="">Select a stakeholder</option>
                    {stakeholders.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.first_name} {s.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={resetSponsorshipMode}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSponsorshipRequest}
                    className={`bg-black text-white py-2 px-6 rounded-lg transition-all duration-300 border border-black 
                    ${(!selectedEvent || !selectedStakeholder) 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-white hover:text-black hover:shadow-md'}`}
                    disabled={!selectedEvent || !selectedStakeholder}
                  >
                    Send Request
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      Please select an event below that has no sponsorship (N/A status).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Events Table */}
        {!loading && !error && (
          <div className={sponsorshipMode ? "opacity-95 transition-opacity duration-300" : ""}>
            <EventsTable
              events={displayedEvents}
              columns={[
                { 
                  label: "Event", 
                  accessor: "title", 
                  width: "w-1/5",
                  render: (value, evt) => (
                    <div className={`flex items-center ${sponsorshipMode && evt.sponsorshipStatus === "N/A" ? "cursor-pointer hover:text-blue-600" : ""}`}
                      onClick={() => sponsorshipMode && selectEvent(evt)}>
                      {sponsorshipMode && evt.sponsorshipStatus === "N/A" && (
                        <input
                          type="radio"
                          name="selectedEvent"
                          checked={selectedEvent?.id === evt.id}
                          onChange={() => selectEvent(evt)}
                          className="mr-2"
                        />
                      )}
                      <span className={`font-medium ${selectedEvent?.id === evt.id ? "text-blue-600" : ""}`}>{value}</span>
                    </div>
                  ),
                },
                { 
                  label: "Category", 
                  accessor: "category",
                  width: "w-1/6",
                  render: (value, evt) => (
                    <span className={`px-2 py-1 rounded-lg text-xs ${evt.categoryColor}`}>
                      {value}
                    </span>
                  ),
                },
                { label: "Date", accessor: "date", width: "w-1/6" },
                { label: "Time", accessor: "time", width: "w-1/6" },
                {
                  label: "Status",
                  accessor: "sponsorshipStatus",
                  width: "w-1/6",
                  render: (value, evt) => (
                    <span className={`px-2 py-1 rounded-lg text-xs ${evt.sponsorshipColor}`}>
                      {value}
                    </span>
                  ),
                },
                {
                  label: "Sponsor",
                  accessor: "sponsor",
                  width: "w-1/6",
                  render: (value, evt) => (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{value}</span>
                      {!sponsorshipMode && evt.sponsorshipStatus === "PENDING" && (
                        <button
                          onClick={() => handleCancelRequest(evt.id)}
                          className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs hover:bg-red-600 transition"
                          title="Cancel request"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  ),
                },
              ]}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              onRowHover={setHoveredEvent}
              hoveredRowId={hoveredEvent?.id}
              selectedRowId={selectedEvent?.id}
              highlightSelectedRow={sponsorshipMode}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-sm text-gray-600 p-4 pl-6 border-t border-gray-200">
        LOGGED IN AS: {userType ? userType.toUpperCase() : "UNKNOWN"}
      </footer>
    </div>
  );
}