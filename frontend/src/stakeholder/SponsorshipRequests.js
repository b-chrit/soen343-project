import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, MapPin, Users, DollarSign, Check, X } from "lucide-react";
import HeaderBar from "../HeaderBar";

export default function SponsorshipRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  
  const userType = localStorage.getItem("user_type");

  useEffect(() => {
    fetchSponsorshipRequests();
  }, []);

  const fetchSponsorshipRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5003/stakeholder/sponsorship_requests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sponsorship requests");
      }

      const data = await response.json();
      setRequests(data.requests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId, eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5003/stakeholder/accept_sponsorship", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          request_id: requestId,
          event_id: eventId
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept sponsorship request");
      }

      // Remove the accepted request from the list
      setRequests(requests.filter(req => req.id !== requestId));
      setActionSuccess("Sponsorship request accepted successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (requestId, eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5003/stakeholder/reject_sponsorship", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          request_id: requestId,
          event_id: eventId
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject sponsorship request");
      }

      // Remove the rejected request from the list
      setRequests(requests.filter(req => req.id !== requestId));
      setActionSuccess("Sponsorship request rejected successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Header */}
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

      <div className="px-10 py-8 flex-1">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full border border-black hover:bg-black hover:text-white transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold uppercase tracking-wide">Sponsorship Requests</h1>
        </div>

        {/* Success Message */}
        {actionSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{actionSuccess}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        )}

        {/* No Requests Message */}
        {!loading && requests.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-10 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No pending sponsorship requests</h3>
            <p className="text-gray-500">
              When an organizer requests your sponsorship, it will appear here.
            </p>
          </div>
        )}

        {/* Requests List */}
        {!loading && requests.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {requests.map((request) => (
              <div 
                key={request.id} 
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">{request.event.title}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                        <span>{new Date(request.event.start).toLocaleDateString()} at {new Date(request.event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                        <span>{request.event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-5 h-5 mr-2 text-gray-500" />
                        <span>Capacity: {request.event.capacity}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                        <span>
                          {request.event.registration_fee ? 
                            `$${request.event.registration_fee.toFixed(2)}` : 
                            'Free'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="font-semibold">Organizer:</span> {request.organizer_name}
                    </div>
                    
                    <div className="mb-4 text-gray-700">
                      <p className="line-clamp-3">{request.event.description}</p>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Requested on: {new Date(request.requested_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="md:ml-6 mt-4 md:mt-0 flex md:flex-col justify-center space-x-4 md:space-x-0 md:space-y-4">
                    <button
                      onClick={() => handleAccept(request.id, request.event.id)}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.id, request.event.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition"
                    >
                      <X className="w-5 h-5 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-sm text-gray-600 p-4 pl-6 border-t border-gray-200">
        LOGGED IN AS: {userType ? userType.toUpperCase() : "UNKNOWN"}
      </footer>
    </div>
  );
}