import FlightList from "@/components/FlightList";
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
        <FlightList
          key={selectedRegion}
          region={selectedRegion}
          initialFlights={flights}
          initialTimestamp={timestamp}
        />
      </div>
    </main>
  );
}