import puppeteer from 'puppeteer';
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const CALCOM_API_KEY = process.env.CALCOM_API_KEY || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Get current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split('T')[0];  
      console.log('Scraping times for date:', currentDate);

      // Generate URL for scraping time slots for the given date
      const url = `https://cal.com/gowashbali/pickup-wash?date=${currentDate}&month=${currentDate.slice(0, 7)}`;
      console.log('Navigating to URL:', url);

      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Extract available time slots using page evaluation
      const availableSlots = await page.$$eval('button[data-testid="time"]', (slots) =>
        slots.map(slot => slot.textContent?.trim())
      );

      console.log('Available time slots:', availableSlots);
      await browser.close();

      // Send the available times as a response
      return res.status(200).json({
        status: 'success',
        availableTimes: availableSlots,
      });
    } catch (error) {
      console.error('Error scraping available times:', error.message);
      return res.status(500).json({
        status: 'error',
        message: 'Error scraping available times',
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { startTime, phone, timeZone = 'Asia/Makassar', location, notes } = req.body;

      // Default values for name and email
      const name = "Custom Booking Form Used";
      const email = "admin@admin.com";

      // Log incoming POST data
      console.log('Incoming POST data:', { startTime, name, email, phone, timeZone, location, notes });

      // Validate the essential fields
      if (!startTime || !phone || !location) {
        return res.status(400).json({ status: 'error', message: 'All required fields must be provided' });
      }

      // Convert the local startTime to UTC for Cal.com API
      const localStartTime = new Date(startTime);
      const utcStartTime = localStartTime.toISOString();  // This converts the local time to UTC

      // Prepare the booking payload for Cal.com V2 API
      const bookingPayload = {
        start: utcStartTime,  // Send the converted UTC start time
        eventTypeId: 1044017,  // Example Event Type ID
        attendee: {
          name,
          email,
          timeZone,  // Ensure the time zone is set to Asia/Makassar
          language: "en",
        },
        guests: [],  // No guests included by default
        meetingUrl: "https://example.com/meeting",  // Custom meeting URL (optional)
        bookingFieldsResponses: {
          phone,
          location,
          notes,
        }
      };

      // Log the payload before sending
      console.log("Sending Booking Payload to Cal.com V2 API:", JSON.stringify(bookingPayload, null, 2));

      // Call Cal.com API to create the booking
      const calcomResponse = await axios.post(
        'https://api.cal.com/v2/bookings',  // V2 API endpoint
        bookingPayload,
        {
          headers: {
            'Authorization': `Bearer ${CALCOM_API_KEY}`,
            'Content-Type': 'application/json',
            'cal-api-version': '2024-08-13'  // Add this line to specify the version
          }
        }
      );

      console.log('Cal.com API response:', calcomResponse.data);

      return res.status(200).json({
        status: 'success',
        message: 'Booking created successfully',
        booking: calcomResponse.data
      });
    } catch (error: any) {
      // Log the error details
      console.error('Error creating booking:', error.message);
      console.error('Error details:', error.response ? error.response.data : 'No additional details');

      return res.status(500).json({
        status: 'error',
        message: 'Error creating booking',
        error: error.response?.data || error.message
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}