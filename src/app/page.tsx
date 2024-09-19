'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Calendar from '../../components/Calendar';
import TimeSlots from '../../components/TimeSlots';
import { Clock, MapPin, Globe } from 'lucide-react';

const MapWithNoSSR = dynamic(() => import('../../components/Map'), { ssr: false });

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<string>(''); // Add startTime
  const [endTime, setEndTime] = useState<string>('');     // Add endTime
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showTimeSlots, setShowTimeSlots] = useState(false); 
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [formData, setFormData] = useState<{ name: string; email: string; notes: string; phone: string }>({
    name: '',
    email: '',
    notes: '',
    phone: ''
  });

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !selectedLocation.lat || !selectedLocation.lng) {
      alert('Please select a date, time, and location.');
      return;
    }

    const bookingData = {
      eventTypeId: 1044017,
      start: `${selectedDate?.toISOString().split('T')[0]}T${selectedTime}:00.000Z`,
      name: 'CustomBooking',
      email: 'custom@booking.com',
      phone: formData.phone,
      timeZone: "Asia/Makassar",
      location: `Lat: ${selectedLocation.lat}, Lng: ${selectedLocation.lng}`,
      metadata: {},
      status: "PENDING"
    };

    try {
      const response = await axios.post('/api/booking-proxy', bookingData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        alert(response.data.message);
        setSelectedDate(new Date());
        setSelectedTime('');
        setSelectedLocation({ lat: null, lng: null });
        setFormData({ name: '', email: '', notes: '', phone: '' });
      } else {
        alert('Error: ' + response.data.error);
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
          <p><Globe className="icon" /> Asia/Makassar</p>
        </div>
      </div>

      <div className="map-column">
        <MapWithNoSSR selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
      </div>

      <div className="form-container">
        <form className="booking-form" onSubmit={handleSubmit}>
          {!showTimeSlots ? (
            <Calendar
              setSelectedDate={setSelectedDate}
              setStartTime={setStartTime}
              setEndTime={setEndTime}
              setShowTimeSlots={setShowTimeSlots}
            />
          ) : (
            <>
              <button className="back-button" onClick={() => setShowTimeSlots(false)}>
                &larr; Back to Calendar
              </button>
              <TimeSlots selectedDate={selectedDate} startTime={startTime} endTime={endTime} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
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