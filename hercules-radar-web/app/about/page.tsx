"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AdsbFlowDiagram from "@/components/AdsbFlowDiagram";
import SquawkExample from "@/components/SquawkExample";
import OpenSkyStats from "@/components/OpenSkyStats";

const SECTIONS = [
  { id: "spruce-goose", number: "01", title: "The Spruce Goose" },
  { id: "why-hercules-radar", number: "02", title: "Why Hercules Radar" },
  { id: "how-tracking-works", number: "03", title: "How Tracking Works" },
  { id: "opensky-network", number: "04", title: "The OpenSky Network" },
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

  useEffect(() => {
    console.log(
      "%c✦ HERCULES RADAR",
      "color: #f97316; font-size: 20px; font-weight: bold;",
    );
    console.log(
      "%cYou found the console. This whole app is a solo build and is emotionally supported by caffeine. :))) ☕",
      "color: #888; font-size: 13px;",
    );
    console.log(
      "%cgithub.com/theibruh/hercules-radar",
      "color: #f97316; font-size: 13px;",
    );
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
            01 / 04
          </p>
          <h1 className="font-heading text-text-primary text-3xl font-bold mb-6">
            THE SPRUCE GOOSE
          </h1>
          <p className="font-serif text-text-primary text-[16px] leading-[1.75] mb-4">
            Built during the Second World War, the H-4 Hercules was Howard
            Hughes&apos;s answer to a wartime steel shortage and wartime
            restrictions on aluminum forced the entire airframe to be built from
            laminated birch instead, which is exactly where its dismissive
            nickname came from, despite never actually containing any spruce at
            all. At 320 feet, its wingspan was the largest of any aircraft ever
            built, a record that stood for over seventy years.
          </p>

          <figure className="my-8">
            <Image
              src="/about/big.jpg"
              alt="The H-4 Hercules during construction, its four-row radial engines visible"
              width={640}
              height={424}
              className="rounded-lg w-full h-auto"
            />
            <figcaption className="font-heading text-text-muted text-[15px] mt-2">
              The Hercules during construction. Source: San Diego Air and Space
              Museum / SDASM Archives, public domain.
            </figcaption>
          </figure>

          <figure className="my-8">
            <Image
              src="/about/comparison.webp"
              alt="Size comparison diagram of the largest aircraft ever built, including the H-4 Hercules"
              width={480}
              height={620}
              className="rounded-lg w-full h-auto"
            />
            <figcaption className="font-heading text-text-muted text-[15px] mt-2">
              The Hercules&apos; wingspan against other giants of aviation
              history. &ldquo;Giant planes comparison&rdquo; by Clem Tillier, CC
              BY-SA 2.5.
            </figcaption>
          </figure>

          <p className="font-serif text-text-primary text-[16px] leading-[1.75] mb-4">
            On November 2, 1947, Howard Hughes climbed into the cockpit of the
            largest aircraft ever built and taxied it across Long Beach Harbor.
            What happened next was never meant to make history the way it did.
            The H-4 Hercules lifted roughly seventy feet off the water and flew
            for about a mile before touching back down. It never flew again.
          </p>

          <figure className="my-8">
            <Image
              src="/about/spruceGooseLanding.png"
              alt="The H-4 Hercules landing off the California coast, November 2, 1947"
              width={640}
              height={420}
              className="rounded-lg w-full h-auto"
            />
            <figcaption className="font-heading text-text-muted text-[15px] mt-2">
              The H-4 Hercules touches back down off the California coast,
              November 2, 1947. Source: Smithsonian Institution Archives
              (SIA2012-0951).
            </figcaption>
          </figure>
          <a
            href="https://archive.org/details/34620HDSpruceGoose"
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading inline-flex items-center gap-1.5 text-accent-strong text-[12px] font-semibold tracking-wide hover:text-accent transition-colors mb-4"
          >
            Watch original footage of the flight ↗
          </a>
          <p className="font-serif text-text-primary text-[16px] leading-[1.75]">
            Before Congress, Hughes had defended the project against accusations
            of waste with a line that would outlive the aircraft itself:
            <br />
            <br />
            <span className="italic font-bold">
              &ldquo;I have put the sweat of my life into this thing, I have my
              reputation rolled up in it, and I have stated serveral times that
              if it is a failure, I will probably leave this country and never
              return, and I mean it.&rdquo;
            </span>
            <br />
            <br />
            The Hercules never flew again, but it still exists today on
            permanent display at the Evergreen Aviation &amp; Space Museum in
            McMinnville, Oregon.
          </p>

          <figure className="my-8">
            <Image
              src="/about/oregon.jpg"
              alt="The H-4 Hercules on display at the Evergreen Aviation & Space Museum"
              width={640}
              height={427}
              className="rounded-lg w-full h-auto"
            />
            <figcaption className="font-heading text-text-muted text-[15px] mt-2">
              On permanent display today at the Evergreen Aviation &amp; Space
              Museum in McMinnville, Oregon. Photo by Clemens Vasters, CC BY
              2.0.
            </figcaption>
          </figure>
        </section>

        <section id="why-hercules-radar" className="scroll-mt-28 mb-24">
          <p className="font-heading text-text-muted text-[11px] tracking-[0.2em] mb-2">
            02 / 04
          </p>
          <h1 className="font-heading text-text-primary text-3xl font-bold mb-6">
            WHY HERCULES RADAR
          </h1>
          <p className="font-serif text-text-primary text-[16px] leading-[1.75] mb-4">
            <a
              href="https://en.wikipedia.org/wiki/Hughes_H-4_Hercules"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-strong/50 hover:text-accent-strong transition-colors"
            >
              Hughes H-4 Hercules
            </a>{" "}
            never proved itself the way Hughes intended. It flew once, for about
            a mile, and never again. But seventy years on, it still commands
            attention: an aircraft built at the edge of what engineering could
            manage, in service of something genuinely audacious. That same
            regard for ambitious, hands-on engineering is what this project
            borrows its name from.
          </p>

          <figure className="my-8 max-w-[280px]">
            <div className="relative w-full h-[220px]">
              <Image
                src="/SpruceGoose-transparent.png"
                alt="The Hercules Radar logo — a goose silhouette viewed from above"
                fill
                className="object-contain"
              />
            </div>
            <figcaption className="font-heading text-text-muted text-[11px] mt-2">
              Viewed from directly overhead, an aircraft&apos;s silhouette and a
              bird&apos;s collapse into nearly the same shape.
            </figcaption>
          </figure>

          <p className="font-serif text-text-primary text-[16px] leading-[1.75]">
            The logo leans into exactly that. It shows a goose from above, its
            wings spread like an aircraft in flight. It's a direct nod to the
            Hercules's old nickname, the "Spruce Goose," but this time it's worn
            deliberately. Hercules reflects the ambition behind the project and
            the myth behind the name, while Radar simply describes what the tool
            actually does.
          </p>
        </section>

        <section id="how-tracking-works" className="scroll-mt-28 mb-24">
          <p className="font-heading text-text-muted text-[11px] tracking-[0.2em] mb-2">
            03 / 04
          </p>
          <h1 className="font-heading text-text-primary text-3xl font-bold mb-6">
            HOW TRACKING WORKS
          </h1>
          <AdsbFlowDiagram />
          <SquawkExample />
        </section>

        <section id="opensky-network" className="scroll-mt-28 mb-24">
          <p className="font-heading text-text-muted text-[11px] tracking-[0.2em] mb-2">
            04 / 04
          </p>
          <h1 className="font-heading text-text-primary text-3xl font-bold mb-6">
            THE OPENSKY NETWORK
          </h1>
          <p className="font-serif text-text-primary text-[16px] leading-[1.75] mb-4">
            The OpenSky Network began in{" "}
            <span className="font-bold text-accent-strong">2012</span> as a
            research collaboration between armasuisse in Switzerland, the
            University of Kaiserslautern in Germany, and the University of
            Oxford. It set out to give researchers open, real-world access to
            air traffic data that had, until then, mostly stayed locked inside
            commercial systems. By 2015 it had grown into its own{" "}
            <span className="font-bold text-accent-strong">
              independent nonprofit
            </span>
            , based in Switzerland, with a mission that hasn&apos;t really
            changed since: keep that data open, for anyone.
          </p>
          <p className="font-serif text-text-primary text-[16px] leading-[1.75]">
            None of it comes from a fleet of proprietary sensors. It comes from{" "}
            <span className="font-bold text-accent-strong">
              thousands of volunteers
            </span>{" "}
            around the world who host their own ADS-B receivers: hobbyists,
            researchers, universities, even the occasional enthusiast with an
            antenna on their roof, all feeding raw signal data into one shared
            network. That crowdsourced foundation has powered hundreds of
            academic papers since. It&apos;s the same open backbone Hercules
            Radar polls{" "}
            <span className="font-bold text-accent-strong">
              every 30 seconds
            </span>{" "}
            for the positions on your screen.
          </p>
          <OpenSkyStats />
        </section>
      </div>
    </div>
  );
}
