// components/TimeSlots.tsx

import React from 'react';

// Define the props interface for the component
interface TimeSlotsProps {
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ selectedTime, setSelectedTime }) => {
  // Define the available time slots
  const times: string[] = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
  ];

  // Handle when a time slot is clicked
  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  return (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h2 className="text-lg font-semibold mb-4">Select a Time</h2>
    <div className="flex flex-wrap gap-2">
      {times.map((time) => (
        <button
          key={time}
          className={`flex-1 px-4 py-2 border rounded-md text-center ${
            selectedTime === time
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-50 border-gray-200'
          }`}
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

