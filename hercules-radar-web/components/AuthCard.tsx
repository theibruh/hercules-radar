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
  const authAccent = theme === "light" ? "#c2410c" : "#e1ccb1";

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
      <style>{`
        .auth-input:focus {
          border-color: ${authAccent} !important;
        }
      `}</style>

      <Image
        src={backgroundImage}
        alt=""
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />

      <div
        style={{ color: authAccent }}
        className="absolute top-6 left-6 font-heading cursor-pointer z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <a
          href="https://en.wikipedia.org/wiki/Pratt_%26_Whitney_R-4360_Wasp_Major"
          className="text-[16px] font-bold tracking-[0.1em]"
          target="_blank" rel="noopener noreferrer"
        >
          Pratt & Whitney R-4360-4A Wasp Major{" "}
        </a>
        <p className="text-[14px] font-semibold tracking-[0.15em]">
          28 CYL · 3,000 HP
        </p>
      </div>

      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="relative w-[360px]"
          onClick={(e) => e.stopPropagation()}
        >
          <span
            style={{ borderColor: authAccent }}
            className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2"
          />
          <span
            style={{ borderColor: authAccent }}
            className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2"
          />
          <span
            style={{ borderColor: authAccent }}
            className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2"
          />
          <span
            style={{ borderColor: authAccent }}
            className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2"
          />

          <div className="bg-surface-page border border-border-subtle rounded-sm shadow-[0_8px_40px_rgba(0,0,0,0.5)] p-7">
            <p className="font-heading text-text-muted text-[11px] tracking-[0.2em] mb-1">
              ACCOUNT ACCESS
            </p>

            {confirmationSent ? (
              <div className="pt-4">
                <p
                  style={{ color: authAccent }}
                  className="font-heading text-[15px] font-bold tracking-[0.05em] mb-3"
                >
                  CHECK YOUR EMAIL
                </p>
                <p className="font-heading text-text-secondary text-[13px] leading-relaxed">
                  We sent a confirmation link to{" "}
                  <span className="text-text-primary font-semibold">
                    {email}
                  </span>
                  . Click it to activate your account, then sign in.
                </p>
                <button
                  onClick={onClose}
                  style={{ backgroundColor: authAccent }}
                  className="font-heading w-full mt-6 text-surface-page font-bold text-[13px] tracking-[0.1em] py-2.5 rounded-sm"
                >
                  GOT IT
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-5 border-b border-border-subtle mb-6">
                  <button
                    onClick={() => setMode("signup")}
                    style={
                      mode === "signup"
                        ? { color: authAccent, borderColor: authAccent }
                        : undefined
                    }
                    className={`font-heading text-[13px] font-bold tracking-[0.1em] pb-2.5 -mb-px border-b-2 transition-colors ${
                      mode === "signup"
                        ? ""
                        : "text-text-muted border-transparent"
                    }`}
                  >
                    SIGN UP
                  </button>
                  <button
                    onClick={() => setMode("signin")}
                    style={
                      mode === "signin"
                        ? { color: authAccent, borderColor: authAccent }
                        : undefined
                    }
                    className={`font-heading text-[13px] font-semibold tracking-[0.1em] pb-2.5 -mb-px border-b-2 transition-colors ${
                      mode === "signin"
                        ? ""
                        : "text-text-muted border-transparent"
                    }`}
                  >
                    SIGN IN
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
                  {mode === "signup" && (
                    <div>
                      <label className="font-heading text-text-secondary text-[10px] tracking-[0.15em] block mb-1.5">
                        DISPLAY NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="auth-input w-full bg-transparent border-b border-border-subtle text-text-secondary text-[14px] pb-1.5 outline-none transition-colors"
                      />
                    </div>
                  )}

                  <div>
                    <label className="font-heading text-text-secondary text-[10px] tracking-[0.15em] block mb-1.5">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input w-full bg-transparent border-b border-border-subtle text-text-secondary text-[14px] pb-1.5 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-heading text-text-secondary text-[10px] tracking-[0.15em] block mb-1.5">
                      PASSWORD
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input w-full bg-transparent border-b border-border-subtle text-text-secondary text-[14px] pb-1.5 outline-none transition-colors"
                    />
                  </div>

                  {error && <p className="text-danger text-[12px]">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: authAccent }}
                    className="font-heading w-full mt-2 text-surface-page font-bold text-[13px] tracking-[0.1em] py-2.5 rounded-sm disabled:opacity-50 transition-opacity cursor-pointer"
                  >
                    {loading
                      ? "..."
                      : mode === "signup"
                        ? "CREATE ACCOUNT"
                        : "SIGN IN"}
                  </button>
                </form>

                <p className="font-heading text-center text-text-muted text-[11px] mt-4 ">
                  <button
                    onClick={onClose}
                    className="underline hover:text-text-secondary transition-colors"
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
