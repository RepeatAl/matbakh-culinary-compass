
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export default function RecipeMetaFields() {
  const { t } = useTranslation();
  const { register } = useFormContext();

  return (
    <>
      <FormItem>
        <FormLabel>{t("myRecipes.titleLabel")}</FormLabel>
        <FormControl>
          <input {...register("title")} className="input" />
        </FormControl>
        <FormMessage />
      </FormItem>
      <FormItem>
        <FormLabel>{t("myRecipes.descLabel")}</FormLabel>
        <FormControl>
          <textarea {...register("description")} className="textarea" />
        </FormControl>
      </FormItem>
      <div className="flex gap-2">
        <FormItem>
          <FormLabel>{t("myRecipes.prep")}</FormLabel>
          <FormControl>
            <input type="number" {...register("prep_minutes")} className="input w-20" min={0} />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>{t("myRecipes.cook")}</FormLabel>
          <FormControl>
            <input type="number" {...register("cook_minutes")} className="input w-20" min={0} />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>{t("myRecipes.servingsLabel")}</FormLabel>
          <FormControl>
            <input type="number" {...register("servings")} className="input w-16" min={1} required />
          </FormControl>
          <FormMessage />
        </FormItem>
      </div>
      <FormItem>
        <FormLabel>{t("myRecipes.publish")}</FormLabel>
        <FormControl>
          <input type="checkbox" {...register("publish")} />
        </FormControl>
      </FormItem>
    </>
  );
}
