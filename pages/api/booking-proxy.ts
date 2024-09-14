import axios, { AxiosError } from 'axios'; // Ensure AxiosError is imported or declared correctly
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log('Received request body:', req.body);

      const response = await axios.post('https://api.cal.com/v1/bookings', req.body, {
        headers: {
          Authorization: `Bearer ${process.env.CALCOM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response from Cal.com API:', response.data);
      res.status(200).json(response.data);
    } catch (error: AxiosError | any) {
      if (error.isAxiosError) {
        console.error('Axios error response:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: error.message });
      } else {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An internal error occurred' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
