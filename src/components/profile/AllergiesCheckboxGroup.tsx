
import React from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";

const ALLERGEN_KEYS = [
  "gluten",
  "lactose",
  "nuts",
  "soy",
  "eggs",
  "fish",
  "shellfish",
  "sesame",
  "peanut",
  "nightshades",
  "histamine"
];

interface AllergiesCheckboxGroupProps {
  selected: string[];
  onChange: (value: string[]) => void;
  label: string;
}

export const AllergiesCheckboxGroup: React.FC<AllergiesCheckboxGroupProps> = ({ selected, onChange, label }) => {
  const { t } = useTranslation();

  const handleToggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter(item => item !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex flex-wrap gap-3">
        {ALLERGEN_KEYS.map((key) => (
          <label className="flex items-center gap-2 text-sm" key={key}>
            <Checkbox
              checked={selected.includes(key)}
              onCheckedChange={() => handleToggle(key)}
              aria-checked={selected.includes(key)}
            />
            <span>{t(`profile.allergies.${key}`)}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
