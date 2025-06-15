
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

// Hilfsfunktion für Logging der Parameter
function debugLogParams(params: Record<string, any>) {
  console.log("===== Matbakh BUSINESS SEARCH Debug-Request Params =====");
  Object.entries(params).forEach(([k, v]) => {
    console.log(`  ${k}: ${JSON.stringify(v)}`);
  });
  console.log("--------------------------------------------------------");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const url = new URL(req.url);

    const GOOGLE_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY");
    // Logging zum Debug
    console.log("GOOGLE_MAPS_API_KEY:", GOOGLE_KEY ? `[${GOOGLE_KEY.slice(0,8)}...${GOOGLE_KEY.slice(-6)}]` : "NICHT GESETZT (undefined/null)");
    if (!GOOGLE_KEY) {
      return new Response(JSON.stringify({ error: "Google API Key missing in Edge Function (GOOGLE_MAPS_API_KEY)" }), {
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

    // Debug-Log aller eingehenden Such-Parameter
    debugLogParams({q, cuisine, location, price_level, open_now, min_rating, page, pageSize});

    // PLACEHOLDER: Falls Testdaten-Trigger aktiv (location=DEBUG-TEST), gebe DUMMY-Daten aus!
    if (location && location.toUpperCase() === "DEBUG-TEST") {
      console.log("[Matbakh] Sende Demo/Testdaten zurück (location=DEBUG-TEST)");
      return new Response(JSON.stringify({
        data: [
          {
            place_id: "debug1",
            name: "DEMO – Restaurant Paradeis",
            address: "DEMO-Straße 1, 12345 Teststadt",
            vicinity: "Teststadt",
            rating: 4.8,
            location: { lat: 52.52, lng: 13.41 },
            photo_url: undefined,
            price_level: 2,
            menu_preview: ["Pizza Margherita", "Caprese", "Tiramisu"],
            geometry: { location: { lat: 52.52, lng: 13.41 } },
            types: ["restaurant", "food"],
          },
        ],
        meta: { page: 1, pageSize: 1, total: 1 }
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
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

    // Fehlerdiagnose: Falls Google API einen Fehler liefert, loggen wir das ausführlich:
    if (gData.error_message) {
      console.error("[Matbakh] Google Places API Fehler:", gData.error_message, gData);
      return new Response(JSON.stringify({
        error: "Google Places API Fehler",
        details: gData.error_message,
        gUrl: gUrl.toString(),
        queryUsed: query,
        params: {q, cuisine, location, price_level, open_now, min_rating, page, pageSize},
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Mapping der Google-Antwort auf unser Schema + Filter nach min_rating (lokal)
    let items = (gData.results || []).filter((r: any) =>
      min_rating ? (r.rating ?? 0) >= min_rating : true
    ).map((r: any) => ({
      place_id: r.place_id,
      name: r.name,
      address: r.formatted_address || r.vicinity,
      vicinity: r.vicinity,
      rating: r.rating,
      location: r.geometry?.location ? {
        lat: r.geometry.location.lat,
        lng: r.geometry.location.lng
      } : undefined,
      photo_url: r.photos && r.photos[0] ?
        // Bilder holen IMMER mit Backend-Key!
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${r.photos[0].photo_reference}&key=${GOOGLE_KEY}` : undefined,
      price_level: r.price_level,
      menu_preview: [],
      geometry: r.geometry,
      types: r.types,
    }));

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
    console.error("[Matbakh] Edge Function (business-search) Fehler:", e);
    return new Response(JSON.stringify({
      error: String(e),
      stack: e?.stack || "",
      info: "Matbakh Fehler in Edge Function",
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
