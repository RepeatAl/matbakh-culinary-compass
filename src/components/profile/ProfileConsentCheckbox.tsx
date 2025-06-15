
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  label: string;
  date?: string | null;
  value: boolean;
  onChange: () => void;
  required?: boolean;
};

export default function ProfileConsentCheckbox({ label, date, value, onChange, required }: Props) {
  return (
    <label className="flex gap-2 items-center cursor-pointer">
      <Checkbox checked={value} onCheckedChange={onChange} required={required} />
      <span className={required ? "font-medium" : ""}>{label}</span>
      {value && date && (
        <span className="text-xs text-muted-foreground ml-2">
          ({new Date(date).toLocaleDateString()})
        </span>
      )}
    </label>
  );
}
