
import React from "react";
import { useTranslation } from "react-i18next";
import { AllergiesCheckboxGroup } from "./AllergiesCheckboxGroup";
import { FoodMultiSelect } from "./FoodMultiSelect";
import { GoalsMultiSelect } from "./GoalsMultiSelect";
import { useFoods } from "@/hooks/useFoods";
import { useProfileExt } from "@/hooks/useUserNutritionProfile";

export const ProfileHealthFields: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: profileExt } = useProfileExt();
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

  // Prepare food options from db
  const foodOptions = foods.map(f => ({
    value: f.slug || f.id,
    label: f.name?.[i18n.language] || f.name?.en || f.name?.de || f.slug,
  }));

  // Placeholders for update handlers since the new hook doesn't provide update mutation.
  const notifyNotEditable = () =>
    alert(t("profile.save_failed", "Speichern nicht möglich."));

  if (foodsLoading) return <div>{t("profile.loading")}</div>;
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
        onChange={notifyNotEditable}
      />
      <div className="rounded bg-yellow-50 border-l-4 border-yellow-600 px-3 py-2 text-yellow-900 text-sm mt-2">
        {t("profile.health.disclaimer")}
      </div>
    </div>
  );
};
