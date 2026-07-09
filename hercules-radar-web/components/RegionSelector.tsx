"use client";

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
};


export default function RegionSelector({ selectedRegion }: RegionSelectorProps) {
  const router = useRouter();

  function handleRegionChange(value: string) {
    router.push(`/?region=${value}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-[11px] uppercase tracking-widest text-white/35">
        Region
      </label>
      <select
        value={selectedRegion}
        onChange={(e) => handleRegionChange(e.target.value)}
        className="bg-white/[0.06] border border-white/[0.08] text-white/85 text-[13px] rounded-lg px-3 py-2 outline-none cursor-pointer hover:border-orange-500/40 focus:border-orange-500/60 transition-colors duration-200 appearance-none pr-8"
      >
        {REGIONS.map((region) => (
          <option key={region.value} value={region.value} className="bg-[#0a0f1a]">
            {region.label}
          </option>
        ))}
      </select>
    </div>
  );
}