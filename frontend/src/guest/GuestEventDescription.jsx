import React, {useState} from 'react'

function GuestEventDescription({event}) {
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const getDayTime = () => {
    let start = new Date(event.start);
    let end = new Date(event.end);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return { day: "Invalid date", time: "N/A" }; // Handle cases where event.start or event.end is missing
    }

    let day, day2, time;

    if (start.toDateString() === end.toDateString()) {
        // Same day event
        day = start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase();
        time = `${start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    } else {
        // Multi-day event
        day = `${start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase()}`;
        day2 = `${end.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase()}`;
        time = `${start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    }
    return { day, day2, time };

  };

  const {day, day2, time} = getDayTime();

  const handleRegistrationClick = () => {
    setShowLoginPrompt(true);
  };

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex flex-row mb-4">
        <h2 className="text-3xl font-bold text-black">{event.title}</h2>
      </div>
      <div className='w-full flex flex-row'>
        <p className={`text-sm text-center px-4 py-2 rounded-md w-[150px] inline-block ${event.categoryColor || "bg-gray-100 text-gray-800"}`}>
          {event.category}
        </p>
      </div>
      

      <div className='flex flex-row w-full h-full mt-8 text-xs justify-between'>
        <div className='flex flex-col w-[45%] justify-between'>
          <div className='flex flex-row w-full justify-between'>
            <div className='mr-2 flex flex-col w-full h-full'>
              <div>
                <p>Day</p>
                <p><strong>{day}</strong></p>
                {day2 && (
                  <>
                    <p>To</p>
                    <p><strong>{day2}</strong></p>
                  </>
                )}
                    
              </div>

              <div className='mt-6'>
                <p>Time</p>
                <p><strong>{time}</strong></p>
              </div>

              <div className='mt-6'>
                <p>Location</p>
                <p><strong>{event.location}</strong></p>
              </div>

              <div className='mt-6'>
                <p>Capacity</p>
                <p><strong>{event.capacity}</strong></p>
              </div>
              <div className='flex-grow'></div>
            </div>

            <div className='ml-2 flex flex-col h-full w-full border-r border-black-700 pr-4'>
              <div>
                <p>Organizer</p>
                <p><strong>{event.organization_name}</strong></p>
              </div>
              <div className={day2 ? 'mt-14' : 'mt-6'}>
                <p>Representative</p>
                <p><strong>{event.organizer_name}</strong></p>
              </div>
              <div className='mt-6'>
                <p>Sponsor(s)</p>
                <p><strong>{event.sponsor_name || 'N/A'}</strong></p>
              </div>
                
              <div className='flex-grow'></div>

            </div>
          </div>

          <div className='w-full flex flex-row justify-between'>
            <div>
                <p className='text-base'>Ticket(s) left</p>
                <p className='text-base'><strong>{event.capacity - event.registrations}</strong></p>
            </div>
            <div>
                <p className='text-base'>Registration Fee</p>
                <p className='text-base'><strong>{event.feeFormatted}</strong></p>
            </div>
          </div>
        </div>

        <div className='w-[50%] flex flex-col'>
          <p className='mb-4'><strong>Description</strong></p>
          <p className='text-sm text-justify'>{event.description}</p>
          <div className='flex-grow'></div>

          <button
            onClick={handleRegistrationClick}
            className="py-3 px-8 font-medium rounded-lg border transition-all duration-300 : bg-black text-white border-black hover:bg-white hover:text-black"
          >
            REGISTER FOR EVENT
          </button>
        </div>
      </div>

      {/* Login Prompt */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg shadow-lg border border-gray-300 p-6 w-[300px] max-w-sm text-center">
                <p className="text-center text-xl"> Login to register </p>
                <div className="mt-4 flex justify-center">
                    <button
                        onClick = {handleCloseLoginPrompt}
                        className = "absolute top-2 right-4 text-2xl text-gray-500 hover:text-black"
                    >
                        &times;
                    </button>
                    <button
                        onClick = {() => {
                            window.location.href = "/login";
                        }}
                        className = "py-3 px-8 font-medium rounded-lg border transition-all duration-300 : bg-black text-white border-black hover:bg-white hover:text-black"
                    >
                        GO TO LOGIN
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default GuestEventDescription