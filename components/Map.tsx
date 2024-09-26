'use client';

import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react'; // Import the MapPin icon

interface MapProps {
  selectedLocation: { lat: number | null; lng: number | null };
  setSelectedLocation: (location: { lat: number; lng: number }) => void;
}

const Map: React.FC<MapProps> = ({ selectedLocation, setSelectedLocation }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const map = L.map('map').setView([-8.8185, 115.1763], 13);  // Set to Ungasan, Bali

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Safely access MapPin only if it exists
      const mapPinElement = MapPin ? MapPin({ size: 24, color: 'red' }).props.children : '';

      // Create a custom Leaflet icon using the MapPin icon
      const customIcon = L.divIcon({
        html: `<div style="width: 24px; height: 24px; color: red;">${mapPinElement}</div>`,
        className: '' // Empty className to remove default styles
      });

      // Geofence coordinates
      const geofenceCenter: [number, number] = [-8.8185, 115.1763];
      const geofenceRadius = 7000; // 7 km radius

      // Add a circle to represent the geofence
      const geofenceCircle = L.circle(geofenceCenter, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.1,
        radius: geofenceRadius,
      }).addTo(map);

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

        // If marker exists, move it; else, create a new one with the custom icon
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