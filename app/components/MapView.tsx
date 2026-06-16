'use client';

import { useEffect, useRef } from 'react';
import { Spot } from '@/app/lib/types';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

interface Props {
  spots: Spot[];
  waypoints: { lat: number; lng: number }[];
}

export default function MapView({ spots, waypoints }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!mapRef.current || !spots.length || !apiKey) return;

    const initMap = () => {
      if (!window.google?.maps) return;
      const center = spots[0] ? { lat: spots[0].lat, lng: spots[0].lng } : { lat: 35.6762, lng: 136.0 };
      const map = new window.google.maps.Map(mapRef.current!, {
        center,
        zoom: 7,
        mapTypeControl: false,
        streetViewControl: false,
      });

      spots.forEach((spot, i) => {
        new window.google.maps.Marker({
          position: { lat: spot.lat, lng: spot.lng },
          map,
          label: { text: `${i + 1}`, color: 'white', fontWeight: 'bold' },
          title: spot.name,
        });
      });

      if (waypoints.length >= 2) {
        const path = waypoints.map((w) => ({ lat: w.lat, lng: w.lng }));
        new window.google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: '#10b981',
          strokeOpacity: 0.7,
          strokeWeight: 3,
          map,
        });
      }
    };

    if (window.google?.maps) {
      initMap();
    } else {
      const existing = document.getElementById('gmaps-script');
      if (existing) {
        existing.addEventListener('load', initMap);
      } else {
        const script = document.createElement('script');
        script.id = 'gmaps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=ja`;
        script.async = true;
        script.onload = initMap;
        document.head.appendChild(script);
      }
    }
  }, [spots, waypoints, apiKey]);

  if (!apiKey) return null;

  return (
    <div
      ref={mapRef}
      className="w-full h-72 rounded-2xl overflow-hidden shadow-md border border-gray-100"
    />
  );
}
