import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LoaderIcon } from './Icons'; // Import the LoaderIcon
import _ from 'lodash';

interface TimeSlotsProps {
  selectedDate: { startTime: string; endTime: string } | null;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ selectedDate, selectedTime, setSelectedTime }) => {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startTime = selectedDate?.startTime;
    const endTime = selectedDate?.endTime;

    if (startTime && endTime) {
      setLoading(true);
      setError(null);

      axios
        .get('/api/booking-proxy', {
          params: { startTime, endTime },
        })
        .then((response) => {
          const dateKey = startTime.split('T')[0]; // Extract the date part of the startTime
          const slots = response.data.availableTimes[dateKey]; // Dynamically use the selected date

          if (slots) {
            const formattedTimes = slots.map((slot: any) => {
              const date = new Date(slot.time);
              return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            });
            setAvailableTimes(formattedTimes);
          } else {
            setAvailableTimes([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to load available time slots');
          setLoading(false);
        });
    }
  }, [selectedDate]);

  const handleTimeClick = (time: string) => {
    setSelectedTime(time); // Only set the selected time
    console.log("Time selected:", time); // Log selected time
  };

  if (loading) {
    return (
      <div className="time-section">
        <div className="loader-container">
          <LoaderIcon className="text-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="time-section fixed-height">
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