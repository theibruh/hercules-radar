"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const REGIONS = [
  { value: "australia", label: "Australia" },
  { value: "europe", label: "Europe" },
  { value: "north_america", label: "North America" },
  { value: "asia", label: "Asia" },
  { value: "south_america", label: "South America" },
  { value: "africa", label: "Africa" },
  { value: "middle_east", label: "Middle East" },
];

type RegionSelectorProps = {
  selectedRegion: string;
  compact?: boolean;
};

export default function RegionSelector({
  selectedRegion,
  compact = false,
}: RegionSelectorProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected =
    REGIONS.find((r) => r.value === selectedRegion) ?? REGIONS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSelect(value: string) {
    setIsOpen(false);
    router.push(`/?region=${value}`);
  }

  return (
    <div
      ref={dropdownRef}
      className={`relative ${compact ? "w-[150px]" : "w-[220px] flex flex-col gap-1.5"}`}
    >
      {!compact && (
        <p className="text-[10px] uppercase tracking-widest text-white/35">
          Region
        </p>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between
          bg-white/[0.06] border border-white/10 rounded-lg
          text-white/85 cursor-pointer
          hover:border-orange-500/50 transition-colors duration-200
          ${compact ? "px-3 py-2 text-[12px]" : "px-3.5 py-2.5 text-[13px]"}
        `}
      >
        <span className="flex items-center gap-2">
          <span className={`text-orange-500 ${compact ? "text-[9px]" : "text-[10px]"}`}>●</span>
          {selected.label}
        </span>
        <span
          className={`text-white/30 transition-transform duration-200 ${compact ? "text-[9px]" : "text-[10px]"} ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-[#11161f] border border-white/10 rounded-lg overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-10">
          {REGIONS.map((region) => (
            <div
              key={region.value}
              onClick={() => handleSelect(region.value)}
              className={`
                cursor-pointer flex items-center justify-between
                transition-colors duration-150
                ${compact ? "px-3 py-2 text-[12px]" : "px-3.5 py-2.5 text-[13px]"}
                ${
                  region.value === selectedRegion
                    ? "bg-orange-500/[0.12] text-orange-500 font-bold"
                    : "text-white/70 hover:bg-orange-500/[0.08] hover:text-white/95"
                }
              `}
            >
              {region.label}
              {region.value === selectedRegion && (
                <span className={`text-orange-500 ${compact ? "text-[11px]" : "text-[12px]"}`}>
                  ✓
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}