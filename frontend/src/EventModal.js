export default function EventModal({ event, onClose }) {
    if (!event) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 w-2/3 max-w-lg rounded-lg relative shadow-lg border border-black">
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-3 right-4 text-2xl font-bold">
            &times;
          </button>
  
          {/* Event Title */}
          <h2 className="text-2xl font-bold">{event.title}</h2>
  
          {/* Category */}
          <p className={`mt-2 text-sm px-3 py-1 ${event.color} text-black bg-opacity-20 rounded-md inline-block`}>
            {event.category}
          </p>
  
          {/* Event Details */}
          <div className="mt-4 text-sm">
            <p><strong>DAY:</strong> {event.date}</p>
            <p><strong>TIME:</strong> {event.time}</p>
            <p><strong>ORGANIZER:</strong> {event.organizer || "XYZ"}</p>
          </div>
  
          {/* Description */}
          <p className="mt-4 text-gray-700 leading-relaxed">
            {event.description || "No additional details available for this event."}
          </p>
  
          {/* Button - Initially Black, Hover to White */}
          <div className="flex justify-end mt-6">
            <button className="py-2 px-6 bg-black text-white font-medium border border-black transition hover:bg-white hover:text-black">
              REGISTER FOR EVENT
            </button>
          </div>
        </div>
      </div>
    );
  }
  