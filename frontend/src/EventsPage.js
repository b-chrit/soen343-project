import { useState, useRef } from "react";
import { ChevronLeft, Eye, Search } from "lucide-react";
import EventModal from "./EventModal";
import HeaderBar from "./HeaderBar";

  const eventsPerPage = 5; // Show 6 events per page

  export default function EventsPage({ onBack, eventsData, onNavigateEvents, onNavigateProfile }) {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const searchRef = useRef(null);
  
    // Handle clicking outside the search input
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchActive(false);
      }
    };
  
    // Close search input on Escape key
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsSearchActive(false);
      }
    };
  
    // Calculate the events to display based on pagination
    const totalPages = Math.ceil(eventsData.length / eventsPerPage);
    const startIndex = (currentPage - 1) * eventsPerPage;
    const displayedEvents = eventsData.slice(startIndex, startIndex + eventsPerPage);
  
    return (
      <div className="min-h-screen bg-white flex flex-col relative" onClick={handleClickOutside}>
          <HeaderBar
            menuOptions={[
              { label: "EVENTS", onClick: onNavigateEvents },
              { label: "PROFILE", onClick: onNavigateProfile  },
              { label: "LOGOUT", onClick: () => console.log("Logging Out") },
            ]}
          />
        {/* MAIN CONTENT */}
        <div className="px-10 py-6">
          {/* BACK BUTTON & TITLE */}
          <div className="flex items-center space-x-4 mb-6">
            <button onClick={onBack} className="p-2">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold uppercase">Events</h1>
          </div>
  
          {/* SEARCH, FILTER, AND VIEW REGISTRATIONS */}
          <div className="flex justify-between items-center mb-4">
            <button className="bg-black text-white py-2 px-6 rounded-lg">
              View My Registrations
            </button>
            <div className="flex items-center space-x-4">
              <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg">
                Filter ▼
              </button>
  
              {/* Search Toggle */}
              <div ref={searchRef} className="relative">
                {isSearchActive ? (
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search"
                    className="border border-gray-300 py-2 px-4 rounded-lg"
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
  
          {/* EVENTS TABLE */}
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
                      {/* Eye Button */}
                      <button
                        onClick={() => setSelectedEvent(event)}
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
  
          {/* PAGINATION */}
          <div className="flex justify-start items-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`py-2 px-4 rounded-lg ${
                currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-700"
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`py-2 px-4 rounded-lg ${
                currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-700"
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
  
        {/* MODAL */}
        {selectedEvent && (
          <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
  
        {/* FOOTER */}
        <footer className="text-sm text-gray-600 p-4 pl-6 absolute bottom-0 left-0">
          LOGGED IN AS: ATTENDEE
        </footer>
      </div>
    );
  }