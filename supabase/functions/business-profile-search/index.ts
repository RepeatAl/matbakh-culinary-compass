
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { query, location } = await req.json();

    // Google Business API (Places API) Endpoint:
    // Search businesses for a query+location (Text Search)
    const API_KEY = Deno.env.get("GOOGLE_BUSINESS_API_KEY");
    const params = new URLSearchParams({
      query: `${query} ${location || ""}`.trim(),
      key: API_KEY ?? "",
    });

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?${params.toString()}`;

    const res = await fetch(url);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
