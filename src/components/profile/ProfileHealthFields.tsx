
import React from "react";
import { useFormContext } from "react-hook-form";
import { useSafeT } from "@/hooks/useSafeT";
import { AllergiesCheckboxGroup } from "./AllergiesCheckboxGroup";
import { FoodMultiSelect } from "./FoodMultiSelect";
import { GoalsMultiSelect } from "./GoalsMultiSelect";
import { useFoods } from "@/hooks/useFoods";
import Select from "react-select";
import type { TranslationKey } from "@/types/i18n";

export const ProfileHealthFields: React.FC = () => {
  const { t, i18n } = useSafeT();
  const { data: foods = [] } = useFoods();
  const { setValue, watch } = useFormContext();

  const foodOptions = foods.map(f => ({
    value: f.slug || f.id,
    label: f.name?.[i18n.language] || f.name?.en || f.name?.de || f.slug,
  }));

  const GOAL_KEYS = [
    "weight_loss", "weight_maintenance", "muscle_gain", "high_protein", "low_carb",
    "vegan", "vegetarian", "keto", "paleo", "diabetic_friendly", "heart_health",
    "gut_health", "anti_inflammatory", "sustainable_eating", "flexitarian", "other"
  ] as const;
  
  const goalOptions = GOAL_KEYS.map(key => ({
    value: key,
    label: t(`profile.goals.${key}` as TranslationKey, key.replace('_', ' ')),
  }));

  function handleMultiChange(name: string, value: any) {
    setValue(name, value ? value.map((v: any) => v.value) : []);
  }

  return (
    <div className="space-y-6">
      <AllergiesCheckboxGroup
        label={t("profile.allergies.label", "Allergies")}
        selected={watch("allergies") || []}
        onChange={(value) => setValue("allergies", value)}
      />

      <div>
        <label className="block text-sm font-medium mb-1">
          {t("profile.favorite_foods.label", "Favorite Foods")}
        </label>
        <Select
          isMulti
          options={foodOptions}
          value={foodOptions.filter(o => (watch("favorite_foods") || []).includes(o.value))}
          onChange={val => handleMultiChange("favorite_foods", val)}
          classNamePrefix="react-select"
          placeholder={t("common.select", "Select...")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          {t("profile.disliked_foods.label", "Disliked Foods")}
        </label>
        <Select
          isMulti
          options={foodOptions}
          value={foodOptions.filter(o => (watch("disliked_foods") || []).includes(o.value))}
          onChange={val => handleMultiChange("disliked_foods", val)}
          classNamePrefix="react-select"
          placeholder={t("common.select", "Select...")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          {t("profile.goals.label", "Nutrition Goals")}
        </label>
        <Select
          isMulti
          options={goalOptions}
          value={goalOptions.filter(o => (watch("goals") || []).includes(o.value))}
          onChange={val => handleMultiChange("goals", val)}
          classNamePrefix="react-select"
          placeholder={t("common.select", "Select...")}
        />
      </div>

      <div className="rounded bg-yellow-50 border-l-4 border-yellow-600 px-3 py-2 text-yellow-900 text-sm mt-2">
        {t("profile.health.disclaimer", "This app is not a substitute for medical advice.")}
      </div>
    </div>
  );
};
