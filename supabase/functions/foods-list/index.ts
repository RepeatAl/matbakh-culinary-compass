
import { serve } from "https://deno.land/x/sift/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Supabase-Initialisierung (Service Role Key notwendig für Serverkontext)
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// CORS-Header wie gefordert
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "apikey, Authorization, Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

serve(async (req) => {
  // Preflight/Options-Request sofort mit Header beantworten
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Nur GET ist erlaubt
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  // Query: Die wichtigsten Felder sortiert nach deutschem Namen (Fallback: slug falls name.de fehlt)
  const { data, error } = await supabase
    .from("foods")
    .select("id, slug, name, category")
    .order("name->>de", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
    });
  }

  return new Response(JSON.stringify(data ?? []), {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    },
  });
});
