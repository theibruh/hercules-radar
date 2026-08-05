"use client";

import { useState } from "react";
import { Flight } from "@/types/flight";
import dynamic from "next/dynamic";
import AircraftPhoto from "@/components/AircraftPhoto";
import { getCategoryLabel } from "@/lib/aircraftCategory";

const FlightMap = dynamic(() => import("@/components/FlightMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-55 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center text-text-muted text-[11px] animate-pulse">
      Loading map...
    </div>
  ),
});

type FlightCardProps = {
  flightData: Flight;
};

export default function FlightCard({ flightData }: FlightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [registration, setRegistration] = useState<string | null>(null);

  const isEmergency = ["7700", "7600", "7500"].includes(
    flightData.squawk ?? "",
  );

  const altitudeFt = flightData.altitude
    ? Math.round(flightData.altitude * 3.28084).toLocaleString()
    : "N/A";

  const speedKts = flightData.speed
    ? Math.round(flightData.speed * 1.94384)
    : null;

  const callsign = flightData.callsign?.trim() || "N/A";
  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={`
        w-full rounded-xl border cursor-pointer
        backdrop-blur-md
        transition-all duration-200
        ${
          isEmergency
            ? "border-danger/40 bg-danger-wash shadow-[0_0_14px_rgba(239,68,68,0.2)]"
            : isExpanded
              ? "border-accent/60 bg-surface-card-hover shadow-[0_0_18px_rgba(249,115,22,0.18)]"
              : "border-border-subtle bg-surface-card hover:border-accent/40 hover:shadow-[0_0_14px_rgba(249,115,22,0.14)]"
        }
      `}
    >
      {/* Main row */}
      <div className="flex items-center px-6 py-4 gap-0 ">
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-0.5">
            Callsign
          </p>
          <p
            className={`font-mono font-bold text-[15px] tracking-wide ${isEmergency ? "text-danger" : "text-accent"}`}
          >
            {callsign}
          </p>
        </div>

        <div className="w-px self-stretch bg-border-subtle mx-3" />

        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-0.5">
            Country
          </p>
          <p className="font-mono text-[13px] text-text-primary">
            {flightData.country || "N/A"}
          </p>
        </div>

        <div className="w-px self-stretch bg-border-subtle mx-3" />

        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-0.5">
            Altitude
          </p>
          <p className="font-mono text-[13px] text-text-primary">{altitudeFt} ft</p>
        </div>

        <div className="w-px self-stretch bg-border-subtle mx-3" />

        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-0.5">
            Speed
          </p>
          <p className="font-mono text-[13px] text-text-primary">
            {speedKts ? `${speedKts} kts` : "N/A"}
          </p>
        </div>

        <div className="w-px self-stretch bg-border-subtle mx-3" />

        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest text-text-muted mb-0.5">
            Heading
          </p>
          <p className="font-mono text-[13px] text-text-primary">
            {flightData.heading ? `${flightData.heading}°` : "N/A"}
          </p>
        </div>

        <div className="w-px self-stretch bg-border-subtle mx-3" />

        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="font-mono text-[11px] text-text-secondary bg-surface-card-hover border border-border-subtle rounded-md px-2 py-1">
            {flightData.squawk || "N/A"}
          </span>
          {isEmergency && (
            <span className="text-[11px] text-danger font-bold bg-danger/15 border border-danger/40 rounded-md px-2 py-1">
              MAYDAY
            </span>
          )}
        </div>
      </div>

      {/* Expanded panel */}
      {isExpanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="border-t border-border-subtle px-6 py-4 flex gap-0"
        >
          {/* LEFT third: Photo + registration */}
          <div className="flex-1 flex flex-col gap-2">
            <AircraftPhoto
              icao24={flightData.icao24}
              onRegistration={setRegistration}
            />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-muted mb-0.5">
                Registration
              </p>
              <p className="font-mono text-[13px] text-text-primary">
                {registration ?? "—"}
              </p>
            </div>
            <p className="text-[9px] text-text-muted">
              Photo via{" "}
              <a
                href="https://www.planespotters.net"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-accent/50 hover:text-accent transition-colors"
              >
                planespotters.net
              </a>
            </p>
          </div>

          <div className="w-px self-stretch bg-border-subtle mx-4" />

          {/* MIDDLE third: Map + data */}
          <div className="flex-1 flex flex-col gap-3">
            {flightData.latitude && flightData.longitude ? (
              <FlightMap
                latitude={flightData.latitude}
                longitude={flightData.longitude}
                heading={flightData.heading ?? 0}
                speed={flightData.speed}
                onGround={flightData.onGround}
              />
            ) : (
              <div className="w-full h-55 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center text-text-muted text-[11px]">
                No position data
              </div>
            )}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-text-muted mb-0.5">
                  Latitude
                </p>
                <p className="font-mono text-text-primary">
                  {flightData.latitude ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-text-muted mb-0.5">
                  Longitude
                </p>
                <p className="font-mono text-text-primary">
                  {flightData.longitude ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-text-muted mb-0.5">
                  On ground
                </p>
                <p className="font-mono text-text-primary">
                  {flightData.onGround ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-text-muted mb-0.5">
                  Category
                </p>
                <p className="font-mono text-text-primary">
                  {getCategoryLabel(flightData.category) ?? "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="w-px self-stretch bg-border-subtle mx-4" />

          {/* RIGHT third: AI */}
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <p className="text-[10px] uppercase tracking-widest text-text-muted">
              AI Assistant
            </p>
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-accent text-[12px] bg-accent-wash border border-accent/35 hover:bg-accent/18 hover:border-accent/60 hover:shadow-[0_0_12px_rgba(249,115,22,0.15)] transition-all duration-200"
            >
              ✦ Ask AI about {callsign}
            </button>
            <p className="text-[10px] text-text-muted text-center leading-relaxed">
              Route info, aircraft type,
              <br />
              airline details and more
            </p>
          </div>
        </div>
      )}
    </div>
  );
}