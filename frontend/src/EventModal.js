export default function EventModal({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 w-full max-w-3xl rounded-lg relative shadow-lg border border-gray-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-3xl font-bold text-gray-600 hover:text-black transition"
        >
          &times;
        </button>

        {/* Event Title */}
        <h2 className="text-3xl font-bold text-black">{event.title}</h2>

        {/* Event Category */}
        <p className={`mt-3 text-sm px-4 py-2 ${event.color || "bg-blue-100 text-blue-800"} rounded-md inline-block`}>
          {event.category}
        </p>

        {/* Event Details */}
        <div className="mt-6 grid grid-cols-2 gap-6 text-gray-700 text-sm">
          <div>
            <p className="font-semibold">Start:</p>
            <p>{new Date(event.start).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-semibold">End:</p>
            <p>{new Date(event.end).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-semibold">Location:</p>
            <p>{event.location}</p>
          </div>
          <div>
            <p className="font-semibold">Organizer:</p>
            <p>{event.organizer_name || "Not available"}</p>
          </div>
          <div>
            <p className="font-semibold">Sponsor:</p>
            <p>{event.sponsor_name || "Not available"}</p>
          </div>
        </div>

        {/* Event Description */}
        <p className="mt-6 text-gray-800 leading-relaxed">
          <strong>Description:</strong> {event.description || "No additional details available for this event."}
        </p>

        {/* Button - Initially Black, Hover to White */}
        <div className="flex justify-center mt-8">
          <button className="py-3 px-8 bg-black text-white font-medium rounded-lg border border-black transition-all duration-300 hover:bg-white hover:text-black">
            REGISTER FOR EVENT
          </button>
        </div>
      </div>
    </div>
  );
}
