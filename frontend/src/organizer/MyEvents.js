import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import HeaderBar from "../HeaderBar";
import EventsTable from "../EventsTable";
import SearchAndFilter from "../SearchAndFilter";
import MyEventsModal from "./MyEventsModal";
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
  const [selectedEvent, setSelectedEvent] = useState(null);

  const userType = localStorage.getItem("user_type");

  useEffect(() => {
    fetchMyEvents();
  }, [navigate]);

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

        const formattedStart = new Date(start).toISOString().slice(0, 16);
        const formattedEnd = new Date(end).toISOString().slice(0, 16);
        console.log(event);
        return {
          id: event.id,
          title: event.title,
          category: event.category || "N/A",
          categoryColor,
          date,
          time,
          start: formattedStart,
          end: formattedEnd,
          sponsored: event.sponsor_name ? "Yes" : "No",
          sponsor: event.sponsor_name || "None",
          capacity: event.capacity || "N/A",
          registrations: event.registrations || 0,
          location: event.location,
          description: event.description,
          event_type: event.event_type,
          registration_fee: event.fee
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

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleDeleteEvent = (eventId) => {
    setEventsData(eventsData.filter((event) => event.id !== eventId));
    setSelectedEvent(null);
  };

  const handleEditEvent = (updatedEvent) => {
    const updatedEvents = eventsData.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    setEventsData(updatedEvents);
    setSelectedEvent(null);
    fetchMyEvents();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* ✅ Header */}
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

      {/* ✅ Page Title & Back */}
      <div className="px-10 py-8 flex-1">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full border border-black hover:bg-black hover:text-white transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold uppercase tracking-wide">
            My Events
          </h1>
        </div>

        {/* ✅ Search and Filter */}
        <div className="flex justify-between items-center mb-6">
          <div></div>
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

        {/* ✅ Loading and Error */}
        {loading && <p className="text-gray-500">Loading your events...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* ✅ Events Table */}
        {!loading && !error && (
          <EventsTable
            events={displayedEvents}
            columns={[
              { label: "Event", accessor: "title", width: "w-1/5" },
              {
                label: "Category",
                accessor: "category",
                width: "w-1/5",
                render: (value, event) => (
                  <span
                    className={`px-2 py-1 rounded-lg text-xs ${event.categoryColor}`}
                  >
                    {value}
                  </span>
                ),
              },
              { label: "Date", accessor: "date", width: "w-1/5" },
              { label: "Time", accessor: "time", width: "w-1/5" },
              { label: "Sponsored", accessor: "sponsored", width: "w-1/5" },
              { label: "Sponsor", accessor: "sponsor", width: "w-1/5" },
              { label: "Capacity", accessor: "capacity", width: "w-1/5" },
              { label: "Registrations", accessor: "registrations", width: "w-1/5" },
            ]}
            onEventClick={handleEventClick}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>

      {/* ✅ Modal */}
      {selectedEvent && (
        <MyEventsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDeleteEvent={handleDeleteEvent}
          onEditEvent={handleEditEvent}
        />
      )}

      {/* ✅ Footer */}
      <footer className="text-sm text-gray-600 p-4 pl-6 border-t border-gray-200">
        LOGGED IN AS: {userType ? userType.toUpperCase() : "UNKNOWN"}
      </footer>
    </div>
  );
}
