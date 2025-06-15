
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import IngredientFields from "./IngredientFields";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Tables } from "@/integrations/supabase/types";

const recipeSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  prep_minutes: z.coerce.number().min(0).optional(),
  cook_minutes: z.coerce.number().min(0).optional(),
  servings: z.coerce.number().min(1),
  publish: z.boolean().default(false),
  ingredients: z.array(
    z.object({
      name: z.string().min(1),
      quantity: z.coerce.number().min(0),
      unit: z.string().optional(),
    })
  ),
});

type RecipeFormProps = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  existing: Tables<"recipes"> | null;
  onSaved: () => void;
};

type FormValues = z.infer<typeof recipeSchema>;

export default function RecipeForm({ open, onOpenChange, existing, onSaved }: RecipeFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: existing?.title ?? "",
      description: existing?.description ?? "",
      prep_minutes: existing?.prep_minutes ?? undefined,
      cook_minutes: existing?.cook_minutes ?? undefined,
      servings: existing?.servings ?? 1,
      publish: existing?.publish ?? false,
      ingredients: [],
    },
  });

  // Für edit: Lade Zutaten, wenn bestehend
  useEffect(() => {
    if (existing) {
      form.reset({
        title: existing.title,
        description: existing.description ?? "",
        prep_minutes: existing.prep_minutes ?? undefined,
        cook_minutes: existing.cook_minutes ?? undefined,
        servings: existing.servings ?? 1,
        publish: existing.publish ?? false,
        ingredients: [],
      });
      // Ingredients nachladen
      supabase
        .from("ingredients")
        .select("*")
        .eq("recipe_id", existing.id)
        .then(({ data }) => {
          form.setValue("ingredients", data ?? []);
        });
    } else {
      form.reset();
    }
    // eslint-disable-next-line
  }, [existing, open]);

  // Submit
  async function onSubmit(values: FormValues) {
    let recipeId = existing?.id;
    let result;
    if (existing) {
      result = await supabase
        .from("recipes")
        .update({
          title: values.title,
          description: values.description,
          prep_minutes: values.prep_minutes,
          cook_minutes: values.cook_minutes,
          servings: values.servings,
          publish: values.publish,
        })
        .eq("id", recipeId)
        .select()
        .single();
    } else {
      const { data, error } = await supabase
        .from("recipes")
        .insert({
          title: values.title,
          description: values.description,
          prep_minutes: values.prep_minutes,
          cook_minutes: values.cook_minutes,
          servings: values.servings,
          publish: values.publish,
        })
        .select()
        .single();

      if (error) {
        toast({ title: t("myRecipes.errorSave"), description: error.message, variant: "destructive" });
        return;
      }
      recipeId = data.id;
    }

    // Zutaten syncen
    if (recipeId) {
      // Bestehende Zutaten löschen, neue einfügen
      await supabase.from("ingredients").delete().eq("recipe_id", recipeId);
      if (values.ingredients.length > 0) {
        await supabase.from("ingredients").insert(
          values.ingredients.map((i) => ({
            ...i,
            recipe_id: recipeId,
          }))
        );
      }
    }
    toast({ title: t("myRecipes.successSave") });
    onSaved();
  }

  // Löschen
  async function onDelete() {
    if (!existing) return;
    const { error } = await supabase.from("recipes").delete().eq("id", existing.id);
    if (error) {
      toast({ title: t("myRecipes.errorDelete"), description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: t("myRecipes.successDelete") });
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existing ? t("myRecipes.formEdit") : t("myRecipes.formNew")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormItem>
              <FormLabel>{t("myRecipes.titleLabel")}</FormLabel>
              <FormControl>
                <input {...form.register("title")} className="input" />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>{t("myRecipes.descLabel")}</FormLabel>
              <FormControl>
                <textarea {...form.register("description")} className="textarea" />
              </FormControl>
            </FormItem>
            <div className="flex gap-2">
              <FormItem>
                <FormLabel>{t("myRecipes.prep")}</FormLabel>
                <FormControl>
                  <input type="number" {...form.register("prep_minutes")} className="input w-20" min={0} />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>{t("myRecipes.cook")}</FormLabel>
                <FormControl>
                  <input type="number" {...form.register("cook_minutes")} className="input w-20" min={0} />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>{t("myRecipes.servingsLabel")}</FormLabel>
                <FormControl>
                  <input type="number" {...form.register("servings")} className="input w-16" min={1} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
            <FormItem>
              <FormLabel>{t("myRecipes.ingredients")}</FormLabel>
              <FormControl>
                <IngredientFields control={form.control} />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>{t("myRecipes.publish")}</FormLabel>
              <FormControl>
                <input type="checkbox" {...form.register("publish")} />
              </FormControl>
            </FormItem>
            <div className="flex justify-between items-center gap-3 pt-2">
              <Button type="submit">{t("myRecipes.btnSave")}</Button>
              {existing && (
                <Button type="button" variant="destructive" onClick={onDelete}>{t("myRecipes.btnDelete")}</Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
