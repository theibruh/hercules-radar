"use client";

import { useEffect, useRef, useState } from "react";

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

  return (
    <div ref={elementRef} className="font-mono text-[14px]">
      {route?.origin && route?.destination ? (
        <span className="font-semibold text-text-primary">
          {route.origin} <span className="text-text-muted">→</span> {route.destination}
        </span>
      ) : (
        <span className="text-text-muted">—</span>
      )}
    </div>
  );
}