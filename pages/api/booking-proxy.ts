import puppeteer from 'puppeteer';
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const CALCOM_API_KEY = process.env.CALCOM_API_KEY || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const currentDate = new Date().toISOString().split('T')[0];  
      console.log('Scraping times for date:', currentDate);

      const url = `https://cal.com/gowashbali/pickup-wash?date=${currentDate}&month=${currentDate.slice(0, 7)}`;
      console.log('Navigating to URL:', url);

      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });

      const availableSlots = await page.$$eval('button[data-testid="time"]', (slots) =>
        slots.map(slot => slot.textContent?.trim())
      );

      console.log('Available time slots:', availableSlots);
      await browser.close();

      return res.status(200).json({
        status: 'success',
        availableTimes: availableSlots,
      });
    } catch (error: unknown) {
      // Cast error to Error type to safely access its message
      const typedError = error as Error;
      console.error('Error scraping available times:', typedError.message);

      return res.status(500).json({
        status: 'error',
        message: 'Error scraping available times',
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { startTime, phone, timeZone = 'Asia/Makassar', location, notes } = req.body;

      const name = "Custom Booking Form Used";
      const email = "admin@admin.com";

      console.log('Incoming POST data:', { startTime, name, email, phone, timeZone, location, notes });

      if (!startTime || !phone || !location) {
        return res.status(400).json({ status: 'error', message: 'All required fields must be provided' });
      }

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

      console.log("Sending Booking Payload to Cal.com V2 API:", JSON.stringify(bookingPayload, null, 2));

      const calcomResponse = await axios.post(
        'https://api.cal.com/v2/bookings',
        bookingPayload,
        {
          headers: {
            'Authorization': `Bearer ${CALCOM_API_KEY}`,
            'Content-Type': 'application/json',
            'cal-api-version': '2024-08-13'
          }
        }
      );

      console.log('Cal.com API response:', calcomResponse.data);

      return res.status(200).json({
        status: 'success',
        message: 'Booking created successfully',
        booking: calcomResponse.data
      });
    } catch (error: unknown) {
      // Again, cast error to Error to safely access its message
      const typedError = error as Error;
      console.error('Error creating booking:', typedError.message);
      console.error('Error details:', (typedError as any).response ? (typedError as any).response.data : 'No additional details');

      return res.status(500).json({
        status: 'error',
        message: 'Error creating booking',
        error: (typedError as any).response?.data || typedError.message
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}