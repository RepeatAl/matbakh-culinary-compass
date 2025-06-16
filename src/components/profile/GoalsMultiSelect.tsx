
import React from "react";
import { useSafeT } from "@/hooks/useSafeT";
import Select from "react-select";
import type { TranslationKey } from "@/types/i18n";

const GOAL_KEYS = [
  "weight_loss",
  "weight_maintenance",
  "muscle_gain",
  "high_protein",
  "low_carb",
  "vegan",
  "vegetarian",
  "keto",
  "paleo",
  "diabetic_friendly",
  "heart_health",
  "gut_health",
  "anti_inflammatory",
  "sustainable_eating",
  "flexitarian",
  "other"
] as const;

interface GoalsMultiSelectProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
}

export const GoalsMultiSelect: React.FC<GoalsMultiSelectProps> = ({ selected, onChange, label }) => {
  const { t } = useSafeT();

  const options = GOAL_KEYS.map(key => ({
    value: key,
    label: t(`profile.goals.${key}` as TranslationKey, key.replace('_', ' '))
  }));

  const valueOptions = options.filter(opt => selected?.includes(opt.value));
  return (
    <div className="mb-2">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Select
        isMulti
        name={label}
        options={options}
        value={valueOptions}
        onChange={(selected) => onChange(Array.isArray(selected) ? selected.map(item => item.value) : [])}
        className="react-select-container"
        classNamePrefix="react-select"
        placeholder={t("common.select", "Select...")}
      />
    </div>
  );
};
