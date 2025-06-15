
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { foodIds, maxResults } = body;

  if (!Array.isArray(foodIds) || foodIds.length === 0) {
    return new Response(JSON.stringify({ error: "foodIds is required and must be a non-empty array" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Default: maxResults pro Food = 3 (API Contract maxResults gilt für alle, nicht pro foodId!)
  const limit = typeof maxResults === "number" && maxResults > 0 && maxResults <= 20 ? maxResults : 3;

  // Suche passende Pairings aus DB
  try {
    // Alle food_pairings, wo food_id in foodIds
    const { data: pairings, error } = await supabase
      .from("food_pairings")
      .select("food_id, paired_with, confidence")
      .in("food_id", foodIds)
      .order("confidence", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Filter: maxResults pro Input-Food
    const result: any[] = [];
    for (const id of foodIds) {
      const matches = pairings
        .filter((row: any) => row.food_id === id)
        .slice(0, limit)
        .map((row: any) => ({
          foodId: row.food_id,
          pairedWith: row.paired_with,
          confidence: Number(row.confidence),
        }));
      result.push(...matches);
    }

    return new Response(JSON.stringify({ pairings: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Unhandled error:", e);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
