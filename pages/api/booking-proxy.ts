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
        language: "en",  // Added the required language field as a string
        location: location,
        metadata: metadata || {},
        status: status || 'PENDING'
      };

      const calcomResponse = await axios.post('https://api.cal.com/v2/bookings', bookingData, {
        headers: {
          Authorization: `Bearer cal_live_af2036ceabdcf7ba81a28d3b57633130`,
          'Content-Type': 'application/json',
        },
      });

      res.status(200).json({
        status: 'success',
        data: calcomResponse.data,
      });

    } catch (error: any) {
      if (error.response) {
        // Log full error response to understand its structure
        console.error('Full error response:', JSON.stringify(error.response.data, null, 2));

        // Log specific error details if available
        const errorDetails = error.response.data?.details?.errors || 'No error details available';

        console.error('Error creating booking:', errorDetails);

        // Respond with detailed error info
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
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
