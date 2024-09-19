import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  setSelectedDate: (startTime: string, endTime: string) => void;
  setStartTime: (startTime: string) => void;
  setEndTime: (endTime: string) => void;
  setShowTimeSlots: (show: boolean) => void;
}

const Calendar: React.FC<CalendarProps> = ({ setSelectedDate, setStartTime, setEndTime, setShowTimeSlots }) => {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  useEffect(() => {
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
    const startTime = `${date.toISOString().split('T')[0]}T00:00:00Z`;
    const endTime = `${date.toISOString().split('T')[0]}T23:59:59Z`;
    
    setStartTime(startTime); // Set start time in parent component
    setEndTime(endTime);     // Set end time in parent component
    setSelectedDate(startTime, endTime); // Pass to the selected date handler
    setShowTimeSlots(true);  // Show time slots
  };

  return (
    <div className="calendar-section">
      <div className="calendar-header">
        <div className="month-year">{new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(currentYear, currentMonth))} {currentYear}</div>
        <div className="nav-buttons">
          <button className="nav-button" type="button" onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
          <button className="nav-button" type="button" onClick={handleNextMonth}><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="calendar">
        <div className="weekdays">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div className="days">
          {daysInMonth.map((day) => (
            <div key={day} className="day" onClick={() => handleDateClick(day)}>{day}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;