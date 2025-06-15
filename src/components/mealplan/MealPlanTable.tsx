
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tables, Enums } from "@/integrations/supabase/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, startOfWeek } from "date-fns";

const days: Enums<"weekday_short">[] = ["mon","tue","wed","thu","fri","sat","sun"];
const meals: Enums<"meal_type">[] = ["breakfast","lunch","dinner"];

export default function MealPlanTable({ mealPlan }: { mealPlan: Tables<"meal_plans"> }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [items, setItems] = useState<Tables<"meal_plan_items">[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [cell, setCell] = useState<{ day: string; meal: string } | null>(null);
  const [allRecipes, setAllRecipes] = useState<{ id: string; title: string }[]>([]);
  const [selected, setSelected] = useState<string>("");

  // Lade Mealplan-Items
  useEffect(() => {
    supabase.from("meal_plan_items").select("*").eq("meal_plan_id", mealPlan.id)
      .then(({ data }) => setItems(data ?? []));
  }, [mealPlan]);

  // Lade Rezepte (publ+own)
  useEffect(() => {
    (async () => {
      const { data: pub } = await supabase.from("recipes").select("id, title").eq("publish", true);
      const { data: own } = await supabase.from("recipes").select("id, title").eq("user_id", mealPlan.user_id);
      const all = [...(pub ?? []), ...(own ?? [])];
      // Duplikate raus (Map per id)
      const map = new Map(all.map(r => [r.id, r]));
      setAllRecipes(Array.from(map.values()));
    })();
  }, [mealPlan.user_id]);

  const cellItem = (d: string, m: string) =>
    items.find(i => i.weekday === d && i.meal === m);

  // Zelle Bearbeiten (Dialog)
  const openCell = (d: string, m: string) => {
    setCell({ day: d, meal: m });
    setShowDialog(true);
    setSelected(cellItem(d, m)?.recipe_id ?? "");
  };

  const saveItem = async () => {
    if (!cell) return;
    const exist = cellItem(cell.day, cell.meal);
    let res;
    if (selected) {
      // Upsert item
      if (exist) {
        res = await supabase
          .from("meal_plan_items")
          .update({ recipe_id: selected })
          .eq("id", exist.id)
          .select();
      } else {
        res = await supabase
          .from("meal_plan_items")
          .insert({
            meal_plan_id: mealPlan.id,
            weekday: cell.day as Enums<"weekday_short">,
            meal: cell.meal as Enums<"meal_type">,
            recipe_id: selected,
          })
          .select();
      }
    } else if (exist) {
      // Löschen (kein Rezept gewählt)
      res = await supabase.from("meal_plan_items").delete().eq("id", exist.id);
    }
    setShowDialog(false);
    // Reload
    const { data } = await supabase.from("meal_plan_items").select("*").eq("meal_plan_id", mealPlan.id);
    setItems(data ?? []);
    toast({ title: t("mealPlan.success") });
  };

  // Hilfsfunktionen für Labels
  const dayLabel = (d: string) => t(`mealPlan.day.${d}`, d);
  const mealLabel = (m: string) => t(`mealPlan.meal.${m}`, m);

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-max w-full border rounded shadow">
        <thead>
          <tr>
            <th></th>
            {days.map((d) => <th key={d}>{dayLabel(d)}</th>)}
          </tr>
        </thead>
        <tbody>
          {meals.map((meal) => (
            <tr key={meal}>
              <td className="font-semibold">{mealLabel(meal)}</td>
              {days.map((day) => (
                <td key={day} className="h-20 w-32 relative group" tabIndex={0}>
                  <Button variant="ghost" className="w-full h-full" onClick={() => openCell(day, meal)}>
                    {allRecipes.find(r => r.id === cellItem(day, meal)?.recipe_id)?.title || (
                      <span className="text-muted-foreground">{t("mealPlan.empty")}</span>
                    )}
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("mealPlan.selectRecipeTitle")}</DialogTitle>
          </DialogHeader>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger>
              <SelectValue placeholder={t("mealPlan.selectRecipe")} />
            </SelectTrigger>
            <SelectContent>
              {allRecipes.map((r) => (
                <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
              ))}
              <SelectItem value="">{t("mealPlan.noRecipe")}</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button" onClick={saveItem}>{t("mealPlan.btnSave")}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
