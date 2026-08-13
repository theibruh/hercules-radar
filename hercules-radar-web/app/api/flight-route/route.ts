import { NextRequest, NextResponse } from "next/server";
import { getOpenSkyAccessToken } from "@/lib/opensky-auth";

export async function GET(request: NextRequest) {
  const icao24 = request.nextUrl.searchParams.get("icao24");

  if (!icao24) {
    return NextResponse.json({ error: "Missing icao24" }, { status: 400 });
  }

  try {
    const token = await getOpenSkyAccessToken();
    const nowSeconds = Math.floor(Date.now() / 1000);
    const beginSeconds = nowSeconds - 24 * 60 * 60;

    const response = await fetch(
      `https://opensky-network.org/api/flights/aircraft?icao24=${icao24}&begin=${beginSeconds}&end=${nowSeconds}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ route: null }, { status: response.status });
    }

    const flights = await response.json();

    if (!Array.isArray(flights) || flights.length === 0) {
      return NextResponse.json({ route: null });
    }

    const latest = flights[flights.length - 1];

    return NextResponse.json({
      route: {
        origin: latest.estDepartureAirport ?? null,
        destination: latest.estArrivalAirport ?? null,
      },
    });
  } catch (error) {
    console.error("[/api/flight-route] Fetch failed:", error);
    return NextResponse.json({ route: null }, { status: 500 });
  }
}