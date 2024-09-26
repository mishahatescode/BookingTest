'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Calendar from '../../components/Calendar';
import TimeSlots from '../../components/TimeSlots';
import { Clock, MapPin } from 'lucide-react';

// Dynamically import the Map component with SSR disabled
const MapWithNoSSR = dynamic(() => import('../../components/Map'), { ssr: false });

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<{ startTime: string, endTime: string } | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>(''); 
  const [computedStartTime, setComputedStartTime] = useState<string>('');  
  const [showTimeSlots, setShowTimeSlots] = useState(false); 
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [formData, setFormData] = useState<{ name: string; email: string; notes: string; phone: string }>({
    name: '',
    email: '',
    notes: '',
    phone: ''
  });

  // Updated combineDateAndTime function
  const combineDateAndTime = (dateString: string, timeString: string) => {
    // Convert 12-hour format (e.g., "04:00 PM") to 24-hour format
    const timeParts = timeString.match(/(\d+):(\d+)\s*(AM|PM)/);
    
    if (!timeParts) {
      console.error("Invalid time value:", timeString);
      return ''; // Return early if time is invalid
    }

    let hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    const ampm = timeParts[3];

    // Convert to 24-hour format
    if (ampm === 'PM' && hours < 12) {
      hours += 12;
    }
    if (ampm === 'AM' && hours === 12) {
      hours = 0; // Midnight case
    }

    // Parse the date string and set the hours/minutes
    const date = new Date(dateString);
    date.setHours(hours, minutes, 0, 0);

    if (isNaN(date.getTime())) {
      console.error("Invalid time value:", timeString);
      return '';  // Return early to avoid further issues
    }

    return date.toISOString();  // Convert to valid ISO format
  };

  // Recompute startTime when selectedTime or selectedDate changes
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const startTime = combineDateAndTime(selectedDate.startTime, selectedTime);
      console.log("Final computed startTime for booking:", startTime);
      setComputedStartTime(startTime);
    }
  }, [selectedDate, selectedTime]);

  // Log selected date
  const handleDateSelect = (startTime: string, endTime: string) => {
    console.log("Date Selected:", { startTime, endTime }); // Log date selection

    setSelectedDate({
      startTime: new Date(startTime).toISOString(), 
      endTime: new Date(endTime).toISOString()
    });
  };

  // Log selected time
  const handleTimeSelect = (time: string) => {
    console.log("Time Slot Selected:", time); // Log time slot selection
    setSelectedTime(time);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDate || !computedStartTime || !selectedLocation.lat || !selectedLocation.lng) {
      alert('Please select a date, time, and location.');
      return;
    }

    try {
      const endTime = new Date(computedStartTime);
      endTime.setHours(endTime.getHours() + 1);
      const endTimeISO = endTime.toISOString();

      const bookingData = {
        startTime: computedStartTime,
        endTime: endTimeISO,
        name: 'Custom Booking Form Used',
        email: 'admin@admin.com',
        phone: formData.phone,
        location: `Lat: ${selectedLocation.lat}, Lng: ${selectedLocation.lng}`,
        notes: formData.notes || ''
      };

      console.log("Booking Data being sent:", bookingData);

      const response = await axios.post('/api/booking-proxy', bookingData, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = response.data as { message: string; error?: string };

      if (response.status === 200) {
        alert(data.message);
        setSelectedDate(null);
        setSelectedTime('');
        setSelectedLocation({ lat: null, lng: null });
        setFormData({ name: '', email: '', notes: '', phone: '' });
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error: any) {
      console.error('Error:', error.message);
      alert('An error occurred while submitting the booking.');
    }
  };

  return (
    <div className="container">
      <div className="service-details">
        <div className="service-info">
          <img src="https://cal.com/api/avatar/45b142bc-13e0-401b-a8f1-596a191e2395.png" alt="GoWash Logo" style={{ width: '48px', marginBottom: '8px' }} />
          <h3>GoWash Bali</h3>
          <h2>Pickup & Wash - 100.000 Rp</h2>
          <p><Clock className="icon" /> 1h</p>
          <p><MapPin className="icon" /> Custom attendee location</p>
        </div>
      </div>

      <div className="map-column">
        <MapWithNoSSR selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
      </div>

      <div className="form-container">
        <form className="booking-form" onSubmit={handleSubmit}>
          {!showTimeSlots ? (
            <Calendar
              setSelectedDate={handleDateSelect}
              setShowTimeSlots={setShowTimeSlots}
              timezone="Asia/Makassar"
            />
          ) : (
            <>
              <button className="back-button" type="button" onClick={() => setShowTimeSlots(false)}>
                &larr; Back to Calendar
              </button>
              {selectedDate && (
                <TimeSlots
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  setSelectedTime={handleTimeSelect}
                />
              )}
            </>
          )}

          <label htmlFor="phone">WhatsApp Number</label>
          <input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />

          <label htmlFor="notes">Comments</label>
          <textarea id="notes" rows={4} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}></textarea>

          <button type="submit" className="confirm-button">Confirm Booking</button>
        </form>
      </div>
    </div>
  );
};

export default Home;