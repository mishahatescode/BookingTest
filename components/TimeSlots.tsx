import React from 'react';

interface TimeSlotsProps {
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  setShowTimeSlots: (show: boolean) => void; // To toggle back to Calendar view
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ selectedTime, setSelectedTime, setShowTimeSlots }) => {
  const times: string[] = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'];

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  const handleBackClick = () => {
    setShowTimeSlots(false); // Go back to the Calendar
  };

  return (
    <div className="time-section">
      <button className="back-button" onClick={handleBackClick}>
        &#10094; Back to Calendar
      </button>
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
