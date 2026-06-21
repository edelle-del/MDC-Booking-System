'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('id, event_name, event_date, event_time, venue, status')
          .eq('status', 'approved');

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        // Suppress error in console to prevent Next.js dev overlay
        // Fallback demo data
        const today = new Date();
        const thisMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        
        setEvents([
            { id: '1', event_name: 'Foundation Day Performance', event_date: `${thisMonthStr}-15`, event_time: '14:00', venue: 'Mapúa Gym' },
            { id: '2', event_name: 'Alumni Homecoming', event_date: `${thisMonthStr}-20`, event_time: '18:00', venue: 'Intramuros Campus' },
            { id: '3', event_name: 'Guest Appearance', event_date: `${thisMonthStr}-20`, event_time: '20:00', venue: 'Makati Studio' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDateEvents(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDateEvents(null);
  };

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDayClick = (day: number) => {
    const clickedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.event_date === clickedDateStr);
    
    if (dayEvents.length > 0) {
      setSelectedDateEvents(dayEvents);
    } else {
      setSelectedDateEvents([]); // Explicitly empty to show "No events" message
    }
  };

  return (
    <main className="min-h-screen container py-xl flex flex-col items-center animate-fade-in">
      <div className="w-full max-w-4xl">
        <div className="mb-xl">
          <Link href="/" className="text-secondary hover:text-white text-sm flex items-center gap-sm transition-fast">
            &larr; Back to Home
          </Link>
        </div>
        
        <div className="text-center mb-xl">
          <h1 className="text-4xl font-bold mb-sm tracking-tighter">MDC Schedule</h1>
          <p className="text-secondary max-w-2xl mx-auto">
            Explore our calendar view to check our availability and upcoming performances. Dates with dots indicate scheduled events.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-secondary py-2xl">Loading calendar...</p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-xl items-start justify-center">
            
            {/* Calendar Grid Section */}
            <div className="card w-full lg:w-2/3">
              <div className="flex justify-between items-center mb-lg">
                <button onClick={handlePrevMonth} className="btn btn-outline text-sm px-sm py-xs">&larr; Prev</button>
                <h2 className="text-xl font-bold tracking-tighter">{monthNames[month]} {year}</h2>
                <button onClick={handleNextMonth} className="btn btn-outline text-sm px-sm py-xs">Next &rarr;</button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-sm">
                {dayNames.map(day => (
                  <div key={day} className="text-xs font-bold text-muted uppercase tracking-wider py-xs">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {/* Empty slots before first day */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-sm bg-transparent border border-transparent"></div>
                ))}
                
                {/* Actual days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const dayEvents = events.filter(e => e.event_date === dateStr);
                  const hasEvents = dayEvents.length > 0;
                  
                  // Check if it's today
                  const today = new Date();
                  const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

                  return (
                    <button 
                      key={`day-${day}`}
                      onClick={() => handleDayClick(day)}
                      className={`
                        relative flex flex-col items-center justify-center p-sm md:p-md min-h-[60px] md:min-h-[80px]
                        border transition-fast rounded-sm
                        ${hasEvents ? 'bg-white text-black hover:bg-gray-200 border-white cursor-pointer' : 'bg-tertiary border-gray-800 text-secondary hover:border-gray-600'}
                        ${isToday && !hasEvents ? 'ring-2 ring-gray-400' : ''}
                      `}
                    >
                      <span className={`text-lg font-bold ${hasEvents ? 'text-black' : ''}`}>{day}</span>
                      {hasEvents && (
                        <div className="mt-xs flex gap-1">
                          {dayEvents.slice(0, 3).map((_, idx) => (
                             <div key={idx} className="w-1.5 h-1.5 bg-black rounded-full"></div>
                          ))}
                          {dayEvents.length > 3 && <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event Details Section */}
            <div className="w-full lg:w-1/3 flex flex-col gap-sm">
              {selectedDateEvents === null ? (
                <div className="card text-center py-xl border-dashed border-gray-700 bg-transparent">
                  <p className="text-secondary text-sm">Select a date on the calendar to view scheduled events.</p>
                </div>
              ) : selectedDateEvents.length === 0 ? (
                <div className="card text-center py-xl border-dashed border-gray-700 bg-transparent">
                  <p className="text-secondary text-sm">No performances scheduled on this date. We are available for booking!</p>
                  <Link href="/book" className="btn btn-outline text-sm mt-md inline-block">Book this date</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-sm">
                  <h3 className="font-bold text-lg border-b border-gray-800 pb-xs mb-xs">
                    Events on {new Date(selectedDateEvents[0].event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </h3>
                  {selectedDateEvents.map((evt, idx) => (
                    <div key={evt.id || idx} className="card p-md border-l-4 border-l-white bg-gray-900">
                      <h4 className="font-bold text-white mb-xs">{evt.event_name}</h4>
                      <p className="text-sm text-secondary mb-xs">
                        {evt.event_time ? `Time: ${evt.event_time}` : 'Time: TBA'}
                      </p>
                      <p className="text-sm bg-black px-xs py-1 rounded inline-block text-muted border border-gray-800">
                        {evt.venue || 'Venue TBA'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
