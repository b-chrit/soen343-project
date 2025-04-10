import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import SponserDescription from "./SponserDescription";
import Calendar from "../Calendar";

export default function SponsorModal({ event, onClose, updateEvents }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSponsored, setIsSponsored] = useState(false);

  useEffect(() => {
    const checkSponsorship = async () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5003/stakeholder/check_sponsorship?event_id=${event.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to check sponsorship status");
        const data = await res.json();
        setIsSponsored(data.is_sponsoring);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkSponsorship();
  }, [event.id]);

  const handleSponsorship = async () => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const url = isSponsored
        ? "http://localhost:5003/stakeholder/cancel_sponsorship"
        : "http://localhost:5003/stakeholder/sponsor_event";

      const method = isSponsored ? "DELETE" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          event_id: event.id
          // No need to send stakeholder_id anymore
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred");
      }

      const data = await response.json();

      if (data.status === "sponsored") {
        setIsSponsored(true);
        setIsSuccess(true);
        updateEvents?.(event.id, true);
      } else if (data.status === "sponsorship cancelled") {
        setIsSponsored(false);
        setIsSuccess(true);
        updateEvents?.(event.id, false);
      } else {
        throw new Error("Unexpected response from server.");
      }

      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) return null;

  if (isSuccess)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 w-full max-w-3xl h-[600px] rounded-lg relative flex flex-col shadow-lg border border-gray-300">
          <div className="w-full h-full flex align-center items-center justify-center">
            <DotLottieReact className="w-[200px] f-[200px]" src="/success_animation.json" autoplay />
          </div>
        </div>
      </div>
    );

  if (isLoading)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 w-full max-w-3xl h-[600px] rounded-lg relative flex flex-col shadow-lg border border-gray-300">
          <div className="w-full h-full flex align-center items-center justify-center">
            <ClipLoader size={100} color="#000" loading={isLoading} />
          </div>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8 space-x-10">
      
      <div className="bg-white p-8 w-full max-w-3xl h-[600px] rounded-lg relative flex flex-col shadow-lg border border-gray-300">
        <button onClick={onClose} className="absolute top-3 right-4 text-3xl font-bold text-gray-600 hover:text-black transition">
          &times;
        </button>

        <div className="w-full h-full">
          <SponserDescription
            event={event}
            isSponsored={isSponsored}
            setIsSponsored={setIsSponsored}
            isLoading={isLoading}
            handleSponsorship={handleSponsorship}
            registerButtonText={isSponsored ? "Cancel Sponsorship" : "Sponsor Event"}
          />
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
      {isSponsored &&<div className="h-[600px] p-8 space-y-2 bg-white w-full flex flex-col rounded-lg">
        <h1>SharedCalendar</h1>
        <Calendar event_id={event.id}/>        
      </div>}
    </div>
  );
}