
import { useEffect, useState } from "react";
import { useFieldArray, useWatch, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

// type Ingredient = { name: string; quantity: number; unit?: string }; // Not needed here

function parseLocaleNumber(input: string, locale: string): number | "" {
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

  // Local state to remember the raw string values for each quantity input
  const [quantities, setQuantities] = useState<string[]>(() =>
    ingredients.map(ingr =>
      ingr?.quantity === "" || ingr?.quantity == null
        ? ""
        : (typeof ingr.quantity === "number"
            ? (i18n.language === "de" || i18n.language === "fr"
                ? ingr.quantity.toString().replace(".", ",")
                : ingr.quantity.toString()
              )
            : ingr.quantity
          )
    )
  );

  // Sync local state with fields/ingredients length (when adding/removing)
  useEffect(() => {
    if (ingredients.length !== quantities.length) {
      setQuantities(
        ingredients.map(ingr =>
          ingr?.quantity === "" || ingr?.quantity == null
            ? ""
            : (typeof ingr.quantity === "number"
                ? (i18n.language === "de" || i18n.language === "fr"
                    ? ingr.quantity.toString().replace(".", ",")
                    : ingr.quantity.toString()
                  )
                : ingr.quantity
              )
        )
      );
    }
    // eslint-disable-next-line
  }, [ingredients.length]); // Only when length changes

  // Decimal placeholder according to language
  const decPlaceholder = i18n.language === "de" || i18n.language === "fr" ? "0,5" : "0.5";

  const handleQuantityChange = (idx: number, value: string) => {
    const newQuantities = [...quantities];
    newQuantities[idx] = value;
    setQuantities(newQuantities);
  };

  const handleQuantityBlur = (idx: number, rawString: string) => {
    const num = parseLocaleNumber(rawString, i18n.language);
    setValue(`ingredients.${idx}.quantity`, num, { shouldValidate: true });
    // Optionally format back to proper string if desired, here left as user input
  };

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
            value={quantities[idx] ?? ""}
            onChange={e => handleQuantityChange(idx, e.target.value)}
            onBlur={e => handleQuantityBlur(idx, e.target.value)}
            aria-label={t("myRecipes.ingrQty")}
          />
          <input
            className="input w-16"
            placeholder={t("myRecipes.ingrUnit")}
            {...control.register(`ingredients.${idx}.unit`)}
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              remove(idx);
              // After remove, useEffect will sync local state
            }}
          >
            <X />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          append({ name: "", quantity: "", unit: "" });
          // After append, useEffect will sync local state
        }}
      >
        + {t("myRecipes.addIngr")}
      </Button>
    </div>
  );
}
