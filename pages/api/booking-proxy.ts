// import type { NextApiRequest, NextApiResponse } from 'next';
// import axios from 'axios';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       // Forward the request to Cal.com API
//       const response = await axios.post('https://api.cal.com/v1/bookings', req.body, {
//         headers: {
//           Authorization: `Bearer ${process.env.CALCOM_API_KEY}`, // Use server-side environment variable
//           'Content-Type': 'application/json',
//         },
//       });

//       res.status(200).json(response.data);
//     } catch (error: any) {
//       console.error('Error in proxy:', error.response?.data || error.message);
//       res.status(error.response?.status || 500).json({ error: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }


// import type { NextApiRequest, NextApiResponse } from 'next';
// import axios from 'axios';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       // Temporarily hardcode your API key here for local testing
//       const apiKey = 'cal_live_d54e3ef72f9461998a3657f8fb592a15'; // Replace this with the actual Cal.com API key

//       // Forward the request to Cal.com API
//       const response = await axios.post('https://api.cal.com/v1/bookings', req.body, {
//         headers: {
//           Authorization: `Bearer ${apiKey}`, // Use the hardcoded API key
//           'Content-Type': 'application/json',
//         },
//       });

//       res.status(200).json(response.data);
//     } catch (error: any) {
//       console.error('Error in proxy:', error.response?.data || error.message);
//       console.log('API Key:', apiKey);
//       res.status(error.response?.status || 500).json({ error: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log('Received request body:', req.body); // Log the request body

      const response = await axios.post('https://api.cal.com/v1/bookings', req.body, {
        headers: {
          Authorization: `Bearer ${process.env.CALCOM_API_KEY}`, // Ensure the API key is set correctly
          'Content-Type': 'application/json',
        },
      });

      console.log('Response from Cal.com API:', response.data); // Log the response from Cal.com

      res.status(200).json(response.data);
    } catch (error: any) {
      console.error('Error in proxy:', error.response?.data || error.message); // Log the error details
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}