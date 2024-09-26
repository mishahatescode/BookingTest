import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LoaderIcon } from './Icons';  // Import the LoaderIcon
import _ from 'lodash';

// Define an interface for the expected response data structure
interface AvailableTimesResponse {
  availableTimes: string[];
}

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

      const debouncedFetch = _.debounce(() => {
        axios
          .get('/api/booking-proxy', {
            params: {
              startTime,
              endTime,
            },
          })
          .then((response) => {
            const data = response.data as AvailableTimesResponse; // Cast the response to the expected type
            setAvailableTimes(data.availableTimes);
            setLoading(false);
            console.log('Available times:', data.availableTimes);
          })
          .catch((err) => {
            setError('Failed to load available time slots');
            setLoading(false);
          });
      }, 300);

      debouncedFetch();
      return () => debouncedFetch.cancel();
    }
  }, [selectedDate]);

  const handleTimeClick = (time: string) => {
    setSelectedTime(time); // Only set the selected time, do not trigger any POST requests
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