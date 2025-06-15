
import React, { useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useFoods } from "@/hooks/useFoods";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Allergie-Optionen – Keys für potentielle i18n-Anbindung
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
  const { t, i18n } = useTranslation();
  const { register, setValue, watch, control } = useFormContext();
  const { data: foods = [], isLoading } = useFoods();

  const allergies: string[] = watch("allergies") || [];
  const is_diabetic: boolean = watch("is_diabetic");
  const diabetes_type: string = watch("diabetes_type");

  // Helper für Food-Optionen (ID, Label) – i18n Support
  const foodOptions = useMemo(
    () =>
      foods.map(f => ({
        value: f.slug,
        label: f.name?.[i18n.language] || f.name?.de || f.slug,
        category: f.category,
      })),
    [foods, i18n.language]
  );

  // Ernährungsziele (Trend-Liste, quickstart)
  const goalsOptions = [
    { value: "abnehmen", label: t("nutrition.goals.weight_loss", "Abnehmen") },
    { value: "muskelaufbau", label: t("nutrition.goals.muscle_gain", "Muskelaufbau") },
    { value: "allergiefrei", label: t("nutrition.goals.allergy_free", "Allergiefrei") },
    { value: "energie", label: t("nutrition.goals.energy", "Mehr Energie") },
    { value: "vegan", label: t("nutrition.goals.vegan", "Vegan") },
    { value: "vegetarisch", label: t("nutrition.goals.vegetarian", "Vegetarisch") },
    { value: "paleo", label: t("nutrition.goals.paleo", "Paleo") },
  ];

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

  // MultiSelect Wrapper für react-select (Food/Goals)
  function MultiSelectField({ name, label, options }: {
    name: string;
    label: string;
    options: { value: string; label: string }[];
  }) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="mb-2">
            <Label className="block text-sm font-medium mb-1">{label}</Label>
            <Select
              isMulti
              name={name}
              options={options}
              value={options.filter(opt => Array.isArray(field.value) && field.value.includes(opt.value))}
              onChange={(selected) => field.onChange((selected as any[]).map(item => item.value))}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder={t("profile.select_placeholder", "Auswählen...")}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isDisabled={isLoading}
              styles={{
                option: (base, state) => ({
                  ...base,
                  paddingLeft: 28,
                  position: "relative",
                  // Zeigt Checkboxen im Dropdown (benötigt react-select CSS/Prefix)
                  ':before': {
                    content: '""',
                    position: 'absolute',
                    left: 5,
                    top: 8,
                    width: 14,
                    height: 14,
                    border: '1.5px solid #aaa',
                    borderRadius: 3,
                    background: state.isSelected ? '#2563eb' : '#fff',
                  }
                }),
                multiValue: (base) => ({
                  ...base,
                  background: "#f1f5f9",
                  color: "#111"
                }),
                // evtl. noch mehr Styles für Lesbarkeit!
              }}
              theme={theme => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#2563eb",
                  primary25: "#eff6ff",
                  neutral10: "#cbd5e1"
                }
              })}
            />
          </div>
        )}
      />
    );
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
              <span>{t(`allergies.${a.toLowerCase()}`, a)}</span>
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

      {/* Lieblingslebensmittel */}
      <MultiSelectField
        name="favorite_foods"
        label={t("profile.health.favorite_foods_label", "Lieblingslebensmittel")}
        options={foodOptions}
      />

      {/* Nicht gemochte Lebensmittel */}
      <MultiSelectField
        name="disliked_foods"
        label={t("profile.health.disliked_foods_label", "Nicht gerne essen")}
        options={foodOptions}
      />

      {/* Ernährungsziele */}
      <MultiSelectField
        name="goals"
        label={t("profile.health.goals_label", "Ernährungsziele")}
        options={goalsOptions}
      />

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
