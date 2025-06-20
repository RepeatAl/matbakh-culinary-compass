import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";

// ---------- SCHEMA UND TYPEN ----------
const nutritionSchema = z.object({
  weight: z
    .number({ invalid_type_error: "nutrition.calc.error.weight" })
    .min(20, "nutrition.calc.error.weight")
    .max(250, "nutrition.calc.error.weight"),
  height: z
    .number({ invalid_type_error: "nutrition.calc.error.height" })
    .min(100, "nutrition.calc.error.height")
    .max(250, "nutrition.calc.error.height"),
  age: z
    .number({ invalid_type_error: "nutrition.calc.error.age" })
    .min(5, "nutrition.calc.error.age")
    .max(120, "nutrition.calc.error.age"),
  gender: z.enum(["male", "female", "other"], { errorMap: () => ({ message: "nutrition.calc.error.gender" }) }),
  activityLevel: z.enum(
    ["sedentary", "light", "moderate", "active", "very_active"],
    { errorMap: () => ({ message: "nutrition.calc.error.activity" }) }
  ),
  units: z.enum(["metric", "imperial"], { errorMap: () => ({ message: "nutrition.calc.error.units" }) }),
});
type NutritionInput = z.infer<typeof nutritionSchema>;

// ---------- HELPER ----------
function lbsToKg(lbs: number) {
  return Math.round((lbs * 0.45359237 + Number.EPSILON) * 100) / 100;
}
function inToCm(inches: number) {
  return Math.round((inches * 2.54 + Number.EPSILON) * 100) / 100;
}
function kgToLbs(kg: number) {
  return Math.round((kg / 0.45359237 + Number.EPSILON) * 10) / 10;
}
function cmToIn(cm: number) {
  return Math.round((cm / 2.54 + Number.EPSILON) * 10) / 10;
}

// ---------- OPTIONEN ----------
const GENDER_OPTIONS = [
  { value: "male", label: "nutrition.calc.gender.male" },
  { value: "female", label: "nutrition.calc.gender.female" },
  { value: "other", label: "nutrition.calc.gender.other" },
];
const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "nutrition.calc.activity.sedentary" },
  { value: "light", label: "nutrition.calc.activity.light" },
  { value: "moderate", label: "nutrition.calc.activity.moderate" },
  { value: "active", label: "nutrition.calc.activity.active" },
  { value: "very_active", label: "nutrition.calc.activity.very_active" },
];

// ---------- FETCHER ----------
async function fetchNutritionCalc(input: NutritionInput) {
  const res = await fetch("https://eztmmerfuxcgmggewvaq.functions.supabase.co/nutrition-calc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Fehler bei der Berechnung.");
  }
  return res.json();
}

// ---------- COMPONENT ----------
export function NutritionCalculatorForm() {
  const { t, i18n } = useTranslation();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm<NutritionInput>({
    resolver: zodResolver(nutritionSchema),
    defaultValues: {
      weight: 70,
      height: 175,
      age: 30,
      gender: "male",
      activityLevel: "sedentary",
      units: "metric",
    },
    mode: "onBlur"
  });
  const currUnits = watch("units");

  const mutation = useMutation<any, Error, NutritionInput>({
    mutationFn: fetchNutritionCalc,
  });

  function onSubmit(data: NutritionInput) {
    mutation.reset();
    mutation.mutate(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="max-w-md border rounded-lg p-6 bg-card space-y-4 shadow"
    >
      <h2 className="text-lg font-semibold">{t("nutrition.calc.title")}</h2>
      <div className="space-y-2">
        {/* Einheiten-Auswahl */}
        <Controller
          name="units"
          control={control}
          render={({ field }) => (
            <label className="block text-sm font-medium">
              {t("nutrition.calc.units.label")}
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={t("nutrition.calc.units.placeholder")}>
                    {field.value === "metric"
                      ? t("nutrition.calc.units.metric")
                      : t("nutrition.calc.units.imperial")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">{t("nutrition.calc.units.metric")}</SelectItem>
                  <SelectItem value="imperial">{t("nutrition.calc.units.imperial")}</SelectItem>
                </SelectContent>
              </Select>
            </label>
          )}
        />

        {/* GESCHLECHT */}
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <label className="block text-sm font-medium">
              {t("nutrition.calc.gender.label")}
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("nutrition.calc.gender.placeholder")}>
                    {t(`nutrition.calc.gender.${field.value}`)}
                  </SelectValue>
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
                <span className="text-xs text-destructive">{t(errors.gender.message as string)}</span>
              )}
            </label>
          )}
        />

        {/* AKTIVITÄTSLEVEL */}
        <Controller
          name="activityLevel"
          control={control}
          render={({ field }) => (
            <label className="block text-sm font-medium">
              {t("nutrition.calc.activity.label")}
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("nutrition.calc.activity.placeholder")}>
                    {t(`nutrition.calc.activity.${field.value}`)}
                  </SelectValue>
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
                <span className="text-xs text-destructive">{t(errors.activityLevel.message as string)}</span>
              )}
            </label>
          )}
        />

        {/* GEWICHT */}
        <label className="block text-sm font-medium">
          {currUnits === "imperial" ? t("nutrition.calc.weight.lbs") : t("nutrition.calc.weight.label")}
          <Input
            type="number"
            step="any"
            {...register("weight", { valueAsNumber: true })}
            min={currUnits === "metric" ? 20 : 40}
            max={currUnits === "metric" ? 250 : 550}
            disabled={mutation.isPending}
            placeholder={currUnits === "imperial" ? "154" : t("nutrition.calc.weight.placeholder")}
          />
          {errors.weight && (
            <span className="text-xs text-destructive">{t(errors.weight.message as string)}</span>
          )}
          {currUnits === "imperial" && (
            <span className="block text-xs text-muted-foreground mt-1">
              {t("nutrition.calc.units.hintWeight")}
            </span>
          )}
        </label>

        {/* GRÖßE */}
        <label className="block text-sm font-medium">
          {currUnits === "imperial" ? t("nutrition.calc.height.in") : t("nutrition.calc.height.label")}
          <Input
            type="number"
            step="any"
            {...register("height", { valueAsNumber: true })}
            min={currUnits === "metric" ? 100 : 39}
            max={currUnits === "metric" ? 250 : 98}
            disabled={mutation.isPending}
            placeholder={currUnits === "imperial" ? "69" : t("nutrition.calc.height.placeholder")}
          />
          {errors.height && (
            <span className="text-xs text-destructive">{t(errors.height.message as string)}</span>
          )}
          {currUnits === "imperial" && (
            <span className="block text-xs text-muted-foreground mt-1">
              {t("nutrition.calc.units.hintHeight")}
            </span>
          )}
        </label>

        {/* ALTER */}
        <label className="block text-sm font-medium">
          {t("nutrition.calc.age.label")}
          <Input
            type="number"
            {...register("age", { valueAsNumber: true })}
            min={5}
            max={120}
            disabled={mutation.isPending}
            placeholder={t("nutrition.calc.age.placeholder")}
          />
          {errors.age && (
            <span className="text-xs text-destructive">{t(errors.age.message as string)}</span>
          )}
        </label>
      </div>

      <div>
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? t("nutrition.calc.sending") : t("nutrition.calc.submit")}
        </Button>
        {/* Statuszeile: Spinner & Fehleranzeige */}
        <div className="min-h-8 mt-2 flex items-center">
          {mutation.isPending && (
            <span className="inline-block w-5 h-5 mr-2 border-2 border-primary border-t-transparent rounded-full animate-spin" aria-label={t("nutrition.calc.sending")}></span>
          )}
          {mutation.isError && (
            <span className="block text-xs text-destructive">
              {mutation.error?.message || t("nutrition.calc.error.fallback")}
            </span>
          )}
        </div>
      </div>

      {/* ERGEBNIS nur zeigen, wenn mutation.data existiert */}
      {mutation.data && (
        <Card className="mt-6">
          <CardHeader>
            <div className="font-semibold">{t("nutrition.calc.result.title")}</div>
          </CardHeader>
          <CardContent>
            <div>
              <span className="font-medium">{t("nutrition.calc.result.bmr", { value: mutation.data.bmr })}</span>
            </div>
            <div>
              <span className="font-medium">{t("nutrition.calc.result.tdee", { value: mutation.data.tdee })}</span>
            </div>
            <div className="mt-2">
              <span className="font-medium">{t("nutrition.calc.result.macros")}</span>
              <ul className="ml-4 list-disc">
                <li>
                  {t("nutrition.calc.result.macroCarbs")}: {mutation.data.macros.carbs.grams}g
                  {" "}({mutation.data.macros.carbs.ratio}%)
                </li>
                <li>
                  {t("nutrition.calc.result.macroProtein")}: {mutation.data.macros.protein.grams}g
                  {" "}({mutation.data.macros.protein.ratio}%)
                </li>
                <li>
                  {t("nutrition.calc.result.macroFat")}: {mutation.data.macros.fat.grams}g
                  {" "}({mutation.data.macros.fat.ratio}%)
                </li>
              </ul>
              <span className="text-xs mt-1 text-muted-foreground">{t("nutrition.calc.result.units", { units: mutation.data.units })}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  );
}
