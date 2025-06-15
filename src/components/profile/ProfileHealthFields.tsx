
import React from "react";
import { useTranslation } from "react-i18next";
import { AllergiesCheckboxGroup } from "./AllergiesCheckboxGroup";
import { FoodMultiSelect } from "./FoodMultiSelect";
import { GoalsMultiSelect } from "./GoalsMultiSelect";
import { useUserProfileExt } from "@/hooks/useUserProfileExt";

export const ProfileHealthFields: React.FC = () => {
  const { t } = useTranslation();
  const { profileExt, updateProfileExt } = useUserProfileExt();

  if (!profileExt) return null;

  const handleAllergiesChange = (vals: string[]) => {
    updateProfileExt({ allergies: vals });
  };
  const handleFavoritesChange = (vals: string[]) => {
    updateProfileExt({ favorite_foods: vals });
  };
  const handleDislikedChange = (vals: string[]) => {
    updateProfileExt({ disliked_foods: vals });
  };
  const handleGoalsChange = (vals: string[]) => {
    updateProfileExt({ goals: vals });
  };

  return (
    <div className="space-y-6 mt-4">
      <AllergiesCheckboxGroup
        label={t("profile.allergies.label")}
        selected={profileExt.allergies || []}
        onChange={handleAllergiesChange}
      />
      <FoodMultiSelect
        label={t("profile.favorite_foods.label")}
        selected={profileExt.favorite_foods || []}
        onChange={handleFavoritesChange}
      />
      <FoodMultiSelect
        label={t("profile.disliked_foods.label")}
        selected={profileExt.disliked_foods || []}
        onChange={handleDislikedChange}
      />
      <GoalsMultiSelect
        label={t("profile.goals.label")}
        selected={profileExt.goals || []}
        onChange={handleGoalsChange}
      />
      <div className="rounded bg-yellow-50 border-l-4 border-yellow-600 px-3 py-2 text-yellow-900 text-sm mt-2">
        {t("profile.health.disclaimer", "Wichtiger Hinweis: Diese Angaben ersetzen keine medizinische/ärztliche Beratung. Im Zweifelsfall wenden Sie sich bitte an Ihren Arzt oder Ihre Ärztin.")}
      </div>
    </div>
  );
};
