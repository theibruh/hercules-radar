import FlightCard from "@/components/FlightCard";
import { Flight } from "@/types/flight";
import RegionSelector from "@/components/RegionSelector";


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



export default async function Home({searchParams}: HomeProps) {
  const { region } = await searchParams;
  const selectedRegion = region ?? "australia";
  const  { flights, timestamp } = await getFlights(selectedRegion);
  return (
    <main className="min-h-screen bg-[#0a0f1a] p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-3">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white tracking-wide">Hercules Radar</h1>
          <p className="text-white/40 text-sm mt-1">Live flight tracking over global airspace</p>
          <p className="text-white/25 text-xs mt-1">Last updated: <span className="text-green-400/70">{timestamp}</span></p>
          <div className="flex justify-center mt-4">  
            <RegionSelector selectedRegion={selectedRegion} />
          </div>
        </div>

        {flights.length === 0 ? (
          <p className="text-center text-white/30 text-sm">No flights found or API unavailable.</p>
        ) : (
          flights.map((flight) => (
            <FlightCard key={flight.icao24} flightData={flight} />
          ))
        )}

      </div>
    </main>
  );
}