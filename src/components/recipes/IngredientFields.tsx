
import { useFieldArray, useWatch, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

// type Ingredient = { name: string; quantity: number; unit?: string }; // Not needed here

function parseLocaleNumber(input: string, locale: string): number | "" {
  // Accepts comma OR dot as decimal separator
  if (input === "") return "";
  let normalized = input.trim().replace(",", ".");
  const n = Number(normalized);
  return isNaN(n) ? "" : n;
}

export default function IngredientFields() {
  const { t, i18n } = useTranslation();
  const { control, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "ingredients" });
  const ingredients = useWatch({ control, name: "ingredients" }) ?? [];

  // Decimal placeholder according to language
  const decPlaceholder = i18n.language === "de" || i18n.language === "fr" ? "0,5" : "0.5";

  return (
    <div className="flex flex-col space-y-2">
      {fields.map((field, idx) => (
        <div key={field.id} className="flex gap-2 items-center">
          <input
            className="input w-32"
            placeholder={t("myRecipes.ingrName")}
            {...control.register(`ingredients.${idx}.name`)}
          />
          <input
            className="input w-20"
            type="text"
            inputMode="decimal"
            placeholder={t("myRecipes.ingrQty") + ` (${decPlaceholder})`}
            value={ingredients[idx]?.quantity ?? ""}
            onChange={e => {
              const v = parseLocaleNumber(e.target.value, i18n.language);
              setValue(`ingredients.${idx}.quantity`, v, { shouldValidate: true });
            }}
            aria-label={t("myRecipes.ingrQty")}
          />
          <input
            className="input w-16"
            placeholder={t("myRecipes.ingrUnit")}
            {...control.register(`ingredients.${idx}.unit`)}
          />
          <Button type="button" variant="ghost" onClick={() => remove(idx)}><X /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => append({ name: "", quantity: "", unit: "" })}>
        + {t("myRecipes.addIngr")}
      </Button>
    </div>
  );
}
