
import { serve } from "https://deno.land/x/sift/mod.ts";

// Harris-Benedict-Formel (vereinfachte Version)
function calcCalories({ gender, weight, height, age, activity }: 
  { gender: string, weight: number, height: number, age: number, activity: string }
): { calories: number, explanation: string } {
  // Basalumsatz in kcal
  let base = gender === "f"
    ? 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age)
    : 66 + (13.7 * weight) + (5 * height) - (6.8 * age);

  // Aktivitätsfaktor-Tabelle (vereinfachte Werte)
  let multiplier = 1.2; // Standard: wenig aktiv
  if (activity === "light") multiplier = 1.375;
  if (activity === "moderate") multiplier = 1.55;
  if (activity === "active") multiplier = 1.725;
  if (activity === "very_active") multiplier = 1.9;

  const calories = Math.round(base * multiplier);
  return {
    calories,
    explanation: "Empfohlene tägliche Kalorienzufuhr gemäß Harris-Benedict-Formel mit Aktivitätsfaktor."
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Nur POST erlaubt" }), { status: 405, headers: corsHeaders });
  }
  try {
    const body = await req.json();
    // Minimalvalidierung
    const { gender, weight, height, age, activity } = body;
    if (
      !gender || !["m", "f"].includes(gender) ||
      !weight || !height || !age ||
      typeof weight !== "number" || weight < 20 || weight > 250 ||
      typeof height !== "number" || height < 100 || height > 250 ||
      typeof age !== "number" || age < 5 || age > 120
    ) {
      return new Response(JSON.stringify({ error: "Ungültige Eingabe" }), { status: 400, headers: corsHeaders });
    }
    const validActivities = ["none","light","moderate","active","very_active"];
    if (!activity || !validActivities.includes(activity)) {
      return new Response(JSON.stringify({ error: "Ungültige Aktivität" }), { status: 400, headers: corsHeaders });
    }
    const result = calcCalories({ gender, weight, height, age, activity });
    return new Response(JSON.stringify(result), { headers: corsHeaders });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Fehler bei der Berechnung" }), { status: 500, headers: corsHeaders });
  }
});
