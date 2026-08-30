"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/components/ThemeProvider";

type AuthCardProps = {
  onClose: () => void;
};

export default function AuthCard({ onClose }: AuthCardProps) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const supabase = createClient();
  const { theme } = useTheme();
  const backgroundImage =
    theme === "light"
      ? "/about/engine-blueprint-light.png"
      : "/about/engine-blueprint-dark.png";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });
      if (error) {
        setError(error.message);
      } else if (!data.session) {
        setConfirmationSent(true);
      } else {
        onClose();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        onClose();
      }
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50">
      <Image
        src={backgroundImage}
        alt=""
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />

      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="relative w-[360px]"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-accent" />
          <span className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-accent" />
          <span className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-accent" />
          <span className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-accent" />

          <div className="bg-surface-panel border border-white/[0.08] rounded-sm shadow-[0_8px_40px_rgba(0,0,0,0.5)] p-7">
            <p className="font-heading text-text-faint text-[11px] tracking-[0.2em] mb-1">
              ACCOUNT ACCESS
            </p>

            {confirmationSent ? (
              <div className="pt-4">
                <p className="font-heading text-accent text-[15px] font-bold tracking-[0.05em] mb-3">
                  CHECK YOUR EMAIL
                </p>
                <p className="font-heading text-text-hover text-[13px] leading-relaxed">
                  We sent a confirmation link to{" "}
                  <span className="text-text-primary font-semibold">{email}</span>.
                  Click it to activate your account, then sign in.
                </p>
                <button
                  onClick={onClose}
                  className="font-heading w-full mt-6 bg-accent text-surface-panel font-bold text-[13px] tracking-[0.1em] py-2.5 rounded-sm"
                >
                  GOT IT
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-5 border-b border-white/10 mb-6">
                  <button
                    onClick={() => setMode("signup")}
                    className={`font-heading text-[13px] font-bold tracking-[0.1em] pb-2.5 -mb-px border-b-2 transition-colors ${
                      mode === "signup"
                        ? "text-accent border-accent"
                        : "text-text-faint border-transparent"
                    }`}
                  >
                    SIGN UP
                  </button>
                  <button
                    onClick={() => setMode("signin")}
                    className={`font-heading text-[13px] font-semibold tracking-[0.1em] pb-2.5 -mb-px border-b-2 transition-colors ${
                      mode === "signin"
                        ? "text-accent border-accent"
                        : "text-text-faint border-transparent"
                    }`}
                  >
                    SIGN IN
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
                  {mode === "signup" && (
                    <div>
                      <label className="font-heading text-text-faint text-[10px] tracking-[0.15em] block mb-1.5">
                        DISPLAY NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-transparent border-b border-border-interactive text-text-hover text-[14px] pb-1.5 outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  )}

                  <div>
                    <label className="font-heading text-text-faint text-[10px] tracking-[0.15em] block mb-1.5">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-border-interactive text-text-hover text-[14px] pb-1.5 outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-heading text-text-faint text-[10px] tracking-[0.15em] block mb-1.5">
                      PASSWORD
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent border-b border-border-interactive text-text-hover text-[14px] pb-1.5 outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  {error && <p className="text-danger text-[12px]">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="font-heading w-full mt-2 bg-accent text-surface-panel font-bold text-[13px] tracking-[0.1em] py-2.5 rounded-sm disabled:opacity-50 transition-opacity cursor-pointer"
                  >
                    {loading ? "..." : mode === "signup" ? "CREATE ACCOUNT" : "SIGN IN"}
                  </button>
                </form>

                <p className="font-heading text-center text-text-faint text-[11px] mt-4 ">
                  <button
                    onClick={onClose}
                    className="underline hover:text-text-hover transition-colors"
                  >
                    Continue browsing
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}