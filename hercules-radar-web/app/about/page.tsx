"use client";

import { useState, useEffect } from "react";

const SECTIONS = [
  { id: "spruce-goose", number: "01", title: "The Spruce Goose" },
  { id: "howard-hughes", number: "02", title: "Howard Hughes" },
  { id: "why-hercules-radar", number: "03", title: "Why Hercules Radar" },
  { id: "how-tracking-works", number: "04", title: "How Tracking Works" },
  { id: "opensky-network", number: "05", title: "The OpenSky Network" },
];

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-112px 0px -66% 0px",
        threshold: 0,
      },
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-7xl mx-auto flex gap-12 px-6 pt-8">
      <aside className="w-[220px] flex-shrink-0 sticky top-28 self-start flex flex-col gap-5">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`font-heading flex items-center gap-2.5 border-l-2 pl-3 transition-colors duration-200 ${
              section.id === activeSection
                ? "border-accent text-accent"
                : "border-transparent text-text-muted hover:text-text-hover"
            }`}
          >
            <span className="text-[10px] font-semibold">{section.number}</span>
            <span className="text-[12px] font-semibold tracking-[0.15em] uppercase">
              {section.title}
            </span>
          </a>
        ))}
      </aside>

      <div className="flex-1 max-w-[640px] pb-24">
        <section id="spruce-goose" className="scroll-mt-28 mb-24">
          <p className="font-heading text-text-muted text-[11px] tracking-[0.2em] mb-2">
            01 / 05
          </p>
          <h1 className="font-heading text-text-primary text-3xl font-bold mb-6">
            THE SPRUCE GOOSE
          </h1>
          <p className="font-serif text-text-primary text-[16px] leading-[1.75] mb-4">
            On November 2, 1947, Howard Hughes climbed into the cockpit of the
            largest aircraft ever built and taxied it across Long Beach Harbor.
            What happened next was never meant to make history the way it did —
            the H-4 Hercules lifted roughly seventy feet off the water and flew
            for about a mile before touching back down. It never flew again.
          </p>
          <p className="font-serif text-text-primary text-[16px] leading-[1.75]">
            Before Congress, Hughes had defended the project against accusations
            of waste with a line that would outlive the aircraft itself:{" "}
            <span className="italic">
              &ldquo;I put the sweat of my life into this thing.&rdquo;
            </span>
          </p>
        </section>

        <section id="howard-hughes" className="scroll-mt-28 mb-24">
          <p className="font-heading text-text-muted text-[11px] tracking-[0.2em] mb-2">
            02 / 05
          </p>
          <h1 className="font-heading text-text-primary text-3xl font-bold mb-6">
            HOWARD HUGHES
          </h1>
          <p className="font-serif text-text-secondary text-[16px] leading-[1.75]">
            Content coming next.
          </p>
        </section>

        <section id="why-hercules-radar" className="scroll-mt-28 mb-24">
          <p className="font-heading text-text-muted text-[11px] tracking-[0.2em] mb-2">
            03 / 05
          </p>
          <h1 className="font-heading text-text-primary text-3xl font-bold mb-6">
            WHY HERCULES RADAR
          </h1>
          <p className="font-serif text-text-secondary text-[16px] leading-[1.75]">
            Content coming next.
          </p>
        </section>

        <section id="how-tracking-works" className="scroll-mt-28 mb-24">
          <p className="font-heading text-text-muted text-[11px] tracking-[0.2em] mb-2">
            04 / 05
          </p>
          <h1 className="font-heading text-text-primary text-3xl font-bold mb-6">
            HOW TRACKING WORKS
          </h1>
          <p className="font-serif text-text-secondary text-[16px] leading-[1.75]">
            Content coming next.
          </p>
        </section>

        <section id="opensky-network" className="scroll-mt-28 mb-24">
          <p className="font-heading text-text-muted text-[11px] tracking-[0.2em] mb-2">
            05 / 05
          </p>
          <h1 className="font-heading text-text-primary text-3xl font-bold mb-6">
            THE OPENSKY NETWORK
          </h1>
          <p className="font-serif text-text-secondary text-[16px] leading-[1.75]">
            Content coming next.
          </p>
        </section>
      </div>
    </div>
  );
}
