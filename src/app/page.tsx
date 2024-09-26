'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Calendar from '../../components/Calendar';
import TimeSlots from '../../components/TimeSlots';
import { Clock, MapPin } from 'lucide-react';

// Dynamically import the Map component with SSR disabled
const MapWithNoSSR = dynamic(() => import('../../components/Map'), { ssr: false });

interface ApiResponse {
  message: string;
  error?: string;
}

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<{ startTime: string, endTime: string } | null>(null); 
  const [selectedTime, setSelectedTime] = useState<string>(''); 
  const [computedStartTime, setComputedStartTime] = useState<string>('');  // Final computed startTime after combining date and time
  const [showTimeSlots, setShowTimeSlots] = useState(false); 
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [formData, setFormData] = useState<{ name: string; email: string; notes: string; phone: string }>({
    name: '',
    email: '',
    notes: '',
    phone: ''
  });

  // Combine the selected date and time directly, without unwanted timezone shifts
  const combineDateAndTime = (dateString: string, timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);

    // Parse date and set the correct time
    const date = new Date(dateString);
    date.setHours(hours, minutes, 0, 0);

    // Return local time without UTC 'Z' suffix
    return date.toLocaleDateString('sv-SE') + 'T' + timeString + ':00';
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
    const date = new Date(startTime).toISOString().split('T')[0];
    console.log("Date Selected: Start Time:", date, "End Time:", endTime); // Log date selection

    setSelectedDate({
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
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

    // Create the endTime (assuming 1-hour slots)
    const endTime = new Date(computedStartTime);
    endTime.setHours(endTime.getHours() + 1); // Add 1 hour
    const endTimeISO = endTime.toISOString();

    console.log("Computed endTime:", endTimeISO);

    // Prepare the booking data
    const bookingData = {
      startTime: computedStartTime,  // Use the computed startTime
      endTime: endTimeISO,
      name: 'Custom Booking Form Used', // Hardcoded name
      email: 'admin@admin.com', // Hardcoded email
      phone: formData.phone,
      location: `Lat: ${selectedLocation.lat}, Lng: ${selectedLocation.lng}`,
      notes: formData.notes || ''
    };

    console.log("Booking Data being sent:", bookingData);

    // Send booking data to the backend
    try {
      const response = await axios.post('/api/booking-proxy', bookingData, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = response.data as ApiResponse; // Cast response to ApiResponse

      if (response.status === 200) {
        alert(data.message);
        setSelectedDate(null); // Reset date
        setSelectedTime('');    // Reset time
        setSelectedLocation({ lat: null, lng: null });
        setFormData({ name: '', email: '', notes: '', phone: '' });
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error: any) {
      console.error('Error:', error.message);
      alert('An error occurred.');
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