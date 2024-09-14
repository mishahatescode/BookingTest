// app/page.tsx or pages/index.tsx

'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

// Import your components
import Calendar from '../../components/Calendar';
import TimeSlots from '../../components/TimeSlots';

// Dynamically import the Map component with SSR disabled
const MapWithNoSSR = dynamic(() => import('../../components/Map'), { ssr: false });

const Home: React.FC = () => {
  // State variables
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [formData, setFormData] = useState<{ name: string; email: string; notes: string }>({ name: '', email: '', notes: '' });

  // Replace with your Cal.com Event Type ID and API key
  const eventTypeId = '1044017'; // Replace with your actual eventTypeId
  const apiKey = 'cal_live_481608b4fba45417eae32dc45080241a'; // Replace with your actual API key

  // Handle form submission
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!selectedDate || !selectedTime || !selectedLocation.lat || !selectedLocation.lng) {
    alert('Please select a date, time, and location.');
    return;
  }

  const bookingData = {
    eventTypeId,
    startTime: `${selectedDate.toISOString().split('T')[0]}T${selectedTime}:00Z`,
    endTime: `${selectedDate.toISOString().split('T')[0]}T${parseInt(selectedTime) + 1}:00Z`,
    location: {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    },
    invitee: {
      name: formData.name,
      email: formData.email,
    },
    notes: formData.notes,
  };

  try {
    const response = await axios.post(
      'https://api.cal.com/v1/bookings',
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Response:', response.data); // Log the API response

    if (response.status === 200) {
      alert('Booking confirmed!');
      // Reset the form and state
      setSelectedDate(null);
      setSelectedTime('');
      setSelectedLocation({ lat: null, lng: null });
      setFormData({ name: '', email: '', notes: '' });
    } else {
      console.error('Error in response:', response.data); // Log error in response
      alert('Error: ' + response.data.error);
    }
  } catch (error) {
    console.error('Error creating booking:', error.response?.data || error.message); // Log detailed error
    alert('An error occurred while submitting the form.');
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
