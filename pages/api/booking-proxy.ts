// /pages/api/booking-proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Forward the request to the Cal.com API
      const response = await axios.post('https://api.cal.com/v1/bookings', req.body, {
        headers: {
          Authorization: `Bearer ${process.env.CALCOM_API_KEY}`, // Use environment variables for security
          'Content-Type': 'application/json',
        },
      });

      // Send the response back to the client
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error('Error in proxy:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
