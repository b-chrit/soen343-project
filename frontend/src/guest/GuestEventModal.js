import { useState } from "react";
import { X, Calendar, Clock, MapPin, Users, Building, User, Award, Tag, DollarSign } from "lucide-react";

export default function GuestEventModal({ event, onClose }) {
  if (!event) return null;

  // Format date properly
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Spots left indicators
  const getSpotsLeftIndicator = () => {
    const spotsLeft = event.capacity - event.registrations;
    
    if (spotsLeft === 0) {
      return { text: "SOLD OUT", bgColor: "bg-red-100", textColor: "text-red-800" };
    } else if (spotsLeft <= 5) {
      return { text: "ALMOST FULL", bgColor: "bg-orange-100", textColor: "text-orange-800" };
    } else if (spotsLeft <= 10) {
      return { text: "FILLING UP", bgColor: "bg-yellow-100", textColor: "text-yellow-800" };
    } else {
      return { text: "AVAILABLE", bgColor: "bg-green-100", textColor: "text-green-800" };
    }
  };

  const spotsLeftInfo = getSpotsLeftIndicator();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl relative overflow-hidden animate-fadeIn">
        {/* Header with gradient background */}
        <div className="relative">
          <div className={`${event.categoryColor?.split(' ')[0] || 'bg-gray-100'} h-16 bg-opacity-90`}></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-white bg-opacity-90 p-2 shadow-md hover:bg-opacity-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Title and category */}
          <div className="mb-6">
            <div className="flex items-start gap-2 mb-2">
              <span className={`text-xs px-3 py-1 rounded-full ${event.categoryColor || "bg-gray-100 text-gray-800"}`}>
                {event.category}
              </span>
              {event.sponsored === "Yes" && (
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  Sponsored
                </span>
              )}
              <span className={`text-xs px-3 py-1 rounded-full ml-auto ${spotsLeftInfo.bgColor} ${spotsLeftInfo.textColor}`}>
                {spotsLeftInfo.text}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column - Event details */}
            <div className="space-y-5">
              {/* Date & Time */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Event Details</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex">
                    <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="font-medium">{formatDate(event.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <Clock className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Time</p>
                      <p className="font-medium">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <p className="font-medium">{event.location}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Organizer info */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Organized by</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex">
                    <Building className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Organization</p>
                      <p className="font-medium">{event.organization_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <User className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Representative</p>
                      <p className="font-medium">{event.organizer_name}</p>
                    </div>
                  </div>
                  
                  {event.sponsored === "Yes" && (
                    <div className="flex">
                      <Award className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Sponsor</p>
                        <p className="font-medium">{event.sponsor || "N/A"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right column - Description */}
            <div className="space-y-5">
              {/* Description */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Description</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
              
              {/* Registration info */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Registration</h3>
                </div>
                <div className="p-4">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-500 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Capacity</p>
                        <p className="font-medium">{event.capacity}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Registration Fee</p>
                        <p className={`font-medium ${event.feeFormatted === 'Free' ? 'text-green-600' : ''}`}>
                          {event.feeFormatted}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${event.registrations >= event.capacity ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(100, (event.registrations / event.capacity) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{event.registrations} registered</span>
                      <span>{event.capacity - event.registrations} spots left</span>
                    </div>
                  </div>
                  
                  {/* Disabled registration button */}
                  <button
                    disabled
                    className="w-full flex justify-center items-center py-3 px-6 font-medium rounded-lg border bg-gray-200 text-gray-500 cursor-not-allowed"
                  >
                    <User className="w-4 h-4 mr-2" />
                    LOGIN REQUIRED TO REGISTER
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Please login to your account to register for this event.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}