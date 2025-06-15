
import { serve } from "https://deno.land/x/sift/mod.ts";
import { z } from "https://deno.land/x/zod@v3.22.2/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

const formSchema = z.object({
  weight: z.number().positive(),
  height: z.number().positive(),
  age: z.number().int().positive(),
  gender: z.enum(["male", "female", "other"]),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  units: z.enum(["metric", "imperial"]).optional(),
});

function convertImperial({ weight, height }: {weight: number, height: number}): {weight: number, height: number} {
  // weight in lbs → kg, height in inches → cm
  return { weight: weight * 0.45359237, height: height * 2.54 };
}

function getActivityFactor(activity: string) {
  switch (activity) {
    case "sedentary": return 1.2;
    case "light": return 1.375;
    case "moderate": return 1.55;
    case "active": return 1.725;
    case "very_active": return 1.9;
    default: return 1.2;
  }
}

function calcBMR(gender: string, weight: number, height: number, age: number) {
  // Mifflin-St Jeor formula
  // For men:    BMR = 10*weight + 6.25*height − 5*age + 5
  // For women:  BMR = 10*weight + 6.25*height − 5*age − 161
  // For "other": average the two (neutral)
  if (gender === "male")
    return 10 * weight + 6.25 * height - 5 * age + 5;
  if (gender === "female")
    return 10 * weight + 6.25 * height - 5 * age - 161;
  // neutral version ("other")
  return 10 * weight + 6.25 * height - 5 * age - 78;
}

function getMacroRecommendations(tdee: number) {
  // Example: 50% carbs, 20% protein, 30% fat in grams
  // 1g carbs = 4 kcal, 1g protein = 4 kcal, 1g fat = 9 kcal
  const macros = {
    carbs: 0.5,
    protein: 0.2,
    fat: 0.3,
  };
  const grams = {
    carbs: Math.round((tdee * macros.carbs) / 4),
    protein: Math.round((tdee * macros.protein) / 4),
    fat: Math.round((tdee * macros.fat) / 9),
  };
  return {
    ratio: macros,
    grams,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST allowed" }), { status: 405, headers: corsHeaders });
  }

  try {
    const bodyRaw = await req.json();
    // Try to convert number strings to actual numbers for Zod
    const body = {
      ...bodyRaw,
      weight: typeof bodyRaw.weight === "string" ? parseFloat(bodyRaw.weight) : bodyRaw.weight,
      height: typeof bodyRaw.height === "string" ? parseFloat(bodyRaw.height) : bodyRaw.height,
      age: typeof bodyRaw.age === "string" ? parseInt(bodyRaw.age) : bodyRaw.age,
      units: bodyRaw.units,
    };
    const input = formSchema.safeParse(body);
    if (!input.success) {
      const errorMsg = input.error.errors.map(e => e.path[0] + ": " + e.message).join("; ");
      return new Response(JSON.stringify({ error: errorMsg }), { status: 400, headers: corsHeaders });
    }
    let { weight, height, age, gender, activityLevel, units = "metric" } = input.data;

    // Imperial conversion if necessary
    if (units === "imperial") {
      ({ weight, height } = convertImperial({ weight, height }));
    }

    const bmr = calcBMR(gender, weight, height, age);
    const factor = getActivityFactor(activityLevel);
    const tdee = Math.round(bmr * factor);

    const macros = getMacroRecommendations(tdee);

    return new Response(
      JSON.stringify({
        bmr: Math.round(bmr),
        tdee,
        units: "kcal/day",
        macros: {
          carbs: {
            grams: macros.grams.carbs,
            label: "Carbohydrates",
            ratio: 50,
          },
          protein: {
            grams: macros.grams.protein,
            label: "Protein",
            ratio: 20,
          },
          fat: {
            grams: macros.grams.fat,
            label: "Fat",
            ratio: 30,
          }
        }
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
});
