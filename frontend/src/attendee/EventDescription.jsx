import React from 'react'

function EventDescription( {event, isRegistered, setIsRegistered, isLoading, handleRegistration}) {

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
            {isRegistered ? (
              <p className={`font-medium w-full text-center py-3 px-8 rounded-md border border-black inline-block text-black`}>
                YOU ARE REGISTERED TO THIS EVENT
              </p>
            ):(
              <>
                <div>
                  <p className='text-base'>Ticket(s) left</p>
                  <p className='text-base'><strong>{event.capacity - event.registrations}</strong></p>
                </div>
                <div>
                  <p className='text-base'>Registration Fee</p>
                  <p className='text-base'><strong>{event.feeFormatted}</strong></p>
                </div>
              </> 
            )}
          </div>
        </div>
          

        <div className='w-[50%] flex flex-col'>
          <p className='mb-4'><strong>Description</strong></p>
          <p className='text-sm text-justify'>{event.description}</p>
          <div className='flex-grow'></div>
          <button
            onClick={handleRegistration}
            disabled={isLoading}
            className={`py-3 px-8 font-medium rounded-lg border transition-all duration-300 
              ${isLoading
              ? "bg-gray-300 cursor-not-allowed border-gray-300 text-gray-500"
              : isRegistered
              ? "bg-red-600 text-white border-red-600 hover:bg-white hover:text-red-600"
              : "bg-black text-white border-black hover:bg-white hover:text-black"}`}
          >
            {isLoading ? "Processing..." : isRegistered ? "CANCEL REGISTRATION" : "REGISTER FOR EVENT"}
          </button>

        </div>
      </div>
    </div>
  )
}

export default EventDescription