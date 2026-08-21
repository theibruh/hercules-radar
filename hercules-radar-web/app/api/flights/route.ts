import { NextRequest, NextResponse } from "next/server";
import { Flight } from "@/types/flight";
import { Region } from "@/types/regions";
import { getOpenSkyAccessToken } from "@/lib/opensky-auth";

const REGIONS: Record<string, Region> = {
  australia:     { lamin: -44, lomin: 113,  lamax: -10, lomax: 154 },
  europe:        { lamin: 36,  lomin: -10,  lamax: 71,  lomax: 40  },
  north_america: { lamin: 15,  lomin: -170, lamax: 72,  lomax: -50 },
  asia:          { lamin: 10,  lomin: 60,   lamax: 55,  lomax: 150 },
  south_america: { lamin: -56, lomin: -81,  lamax: 13,  lomax: -34 },
  africa:        { lamin: -35, lomin: -18,  lamax: 38,  lomax: 52  },
  middle_east:   { lamin: 12,  lomin: 32,   lamax: 42,  lomax: 65  },
};

function mapToFlight(raw: unknown[]): Flight {
  return {
    icao24:    (raw[0] as string)  ?? null,
    callsign:  (raw[1] as string)  ?? null,
    country:   (raw[2] as string)  ?? null,
    longitude: (raw[5] as number)  ?? null,
    latitude:  (raw[6] as number)  ?? null,
    altitude:  (raw[7] as number)  ?? null,
    onGround:  (raw[8] as boolean) ?? false,
    speed:     (raw[9] as number)  ?? null,
    heading:   (raw[10] as number) ?? null,
    squawk:    (raw[14] as string) ?? null,
    category:  (raw[17] as number) ?? null,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const regionName = searchParams.get("region") ?? "australia";
  const region = REGIONS[regionName] ?? REGIONS["australia"];

  try {

    const token = await getOpenSkyAccessToken();

    const response = await fetch(
      `https://opensky-network.org/api/states/all?lamin=${region.lamin}&lomin=${region.lomin}&lamax=${region.lamax}&lomax=${region.lomax}&extended=1`,
      {
        next: { revalidate: 30 },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "OpenSky API error", flights: [], timestamp: "N/A" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawStates: unknown[][] = data.states ?? [];
    const timestamp = new Date(data.time * 1000).toLocaleTimeString("en-AU");
    const flights: Flight[] = rawStates
      .filter((raw) => raw[1] && (raw[1] as string).trim() !== "")
      .map(mapToFlight);

    return NextResponse.json({ flights, timestamp });

  } catch (error) {
    console.error("[/api/flights] Fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch flights", flights: [], timestamp: "N/A" },
      { status: 500 }
    );
  }
}