"use client";

import { useEffect, useState } from "react";

type PhotoData = {
  src: string | null;
  link: string | null;
  photographer: string | null;
};

type AircraftPhotoProps = {
  icao24: string;
  onRegistration?: (registration: string | null) => void;
  onAircraftModel?: (model: { manufacturer: string | null; type: string | null }) => void;
};

export default function AircraftPhoto({ icao24, onRegistration, onAircraftModel }: AircraftPhotoProps) {
  const [photo, setPhoto] = useState<PhotoData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");

  useEffect(() => {
    let cancelled = false;

    async function fetchPhoto() {
      try {
        const res = await fetch(`/api/aircraft-photo?icao24=${icao24}`);
        const data = await res.json();
        if (cancelled) return;

        setPhoto(data.photo);
        setStatus(data.photo?.src ? "ready" : "empty");
        onRegistration?.(data.registration ?? null);
        onAircraftModel?.(data.aircraftModel ?? null);
      } catch {
        if (!cancelled) setStatus("empty");
      }
    }

    fetchPhoto();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- as onRegistration/onAircraftModel are stable setState callbacks from the parent
  }, [icao24]);

  if (status === "loading") {
    return (
      <div className="w-full h-55 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center text-text-muted text-[11px] animate-pulse">
        Loading photo...
      </div>
    );
  }

  if (status === "empty" || !photo?.src) {
    return (
      <div className="w-full h-55 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center text-text-muted text-[11px]">
        No photo available
      </div>
    );
  }

  return (
    <a
      href={photo.link ?? undefined}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="relative block w-full h-55 rounded-lg overflow-hidden border border-border-subtle"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- external, unconfigured CDN domain from planespotters */}
      <img
        src={photo.src}
        alt={`Photo of aircraft ${icao24}`}
        className="w-full h-full object-cover"
      />
      {photo.photographer && (
        <span className="absolute bottom-0 right-0 bg-black/60 text-white/70 text-[9px] px-1.5 py-0.5 rounded-tl-md">
          © {photo.photographer}
        </span>
      )}
    </a>
  );
}