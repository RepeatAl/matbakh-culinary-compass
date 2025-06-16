
import React from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";

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
];

interface GoalsMultiSelectProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
}

export const GoalsMultiSelect: React.FC<GoalsMultiSelectProps> = ({ selected, onChange, label }) => {
  const { t } = useTranslation();

  const options = GOAL_KEYS.map(key => ({
    value: key,
    label: t(`profile.goals.${key}`)
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
