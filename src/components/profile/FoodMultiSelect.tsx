
import React from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { useFoods } from "@/hooks/useFoods";

interface FoodMultiSelectProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
}

export const FoodMultiSelect: React.FC<FoodMultiSelectProps> = ({ selected, onChange, label }) => {
  const { t, i18n } = useTranslation();
  const { data: foods = [], isLoading } = useFoods();

  // food.name is { de, en, es, fr }
  const options = foods.map(
    (f: any) => ({
      value: f.slug || f.id,
      label: f.name?.[i18n.language] || f.name?.en || f.name?.de || f.slug
    })
  );
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
        placeholder={t("Auswählen...", "Auswählen...")}
        isLoading={isLoading}
      />
    </div>
  );
};
