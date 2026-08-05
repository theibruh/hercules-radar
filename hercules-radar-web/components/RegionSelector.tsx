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
      className={`relative ${compact ? "w-[110px]" : "w-[180px]"}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          font-heading w-full flex flex-col items-start gap-0.5
          border-b cursor-pointer transition-colors duration-200
          ${isOpen ? "border-accent" : "border-border-interactive hover:border-text-faint"}
          ${compact ? "pb-1" : "pb-1.5"}
        `}
      >
        <span className={`text-text-muted tracking-[0.2em] uppercase ${compact ? "text-[8px]" : "text-[9px]"}`}>
          Region
        </span>
        <span className="flex items-center justify-between w-full">
          <span className={`text-text-primary font-semibold tracking-wide ${compact ? "text-[13px]" : "text-[15px]"}`}>
            {selected.label}
          </span>
          <span
            className={`text-accent transition-transform duration-200 ${compact ? "text-[10px]" : "text-[11px]"}`}
            style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          >
             ▸
          </span>
        </span>
      </button>

      {isOpen && (
        <div className="font-heading absolute top-[calc(100%+8px)] left-0 right-0 bg-surface-panel border border-border-interactive rounded-sm overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-10">
          {REGIONS.map((region) => (
            <div
              key={region.value}
              onClick={() => handleSelect(region.value)}
              className={`
                cursor-pointer flex items-center justify-between
                border-l-2 transition-colors duration-150
                ${compact ? "px-3 py-2 text-[12px]" : "px-3.5 py-2.5 text-[13px]"}
                ${
                  region.value === selectedRegion
                    ? "border-accent bg-accent-wash text-accent font-semibold"
                    : "border-transparent text-text-hover hover:bg-surface-hover hover:text-text-panel-bright"
                }
              `}
            >
              {region.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}