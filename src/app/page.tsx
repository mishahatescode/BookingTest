'use client';

import axios from 'axios';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Calendar from '../../components/Calendar';
import TimeSlots from '../../components/TimeSlots';

// Define the expected response structure from the API
interface ApiResponse {
  message: string;
  error?: string;
}

// Dynamically import the Map component with SSR disabled
const MapWithNoSSR = dynamic(() => import('../../components/Map'), { ssr: false });

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showTimeSlots, setShowTimeSlots] = useState(false); // Manage Calendar/TimeSlots view
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [formData, setFormData] = useState<{ name: string; email: string; notes: string; phone: string }>({
    name: '',
    email: '',
    notes: '',
    phone: '' 
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !selectedLocation.lat || !selectedLocation.lng) {
      alert('Please select a date, time, and location.');
      return;
    }

    const bookingData = {
      eventTypeId: 1044017,  // Replace with the correct eventTypeId
      start: `${selectedDate.toISOString().split('T')[0]}T${selectedTime}:00.000Z`,  // Combine date and time
      name: 'CustomBooking',  // Placeholder name for tracking
      email: 'custom@booking.com',  // Placeholder email for tracking
      phone: formData.phone,  // Correctly accessing phone from formData
      timeZone: "Asia/Makassar",  // Denpasar timezone
      location: `Lat: ${selectedLocation.lat}, Lng: ${selectedLocation.lng}`,  // Add location
      metadata: {},  // Default metadata
      status: "PENDING"
    };

    try {
      const response = await axios.post<ApiResponse>('/api/booking-proxy', bookingData, {
        headers: { 'Content-Type': 'application/json' },
      });

      const result = response.data;

      if (response.status === 200) {
        alert(result.message); 
        setSelectedDate(null);
        setSelectedTime('');
        setSelectedLocation({ lat: null, lng: null });
        setFormData({ name: '', email: '', notes: '', phone: '' }); 
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error: any) {
      if (error.response) {
        console.error('Axios error response:', error.response?.data || error.message);
        alert('Axios error: ' + (error.response?.data?.message || error.message));
      } else {
        console.error('Error:', error.message);
        alert('An error occurred while submitting the form.');
      }
    }
  };

  return (
    <div className="container">
      <div className="service-details">
        {/* Add service details here, if needed */}
        <div className="service-info">
          <h2>GoWash Bali</h2>
          <h3>Pickup & Wash - 100.000 Rp</h3>
          <p><i className="icon-calendar"></i> Sunday, September 15, 2024</p>
          <p><i className="icon-clock"></i> 1h</p>
          <p><i className="icon-location"></i> Custom attendee location</p>
          <p><i className="icon-globe"></i> Asia/Makassar</p>
        </div>
      </div>

      {/* Middle Column - Map Component */}
      <div className="map-column">
        <MapWithNoSSR selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
      </div>

      {/* Right Column - Booking Form */}
      <div className="form-container">
        <form className="booking-form" onSubmit={handleSubmit}>
          <h2>Confirm Your Booking</h2>
          <div className="container">
               <div className="flex">
                 {/* Conditionally render Calendar or TimeSlots */}
                 {!showTimeSlots ? (
                   <Calendar
                   selectedDate={selectedDate}
                   setSelectedDate={setSelectedDate}
                   setShowTimeSlots={setShowTimeSlots}
                   />
                   ) : (
                   <TimeSlots
                   selectedTime={selectedTime}
                   setSelectedTime={setSelectedTime}
                   setShowTimeSlots={setShowTimeSlots}
                   />
                 )}
               </div>
             </div>
          <label htmlFor="phone">WhatsApp Number</label>
          <input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />

          <label htmlFor="notes">Comments</label>
          <textarea
            id="notes"
            rows={4}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          ></textarea>

          <button type="submit">Confirm Booking</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
