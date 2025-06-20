
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
  console.log("Foods-list function called with method:", req.method);
  
  // Preflight/Options-Request sofort mit Header beantworten
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Nur GET ist erlaubt
  if (req.method !== "GET") {
    console.log("Method not allowed:", req.method);
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  try {
    console.log("Fetching foods from database...");
    
    // Query: Die wichtigsten Felder sortiert nach deutschem Namen (Fallback: slug falls name.de fehlt)
    const { data, error } = await supabase
      .from("foods")
      .select("id, slug, name, category")
      .order("name->>de", { ascending: true });

    if (error) {
      console.error("Database error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
      });
    }

    console.log("Foods fetched successfully, count:", data?.length || 0);

    return new Response(JSON.stringify(data ?? []), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
    });
  } catch (error) {
    console.error("Unexpected error in foods-list function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
    });
  }
});
