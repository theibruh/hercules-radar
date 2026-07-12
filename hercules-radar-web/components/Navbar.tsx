"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import RegionSelector from "@/components/RegionSelector";
import Link from "next/link";


export default function Navbar() {
  const searchParams = useSearchParams();
  const selectedRegion = searchParams.get("region") ?? "australia";

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#292e37]/95 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11">
            <Image
              src="/SpruceGoose-transparent.png"
              alt="Hercules Radar"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-white font-bold text-lg tracking-wide">
            HERCULES RADAR 
          </span>
        </div>

        <div className="flex items-center gap-5">
          {/* hardcoded links for now, as the logbook and about pages are not yet implemented */}
          <Link href="/" className="text-orange-500 text-[13px] transition-colors">
            Home
          </Link>
          <span className="text-white/20 text-[13px] cursor-default">
            Logbook
          </span>
          <span className="text-white/20 text-[13px] cursor-default">
            About
          </span>

          <div className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 w-[180px]">
            <span className="text-white/30 text-[12px]">⌕</span>
            <input
              type="text"
              placeholder="Search callsign..."
              disabled
              className="bg-transparent border-none outline-none text-white/70 text-[12px] w-full placeholder:text-white/25 cursor-not-allowed"
            />
          </div>

          <RegionSelector selectedRegion={selectedRegion} compact />
        </div>

        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-md border border-white/15 bg-white/[0.04] flex items-center justify-center text-white/30 opacity-50 cursor-not-allowed"
            title="Light/dark mode — coming soon"
          >
            <span className="text-[14px]">◐</span>
          </div>
          <button
            disabled
            className="bg-orange-500/[0.12] border border-orange-500/40 text-orange-500 text-[12px] px-4 py-2 rounded-lg cursor-not-allowed opacity-70"
          >
            Sign in
          </button>
        </div>

      </div>
    </nav>
  );
}