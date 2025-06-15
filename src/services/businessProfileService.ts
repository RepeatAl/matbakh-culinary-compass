
export interface BusinessProfileResult {
  name: string;
  address: string;
  place_id: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  photo_url?: string;
  [key: string]: any;
}

export async function searchBusinessProfile(query: string, location: string): Promise<BusinessProfileResult[]> {
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/business-profile-search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, location }),
  });
  if (!res.ok) throw new Error("Google Business Suche fehlgeschlagen.");
  const { results } = await res.json();
  return (results || []).map((r: any) => ({
    name: r.name,
    address: r.formatted_address,
    place_id: r.place_id,
    website: r.website,
    rating: r.rating,
    user_ratings_total: r.user_ratings_total,
    photo_url: r.photos && r.photos[0]
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${r.photos[0].photo_reference}&key=${localStorage.getItem("google_business_api_key") || ""}`
      : undefined,
    ...r,
  }));
}
