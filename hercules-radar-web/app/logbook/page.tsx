"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/hooks/useUser";
import AuthCard from "@/components/AuthCard";
import CreateLogEntryModal from "@/components/CreateLogEntryModal";
import LogEntryCard, { LogEntry } from "@/components/LogEntryCard";
import { fetchFeedEntries, fetchPrivateEntries, fetchArchivedEntries } from "@/lib/logEntries";

export default function LogbookPage() {
  const { user, loading } = useUser();
  const [showAuth, setShowAuth] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [view, setView] = useState<"feed" | "private" | "archived">("feed");
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(true);

  const refetch = useCallback(() => {
    if (!user) return;
    setEntriesLoading(true);
    const fetchFn =
      view === "feed" ? fetchFeedEntries : view === "private" ? fetchPrivateEntries : fetchArchivedEntries;
    fetchFn().then((data) => {
      setEntries(data);
      setEntriesLoading(false);
    });
  }, [view, user]);

  useEffect(() => {
    refetch();
  }, [refetch]);

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
            view === "feed" ? "text-accent border-accent" : "text-text-muted border-transparent"
          }`}
        >
          FEED
        </button>
        <button
          onClick={() => setView("private")}
          className={`font-heading text-[13px] font-bold tracking-[0.1em] pb-3 -mb-px border-b-2 transition-colors ${
            view === "private" ? "text-accent border-accent" : "text-text-muted border-transparent"
          }`}
        >
          PRIVATE
        </button>
        <button
          onClick={() => setView("archived")}
          className={`font-heading text-[13px] font-bold tracking-[0.1em] pb-3 -mb-px border-b-2 transition-colors ${
            view === "archived" ? "text-accent border-accent" : "text-text-muted border-transparent"
          }`}
        >
          ARCHIVED
        </button>
      </div>

      <div className="flex flex-col items-center gap-6">
        {entriesLoading ? (
          <p className="font-serif text-text-muted text-center py-16">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="font-serif text-text-muted text-center py-16">
            {view === "feed"
              ? "No public posts yet."
              : view === "private"
                ? "You haven't logged anything yet."
                : "Nothing archived."}
          </p>
        ) : (
          entries.map((entry) => (
            <LogEntryCard
              key={entry.id}
              entry={entry}
              isOwner={view === "private" || view === "archived"}
              onChanged={refetch}
            />
          ))
        )}
      </div>

      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-accent text-surface-page flex items-center justify-center text-2xl font-bold shadow-[0_4px_20px_rgba(0,0,0,0.3)] z-30"
        aria-label="Create new log entry"
      >
        +
      </button>

      {showCreate && (
        <CreateLogEntryModal onClose={() => setShowCreate(false)} onCreated={refetch} />
      )}
    </div>
  );
}