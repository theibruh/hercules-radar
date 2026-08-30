"use client";

import { useState } from "react";

export type LogEntry = {
  id: string;
  callsign: string;
  aircraftType: string | null;
  registration: string | null;
  location: string | null;
  notes: string | null;
  photoUrl: string | null;
  isPublic: boolean;
  createdAt: string;
  posterName: string;
};

type LogEntryCardProps = {
  entry: LogEntry;
  isOwner: boolean;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
};

function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function LogEntryCard({ entry, isOwner, onArchive, onDelete }: LogEntryCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group relative bg-surface-card border border-border-subtle rounded-xl overflow-hidden max-w-md w-full">
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-accent-strong flex items-center justify-center">
            <span className="font-heading text-surface-page text-[12px] font-bold">
              {entry.posterName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-heading text-text-primary text-[12px] font-semibold">
            {entry.posterName}
          </span>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-text-primary text-[16px] leading-none px-1"
              aria-label="Post options"
            >
              ⋯
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-6 bg-surface-panel border border-border-interactive rounded-sm overflow-hidden z-10 w-28">
                <button
                  onClick={() => {
                    onArchive?.(entry.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 font-heading text-text-hover text-[12px] hover:bg-surface-hover transition-colors"
                >
                  Archive
                </button>
                <button
                  onClick={() => {
                    onDelete?.(entry.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 font-heading text-danger text-[12px] hover:bg-surface-hover transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {entry.photoUrl ? (
        <img
          src={entry.photoUrl}
          alt={`Photo of ${entry.callsign}`}
          className="w-full h-44 object-cover mt-2"
        />
      ) : (
        <div className="w-full h-44 mt-2 bg-surface-card-hover flex items-center justify-center">
          <span className="font-heading text-text-muted text-[12px]">No photo</span>
        </div>
      )}

      <div className="p-4 flex flex-col gap-2.5">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-mono text-accent-strong text-[15px] font-bold">
              {entry.callsign}
            </p>
            {entry.aircraftType && (
              <p className="font-heading text-text-secondary text-[12px]">
                {entry.aircraftType}
              </p>
            )}
          </div>
          <span className="font-heading text-[10px] uppercase tracking-widest text-text-secondary bg-surface-card-hover border border-border-subtle rounded-md px-2 py-1">
            {entry.isPublic ? "Public" : "Private"}
          </span>
        </div>

        {(entry.registration || entry.location) && (
          <div className="flex gap-5">
            {entry.registration && (
              <div>
                <p className="font-heading text-[9px] uppercase tracking-widest text-text-muted mb-0.5">
                  Registration
                </p>
                <p className="font-mono text-[12px] text-text-primary">{entry.registration}</p>
              </div>
            )}
            {entry.location && (
              <div>
                <p className="font-heading text-[9px] uppercase tracking-widest text-text-muted mb-0.5">
                  Location
                </p>
                <p className="font-mono text-[12px] text-text-primary">{entry.location}</p>
              </div>
            )}
          </div>
        )}

        {entry.notes && (
          <p className="font-heading text-[13px] leading-relaxed text-text-primary">
            {entry.notes}
          </p>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-border-subtle mt-1">
          <p className="font-mono text-text-muted text-[10px]">{timeAgo(entry.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}