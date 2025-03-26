import { useState } from "react";
import { ClipLoader } from 'react-spinners';
import { CheckCircle, XCircle } from "lucide-react";
import EventDescription from "./EventDescription";
import EventPayment from "./EventPayment";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function EventModal({ event, onClose, updateEvents }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRegistered, setIsRegistered] = useState(event.isRegistered);

  const [isInPayment, setIsInPayment] = useState(false)
  const [clientSecret, setClientSecret] = useState(null);

  const handleRegistration = async () => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const url = isRegistered
        ? "http://localhost:5003/event/deregister"
        : "http://localhost:5003/event/register";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          { 
            event_id : event.id,
            ...(clientSecret && { client_secret : clientSecret })
          }
        ),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred");
      }
      const data = await response.json();
      console.log(data);

      if (data.status == 'payment_required'){
        setClientSecret(data.client_secret);
        setIsInPayment(true);
      }
      if (data.status == 'registered'){
        setIsSuccess(true);
        setIsRegistered(true);
        setClientSecret(false);
        
        if (updateEvents) {
          updateEvents(event.id, !isRegistered);
        }
        setIsInPayment(false);

        const timer = setTimeout(() => {
          setIsSuccess(false);
        }, 2000);
      }
      if (data.status == 'cancelled'){
        setIsRegistered(false)
        if (updateEvents) {
          updateEvents(event.id, !isRegistered);
        }
      }

    } catch (err) {
      console.log("Error : "+err);
      setError(err.message);  // Display the error message returned by the backend
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) return null;

  if (isSuccess) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 w-full max-w-3xl h-[600px] rounded-lg relative flex flex-col shadow-lg border border-gray-300">
        <div className="w-full h-full flex align-center items-center justify-center">
          <DotLottieReact className="w-[200px] f-[200px]" src="/success_animation.json" autoplay />
        </div>
      </div>
    </div>
    
    
  )

  if (isLoading) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 w-full max-w-3xl h-[600px] rounded-lg relative flex flex-col shadow-lg border border-gray-300">
        <div className="w-full h-full flex align-center items-center justify-center">
          <ClipLoader size={100} color="#000" loading={isLoading} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 w-full max-w-3xl h-[600px] rounded-lg relative flex flex-col shadow-lg border border-gray-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-3xl font-bold text-gray-600 hover:text-black transition"
        >
          &times;
        </button>

        <div className="w-full h-full">
          {isInPayment ? (
            <EventPayment event={event} clientSecret={clientSecret} isLoading={isLoading} handleRegistration={handleRegistration} />
          ) : (
            <EventDescription 
              event={event} 
              isRegistered={isRegistered} 
              setIsRegistered={setIsRegistered} 
              isLoading={isLoading} 
              handleRegistration={handleRegistration} 
            />
          )}
        </div>

        {/* Success Message
        {isSuccess && (
          <div className="mt-6 text-center text-green-600 animate__animated animate__fadeIn">
            <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
            <p className="text-xl font-semibold">
              {isRegistered ? "Registration Successful!" : "Cancellation Successful!"}
            </p>
            <p>
              {isRegistered
                ? "You have successfully registered for this event."
                : "Your registration has been canceled."}
            </p>
          </div>
        )} */}

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
