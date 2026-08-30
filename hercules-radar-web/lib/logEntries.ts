import { createClient } from "@/lib/supabase/client";
import type { LogEntry } from "@/components/LogEntryCard";

type LogEntryRow = {
  id: string;
  user_id: string;
  created_at: string;
  callsign: string;
  registration: string | null;
  aircraft_type: string | null;
  location: string | null;
  notes: string | null;
  photo_url: string | null;
  is_public: boolean;
  is_archived: boolean;
};

async function attachPosterNames(
  rows: LogEntryRow[],
  supabase: ReturnType<typeof createClient>
): Promise<LogEntry[]> {
  const userIds = [...new Set(rows.map((r) => r.user_id))];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", userIds);

  const nameMap = new Map(
    (profiles ?? []).map((p) => [p.id, p.display_name ?? "Anonymous"])
  );

  return rows.map((r) => ({
    id: r.id,
    callsign: r.callsign,
    aircraftType: r.aircraft_type,
    registration: r.registration,
    location: r.location,
    notes: r.notes,
    photoUrl: r.photo_url,
    isPublic: r.is_public,
    createdAt: r.created_at,
    posterName: nameMap.get(r.user_id) ?? "Anonymous",
  }));
}

export async function fetchFeedEntries(): Promise<LogEntry[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("log_entries")
    .select("*")
    .eq("is_public", true)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (user) {
    query = query.neq("user_id", user.id);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return attachPosterNames(data, supabase);
}

export async function fetchPrivateEntries(): Promise<LogEntry[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("log_entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return attachPosterNames(data, supabase);
}

export async function fetchArchivedEntries(): Promise<LogEntry[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("log_entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_archived", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return attachPosterNames(data, supabase);
}

export async function archiveLogEntry(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("log_entries")
    .update({ is_archived: true })
    .eq("id", id);
  return !error;
}

export async function deleteLogEntry(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("log_entries").delete().eq("id", id);
  return !error;
}