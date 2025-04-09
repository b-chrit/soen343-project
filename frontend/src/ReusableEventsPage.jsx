import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import HeaderBar from "./HeaderBar";
import SearchAndFilter from "./SearchAndFilter";
import EventsTable from "./EventsTable";
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

export default function ReusableEventsPage({
  onBack,
  ModalComponent,
  toggleViewLabel = "View My Registrations",
  fetchUserEvents,
  heading = "Events",
  calendarPath = "/calendar",
}) {
  const navigate = useNavigate();
  const [eventsData, setEventsData] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [viewingUserEvents, setViewingUserEvents] = useState(false);

  const userType = localStorage.getItem("user_type");

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedDate("");
    setSelectedTime("");
    setSearchQuery("");
    setFilteredEvents(eventsData);
  };

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const response = await fetch("http://localhost:5003/event/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        const mappedEvents = data.map((event) => {
          const start = event.start;
          const [date, time] = start ? start.split(" ") : ["N/A", "N/A"];
          return {
            id: event.id,
            title: event.title,
            organizer_name: event.organizer_name || "N/A",
            organization_name: event.organization_name || "N/A",
            category: event.category || "N/A",
            categoryColor: categoryColors[event.category] || "bg-gray-100 text-gray-800",
            date,
            time,
            sponsored: event.sponsor_name ? "Yes" : "No",
            sponsor: event.sponsor_name || "N/A",
            capacity: event.capacity || "N/A",
            registrations: event.registrations || 0,
            location: event.location,
            description: event.description,
            start: event.start,
            end: event.end,
            fee: event.fee,
            feeFormatted: event.fee === 0.0 ? "Free" : `$ ${event.fee?.toFixed(2)}`
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

    fetchAllEvents();
  }, [navigate]);

  useEffect(() => {
    let filtered = (viewingUserEvents ? userEvents : eventsData).filter((event) =>
      [event.title, event.organizer_name, event.category, event.sponsor_name]
        .some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (selectedCategory)
      filtered = filtered.filter((event) => event.category?.toLowerCase().includes(selectedCategory.toLowerCase()));

    if (selectedDate) filtered = filtered.filter((event) => event.date === selectedDate);
    if (selectedTime) filtered = filtered.filter((event) => event.time === selectedTime);

    setFilteredEvents(filtered);
  }, [searchQuery, eventsData, selectedCategory, selectedDate, selectedTime, userEvents, viewingUserEvents]);

  const toggleView = async () => {
    if (!viewingUserEvents && fetchUserEvents) {
      try {
        const data = await fetchUserEvents();
        setUserEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        setError(err.message);
      }
    } else {
      setFilteredEvents(eventsData);
    }

    setViewingUserEvents(!viewingUserEvents);
  };

  const handleEventClick = (event) => setSelectedEvent(event);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const displayedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  const updateEventSponsorStatus = (eventId, status) => {
    setEventsData((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, sponsored: status ? "Yes" : "No", sponsor: status ? "Your Sponsor" : "N/A" } : event
      )
    );
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
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={onBack} className="p-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold uppercase">{heading}</h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex gap-4">
            <button
              onClick={toggleView}
              className="bg-black text-white py-2 px-6 rounded-lg transition-all duration-300 border border-black hover:bg-white hover:text-black hover:scale-105 hover:shadow-md"
            >
              {viewingUserEvents ? "View All Events" : toggleViewLabel}
            </button>

            <button
              onClick={() => navigate(calendarPath)}
              className="bg-gray-100 text-black py-2 px-6 rounded-lg transition-all duration-300 border border-gray-300 hover:bg-black hover:text-white hover:scale-105 hover:shadow-md"
            >
              Switch to Calendar View
            </button>
          </div>

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
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            onEventClick={handleEventClick}
            columns={[
              { label: "Event", accessor: "title", width: "w-1/2" },
              { label: "Organizer", accessor: "organization_name", width: "w-1/5" },
              {
                label: "Category",
                accessor: "category",
                width: "w-1/5",
                render: (val, ev) => <span className={`px-2 py-1 rounded-lg text-xs ${ev.categoryColor}`}>{val}</span>,
              },
              { label: "Fee", accessor: "feeFormatted", width: "w-1/6" },
              { label: "Date", accessor: "date", width: "w-1/5" },
              { label: "Time", accessor: "time", width: "w-1/5" },
              { label: "Sponsored", accessor: "sponsored", width: "w-1/5" },
              { label: "Sponsor", accessor: "sponsor", width: "w-1/5" },
            ]}
          />
        )}
      </div>

      {selectedEvent && <ModalComponent event={selectedEvent} onClose={() => setSelectedEvent(null)} />}

      <footer className="text-sm text-gray-600 p-4 pl-6 absolute bottom-0 left-0">
        LOGGED IN AS: {userType ? userType.toUpperCase() : "UNKNOWN"}
      </footer>
    </div>
  );
}
