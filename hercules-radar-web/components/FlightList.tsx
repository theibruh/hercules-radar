"use client";

import { useEffect, useState } from "react";
import FlightCard from "@/components/FlightCard";
import { Flight } from "@/types/flight";

const REFRESH_INTERVAL_MS = 30_000;

type FlightListProps = {
  region: string;
  initialFlights: Flight[];
  initialTimestamp: string;
};

export default function FlightList({
  region,
  initialFlights,
  initialTimestamp,
}: FlightListProps) {
  const [flights, setFlights] = useState(initialFlights);
  const [timestamp, setTimestamp] = useState(initialTimestamp);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/flights?region=${region}`, {
          cache: "no-store",
        });
        if (!res.ok) return;

        const data = await res.json();
        setFlights(data.flights);
        setTimestamp(data.timestamp);
      } catch {
        // Keep showing the last known data if a refresh fails.
      }
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [region]);

  return (
    <>
      <div className="flex items-center justify-between text-[11px] text-white/40 uppercase tracking-widest border-b border-white/[0.06] pb-3 mb-2">
        <span>
          Region: <span className="text-white/70 font-bold">{region.replace("_", " ")}</span>
        </span>
        <span>
          {flights.length} flights tracked
        </span>
        <span>
          Last updated: <span className="text-green-400/70">{timestamp}</span>
        </span>
      </div>

      {flights.length === 0 ? (
        <p className="text-center text-red-400/30 text-sm">No flights found or API unavailable.</p>
      ) : (
        flights.map((flight) => (
          <FlightCard key={flight.icao24} flightData={flight} />
        ))
      )}
    </>
  );
}
