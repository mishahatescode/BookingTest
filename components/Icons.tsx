import React from 'react';

// Define each icon as a component
export const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="inherit"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: '1em', height: '1em' }}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: '1em', height: '1em' }}
  >
    <path d="M12 2a10 10 0 0 1 10 10c0 5.25-4.5 9.75-10 14.75C6.5 21.75 2 17.25 2 12A10 10 0 0 1 12 2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Add more icons as needed...