
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import RecipeMetaFields from "./RecipeMetaFields";
import RecipeIngredientsSection from "./RecipeIngredientsSection";
import RecipeFormActions from "./RecipeFormActions";

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
      quantity: z.preprocess(
        (v) => typeof v === "string" ? Number((v as string).replace(",", ".")) : v,
        z.number().min(0.01, { message: "Menge muss mindestens 0,01 sein." })
      ),
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
  const { user } = useAuth();

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

  async function onSubmit(values: FormValues) {
    if (!user) {
      toast({ title: t("myRecipes.errorSave"), description: "Not logged in", variant: "destructive" });
      return;
    }
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
      if (result.error) {
        toast({ title: t("myRecipes.errorSave"), description: result.error.message, variant: "destructive" });
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("recipes")
        .insert({
          user_id: user.id,
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

    // Zutaten syncen: alte löschen, neue einfügen
    if (recipeId) {
      await supabase.from("ingredients").delete().eq("recipe_id", recipeId);
      if (values.ingredients.length > 0) {
        const ingrPayload = values.ingredients.map((i) => ({
          recipe_id: recipeId,
          name: i.name,
          quantity: i.quantity,
          unit: i.unit,
        }));
        await supabase.from("ingredients").insert(ingrPayload);
      }
    }
    toast({ title: t("myRecipes.successSave") });
    onSaved();
  }

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
            <RecipeMetaFields />
            <RecipeIngredientsSection />
            <RecipeFormActions isEdit={!!existing} onDelete={onDelete} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
