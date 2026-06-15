const API_KEY = process.env.GOOGLE_MAPS_API_KEY!;

export async function getRouteWaypoints(
  origin: string,
  destination: string,
  mode: 'driving' | 'transit'
): Promise<{ lat: number; lng: number }[]> {
  const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
  url.searchParams.set('origin', origin);
  url.searchParams.set('destination', destination);
  url.searchParams.set('mode', mode);
  url.searchParams.set('language', 'ja');
  url.searchParams.set('key', API_KEY);

  const res = await fetch(url.toString());
  const data = await res.json();

  if (!data.routes?.length) return [];

  const points = data.routes[0].legs[0].steps.map((step: { start_location: { lat: number; lng: number } }) => step.start_location);
  // Sample every ~10 points to keep the list manageable
  return points.filter((_: unknown, i: number) => i % Math.max(1, Math.floor(points.length / 10)) === 0);
}

export async function getPlaceDetails(name: string, nearLat: number, nearLng: number): Promise<{
  placeId: string;
  address: string;
  website: string | null;
  photoUrl: string | null;
  rating: number | null;
  lat: number;
  lng: number;
} | null> {
  const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  searchUrl.searchParams.set('query', name);
  searchUrl.searchParams.set('location', `${nearLat},${nearLng}`);
  searchUrl.searchParams.set('radius', '50000');
  searchUrl.searchParams.set('language', 'ja');
  searchUrl.searchParams.set('key', API_KEY);

  const searchRes = await fetch(searchUrl.toString());
  const searchData = await searchRes.json();
  const place = searchData.results?.[0];
  if (!place) return null;

  const detailUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  detailUrl.searchParams.set('place_id', place.place_id);
  detailUrl.searchParams.set('fields', 'name,formatted_address,website,rating,photos,geometry');
  detailUrl.searchParams.set('language', 'ja');
  detailUrl.searchParams.set('key', API_KEY);

  const detailRes = await fetch(detailUrl.toString());
  const detailData = await detailRes.json();
  const d = detailData.result;

  let photoUrl: string | null = null;
  if (d?.photos?.[0]) {
    photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${d.photos[0].photo_reference}&key=${API_KEY}`;
  }

  return {
    placeId: place.place_id,
    address: d?.formatted_address ?? place.formatted_address ?? '',
    website: d?.website ?? null,
    photoUrl,
    rating: d?.rating ?? null,
    lat: d?.geometry?.location?.lat ?? place.geometry.location.lat,
    lng: d?.geometry?.location?.lng ?? place.geometry.location.lng,
  };
}
