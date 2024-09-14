import React, { useState, useEffect } from 'react';

interface CalendarProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  showTimeSlots: boolean;
  setShowTimeSlots: (show: boolean) => void; // To toggle Calendar/TimeSlots view
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, setSelectedDate, showTimeSlots, setShowTimeSlots }) => {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const days: number[] = [];
      const date = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

      for (let i = 1; i <= lastDay; i++) {
        days.push(i);
      }
      setDaysInMonth(days);
    }
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
    setSelectedDate(date);
    setShowTimeSlots(true); // Show the TimeSlots component after selecting a date
  };

  return (
    <div className="calendar-section">
      <div className="calendar-header">
        <button className="nav-button" onClick={handlePrevMonth}>
          &#10094;
        </button>
        <div className="month-year">
          {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(currentYear, currentMonth))} {currentYear}
        </div>
        <button className="nav-button" onClick={handleNextMonth}>
          &#10095;
        </button>
      </div>
      <div className="calendar">
        <div className="weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="days">
          {daysInMonth.map((day) => (
            <div
              key={day}
              className={`day ${selectedDate && selectedDate.getDate() === day ? 'selected' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
