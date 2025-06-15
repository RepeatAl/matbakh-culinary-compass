
import React from "react";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

export function ProfileConsentCheckboxes() {
  const { register } = useFormContext();
  return (
    <div className="space-y-4 mt-4">
      <div className="flex gap-2 items-center">
        <Checkbox {...register("consent_agb")} />
        <span className="font-medium">AGB & Nutzungsbedingungen akzeptieren</span>
      </div>
      <div className="flex gap-2 items-center">
        <Checkbox {...register("consent_privacy")} />
        <span className="font-medium">Datenschutzerklärung akzeptieren</span>
      </div>
      <div className="flex gap-2 items-center">
        <Checkbox {...register("consent_marketing")} />
        <span>Marketing-E-Mails erhalten</span>
      </div>
    </div>
  );
}
