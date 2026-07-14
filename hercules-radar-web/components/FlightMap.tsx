"use client";

import { useRef, useEffect } from "react";
import L from "leaflet";

type FlightMapProps = {
  latitude: number;
  longitude: number;
  heading: number;
  speed: number | null;
  onGround: boolean;
};

const EARTH_RADIUS_M = 6371000;

// Dead-reckons a new lat/lon assuming constant heading and speed (m/s) — no refetch needed.
function predictPosition(
  lat: number,
  lon: number,
  headingDeg: number,
  speedMs: number,
  elapsedSeconds: number,
): [number, number] {
  const distance = speedMs * elapsedSeconds;
  const headingRad = (headingDeg * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  const dLat = ((distance * Math.cos(headingRad)) / EARTH_RADIUS_M) * (180 / Math.PI);
  const dLon =
    ((distance * Math.sin(headingRad)) / (EARTH_RADIUS_M * Math.cos(latRad))) *
    (180 / Math.PI);

  return [lat + dLat, lon + dLon];
}

function createPlaneIcon(heading: number): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(${heading}deg);
    ">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#f97316">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export default function FlightMap({
  latitude,
  longitude,
  heading,
  speed,
  onGround,
}: FlightMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Create the map + marker once per mount — untouched by later position refreshes,
  // so the user's pan/zoom state and tile cache survive each 30s data refresh.
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: true,
      attributionControl: false,
    }).setView([latitude, longitude], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    markerRef.current = L.marker([latitude, longitude], {
      icon: createPlaneIcon(heading),
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Snap to the latest known fix whenever fresh data arrives, then dead-reckon
  // forward from that corrected position until the next fix replaces it.
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    marker.setLatLng([latitude, longitude]);
    marker.setIcon(createPlaneIcon(heading));

    if (onGround || !speed || speed <= 0) return;

    const startTime = performance.now();
    let frameId: number;
    const animate = (now: number) => {
      const elapsedSeconds = (now - startTime) / 1000;
      const [lat, lon] = predictPosition(
        latitude,
        longitude,
        heading,
        speed,
        elapsedSeconds,
      );
      marker.setLatLng([lat, lon]);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [latitude, longitude, heading, speed, onGround]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-55 rounded-lg overflow-hidden"
    />
  );
}