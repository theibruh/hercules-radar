import FlightCard from "@/components/FlightCard";
import { Flight } from "@/types/flight";

async function getFlights(region: string): Promise<{ flights: Flight[]; timestamp: string }> {
  const res = await fetch(`http://localhost:3000/api/flights?region=${region}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return { flights: [], timestamp: "N/A" };
  }

  return res.json();
}

type HomeProps = {
  searchParams: Promise<{ region?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { region } = await searchParams;
  const selectedRegion = region ?? "australia";
  const { flights, timestamp } = await getFlights(selectedRegion);

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-3">

        <div className="flex items-center justify-between text-[11px] text-white/40 uppercase tracking-widest border-b border-white/[0.06] pb-3 mb-2">
          <span>
            Region: <span className="text-white/70 font-bold">{selectedRegion.replace("_", " ")}</span>
          </span>
          <span>
            {flights.length} flights tracked
          </span>
          <span>
            Last updated: <span className="text-green-400/70">{timestamp}</span>
          </span>
        </div>

        {flights.length === 0 ? (
          <p className="text-center text-red-400/30 text-sm">No flights found or API unavailable.</p>
        ) : (
          flights.map((flight) => (
            <FlightCard key={flight.icao24} flightData={flight} />
          ))
        )}

      </div>
    </main>
  );
}