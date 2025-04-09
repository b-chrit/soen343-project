import ReusableEventsPage from "../ReusableEventsPage";
import SponserModal from "./SponserModal";

export default function SponsorEvent({ onBack }) {
  const fetchSponsoredEvents = async () => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("Unauthorized");

    const response = await fetch("http://localhost:5003/stakeholder/sponsored_events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch sponsored events");

    const data = await response.json();
    
    // Check the response structure based on our API implementation
    const eventsArray = data.events || [];

    return eventsArray.map((event) => {
      const start = event.start;
      const [date, time] = start ? start.split(" ") : ["N/A", "N/A"];
      return {
        id: event.id,
        title: event.title,
        organizer_name: event.organizer_name || "N/A",
        organization_name: event.organization_name || "N/A",
        category: event.category || "N/A",
        categoryColor: event.categoryColor || "bg-gray-100 text-gray-800",
        date,
        time,
        sponsored: "Yes", // These are all sponsored events
        sponsor: event.sponsor_name || "You", // The logged-in stakeholder is the sponsor
        capacity: event.capacity || "N/A",
        registrations: event.registrations || 0,
        location: event.location,
        description: event.description,
        start: event.start,
        end: event.end,
        fee: event.registration_fee,
        feeFormatted: event.registration_fee === 0.0 ? "Free" : `$ ${event.registration_fee?.toFixed(2)}`
      };
    });
  };

  return (
    <ReusableEventsPage
      onBack={onBack}
      toggleViewLabel="View My Sponsored Events"
      fetchUserEvents={fetchSponsoredEvents}
      heading="Sponsor Events"
      calendarPath="/calendar"
      ModalComponent={SponserModal}
    />
  );
}