import { Eye, CalendarX } from "lucide-react";

export default function EventsTable({
  events,
  onEventClick,
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  const hasEvents = events.length > 0;

  return (
    <>
      <div className="border border-gray-300 rounded-lg overflow-hidden w-full">
        {hasEvents ? (
          <table className="w-full text-left table-fixed">
            <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
              <tr>
                <th className="py-3 px-4 w-1/5">Event</th>
                <th className="py-3 px-4 w-1/5">Organizer</th>
                <th className="py-3 px-4 w-1/5">Category</th>
                <th className="py-3 px-4 w-1/5">Date</th>
                <th className="py-3 px-4 w-1/5">Time</th>
                <th className="py-3 px-4 w-1/5">Sponsored</th>
                <th className="py-3 px-4 w-1/5">Sponsor</th>
                <th className="py-3 px-4 w-1/12"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300">
              {events.map((event, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-200 transition duration-200"
                >
                  <td className="py-3 px-4">{event.title}</td>
                  <td className="py-3 px-4">{event.organizer}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${event.categoryColor}`}
                    >
                      {event.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">{event.date}</td>
                  <td className="py-3 px-4">{event.time}</td>
                  <td className="py-3 px-4">{event.sponsored}</td>
                  <td className="py-3 px-4">{event.sponsor}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onEventClick(event)}
                      className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Empty State (No Events)
          <div className="flex flex-col items-center justify-center py-12 text-center w-full">
            <CalendarX className="w-20 h-20 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Events Found
            </h3>
            <p className="text-gray-500 text-sm max-w-xs mb-4">
              We couldn’t find any events matching your search or filters.
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

      {/* Pagination Controls */}
      {hasEvents && (
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
                  num === currentPage
                    ? "bg-black text-white"
                    : "bg-gray-300 text-gray-700"
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
      )}
    </>
  );
}
