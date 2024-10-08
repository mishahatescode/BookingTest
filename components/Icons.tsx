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


export const LoaderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    style={{ width: '16px', height: '16px' }}  /* Set the size explicitly */
    className={`animate-spin ${className}`}
  >
    {/* Outer Circle with Opacity */}
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>

    {/* Inner Path */}
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    ></path>
  </svg>
);

// Make sure this is exported as a named export
export default LoaderIcon;