// app/page.tsx or pages/index.tsx

'use client';

import axios from 'axios';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Define the expected response data structure
interface ApiResponse {
  message: string;
  error?: string; // Optional if the response may include an error
}

// Import your components
import Calendar from '../../components/Calendar';
import TimeSlots from '../../components/TimeSlots';

// Dynamically import the Map component with SSR disabled
const MapWithNoSSR = dynamic(() => import('../../components/Map'), { ssr: false });

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [formData, setFormData] = useState<{ name: string; email: string; notes: string }>({ name: '', email: '', notes: '' });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !selectedLocation.lat || !selectedLocation.lng) {
      alert('Please select a date, time, and location.');
      return;
    }

    const data = {
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      ...formData,
    };

    try {
      const response = await axios.post<ApiResponse>('/api/submit-form', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      const result = response.data;

      if (response.status === 200) {
        alert(result.message);
        setSelectedDate(null);
        setSelectedTime('');
        setSelectedLocation({ lat: null, lng: null });
        setFormData({ name: '', email: '', notes: '' });
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
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
      <div className="flex">
        {/* Calendar Component */}
        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

        {/* TimeSlots Component */}
        {selectedDate && (
          <TimeSlots selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
        )}

        {/* Map Component */}
        <MapWithNoSSR selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />

        {/* Booking Form */}
        <form className="booking-form" onSubmit={handleSubmit}>
          <h2>Confirm Your Booking</h2>

          {/* Display Selected Date, Time, and Location */}
          <div className="booking-details">
            <p>
              <strong>Date:</strong> {selectedDate ? selectedDate.toDateString() : 'Not selected'}
            </p>
            <p>
              <strong>Time:</strong> {selectedTime || 'Not selected'}
            </p>
            <p>
              <strong>Location:</strong>{' '}
              {selectedLocation.lat && selectedLocation.lng
                ? `Lat: ${selectedLocation.lat}, Lng: ${selectedLocation.lng}`
                : 'Not selected'}
            </p>
          </div>

          {/* Form Fields */}
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <label htmlFor="notes">Additional Notes</label>
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
