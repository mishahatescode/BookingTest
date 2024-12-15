'use client';

import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPinIconSVG } from './Icons'; // Import the SVG string

interface MapProps {
  selectedLocation: { lat: number | null; lng: number | null };
  setSelectedLocation: (location: { lat: number; lng: number }) => void;
}

const Map: React.FC<MapProps> = ({ selectedLocation, setSelectedLocation }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const map = L.map('map').setView([-8.8142, 115.1628], 13); // Default view to Ungasan, Bali

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Geofence coordinates (centered on Ungasan, Bali)
      const geofenceCenter: [number, number] = [-8.8142, 115.1628];
      const geofenceRadius = 7000; // 7km in meters

      // Add a circle to represent the geofence
      const geofenceCircle = L.circle(geofenceCenter, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.1,
        radius: geofenceRadius,
      }).addTo(map);

      // Marker for the selected location
      let marker: L.Marker | null = null;

      // Custom Leaflet Icon with bottom-right anchoring
      const mapPinIcon = L.divIcon({
        html: MapPinIconSVG,
        className: '', // Avoid default styling
        iconSize: [24, 24], // Size of the icon
        iconAnchor: [12, 24], // Anchor point (middle bottom)
      });

      // Handle map click event
      map.on('click', function (e: L.LeafletMouseEvent) {
        const { lat, lng } = e.latlng;
        const distance = map.distance(e.latlng, geofenceCenter);

        // Check if within geofence
        if (distance > geofenceRadius) {
          alert('Selected location is outside the allowed area.');
          return;
        }

        // Place or move the marker
        if (marker) {
          marker.setLatLng(e.latlng);
        } else {
          marker = L.marker(e.latlng, { icon: mapPinIcon }).addTo(map);
        }

        setSelectedLocation({ lat, lng });
      });

      // Adjust map view to geofence
      map.fitBounds(geofenceCircle.getBounds());

      return () => {
        map.remove();
      };
    }
  }, [setSelectedLocation]);

  return <div id="map" className="map-container"></div>;
};

export default Map;