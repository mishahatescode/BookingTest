import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPinIconSVG } from './Icons'; // Now this should work fine

interface MapProps {
  selectedLocation: { lat: number | null; lng: number | null };
  setSelectedLocation: (location: { lat: number; lng: number }) => void;
}

const Map: React.FC<MapProps> = ({ selectedLocation, setSelectedLocation }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const map = L.map('map').setView([-8.8166, 115.1652], 13);  // Default to Ungasan, Bali

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const geofenceCenter: [number, number] = [-8.8166, 115.1652];
      const geofenceRadius = 7000; // 7km radius

      const geofenceCircle = L.circle(geofenceCenter, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.1,
        radius: geofenceRadius,
      }).addTo(map);

      let marker: L.Marker | null = null;

      map.on('click', function (e: L.LeafletMouseEvent) {
        const { lat, lng } = e.latlng;
        const distance = map.distance(e.latlng, geofenceCenter);

        if (distance > geofenceRadius) {
          alert('Selected location is outside the allowed area.');
          return;
        }

        if (marker) {
          marker.setLatLng(e.latlng);
        } else {
          marker = L.marker(e.latlng, {
            icon: L.divIcon({
              html: MapPinIconSVG, // Use the raw SVG string here
              className: '', // Clear any default class styles
              iconSize: [24, 24], // Set the size explicitly
            }),
          }).addTo(map);
        }

        setSelectedLocation({ lat, lng });
      });

      map.fitBounds(geofenceCircle.getBounds());

      return () => {
        map.remove();
      };
    }
  }, [setSelectedLocation]);

  return <div id="map" className="map-container"></div>;
};

export default Map;