// Map.tsx
'use client';

import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

interface MapProps {
  selectedLocation: { lat: number | null; lng: number | null };
  setSelectedLocation: (location: { lat: number; lng: number }) => void;
}

const Map: React.FC<MapProps> = ({ selectedLocation, setSelectedLocation }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize the map at Ungasan, Bali with a zoom level
      const map = L.map('map').setView([-8.8141, 115.1628], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Geofence coordinates
      const geofenceCenter: [number, number] = [-8.8141, 115.1628]; // Ungasan, Bali center
      const geofenceRadius = 7000; // 7 km radius

      // Add a circle to represent the geofence
      const geofenceCircle = L.circle(geofenceCenter, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.1,
        radius: geofenceRadius,
      }).addTo(map);

      // SVG icon for the MapPin (can be customized further if needed)
      const mapPinSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a10 10 0 0110 10c0 5.25-4.5 9.75-10 14.75C6.5 21.75 2 17.25 2 12A10 10 0 0112 2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      `;

      // Create a custom Leaflet icon using the MapPin SVG
      const customIcon = L.divIcon({
        html: mapPinSVG,
        iconSize: [24, 24], // Adjust size of the icon
        iconAnchor: [12, 24], // Anchor it at the bottom center (so it points correctly)
        className: 'custom-map-pin', // Remove default styling
      });

      // Marker for the selected location
      let marker: L.Marker | null = null;

      // Handle map click event
      map.on('click', function (e: L.LeafletMouseEvent) {
        const { lat, lng } = e.latlng;

        // Check if the clicked location is within the geofence
        const distance = map.distance(e.latlng, geofenceCenter);
        if (distance > geofenceRadius) {
          alert('Selected location is outside the allowed area.');
          return;
        }

        // If marker exists, move it; else, create a new one
        if (marker) {
          marker.setLatLng(e.latlng);
        } else {
          marker = L.marker(e.latlng, { icon: customIcon }).addTo(map);
        }

        // Update the selected location
        setSelectedLocation({ lat, lng });
      });

      // Adjust map view to geofence
      map.fitBounds(geofenceCircle.getBounds());

      // Cleanup on unmount
      return () => {
        map.remove();
      };
    }
  }, [setSelectedLocation]);

  return <div id="map" className="map-container" style={{ height: '400px', width: '100%' }}></div>; // Added height and width
};

export default Map;