import React, { useEffect, useState } from 'react'

function Calendar( { event_id }) {

    const [calendar, setCalendar] = useState(null);

    const getCalendar = async () => {
        try{
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5003/event/calendar?event_id="+event_id, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                }
            });
            const data = await response.json();
            setCalendar(data.calendar);
        }catch (error){
            console.log(error);
        }
        
    }

    useEffect(() => {
        getCalendar();
      }, []);
    
    return (
        <iframe 
            src={`https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FToronto&showPrint=0&mode=WEEK&showTitle=1&showDate=0&showCalendars=0&showTz=0&hl=en&src=${calendar}&color=%238E24AA`}
            style={{ borderWidth: 0, width: '100%', height: '100%', borderRadius: '10px' }} 
            frameborder="0"
            scrolling="no"
        />
    )
}

export default Calendar
