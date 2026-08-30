"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type CreateLogEntryModalProps = {
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateLogEntryModal({ onClose, onCreated }: CreateLogEntryModalProps) {
  const [callsign, setCallsign] = useState("");
  const [aircraftType, setAircraftType] = useState("");
  const [registration, setRegistration] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in.");
      setLoading(false);
      return;
    }

    let photoUrl: string | null = null;

    if (photoFile) {
      const path = `${user.id}/${crypto.randomUUID()}-${photoFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("log-photos")
        .upload(path, photoFile);

      if (uploadError) {
        setError(`Photo upload failed: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("log-photos").getPublicUrl(path);
      photoUrl = urlData.publicUrl;
    }

    const { error: insertError } = await supabase.from("log_entries").insert({
      user_id: user.id,
      callsign,
      aircraft_type: aircraftType || null,
      registration: registration || null,
      location: location || null,
      notes: notes || null,
      photo_url: photoUrl,
      is_public: isPublic,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onCreated();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative w-[380px]" onClick={(e) => e.stopPropagation()}>
        <div className="bg-surface-panel border border-border-interactive rounded-sm p-6">
          <p className="font-heading text-text-faint text-[11px] tracking-[0.2em] mb-4">
            NEW LOG ENTRY
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="font-heading text-text-hover text-[10px] tracking-[0.15em] block mb-1">
                CALLSIGN *
              </label>
              <input
                required
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                className="w-full bg-transparent border-b border-border-interactive text-text-hover text-[14px] pb-1.5 outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="font-heading text-text-hover text-[10px] tracking-[0.15em] block mb-1">
                AIRCRAFT TYPE
              </label>
              <input
                value={aircraftType}
                onChange={(e) => setAircraftType(e.target.value)}
                className="w-full bg-transparent border-b border-border-interactive text-text-hover text-[14px] pb-1.5 outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="font-heading text-text-hover text-[10px] tracking-[0.15em] block mb-1">
                REGISTRATION
              </label>
              <input
                value={registration}
                onChange={(e) => setRegistration(e.target.value)}
                className="w-full bg-transparent border-b border-border-interactive text-text-hover text-[14px] pb-1.5 outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="font-heading text-text-hover text-[10px] tracking-[0.15em] block mb-1">
                LOCATION
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent border-b border-border-interactive text-text-hover text-[14px] pb-1.5 outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="font-heading text-text-hover text-[10px] tracking-[0.15em] block mb-1">
                NOTES
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-transparent border-b border-border-interactive text-text-hover text-[14px] pb-1.5 outline-none focus:border-accent transition-colors resize-none"
              />
            </div>
            <div>
              <label className="font-heading text-text-hover text-[10px] tracking-[0.15em] block mb-1">
                PHOTO
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                className="w-full text-text-hover text-[12px] file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:bg-accent file:text-surface-panel file:text-[11px] file:font-heading file:font-bold"
              />
            </div>

            <label className="flex items-center gap-2 mt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="accent-accent"
              />
              <span className="font-heading text-text-hover text-[12px]">
                Make this post public
              </span>
            </label>

            {error && <p className="text-danger text-[12px]">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="font-heading w-full mt-2 bg-accent text-surface-panel font-bold text-[13px] tracking-[0.1em] py-2.5 rounded-sm disabled:opacity-50"
            >
              {loading ? "..." : "POST"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}