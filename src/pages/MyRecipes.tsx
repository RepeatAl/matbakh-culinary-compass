
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import RecipeForm from "@/components/recipes/RecipeForm";
import { useAuth } from "@/contexts/AuthContext";

export default function MyRecipes() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth(); // KORREKT: User-Objekt aus Provider
  const [recipes, setRecipes] = useState<Tables<"recipes">[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editRecipe, setEditRecipe] = useState<Tables<"recipes"> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    setLoading(true);
    if (!user) return;
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: t("myRecipes.errorLoading"), description: error.message, variant: "destructive" });
    }
    setRecipes(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line
  }, [user]);

  const handleEdit = (recipe: Tables<"recipes">) => {
    setEditRecipe(recipe);
    setIsOpen(true);
  };

  const handleNew = () => {
    setEditRecipe(null);
    setIsOpen(true);
  };

  const onSaved = () => {
    fetchRecipes();
    setIsOpen(false);
    setEditRecipe(null);
  };

  return (
    <div className="container mx-auto px-2 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{t("myRecipes.title")}</h1>
        <Button onClick={handleNew}>{t("myRecipes.btnNew")}</Button>
      </div>
      {loading ? (
        <div>{t("myRecipes.loading")}</div>
      ) : (
        <ul className="space-y-2">
          {recipes.map((r) => (
            <li key={r.id} className="border rounded shadow-sm px-4 py-2 flex items-center justify-between">
              <div>
                <div className="font-semibold">{r.title}</div>
                <span className="text-muted-foreground text-xs">{t("myRecipes.servings", { count: r.servings })}</span>
                {r.publish && (
                  <span className="ml-2 inline-block px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">{t("myRecipes.published")}</span>
                )}
              </div>
              <Button size="sm" onClick={() => handleEdit(r)}>
                {t("myRecipes.btnEdit")}
              </Button>
            </li>
          ))}
        </ul>
      )}
      <RecipeForm open={isOpen} onOpenChange={setIsOpen} existing={editRecipe} onSaved={onSaved} />
    </div>
  );
}
