import { Eye } from "lucide-react";

export default function EventsTable({
  events,
  onEventClick,
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  return (
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
            {events.map((event, index) => (
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
                    onClick={() => onEventClick(event)}
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

      {/* Pagination Controls */}
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
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
  );
}
