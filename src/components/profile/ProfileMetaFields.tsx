
import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

export function ProfileMetaFields() {
  const { register, formState: { errors } } = useFormContext();
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="first_name" className="block text-sm font-medium mb-1">{t("profile.first_name")}</label>
        <Input
          id="first_name"
          placeholder={t("profile.first_name")}
          {...register("first_name", { required: true })}
        />
        {errors.first_name && <span className="text-destructive text-xs">{t("profile.first_name_error")}</span>}
      </div>
      <div>
        <label htmlFor="last_name" className="block text-sm font-medium mb-1">{t("profile.last_name")}</label>
        <Input
          id="last_name"
          placeholder={t("profile.last_name")}
          {...register("last_name", { required: true })}
        />
        {errors.last_name && <span className="text-destructive text-xs">{t("profile.last_name_error")}</span>}
      </div>
      <div>
        <label htmlFor="language" className="block text-sm font-medium mb-1">{t("profile.language_label")}</label>
        <select
          id="language"
          className="block w-full border rounded-md px-3 py-2 bg-background"
          {...register("language", { required: true })}
        >
          <option value="de">Deutsch</option>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
        {errors.language && <span className="text-destructive text-xs">{t("profile.language_error")}</span>}
      </div>
    </div>
  );
}
