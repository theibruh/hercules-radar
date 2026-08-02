"use client";

import { useTheme } from "@/components/ThemeProvider";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import RegionSelector from "@/components/RegionSelector";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedRegion = searchParams.get("region") ?? "australia";
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#292e37]/95 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-11 h-11">
            <Image
              src="/SpruceGoose-transparent.png"
              alt="Hercules Radar"
              fill
              sizes="44px"
              className="object-contain"
            />
          </div>
          <span className="text-white font-bold text-lg tracking-wide">
            HERCULES RADAR
          </span>
        </Link>

        <div className="flex items-center gap-5">
          {/* hardcoded links for now, as the logbook and about pages are not yet implemented */}
          <Link
            href="/"
            className="text-orange-500 text-[13px] transition-colors"
          >
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
              defaultValue={searchParams.get("search") ?? ""}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.value) {
                  params.set("search", e.target.value);
                } else {
                  params.delete("search");
                }
                router.push(`/?${params.toString()}`);
              }}
              className="bg-transparent border-none outline-none text-white/70 text-[12px] w-full placeholder:text-white/25"
            />
          </div>
          <RegionSelector selectedRegion={selectedRegion} compact />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle light/dark mode"
            className="w-11 h-11 rounded-lg flex items-center justify-center cursor-pointer"
          >
            <svg width="28" height="33" viewBox="0 0 22 26">
              <defs>
                <clipPath id="shutter-clip">
                  <rect x="4" y="4" width="14" height="18" rx="4" />
                </clipPath>
              </defs>

              {/* Frame — outer rounded rect, dark fill, orange-700 outline */}
              <rect
                x="1.75"
                y="1.75"
                width="18.5"
                height="22.5"
                rx="5.5"
                fill="#1f2430"
                stroke="#c2410c"
                strokeWidth="2.5"
              />

              {/* Shade — smaller inset rect, clipped, animates open/closed */}
              <g clipPath="url(#shutter-clip)">
                <rect
                  x="4"
                  y="4"
                  width="14"
                  height="18"
                  fill="#f97316"
                  style={{
                    transform: theme === "light" ? "scaleY(0.06)" : "scaleY(1)",
                    transformOrigin: "11px 4px",
                    transition: "transform 0.45s ease",
                  }}
                />
              </g>
            </svg>
          </button>
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
