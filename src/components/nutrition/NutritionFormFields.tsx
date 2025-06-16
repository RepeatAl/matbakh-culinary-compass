
import { FC } from "react";
import { useSafeT } from "@/hooks/useSafeT";
import { Controller, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  form: UseFormReturn<any>;
}
export const NutritionFormFields: FC<Props> = ({ form }) => {
  const { t } = useSafeT();
  const { control, register, formState: { errors } } = form;

  return (
    <>
      {/* Gewicht */}
      <label className="block text-sm font-medium">
        {t("nutrition.calc.weight.label", "Weight (kg)")}
        <Input
          placeholder={t("nutrition.calc.weight.placeholder", "e.g. 70")}
          {...register("weight")}
          type="number"
        />
        {errors.weight && (
          <span className="text-xs text-destructive mt-1 block">
            {errors.weight?.message ? t(errors.weight.message as string, "Please enter a valid weight.") : ""}
          </span>
        )}
      </label>

      {/* Größe */}
      <label className="block text-sm font-medium">
        {t("nutrition.calc.height.label", "Height (cm)")}
        <Input
          placeholder={t("nutrition.calc.height.placeholder", "e.g. 175")}
          {...register("height")}
          type="number"
        />
        {errors.height && (
          <span className="text-xs text-destructive mt-1 block">
            {errors.height?.message ? t(errors.height.message as string, "Please enter a valid height.") : ""}
          </span>
        )}
      </label>

      {/* Alter */}
      <label className="block text-sm font-medium">
        {t("nutrition.calc.age.label", "Age")}
        <Input
          placeholder={t("nutrition.calc.age.placeholder", "Enter your age")}
          {...register("age")}
          type="number"
        />
        {errors.age && (
          <span className="text-xs text-destructive mt-1 block">
            {errors.age?.message ? t(errors.age.message as string, "Please enter a valid age.") : ""}
          </span>
        )}
      </label>

      {/* Geschlecht */}
      <label className="block text-sm font-medium">
        {t("nutrition.calc.gender.label", "Gender")}
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={t("nutrition.calc.gender.placeholder", "Select gender")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t("nutrition.calc.gender.male", "Male")}</SelectItem>
                <SelectItem value="female">{t("nutrition.calc.gender.female", "Female")}</SelectItem>
                <SelectItem value="other">{t("nutrition.calc.gender.other", "Other")}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.gender && (
          <span className="text-xs text-destructive mt-1 block">
            {errors.gender?.message ? t(errors.gender.message as string, "Please select gender.") : ""}
          </span>
        )}
      </label>

      {/* Aktivitätslevel */}
      <label className="block text-sm font-medium">
        {t("nutrition.calc.activity.label", "Activity Level")}
        <Controller
          control={control}
          name="activityLevel"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={t("nutrition.calc.activity.placeholder", "Select level")} />
              </SelectTrigger>
              <SelectContent>
                {["sedentary","light","moderate","active","very_active"].map((lvl) => (
                  <SelectItem key={lvl} value={lvl}>
                    {t(`nutrition.calc.activity.${lvl}`, lvl.replace('_', ' '))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.activityLevel && (
          <span className="text-xs text-destructive mt-1 block">
            {errors.activityLevel?.message ? t(errors.activityLevel.message as string, "Please select activity level.") : ""}
          </span>
        )}
      </label>

      {/* Einheitensystem */}
      <label className="block text-sm font-medium">
        {t("nutrition.calc.units.label", "Units")}
        <Controller
          control={control}
          name="units"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={t("nutrition.calc.units.placeholder", "Select units")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">{t("nutrition.calc.units.metric", "Metric (kg, cm)")}</SelectItem>
                <SelectItem value="imperial">{t("nutrition.calc.units.imperial", "Imperial (lbs, inches)")}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.units && (
          <span className="text-xs text-destructive mt-1 block">
            {errors.units?.message ? t(errors.units.message as string, "Please select units.") : ""}
          </span>
        )}
      </label>
    </>
  );
};
