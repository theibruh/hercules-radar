"use client";

import { useState } from "react";
import { Flight } from "@/types/flight";

type FlightCardProps = {
  flightData: Flight;
};

export default function FlightCard({ flightData }: FlightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
            ? "border-red-500/40 bg-red-500/[0.08] shadow-[0_0_14px_rgba(239,68,68,0.2)]"
            : isExpanded
              ? "border-orange-500/60 bg-white/[0.065] shadow-[0_0_18px_rgba(249,115,22,0.18)]"
              : "border-white/[0.08] bg-white/[0.06] hover:border-orange-500/40 hover:shadow-[0_0_14px_rgba(249,115,22,0.14)]"
        }
      `}
    >
      {/* Main row */}
      <div className="flex items-center px-6 py-4 gap-0 ">
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest text-white/35 mb-0.5">
            Callsign
          </p>
          <p
            className={`font-bold text-[15px] tracking-wide ${isEmergency ? "text-red-400" : "text-orange-500"}`}
          >
            {callsign}
          </p>
        </div>

        <div className="w-px self-stretch bg-white/[0.06] mx-3" />

        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest text-white/35 mb-0.5">
            Country
          </p>
          <p className="text-[13px] text-white/85">
            {flightData.country || "N/A"}
          </p>
        </div>

        <div className="w-px self-stretch bg-white/[0.06] mx-3" />

        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest text-white/35 mb-0.5">
            Altitude
          </p>
          <p className="text-[13px] text-white/85">{altitudeFt} ft</p>
        </div>

        <div className="w-px self-stretch bg-white/[0.06] mx-3" />

        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest text-white/35 mb-0.5">
            Speed
          </p>
          <p className="text-[13px] text-white/85">
            {speedKts ? `${speedKts} kts` : "N/A"}
          </p>
        </div>

        <div className="w-px self-stretch bg-white/[0.06] mx-3" />

        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest text-white/35 mb-0.5">
            Heading
          </p>
          <p className="text-[13px] text-white/85">
            {flightData.heading ? `${flightData.heading}°` : "N/A"}
          </p>
        </div>

        <div className="w-px self-stretch bg-white/[0.06] mx-3" />

        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="text-[11px] text-white/50 bg-white/[0.07] border border-white/10 rounded-md px-2 py-1">
            {flightData.squawk || "N/A"}
          </span>
          {isEmergency && (
            <span className="text-[11px] text-red-400 font-bold bg-red-500/15 border border-red-500/40 rounded-md px-2 py-1">
              MAYDAY
            </span>
          )}
        </div>
      </div>

      {/* Expanded panel */}
      {isExpanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="border-t border-white/[0.06] px-6 py-4 flex gap-0"
        >
          {/* LEFT third: Photo + registration */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="w-full h-[120px] rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/20 text-[11px]">
              Aircraft photo
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/35 mb-0.5">
                Registration
              </p>
              <p className="text-[13px] text-white/85">—</p>
            </div>
            <p className="text-[9px] text-white/20">
              Photo via{" "}
              <a
                href="https://www.planespotters.net"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-orange-500/50 hover:text-orange-500 transition-colors"
              >
                planespotters.net
              </a>
            </p>
          </div>

          <div className="w-px self-stretch bg-white/[0.06] mx-4" />

          {/* MIDDLE third: Map + data */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="w-full h-[100px] rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/20 text-[11px]">
              Leaflet map
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/35 mb-0.5">
                  Latitude
                </p>
                <p className="text-white/85">{flightData.latitude ?? "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/35 mb-0.5">
                  Longitude
                </p>
                <p className="text-white/85">{flightData.longitude ?? "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/35 mb-0.5">
                  On ground
                </p>
                <p className="text-white/85">
                  {flightData.onGround ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/35 mb-0.5">
                  Category
                </p>
                <p className="text-white/85">{flightData.category ?? "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="w-px self-stretch bg-white/[0.06] mx-4" />

          {/* RIGHT third: AI */}
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <p className="text-[10px] uppercase tracking-widest text-white/30">
              AI Assistant
            </p>
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-orange-500 text-[12px] bg-orange-500/10 border border-orange-500/35 hover:bg-orange-500/18 hover:border-orange-500/60 hover:shadow-[0_0_12px_rgba(249,115,22,0.15)] transition-all duration-200"
            >
              ✦ Ask AI about {callsign}
            </button>
            <p className="text-[10px] text-white/20 text-center leading-relaxed">
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
