import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface TimeSlotsProps {
  selectedDate: { startTime: string; endTime: string } | null;  // Expect an object with startTime and endTime
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ selectedDate, selectedTime, setSelectedTime }) => {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      setError(null);

      const { startTime, endTime } = selectedDate;  // Destructure startTime and endTime from selectedDate
      const eventTypeId = 1044017;  // Use your actual event type ID
      const date = new Date(selectedDate)

      axios
        .get('/api/booking-proxy', {
          params: {
            startTime: date.toISOString(),  // Pass startTime to the proxy
            endTime: date.toISOString(),      // Pass endTime to the proxy
            eventTypeId: eventTypeId,
          },
        })
        .then((response) => {
          const times = response.data.availableTimes;
          setAvailableTimes(times);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to load available time slots');
          setLoading(false);
          console.error('Error fetching time slots:', err);
        });
    }
  }, [selectedDate]);

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  if (loading) {
    return <div>Loading available time slots...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="time-section">
      <h2>Select a Time</h2>
      <div className="time-slots">
        {availableTimes.length > 0 ? (
          availableTimes.map((time) => (
            <button
              key={time}
              className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
              onClick={() => handleTimeClick(time)}
            >
              {time}
            </button>
          ))
        ) : (
          <div>No available times for the selected date.</div>
        )}
      </div>
    </div>
  );
};

export default TimeSlots;