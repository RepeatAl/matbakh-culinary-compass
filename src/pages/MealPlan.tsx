
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import MealPlanTable from "@/components/mealplan/MealPlanTable";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { startOfWeek, format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

export default function MealPlan() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [mealPlan, setMealPlan] = useState<Tables<"meal_plans"> | null>(null);
  const [loading, setLoading] = useState(true);

  const safeT = (key: string, fallback?: string) => {
    const translation = t(key);
    
    if (import.meta.env.DEV && translation === key && fallback) {
      console.warn(`🔍 i18n: Missing translation for "${key}" in language "${i18n.language}"`);
      return `${fallback} [${key}]`;
    }
    
    return translation !== key ? translation : fallback || key;
  };

  // Finde/Erstelle meal_plan der aktuellen Woche (Mo)
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (!user) return;
      const monday = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
      let { data, error } = await supabase
        .from("meal_plans")
        .select("*")
        .eq("user_id", user.id)
        .eq("week_start", monday)
        .maybeSingle();
      if (!data) {
        // Anlegen für User
        const { data: created, error: createError } = await supabase
          .from("meal_plans")
          .insert({ user_id: user.id, week_start: monday })
          .select()
          .single();
        if (createError) {
          toast({ title: safeT("mealPlan.error", "Fehler"), description: createError.message, variant: "destructive" });
        }
        setMealPlan(created ?? null);
      } else {
        setMealPlan(data);
      }
      setLoading(false);
    };
    load();
    // eslint-disable-next-line
  }, [user]);

  if (loading) return <div>{safeT("mealPlan.loading", "Wird geladen...")}</div>;
  if (!mealPlan) return <div>{safeT("mealPlan.error", "Fehler beim Laden des Speiseplans")}</div>;

  return (
    <div className="container mx-auto px-2 py-6">
      <h1 className="text-2xl font-bold mb-4">{safeT("mealPlan.title", "Mein Wochenplan")}</h1>
      <MealPlanTable mealPlan={mealPlan} />
    </div>
  );
}
