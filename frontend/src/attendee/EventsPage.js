import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import EventModal from "./EventModal";
import HeaderBar from "../HeaderBar";
import SearchAndFilter from "../SearchAndFilter";
import EventsTable from "../EventsTable";
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

  const [eventsData, setEventsData] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [viewingRegistrations, setViewingRegistrations] = useState(false);

  const userType = localStorage.getItem("user_type");
  console.log("Logged in user type:", userType);

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedDate("");
    setSelectedTime("");
    setSearchQuery("");
    setFilteredEvents(eventsData);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5003/event/get", {
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
        console.log("Fetched Events:", data);

        const mappedEvents = data.map((event) => {
          const start = event.start;
          const date = start ? start.split(" ")[0] : "N/A";
          const time = start ? start.split(" ")[1] : "N/A";
          const categoryColor =
            categoryColors[event.category] || "bg-gray-100 text-gray-800";

          return {
            id: event.id,
            title: event.title,
            organizer_name: event.organizer_name || "N/A",
            organization_name: event.organization_name || "N/A",
            category: event.category || "N/A",
            categoryColor,
            date,
            time,
            sponsored: event.sponsor_name ? "Yes" : "No",
            sponsor: event.sponsor_name || "N/A",
            capacity: event.capacity || "N/A", // Ensure this is included
            registrations: event.registrations || 0,
            location: event.location,
            description: event.description,
            start: event.start,
            end: event.end,
            fee: event.fee,
            feeFormatted: event.fee == 0.0 ? 'Free' : "$ "+event.fee.toFixed(2)
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

    fetchEvents();
  }, [navigate, registeredEvents]);

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
  }, [
    searchQuery,
    eventsData,
    selectedCategory,
    selectedDate,
    selectedTime,
    registeredEvents,
    viewingRegistrations,
  ]);

  const fetchRegisteredEvents = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      navigate("/login");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5003/attendee/get_events", {
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
  
      const mappedRegisteredEvents = registeredEvents.map((event) => {
        const start = event.start;
        const date = start ? start.split(" ")[0] : "N/A";
        const time = start ? start.split(" ")[1] : "N/A";
        const categoryColor =
          categoryColors[event.category] || "bg-gray-100 text-gray-800";
  
        return {
          id: event.id,
          title: event.title,
          category: event.category || "N/A",
          categoryColor,
          date,
          time,
          sponsored: event.sponsor_name ? "Yes" : "No",
          sponsor: event.sponsor_name || "N/A",
          organization_name: event.organization_name,
          organizer_name: event.organizer_name,
          sponsor_name: event.sponsor_name,
          description: event.description,
          location: event.location,
          start: event.start,
          end: event.end,
          capacity: event.capacity || "N/A", // Adding capacity
          registrations: event.registrations || 0, // Adding registrations
        };
      });
  
      setRegisteredEvents(mappedRegisteredEvents);
      setViewingRegistrations(true);
    } catch (err) {
      setError(err.message);
    }
  };
  

  const toggleView = () => {
    if (!viewingRegistrations) {
      fetchRegisteredEvents();
    } else {
      setFilteredEvents(eventsData);
    }
    setViewingRegistrations(!viewingRegistrations);
  };

  const handleEventClick = async (event) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5003/event/check_registration?event_id=${event.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check registration status");
      }

      const data = await response.json();
      const isRegistered = data.is_registered;

      setSelectedEvent({ ...event, isRegistered });
    } catch (err) {
      setError(err.message);
    }
  };

  const updateEvents = (eventId, isRegistered) => {
    if (isRegistered) {
      const updatedRegisteredEvents = [
        ...registeredEvents,
        eventsData.find((event) => event.id === eventId),
      ];
      setRegisteredEvents(updatedRegisteredEvents);
    } else {
      const updatedRegisteredEvents = registeredEvents.filter(
        (event) => event.id !== eventId
      );
      setRegisteredEvents(updatedRegisteredEvents);
    }

    setFilteredEvents(registeredEvents);
  };

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const displayedEvents = filteredEvents.slice(
    startIndex,
    startIndex + eventsPerPage
  );

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <HeaderBar
        menuOptions={[{ label: "EVENTS", onClick: () => navigate("/events") }, { label: "PROFILE", onClick: () => navigate("/profile") }, { label: "LOGOUT", onClick: () => { localStorage.removeItem("token"); localStorage.removeItem("user_type"); navigate("/login"); } }]}
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
            onClick={toggleView}
            className="bg-black text-white py-2 px-6 rounded-lg transition-all duration-300 border border-black hover:bg-white hover:text-black hover:scale-105 hover:shadow-md"
          >
            {viewingRegistrations ? "View All Events" : "View My Registrations"}
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
        </div>

        {loading && <p>Loading events...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <EventsTable
            events={displayedEvents}
            columns={[
              { label: "Event", accessor: "title", width: "w-1/2" },
              { label: "Organizer", accessor: "organization_name", width: "w-1/5" },
              {
                label: "Category",
                accessor: "category",
                width: "w-1/5",
                render: (value, event) => (
                  <span className={`px-2 py-1 rounded-lg text-xs ${event.categoryColor}`}>
                    {value}
                  </span>
                ),
              },
              { label: "Fee", accessor: "feeFormatted", width: "w-1/6"},
              { label: "Date", accessor: "date", width: "w-1/5" },
              { label: "Time", accessor: "time", width: "w-1/5" },
              { label: "Sponsored", accessor: "sponsored", width: "w-1/5" },
              { label: "Sponsor", accessor: "sponsor", width: "w-1/5" },
              
            ]}
            onEventClick={handleEventClick}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          updateEvents={updateEvents}
        />
      )}

      <footer className="text-sm text-gray-600 p-4 pl-6 absolute bottom-0 left-0">
        LOGGED IN AS: {userType ? userType.toUpperCase() : "UNKNOWN"}
      </footer>
    </div>
  );
}
