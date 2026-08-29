"use client";

import { useEffect, useRef, useState } from "react";
import { getIataCode } from "@/lib/airportCodes";

type RouteData = {
  origin: string | null;
  destination: string | null;
};

export default function FlightRoute({ icao24 }: { icao24: string }) {
  const [route, setRoute] = useState<RouteData | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetch(`/api/flight-route?icao24=${icao24}`)
              .then((res) => res.json())
              .then((data) => setRoute(data.route))
              .catch(() => setRoute(null));

            observer.disconnect();
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [icao24]);

  const origin = getIataCode(route?.origin ?? null);
  const destination = getIataCode(route?.destination ?? null);

  return (
    <div ref={elementRef} className="font-mono text-[13px]">
      {origin || destination ? (
        <span className="text-text-primary">
          {origin ?? <span className="text-text-muted">—</span>}{" "}
          <span className="text-text-muted">→</span>{" "}
          {destination ?? <span className="text-text-muted">—</span>}
        </span>
      ) : (
        <span className="text-text-muted">—</span>
      )}
    </div>
  );
}