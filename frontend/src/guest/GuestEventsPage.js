import { useState, useEffect } from "react";
import HeaderBar from "../HeaderBar";
import SearchAndFilter from "../SearchAndFilter";
import EventsTable from "../EventsTable";
import GuestEventModal from "./GuestEventModal";
import { useNavigate } from "react-router-dom";
import { Calendar, Search } from "lucide-react";

const eventsPerPage = 5;

const categoryColors = {
  Technology: "bg-blue-100 text-blue-800",
  Finance: "bg-green-100 text-green-800",
  Business: "bg-yellow-100 text-yellow-800",
  Marketing: "bg-purple-100 text-purple-800",
  "AI & Tech": "bg-pink-100 text-pink-800",
  "Tech & Business": "bg-teal-100 text-teal-800",
};

export default function GuestEventsPage() {
  const navigate = useNavigate();

  const [eventsData, setEventsData] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

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

        const response = await fetch("http://localhost:5003/event/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();

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
            capacity: event.capacity || "N/A",
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
  }, []);

  useEffect(() => {
    let filtered = eventsData.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.sponsor && event.sponsor.toLowerCase().includes(searchQuery.toLowerCase()))
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
    selectedTime
  ]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const displayedEvents = filteredEvents.slice(
    startIndex,
    startIndex + eventsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* HEADER BAR */}
      <HeaderBar
        menuOptions={[
          { label: "EVENTS", onClick: () => navigate("/guest-events") },
          { label: "LOGIN", onClick: () => navigate("/login")}
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
              <p className="text-gray-600 mt-2">Discover and explore events happening around you</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
              <button 
                onClick={() => navigate("/login")}
                className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Sign in to register
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-600" />
              All Events
            </h2>
            
            <div className="w-full sm:w-auto">
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
          </div>

          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center my-4">
              {error}
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && (
            <div className="text-center py-10">
              <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No events found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
              <button 
                onClick={resetFilters}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Reset all filters
              </button>
            </div>
          )}

          {!loading && !error && filteredEvents.length > 0 && (
            <EventsTable
              events={displayedEvents}
              columns={[
                { label: "Event", accessor: "title", width: "w-1/4" },
                { label: "Organizer", accessor: "organization_name", width: "w-1/6" },
                {
                  label: "Category",
                  accessor: "category",
                  width: "w-1/8",
                  render: (value, event) => (
                    <span className={`px-2 py-1 rounded-lg text-xs ${event.categoryColor}`}>
                      {value}
                    </span>
                  ),
                },
                { 
                  label: "Fee", 
                  accessor: "feeFormatted", 
                  width: "w-1/10",
                  render: (value) => (
                    <span className={value === 'Free' ? 'text-green-600 font-medium' : ''}>
                      {value}
                    </span>
                  )
                },
                { label: "Date", accessor: "date", width: "w-1/8" },
                { label: "Time", accessor: "time", width: "w-1/8" },
                { 
                  label: "Spots Left", 
                  accessor: "registrations", 
                  width: "w-1/10", 
                  render: (value, event) => {
                    const spotsLeft = event.capacity - value;
                    let colorClass = '';
                    
                    if (spotsLeft <= 5 && spotsLeft > 0) {
                      colorClass = 'text-orange-600 font-medium';
                    } else if (spotsLeft === 0) {
                      colorClass = 'text-red-600 font-medium';
                    }
                    
                    return (
                      <span className={colorClass}>
                        {spotsLeft === 0 ? 'Sold out' : spotsLeft}
                      </span>
                    );
                  }
                },
              ]}
              onEventClick={handleEventClick}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>

      {selectedEvent && (
        <GuestEventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      <footer className="text-sm text-gray-600 p-4 pl-6 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <span>LOGGED IN AS: GUEST</span>
          <span className="text-xs">© 2025 SEES Event System</span>
        </div>
      </footer>
    </div>
  );
}