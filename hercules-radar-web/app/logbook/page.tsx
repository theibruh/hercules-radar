// app/logbook/page.tsx
"use client";

import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import AuthCard from "@/components/AuthCard";
import LogEntryCard, { LogEntry } from "@/components/LogEntryCard";

const MOCK_ENTRIES: LogEntry[] = [
  {
    id: "1",
    callsign: "QFA7583",
    aircraftType: "Boeing 737-800",
    registration: "VH-XZH",
    location: "Sydney, 34L",
    notes: "Caught this one on late final, gorgeous evening light off the wing.",
    photoUrl: null,
    isPublic: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    posterName: "theibruh",
  },
];

export default function LogbookPage() {
  const { user, loading } = useUser();
  const [showAuth, setShowAuth] = useState(false);
  const [view, setView] = useState<"feed" | "private">("feed");

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <>
        <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center">
          <p className="font-heading text-text-muted text-[11px] tracking-[0.2em] mb-3">
            LOGBOOK
          </p>
          <h1 className="font-heading text-text-primary text-2xl font-bold mb-3">
            Sign up to start logging spots
          </h1>
          <p className="font-serif text-text-secondary text-[15px] max-w-md mb-8">
            Post the aircraft you&apos;ve spotted, keep them public or private,
            and browse what other spotters have logged.
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="font-heading bg-accent text-surface-panel font-bold text-[13px] tracking-[0.1em] px-6 py-3 rounded-sm"
          >
            SIGN UP
          </button>
        </div>
        {showAuth && <AuthCard onClose={() => setShowAuth(false)} />}
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex gap-6 border-b border-border-subtle mb-8">
        <button
          onClick={() => setView("feed")}
          className={`font-heading text-[13px] font-bold tracking-[0.1em] pb-3 -mb-px border-b-2 transition-colors ${
            view === "feed"
              ? "text-accent border-accent"
              : "text-text-muted border-transparent"
          }`}
        >
          FEED
        </button>
        <button
          onClick={() => setView("private")}
          className={`font-heading text-[13px] font-bold tracking-[0.1em] pb-3 -mb-px border-b-2 transition-colors ${
            view === "private"
              ? "text-accent border-accent"
              : "text-text-muted border-transparent"
          }`}
        >
          PRIVATE
        </button>
      </div>

      <div className="flex flex-col items-center gap-6">
        {MOCK_ENTRIES.length === 0 ? (
          <p className="font-serif text-text-muted text-center py-16">
            {view === "feed" ? "No public posts yet." : "You haven't logged anything yet."}
          </p>
        ) : (
          MOCK_ENTRIES.map((entry) => (
            <LogEntryCard
              key={entry.id}
              entry={entry}
              isOwner={view === "private"}
              onArchive={(id) => console.log("archive", id)}
              onDelete={(id) => console.log("delete", id)}
            />
          ))
        )}
      </div>

      <button
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-accent text-surface-page flex items-center justify-center text-2xl font-bold shadow-[0_4px_20px_rgba(0,0,0,0.3)] z-30"
        aria-label="Create new log entry"
      >
        +
      </button>
    </div>
  );
}