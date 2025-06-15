
import IngredientFields from "./IngredientFields";
import { useTranslation } from "react-i18next";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";

export default function RecipeIngredientsSection() {
  const { t } = useTranslation();

  return (
    <FormItem>
      <FormLabel>{t("myRecipes.ingredients")}</FormLabel>
      <FormControl>
        <IngredientFields />
      </FormControl>
    </FormItem>
  );
}
