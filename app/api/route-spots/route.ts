import { NextRequest, NextResponse } from 'next/server';
import { getRouteWaypoints, getPlaceDetails } from '@/app/lib/google';
import { recommendSpots } from '@/app/lib/claude';
import { buildAffiliateLinks, buildKlookLink } from '@/app/lib/affiliate';
import { Transport, Category } from '@/app/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { origin, destination, transport, categories } = await req.json() as {
      origin: string;
      destination: string;
      transport: Transport;
      categories: Category[];
    };

    if (!origin || !destination || !transport || !categories?.length) {
      return NextResponse.json({ error: '必須パラメータが不足しています' }, { status: 400 });
    }

    const mode = transport === 'car' ? 'driving' : 'transit';
    const waypoints = await getRouteWaypoints(origin, destination, mode);

    const centerPoint = waypoints[Math.floor(waypoints.length / 2)] ?? { lat: 35.6762, lng: 139.6503 };

    const aiSpots = await recommendSpots(origin, destination, transport, categories, waypoints);

    const spots = await Promise.all(
      aiSpots.map(async (s) => {
        const details = await getPlaceDetails(s.name, centerPoint.lat, centerPoint.lng);
        return {
          name: s.name,
          description: s.description,
          address: details?.address ?? '',
          website: details?.website ?? null,
          photoUrl: details?.photoUrl ?? null,
          rating: details?.rating ?? null,
          placeId: details?.placeId ?? '',
          lat: details?.lat ?? centerPoint.lat,
          lng: details?.lng ?? centerPoint.lng,
          klookUrl: buildKlookLink(s.name),
        };
      })
    );

    const affiliate = buildAffiliateLinks(destination, transport);

    return NextResponse.json({ spots, affiliate, waypoints });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
