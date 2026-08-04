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
        <div className="flex items-center gap-10">
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
            <span className="text-white font-heading font-bold text-xl tracking-widest">
              HERCULES RADAR
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-heading text-orange-500 text-[12px] font-semibold tracking-[0.2em] uppercase"
            >
              Home
            </Link>
            <span className="font-heading text-white/35 text-[12px] font-semibold tracking-[0.2em] uppercase cursor-default transition-colors duration-200 hover:text-white/65">
              Logbook
            </span>
            <span className="font-heading text-white/35 text-[12px] font-semibold tracking-[0.2em] uppercase cursor-default transition-colors duration-200 hover:text-white/65">
              About
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex flex-col gap-1 w-[150px]">
            <div className="flex gap-[3px] mb-[3px]">
              <span className="w-px h-[3px] bg-white/15" />
              <span className="w-px h-[5px] bg-white/20" />
              <span className="w-px h-[3px] bg-white/15" />
              <span className="w-px h-[5px] bg-white/20" />
              <span className="w-px h-[3px] bg-white/15" />
              <span className="w-px h-[5px] bg-white/20" />
              <span className="w-px h-[3px] bg-white/15" />
            </div>
            <input
              type="text"
              placeholder="Search callsign"
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
              className="font-heading bg-transparent border-0 border-b border-white/20 outline-none text-white text-[12px] font-medium tracking-wide w-full placeholder:text-white/30 pb-1 focus:border-orange-500 transition-colors duration-200"
            />
          </div>

          <RegionSelector selectedRegion={selectedRegion} compact />

          <div className="flex items-center gap-3 ml-8">
            <button
              onClick={toggleTheme}
              aria-label="Toggle light/dark mode"
              className="w-11 h-11 rounded-lg flex items-center justify-center cursor-pointer "
            >
              <svg width="28" height="33" viewBox="0 0 22 26">
                <defs>
                  <clipPath id="shutter-clip">
                    <rect x="4" y="4" width="14" height="18" rx="4" />
                  </clipPath>
                </defs>
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
                <g clipPath="url(#shutter-clip)">
                  <rect
                    x="4"
                    y="4"
                    width="14"
                    height="18"
                    fill="#f97316"
                    style={{
                      transform:
                        theme === "light" ? "scaleY(0.06)" : "scaleY(1)",
                      transformOrigin: "11px 4px",
                      transition: "transform 0.45s ease",
                    }}
                  />
                </g>
              </svg>
            </button>
            <div className="relative group">
              <span className="pointer-events-none absolute -top-0.5 -left-0.5 w-[5px] h-[5px] border-t-[1.5px] border-l-[1.5px] border-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="pointer-events-none absolute -top-0.5 -right-0.5 w-[5px] h-[5px] border-t-[1.5px] border-r-[1.5px] border-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="pointer-events-none absolute -bottom-0.5 -left-0.5 w-[5px] h-[5px] border-b-[1.5px] border-l-[1.5px] border-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="pointer-events-none absolute -bottom-0.5 -right-0.5 w-[5px] h-[5px] border-b-[1.5px] border-r-[1.5px] border-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <button className="font-heading relative bg-transparent border border-white/15 text-white/75 text-[12px] font-semibold tracking-wide px-4 py-1.5 rounded-sm cursor-pointer transition-all duration-300 group-hover:text-orange-500 group-hover:border-orange-500/40">
                SIGN IN
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
