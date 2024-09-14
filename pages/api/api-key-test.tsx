const apiKey = 'your_actual_api_key'; // Replace with the actual API key

try {
  const response = await axios.post('https://api.cal.com/v1/bookings', bookingData, {
    headers: {
      Authorization: `Bearer ${apiKey}`, // Ensure the API key is correct here
      'Content-Type': 'application/json',
    },
  });
  console.log(response.data);
} catch (error) {
  console.error('Error:', error.response?.data || error.message);
}
