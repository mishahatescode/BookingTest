import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const CALCOM_API_KEY = process.env.CALCOM_API_KEY || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { startTime, endTime } = req.query;

      // Log the incoming request parameters
      console.log('Fetching available times from Cal.com API for the event type ID: 1044017');
      console.log('Request Params:', { startTime, endTime });

      // Fetch available time slots from the Cal.com API
      const response = await axios.get('https://api.cal.com/v2/slots/available', {
        params: {
          eventTypeId: 1044017,  // The event type ID for which to fetch slots
          startTime,  // Use user-selected start time in UTC
          endTime,    // Use user-selected end time in UTC
        },
        headers: {
          Authorization: `Bearer ${CALCOM_API_KEY}`,
          'Content-Type': 'application/json',
          'cal-api-version': '2024-08-13',  // Ensure versioning is added in the headers
        }
      });

      // Log the response for debugging
      console.log('Available times:', JSON.stringify(response.data, null, 2));

      // Return available slots as the response
      return res.status(200).json({
        status: 'success',
        availableTimes: response.data.data.slots,  // Ensure we're returning the correct part of the response
      });
    } catch (error: unknown) {
      const typedError = error as any;
      console.error('Error fetching available times:', typedError.message);
      return res.status(500).json({
        status: 'error',
        message: 'Error fetching available times',
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { startTime, phone, timeZone = 'Asia/Makassar', location, notes } = req.body;

      const name = "Custom Booking Form Used";
      const email = "admin@admin.com";

      console.log('Incoming POST data:', { startTime, name, email, phone, timeZone, location, notes });

      // Create the booking payload for Cal.com API
      const bookingPayload = {
        start: startTime,
        eventTypeId: 1044017,
        attendee: {
          name,
          email,
          timeZone,
          language: "en",
        },
        guests: [],
        meetingUrl: "https://example.com/meeting",
        bookingFieldsResponses: {
          phone,
          location,
          notes,
        }
      };

      // Log the payload before sending
      console.log("Sending Booking Payload to Cal.com V2 API:", JSON.stringify(bookingPayload, null, 2));

      // Make the POST request to create the booking
      const calcomResponse = await axios.post(
        'https://api.cal.com/v2/bookings',
        bookingPayload,
        {
          headers: {
            'Authorization': `Bearer ${CALCOM_API_KEY}`,
            'Content-Type': 'application/json',
            'cal-api-version': '2024-08-13',
          }
        }
      );

      // Log and return the response from Cal.com
      console.log('Cal.com API response:', JSON.stringify(calcomResponse.data, null, 2));

      return res.status(200).json({
        status: 'success',
        message: 'Booking created successfully',
        booking: calcomResponse.data
      });
    } catch (error: unknown) {
      const typedError = error as any;
      console.error('Error creating booking:', typedError.message);
      console.error('Error details:', typedError.response ? typedError.response.data : 'No additional details');
      return res.status(500).json({
        status: 'error',
        message: 'Error creating booking',
        error: typedError.response?.data || typedError.message
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}