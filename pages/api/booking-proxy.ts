import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {
        eventTypeId,
        start,
        name,
        email,
        notes,
        timeZone,
        location
      } = req.body;

      const bookingData = {
        eventTypeId: eventTypeId,
        start: start,
        responses: {
          name: name,
          email: email,
          guests: [], // Optionally add guest info here
          location: location,
        },
        metadata: {}, // Optional metadata
        timeZone: timeZone,
        language: "en", // Set the preferred language for the booking
        title: `Booking for ${name}`, // Customize the title as needed
        description: notes || null, // Optional description
        status: "PENDING", // Initial booking status
        smsReminderNumber: null // Add phone number if needed for SMS reminders
      };

      const calcomResponse = await axios.post('https://api.cal.com/v1/bookings', bookingData, {
        headers: {
          Authorization: `Bearer ${process.env.TESTKEY}`, // Use environment variable for API key
          'Content-Type': 'application/json',
        },
      });

      res.status(200).json({ message: 'Booking created successfully!', data: calcomResponse.data });
    } catch (error: any) {
      console.error('Error creating booking:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
