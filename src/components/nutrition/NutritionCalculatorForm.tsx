import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const GENDER_OPTIONS = [
  { value: "male", label: "nutrition.calc.gender.male" },
  { value: "female", label: "nutrition.calc.gender.female" },
];

const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "nutrition.calc.activity.sedentary" },
  { value: "light", label: "nutrition.calc.activity.light" },
  { value: "moderate", label: "nutrition.calc.activity.moderate" },
  { value: "active", label: "nutrition.calc.activity.active" },
  { value: "very_active", label: "nutrition.calc.activity.very_active" },
];

// API endpoint Konstante (immer vollständige URL für Vercel etc)
const NUTRITION_CALC_ENDPOINT =
  "https://eztmmerfuxcgmggewvaq.functions.supabase.co/nutrition-calc";

export function NutritionCalculatorForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "",
    activityLevel: "",
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const {
    mutate,
    status,
    data,
    error,
    reset,
  } = useMutation({
    mutationFn: async (values: typeof form) => {
      // Convert inputs for API
      const payload = {
        weight: Number(values.weight),
        height: Number(values.height),
        age: Number(values.age),
        gender: values.gender,
        activityLevel: values.activityLevel,
      };
      const res = await fetch(
        "https://eztmmerfuxcgmggewvaq.functions.supabase.co/nutrition-calc",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Fehler bei der Berechnung.");
      }
      return res.json();
    },
  });

  function validate() {
    const errs: { [k: string]: string } = {};
    if (!form.weight || isNaN(Number(form.weight)) || Number(form.weight) < 20 || Number(form.weight) > 250)
      errs.weight = t("nutrition.calc.error.weight");
    if (!form.height || isNaN(Number(form.height)) || Number(form.height) < 100 || Number(form.height) > 250)
      errs.height = t("nutrition.calc.error.height");
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 5 || Number(form.age) > 120)
      errs.age = t("nutrition.calc.error.age");
    if (form.gender !== "male" && form.gender !== "female")
      errs.gender = t("nutrition.calc.error.gender");
    if (
      ![
        "sedentary",
        "light",
        "moderate",
        "active",
        "very_active",
      ].includes(form.activityLevel)
    )
      errs.activityLevel = t("nutrition.calc.error.activity");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
    setErrors((e) => ({ ...e, [e.target.name]: undefined }));
    reset();
  }

  function handleSelect(name: string, value: string) {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
    reset();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      mutate(form);
    }
  }

  const isLoading = status === "pending";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md border rounded-lg p-6 bg-card space-y-4 shadow"
      autoComplete="off"
    >
      <h2 className="text-lg font-semibold">{t("nutrition.calc.title")}</h2>
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          {t("nutrition.calc.weight")}
          <Input
            name="weight"
            type="number"
            min={20}
            max={250}
            value={form.weight}
            placeholder="70"
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.weight && (
            <span className="text-xs text-destructive">{errors.weight}</span>
          )}
        </label>
        <label className="block text-sm font-medium">
          {t("nutrition.calc.height")}
          <Input
            name="height"
            type="number"
            min={100}
            max={250}
            value={form.height}
            placeholder="175"
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.height && (
            <span className="text-xs text-destructive">{errors.height}</span>
          )}
        </label>
        <label className="block text-sm font-medium">
          {t("nutrition.calc.age")}
          <Input
            name="age"
            type="number"
            min={5}
            max={120}
            value={form.age}
            placeholder="30"
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.age && (
            <span className="text-xs text-destructive">{errors.age}</span>
          )}
        </label>
        <label className="block text-sm font-medium">
          {t("nutrition.calc.gender")}
          <Select
            value={form.gender}
            onValueChange={val => handleSelect("gender", val)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("nutrition.calc.gender.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.gender && (
            <span className="text-xs text-destructive">{errors.gender}</span>
          )}
        </label>
        <label className="block text-sm font-medium">
          {t("nutrition.calc.activity")}
          <Select
            value={form.activityLevel}
            onValueChange={val => handleSelect("activityLevel", val)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("nutrition.calc.activity.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.activityLevel && (
            <span className="text-xs text-destructive">{errors.activityLevel}</span>
          )}
        </label>
      </div>
      <div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {t("nutrition.calc.submit")}
        </Button>
      </div>
      {isLoading && (
        <div className="text-xs text-muted-foreground">{t("nutrition.calc.sending")}</div>
      )}
      {error && (
        <div className="text-xs text-destructive">{error.message}</div>
      )}
      {data && (
        <div className="border rounded-md p-4 mt-4 bg-accent/40">
          <div className="font-medium">
            {t("nutrition.calc.result.bmr", { value: data.bmr })}
          </div>
          <div className="font-medium">
            {t("nutrition.calc.result.tdee", { value: data.tdee })}
          </div>
          <div className="text-xs mt-1">{t("nutrition.calc.result.units", { units: data.units })}</div>
        </div>
      )}
    </form>
  );
}
