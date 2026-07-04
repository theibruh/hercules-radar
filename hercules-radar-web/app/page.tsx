import FlightCard from "@/components/FlightCard";
import { Flight } from "@/types/flight";

const testFlight: Flight = {
  icao24: "7c6b2d",
  callsign: "QFA441",
  country: "Australia",
  longitude: 151.2093,
  latitude: -33.8688,
  altitude: 11277,
  onGround: false,
  speed: 242.78,
  heading: 43,
  squawk: "1234",
  category: 3,
};

const emergencyFlight: Flight = {
  icao24: "7c1234",
  callsign: "VOZ888",
  country: "Australia",
  longitude: 153.0251,
  latitude: -27.4698,
  altitude: 3657,
  onGround: false,
  speed: 144.0,
  heading: 90,
  squawk: "7700",
  category: 3,
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f1a] p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-3">
        <FlightCard flightData={testFlight} />
        <FlightCard flightData={emergencyFlight} />
      </div>
    </main>
  );
}