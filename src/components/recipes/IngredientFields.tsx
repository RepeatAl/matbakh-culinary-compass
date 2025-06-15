
import { Control, useFieldArray, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

type Ingredient = {
  name: string;
  quantity: number;
  unit?: string;
};
type Props = { control: Control<any> };

export default function IngredientFields({ control }: Props) {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({ control, name: "ingredients" });
  const ingredients = useWatch({ control, name: "ingredients" }) ?? [];

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
            type="number"
            min={0}
            placeholder={t("myRecipes.ingrQty")}
            {...control.register(`ingredients.${idx}.quantity`)}
          />
          <input
            className="input w-16"
            placeholder={t("myRecipes.ingrUnit")}
            {...control.register(`ingredients.${idx}.unit`)}
          />
          <Button type="button" variant="ghost" onClick={() => remove(idx)}><X /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => append({ name: "", quantity: 0, unit: "" })}>
        + {t("myRecipes.addIngr")}
      </Button>
    </div>
  );
}
