import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isBefore, isToday, startOfDay } from 'date-fns';

interface CalendarProps {
  setSelectedDate: (startTime: string, endTime: string) => void;
  setShowTimeSlots: (show: boolean) => void;
  timezone: string;
}

const Calendar: React.FC<CalendarProps> = ({ setSelectedDate, setShowTimeSlots, timezone }) => {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  const today = startOfDay(new Date());

  useEffect(() => {
    console.log(`Loading calendar for ${currentYear}-${currentMonth + 1}`);
    const days: number[] = [];
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
      days.push(i);
    }
    setDaysInMonth(days);
  }, [currentMonth, currentYear]);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    if (isBefore(date, today)) return; // Prevent past days from being clicked

    // Convert the selected date to UTC
    const startTime = new Date(Date.UTC(currentYear, currentMonth, day, 0, 0, 0)).toISOString();
    const endTime = new Date(Date.UTC(currentYear, currentMonth, day, 23, 59, 59)).toISOString();

    // Log when the user clicks a date
    console.log("Date selected by user:", date.toDateString(), { startTime, endTime });

    setSelectedDate(startTime, endTime); // Pass both times to the parent in UTC
    setShowTimeSlots(true);  // Show time slots
  };

  const renderDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const isDisabled = isBefore(date, today);

    return (
      <div
        key={day}
        className={`day ${isDisabled ? 'disabled' : ''} ${isToday(date) ? 'today' : ''}`}
        onClick={() => !isDisabled && handleDateClick(day)}
      >
        {day}
      </div>
    );
  };

  return (
    <div className="calendar-section">
      <div className="calendar-header">
        <div className="month-year">
          {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(currentYear, currentMonth))} {currentYear}
        </div>
        <div className="nav-buttons">
          <button className="nav-button" onClick={handlePrevMonth}>
            <ChevronLeft size={20} />
          </button>
          <button className="nav-button" onClick={handleNextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="calendar">
        <div className="weekdays">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div className="days">
          {daysInMonth.map((day) => renderDay(day))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;