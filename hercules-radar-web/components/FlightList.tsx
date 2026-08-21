"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const searchQuery = (searchParams.get("search") ?? "").toLowerCase();

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

  const visibleFlights = searchQuery
    ? flights.filter((flight) =>
        (flight.callsign ?? "").toLowerCase().includes(searchQuery),
      )
    : flights;

  return (
    <>
      <div className="flex items-center justify-between text-[11px] text-text-muted uppercase tracking-widest border-b border-border-subtle pb-3 mb-2">
        <span>
          Region:{" "}
          <span className="text-text-primary font-bold">
            {region.replace("_", " ")}
          </span>
        </span>
        <span>{visibleFlights.length} flights tracked</span>
        <span>
          Last updated: <span className="text-success">{timestamp}</span>
        </span>
      </div>

      {visibleFlights.length === 0 ? (
        <p className="text-center text-danger/40 text-md">
          {searchQuery
            ? `No flights matching "${searchQuery}" in this region.`
            : "No flights found or API unavailable."}
        </p>
      ) : (
        visibleFlights.map((flight) => (
          <FlightCard key={flight.icao24} flightData={flight} />
        ))
      )}
    </>
  );
}