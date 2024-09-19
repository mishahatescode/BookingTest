import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.CALCOM_API_KEY;  // Fetch API key from env

  // Check if apiKey exists
  if (!apiKey) {
    console.error('API key missing');
    return res.status(500).json({ status: 'error', message: 'No API key provided' });
  }

  if (req.method === 'POST') {
    // Handle booking creation
    try {
      const {
        eventTypeId,
        start,
        name,
        email,
        phone,
        timeZone,
        location,
        metadata,
        status
      } = req.body;

      const bookingData = {
        eventTypeId: eventTypeId,
        start: start,
        responses: {
          name: name,
          email: email,
          phone: phone,
        },
        timeZone: timeZone,
        language: "en",
        location: location,
        metadata: metadata || {},
        status: status || 'PENDING',
      };

      const calcomResponse = await axios.post('https://api.cal.com/v2/bookings', bookingData, {
        headers: {
          Authorization: `Bearer ${apiKey}`,  // Use the API key here
          'Content-Type': 'application/json',
        },
      });

      res.status(200).json({
        status: 'success',
        data: calcomResponse.data,
      });

    } catch (error: any) {
      if (error.response) {
        console.error('Full error response:', JSON.stringify(error.response.data, null, 2));
        const errorDetails = error.response.data?.details?.errors || 'No error details available';
        console.error('Error creating booking:', errorDetails);

        res.status(error.response.status).json({
          status: 'error',
          message: error.response.data.message,
          details: errorDetails,
        });
      } else {
        console.error('Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
      }
    }

  } else if (req.method === 'GET') {
    // Handle fetching available time slots
    try {
      const { startTime, endTime, eventTypeId } = req.query;

      if (!startTime || !endTime || !eventTypeId) {
        return res.status(400).json({
          status: 'error',
          message: 'startTime, endTime, and eventTypeId are required',
        });
      }
      console.log ('startTime:', startTime, 'endTime:', endTime, 'eventTypeId:', eventTypeId)
      const response = await axios.get('https://api.cal.com/v1/slots', {
        params: {
          start_time: startTime,  // Pass start_time param
          end_time: endTime,      // Pass end_time param
          event_type_id: eventTypeId, // Pass event_type_id param
        },
        headers: {
          Authorization: `Bearer ${apiKey}`,  // Use the API key here
          'Content-Type': 'application/json',
        },
      });

      const availableTimes = response.data.slots.map((slot: any) => slot.start_time);

      res.status(200).json({
        status: 'success',
        availableTimes,
      });

    } catch (error: any) {
      if (error.response) {
        console.error('Error fetching time slots:', error.response.data);
        res.status(error.response.status).json({
          status: 'error',
          message: error.response.data.message,
        });
      } else {
        console.error('Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
      }
    }

  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}