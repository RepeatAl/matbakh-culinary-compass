
import React from "react";
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

const ALLERGEN_OPTIONS = [
  "Gluten",
  "Laktose",
  "Nüsse",
  "Erdnüsse",
  "Fisch",
  "Schalentiere",
  "Soja",
  "Ei",
  "Sellerie",
  "Senf",
  "Sesam",
  "Lupinen",
  "Sulfite",
  "Weichtiere",
];

export function ProfileHealthFields() {
  const { t } = useTranslation();
  const { register, setValue, watch } = useFormContext();

  const allergies: string[] = watch("allergies") || [];
  const is_diabetic: boolean = watch("is_diabetic");
  const diabetes_type: string = watch("diabetes_type");

  function handleAllergyChange(allergy: string) {
    let newAllergies = allergies ? [...allergies] : [];
    if (newAllergies.includes(allergy)) {
      newAllergies = newAllergies.filter((a) => a !== allergy);
    } else {
      newAllergies.push(allergy);
    }
    setValue("allergies", newAllergies);
  }

  function handleDiabeticChange(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setValue("is_diabetic", checked);
    if (!checked) setValue("diabetes_type", "");
  }

  return (
    <div className="space-y-6 mt-4">
      {/* Allergene Auswahl */}
      <div>
        <Label className="mb-1 block">
          {t("profile.health.allergies_label", "Allergene (Mehrfachauswahl möglich)")}
        </Label>
        <div className="flex flex-wrap gap-3">
          {ALLERGEN_OPTIONS.map((a) => (
            <label className="flex items-center gap-2 text-sm" key={a}>
              <Checkbox
                checked={allergies?.includes(a)}
                onCheckedChange={() => handleAllergyChange(a)}
                aria-checked={allergies?.includes(a)}
              />
              <span>{a}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sonstige Allergien */}
      <div>
        <Label htmlFor="other_allergies" className="mb-1">
          {t("profile.health.other_allergies_label", "Sonstige Nahrungsmittelunverträglichkeiten")}
        </Label>
        <Textarea
          id="other_allergies"
          placeholder={t("profile.health.other_allergies_ph", "z.B. Apfel, Quinoa, ...")}
          {...register("other_allergies")}
        />
      </div>

      {/* Diabetes */}
      <div>
        <Label className="mb-1 block">
          {t("profile.health.diabetes_label", "Sind Sie Diabetiker?")}
        </Label>
        <div className="flex flex-row items-center gap-4">
          <input
            type="checkbox"
            id="is_diabetic"
            checked={is_diabetic}
            onChange={handleDiabeticChange}
            className="mr-2"
            {...register("is_diabetic")}
          />
          <span>{t("profile.health.diabetes_check", "Ja, ich bin Diabetiker/in")}</span>
        </div>
        {is_diabetic && (
          <div className="mt-2">
            <Label htmlFor="diabetes_type" className="mr-2">
              {t("profile.health.diabetes_type_label", "Typ:")}
            </Label>
            <select
              id="diabetes_type"
              className="border rounded px-2 py-1 bg-background"
              {...register("diabetes_type")}
              value={diabetes_type || ""}
              onChange={e => setValue("diabetes_type", e.target.value)}
            >
              <option value="">{t("profile.health.diabetes_type_none", "Bitte wählen ...")}</option>
              <option value="Typ I">Typ I</option>
              <option value="Typ II">Typ II</option>
            </select>
          </div>
        )}
      </div>

      {/* Sonstige Beschwerden */}
      <div>
        <Label htmlFor="other_conditions" className="mb-1">
          {t("profile.health.other_conditions_label", "Sonstige relevante Erkrankungen/Beschwerden")}
        </Label>
        <Textarea
          id="other_conditions"
          placeholder={t("profile.health.other_conditions_ph", "z.B. Zöliakie, Reizdarm, ...")}
          {...register("other_conditions")}
        />
      </div>

      {/* Disclaimer */}
      <div className="rounded bg-yellow-50 border-l-4 border-yellow-600 px-3 py-2 text-yellow-900 text-sm mt-2">
        {t(
          "profile.health.disclaimer",
          "Wichtiger Hinweis: Diese Angaben ersetzen keine medizinische/ärztliche Beratung. Im Zweifelsfall wenden Sie sich bitte an Ihren Arzt oder Ihre Ärztin."
        )}
      </div>
    </div>
  );
}
