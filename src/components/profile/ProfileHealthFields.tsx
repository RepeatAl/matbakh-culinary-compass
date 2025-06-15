
import React from "react";
import { useTranslation } from "react-i18next";
import { AllergiesCheckboxGroup } from "./AllergiesCheckboxGroup";
import { FoodMultiSelect } from "./FoodMultiSelect";
import { GoalsMultiSelect } from "./GoalsMultiSelect";
import { useFoods } from "@/hooks/useFoods";
import { useProfileExt } from "@/hooks/useUserNutritionProfile"; // Corrected import

export const ProfileHealthFields: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: profileExt } = useProfileExt(); // Fixed: new signature
  const { data: foods = [], isLoading: foodsLoading } = useFoods();

  // Define allergen and goal lists as specified
  const allergyOptions = [
    { value: 'gluten', label: t("profile.allergies.gluten") },
    { value: 'lactose', label: t("profile.allergies.lactose") },
    { value: 'nuts', label: t("profile.allergies.nuts") },
    { value: 'soy', label: t("profile.allergies.soy") },
    { value: 'eggs', label: t("profile.allergies.eggs") },
    { value: 'fish', label: t("profile.allergies.fish") },
    { value: 'shellfish', label: t("profile.allergies.shellfish") },
    { value: 'sesame', label: t("profile.allergies.sesame") },
    { value: 'peanut', label: t("profile.allergies.peanut") },
    { value: 'nightshades', label: t("profile.allergies.nightshades") },
    { value: 'histamine', label: t("profile.allergies.histamine") },
  ];

  const goalsOptions = [
    { value: "weight_loss", label: t("profile.goals.weight_loss") },
    { value: "weight_maintenance", label: t("profile.goals.weight_maintenance") },
    { value: "muscle_gain", label: t("profile.goals.muscle_gain") },
    { value: "high_protein", label: t("profile.goals.high_protein") },
    { value: "low_carb", label: t("profile.goals.low_carb") },
    { value: "vegan", label: t("profile.goals.vegan") },
    { value: "vegetarian", label: t("profile.goals.vegetarian") },
    { value: "keto", label: t("profile.goals.keto") },
    { value: "paleo", label: t("profile.goals.paleo") },
    { value: "diabetic_friendly", label: t("profile.goals.diabetic_friendly") },
    { value: "heart_health", label: t("profile.goals.heart_health") },
    { value: "gut_health", label: t("profile.goals.gut_health") },
    { value: "anti_inflammatory", label: t("profile.goals.anti_inflammatory") },
    { value: "sustainable_eating", label: t("profile.goals.sustainable_eating") },
    { value: "flexitarian", label: t("profile.goals.flexitarian") },
    { value: "other", label: t("profile.goals.other") },
  ];

  // Prepare food options from db (dynamically, using the translated name)
  const foodOptions = foods.map(f => ({
    value: f.slug || f.id,
    label: f.name?.[i18n.language] || f.name?.en || f.name?.de || f.slug,
  }));

  // Placeholders for update handlers since the new hook doesn't provide update mutation.
  const notifyNotEditable = () =>
    alert(t("Diese Funktion ist aktuell nur lesbar."));

  // Defensive: if the profile is loading or missing
  if (foodsLoading) return <div>{t("Lade Daten...")}</div>;
  if (!profileExt) return null;

  return (
    <div className="space-y-6 mt-4">
      <AllergiesCheckboxGroup
        label={t("profile.allergies.label")}
        selected={profileExt.allergies || []}
        onChange={notifyNotEditable}
      />
      <FoodMultiSelect
        label={t("profile.favorite_foods.label")}
        selected={profileExt.favorite_foods || []}
        onChange={notifyNotEditable}
      />
      <FoodMultiSelect
        label={t("profile.disliked_foods.label")}
        selected={profileExt.disliked_foods || []}
        onChange={notifyNotEditable}
      />
      <GoalsMultiSelect
        label={t("profile.goals.label")}
        selected={profileExt.goals || []}
        options={goalsOptions}
        onChange={notifyNotEditable}
      />
      <div className="rounded bg-yellow-50 border-l-4 border-yellow-600 px-3 py-2 text-yellow-900 text-sm mt-2">
        {t("profile.health.disclaimer", "Wichtiger Hinweis: Diese Angaben ersetzen keine medizinische/ärztliche Beratung. Im Zweifelsfall wenden Sie sich bitte an Ihren Arzt oder Ihre Ärztin.")}
      </div>
    </div>
  );
};
