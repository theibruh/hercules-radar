import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const icao24 = request.nextUrl.searchParams.get("icao24");

  if (!icao24) {
    return NextResponse.json({ error: "Missing icao24" }, { status: 400 });
  }

  const [photoResult, registrationResult] = await Promise.allSettled([
    fetchPhoto(icao24),
    fetchRegistration(icao24),
  ]);

  return NextResponse.json({
    photo: photoResult.status === "fulfilled" ? photoResult.value : null,
    registration:
      registrationResult.status === "fulfilled" ? registrationResult.value : null,
  });
}

async function fetchPhoto(icao24: string) {
  const response = await fetch(
    `https://api.planespotters.net/pub/photos/hex/${icao24}`,
    {
      headers: {
        "User-Agent":
          "HerculesRadar/1.0 (+https://github.com/theibruh/hercules-radar)",
      },
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) return null;

  const data = await response.json();
  const photo = data.photos?.[0];
  if (!photo) return null;

  return {
    src: photo.thumbnail_large?.src ?? photo.thumbnail?.src ?? null,
    link: photo.link ?? null,
    photographer: photo.photographer ?? null,
  };
}

async function fetchRegistration(icao24: string) {
  const response = await fetch(`https://hexdb.io/api/v1/aircraft/${icao24}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data.Registration ?? null;
}
