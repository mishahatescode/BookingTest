// components/TimeSlots.tsx

import React from 'react';

interface TimeSlotsProps {
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ selectedTime, setSelectedTime }) => {
  const times: string[] = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
  ];

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <div className="time-section">
      <h2>Select a Time</h2>
      <div className="time-slots">
        {times.map((time) => (
          <button
            key={time}
            className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
            onClick={() => handleTimeClick(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlots;
