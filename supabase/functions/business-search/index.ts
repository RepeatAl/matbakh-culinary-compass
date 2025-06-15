
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Hilfsfunktion zum Safe-Parsing
function parseNumber(val: string | null, fallback?: number) {
  const n = Number(val);
  return isNaN(n) ? fallback : n;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const url = new URL(req.url);
    const GOOGLE_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY") || Deno.env.get("GOOGLE_BUSINESS_API_KEY");
    if (!GOOGLE_KEY) {
      return new Response(JSON.stringify({ error: "Google API Key missing" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Query-Parameter Parsing/Validation
    const q = url.searchParams.get("q") || undefined;
    const cuisine = url.searchParams.get("cuisine") || undefined;
    const location = url.searchParams.get("location");
    if (!location) {
      return new Response(JSON.stringify({ error: "Missing location" }), { status: 400, headers: corsHeaders });
    }
    const price_level = url.searchParams.get("price_level") ? parseNumber(url.searchParams.get("price_level")) : undefined;
    const open_now = url.searchParams.get("open_now") === "true";
    const min_rating = url.searchParams.get("min_rating") ? parseFloat(url.searchParams.get("min_rating")!) : undefined;

    const page = parseNumber(url.searchParams.get("page"), 1);
    const pageSize = Math.min(parseNumber(url.searchParams.get("pageSize"), 20), 50);

    // Advanced: Filterfelder (Stub, noch kein Effekt)
    // delivery, outdoor_seating, exclude_allergens später per Erweiterung

    // Google Places API Call (Text Search)
    let query = [cuisine, q, "restaurant", `in ${location}`].filter(Boolean).join(" ");
    const gUrl = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
    gUrl.searchParams.set("key", GOOGLE_KEY);
    gUrl.searchParams.set("query", query);
    if (price_level !== undefined) gUrl.searchParams.set("maxprice", String(price_level));
    if (open_now) gUrl.searchParams.set("opennow", "true");

    // Abfrage starten
    const gRes = await fetch(gUrl.toString());
    const gData = await gRes.json();

    // Mapping der Google-Antwort auf unser Schema + Filter nach min_rating (lokal)
    let items = (gData.results || []).filter((r: any) =>
      min_rating ? (r.rating ?? 0) >= min_rating : true
    ).map((r: any) => ({
      place_id: r.place_id,
      name: r.name,
      address: r.formatted_address || r.vicinity,
      vicinity: r.vicinity,
      rating: r.rating,
      photo_url: r.photos && r.photos[0] ?
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${r.photos[0].photo_reference}&key=${GOOGLE_KEY}` : undefined,
      price_level: r.price_level,
      menu_preview: [],
      geometry: r.geometry,
      types: r.types,
    }));

    // Menü-Preview via Firecrawl (Demo: leer; TODO: nachrüsten/caching/real scraping nach user)
    // Für MVP lassen wir menu_preview erstmal leer!

    // Pagination
    const total = items.length;
    const paged = items.slice((page - 1) * pageSize, (page) * pageSize);

    return new Response(JSON.stringify({
      data: paged,
      meta: { page, pageSize, total }
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
