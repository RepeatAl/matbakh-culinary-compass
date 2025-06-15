
import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

const LANG_OPTIONS = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
];

export function ProfileMetaFields() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="first_name" className="block text-sm font-medium mb-1">Vorname</label>
        <Input
          id="first_name"
          placeholder="Vorname"
          {...register("first_name", { required: true })}
        />
        {errors.first_name && <span className="text-destructive text-xs">Vorname ist erforderlich</span>}
      </div>
      <div>
        <label htmlFor="last_name" className="block text-sm font-medium mb-1">Nachname</label>
        <Input
          id="last_name"
          placeholder="Nachname"
          {...register("last_name", { required: true })}
        />
        {errors.last_name && <span className="text-destructive text-xs">Nachname ist erforderlich</span>}
      </div>
      <div>
        <label htmlFor="language" className="block text-sm font-medium mb-1">Sprache</label>
        <select
          id="language"
          className="block w-full border rounded-md px-3 py-2 bg-background"
          {...register("language", { required: true })}
        >
          {LANG_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.language && <span className="text-destructive text-xs">Bitte Sprache wählen</span>}
      </div>
    </div>
  );
}
