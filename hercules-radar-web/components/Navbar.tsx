"use client";

import { useTheme } from "@/components/ThemeProvider";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import RegionSelector from "@/components/RegionSelector";
import AuthCard from "@/components/AuthCard";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const selectedRegion = searchParams.get("region") ?? "australia";
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const [showAuth, setShowAuth] = useState(false);
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setSigningOut(false);
    setConfirmingSignOut(false);
  }

  const displayName = user?.user_metadata?.display_name ?? "Account";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-surface-nav/95 backdrop-blur-md border-b border-border-subtle">
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
              <span className="text-text-primary font-heading font-bold text-xl tracking-widest">
                HERCULES RADAR
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                href="/"
                className={`font-heading text-[12px] font-semibold tracking-[0.2em] uppercase transition-colors duration-200 ${
                  pathname === "/"
                    ? "text-accent"
                    : "text-text-muted hover:text-text-hover"
                }`}
              >
                Home
              </Link>
              <Link
                href="/logbook"
                className={`font-heading text-[12px] font-semibold tracking-[0.2em] uppercase transition-colors duration-200 ${
                  pathname === "/logbook"
                    ? "text-accent"
                    : "text-text-muted hover:text-text-hover"
                }`}
              >
                Logbook
              </Link>
              <Link
                href="/about"
                className={`font-heading text-[12px] font-semibold tracking-[0.2em] uppercase transition-colors duration-200 ${
                  pathname === "/about"
                    ? "text-accent"
                    : "text-text-muted hover:text-text-hover"
                }`}
              >
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex flex-col gap-1 w-[150px]">
              <div className="flex gap-[3px] mb-[3px]">
                <span className="w-px h-[3px] bg-border-interactive" />
                <span className="w-px h-[5px] bg-text-faint" />
                <span className="w-px h-[3px] bg-border-interactive" />
                <span className="w-px h-[5px] bg-text-faint" />
                <span className="w-px h-[3px] bg-border-interactive" />
                <span className="w-px h-[5px] bg-text-faint" />
                <span className="w-px h-[3px] bg-border-interactive" />
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
                className="font-heading bg-transparent border-0 border-b border-border-interactive outline-none text-text-primary text-[12px] font-medium tracking-wide w-full placeholder:text-text-muted pb-1 focus:border-accent transition-colors duration-200"
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
                    fill="var(--color-surface-panel)"
                    stroke="var(--color-accent-frame)"
                    strokeWidth="2.5"
                  />
                  <g clipPath="url(#shutter-clip)">
                    <rect
                      x="4"
                      y="4"
                      width="14"
                      height="18"
                      fill="var(--color-accent)"
                      style={{
                        transform:
                          mounted && theme === "dark"
                            ? "scaleY(1)"
                            : "scaleY(0.06)",
                        transformOrigin: "11px 4px",
                        transition: "transform 0.45s ease",
                      }}
                    />
                  </g>
                </svg>
              </button>

              {mounted && user ? (
                <div className="flex items-center gap-3">
                  <span className="font-heading text-text-hover text-[12px] font-semibold tracking-wide">
                    {displayName}
                  </span>
                  {confirmingSignOut ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="font-heading text-danger text-[11px] font-semibold tracking-wide disabled:opacity-50"
                      >
                        {signingOut ? "..." : "Confirm?"}
                      </button>
                      <button
                        onClick={() => setConfirmingSignOut(false)}
                        className="font-heading text-text-muted text-[11px] hover:text-text-hover transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmingSignOut(true)}
                      className="font-heading text-text-muted text-[11px] tracking-wide underline hover:text-text-hover transition-colors"
                    >
                      Sign out
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative group">
                  <span className="pointer-events-none absolute -top-0.5 -left-0.5 w-[5px] h-[5px] border-t-[1.5px] border-l-[1.5px] border-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute -top-0.5 -right-0.5 w-[5px] h-[5px] border-t-[1.5px] border-r-[1.5px] border-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute -bottom-0.5 -left-0.5 w-[5px] h-[5px] border-b-[1.5px] border-l-[1.5px] border-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute -bottom-0.5 -right-0.5 w-[5px] h-[5px] border-b-[1.5px] border-r-[1.5px] border-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <button
                    onClick={() => setShowAuth(true)}
                    className="font-heading relative bg-transparent border border-border-interactive text-text-hover text-[12px] font-semibold tracking-wide px-5 py-1.5 rounded-sm cursor-pointer transition-all duration-300 group-hover:text-accent group-hover:border-accent/40"
                  >
                    SIGN IN
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showAuth && <AuthCard onClose={() => setShowAuth(false)} />}
    </>
  );
}