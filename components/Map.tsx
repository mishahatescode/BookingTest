// Map.tsx
'use client';

import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import { LocationIcon } from './Icons'; // Assuming you moved MapPin to Icons.tsx

interface MapProps {
  selectedLocation: { lat: number | null; lng: number | null };
  setSelectedLocation: (location: { lat: number; lng: number }) => void;
}

const Map: React.FC<MapProps> = ({ selectedLocation, setSelectedLocation }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize the map at Ungasan, Bali
      const map = L.map('map').setView([-8.8141, 115.1628], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Geofence coordinates
      const geofenceCenter: [number, number] = [-8.8141, 115.1628]; // Ungasan, Bali
      const geofenceRadius = 7000; // 7 km radius

      // Add a circle to represent the geofence
      const geofenceCircle = L.circle(geofenceCenter, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.1,
        radius: geofenceRadius,
      }).addTo(map);

      // Render MapPin as custom icon
      const customIcon = L.divIcon({
        html: `<div style="width: 40px; height: 40px;">${LocationIcon()}</div>`, // Use the custom MapPin
        iconSize: [40, 40], // Increase the size of the icon
        iconAnchor: [20, 40], // Anchor it at the bottom center
        className: '', // Empty className to avoid Leaflet default styles
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

  return <div id="map" className="map-container"></div>;
};

export default Map;