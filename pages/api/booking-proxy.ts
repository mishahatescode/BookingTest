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
        location: location,
        metadata: metadata || {},
        status: status || 'PENDING'
      };

      const calcomResponse = await axios.post('https://api.cal.com/v2/bookings', bookingData, {
        headers: {
          Authorization: `Bearer ${process.env.CALCOM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      res.status(200).json({
        status: 'success',
        data: calcomResponse.data,
      });

    } catch (error: any) {
      console.error('Error creating booking:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        status: 'error',
        message: error.response?.data?.message || 'An error occurred while creating the booking',
        details: error.response?.data || {},
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
