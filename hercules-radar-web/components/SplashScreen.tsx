"use client";

import { useState, useEffect } from "react";

const AVIATION_FACTS = [
  "The world's longest commercial flight is Singapore Airlines SQ23, flying 18 hours from Singapore to New York.",
  "A Boeing 747 has around 6 million parts, with over 150 miles of wiring.",
  "Lightning strikes commercial aircraft about once a year on average planes are designed to handle it safely.",
  "The cruising altitude of most commercial aircraft is between 35,000 and 42,000 feet.",
  "Aircraft tires are inflated to around 200 PSI about six times the pressure of a car tire.",
  "The Howard Hughes H-4 Hercules — the Spruce Goose — only flew once, on November 2, 1947, reaching 70 feet altitude.",
  "Autopilot systems can handle most of a flight pilots manually fly for an average of just 3-7 minutes per trip.",
  "The black box flight recorder is actually bright orange to make it easier to find after a crash.",
  "The world's busiest airport by passenger count is Hartsfield-Jackson Atlanta International Airport.",
  "Jet fuel costs account for roughly 20-30% of an airline's total operating costs.",
  "The angle of attack not speed is what determines whether a wing generates lift.",
  "The term 'Mayday' comes from the French phrase 'm\u2019aider', meaning 'help me'.",
  "Squawk 7700 signals a general emergency, 7600 signals radio failure, and 7500 signals a hijacking.",
  "The Concorde could fly from London to New York in under 3.5 hours faster than the Earth's rotation.",
  "Every aircraft has a unique ICAO24 hex code burned into its transponder like a permanent digital fingerprint.",
];

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [fact, setFact] = useState("");

  useEffect(() => {
    setFact(AVIATION_FACTS[Math.floor(Math.random() * AVIATION_FACTS.length)]);

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 7500);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center
        bg-[#292e37] transition-opacity duration-500
        ${isFading ? "opacity-0" : "opacity-100"}
      `}
    >
      {/* Goose reveal animation */}
      <div className="relative w-[150px] h-[150px] mb-8">
        <img
          src="/SpruceGoose-transparent.png"
          alt="Hercules Radar"
          className="absolute inset-0 w-full h-full object-contain opacity-[0.15]"
        />
        <img
          src="/SpruceGoose-transparent.png"
          alt=""
          className="absolute inset-0 w-full h-full object-contain animate-[fillReveal_6.3s_ease-in-out_0.4s_forwards]"
          style={{ clipPath: "inset(100% 0 0 0)" }}
        />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-white tracking-wide mb-1">
        Hercules Radar
      </h1>
      <p className="text-white/35 text-xs uppercase tracking-[0.12em] mb-8">
        The way of the future
      </p>

      {/* Did you know card */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-7 py-5 max-w-[420px] text-center">
        <p className="text-orange-500/60 text-[10px] uppercase tracking-[0.12em] mb-2.5">
          Did you know?
        </p>
        <p className="text-white/60 text-[13px] leading-relaxed">{fact}</p>
      </div>

      {/* Loading dots */}
      <div className="flex gap-1.5 mt-8">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500/50 animate-[dotPulse_1.2s_ease-in-out_infinite]" />
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500/50 animate-[dotPulse_1.2s_ease-in-out_0.2s_infinite]" />
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500/50 animate-[dotPulse_1.2s_ease-in-out_0.4s_infinite]" />
      </div>
    </div>
  );
}
