import ReusableEventsPage from "../ReusableEventsPage";
import EventModal from "./EventModal";

export default function EventsPage({ onBack }) {
  const fetchUserRegisteredEvents = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

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

    const data = await response.json();

    return data.map((event) => {
      const start = event.start;
      const date = start ? start.split(" ")[0] : "N/A";
      const time = start ? start.split(" ")[1] : "N/A";
      const categoryColor =
        {
          Technology: "bg-blue-100 text-blue-800",
          Finance: "bg-green-100 text-green-800",
          Business: "bg-yellow-100 text-yellow-800",
          Marketing: "bg-purple-100 text-purple-800",
          "AI & Tech": "bg-pink-100 text-pink-800",
          "Tech & Business": "bg-teal-100 text-teal-800",
        }[event.category] || "bg-gray-100 text-gray-800";

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
        feeFormatted: event.fee === 0.0 ? "Free" : "$ " + event.fee.toFixed(2),
      };
    });
  };

  return (
    <ReusableEventsPage
      onBack={onBack}
      toggleViewLabel="View My Registrations"
      fetchUserEvents={fetchUserRegisteredEvents}
      ModalComponent={EventModal}
    />
  );
}
