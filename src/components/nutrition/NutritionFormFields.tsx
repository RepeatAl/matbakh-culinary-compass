
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Controller, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  form: UseFormReturn<any>;
}
export const NutritionFormFields: FC<Props> = ({ form }) => {
  const { t } = useTranslation();
  const { control, register, formState: { errors } } = form;

  return (
    <>
      {/* Gewicht */}
      <label className="block text-sm font-medium">
        {t("nutrition.calc.weight.label")}
        <Input
          placeholder={t("nutrition.calc.weight.placeholder")}
          {...register("weight")}
          type="number"
        />
        {errors.weight && (
          <span className="text-xs text-destructive mt-1 block">
            {errors.weight?.message ? t(errors.weight.message as string) : ""}
          </span>
        )}
      </label>

      {/* Größe */}
      <label className="block text-sm font-medium">
        {t("nutrition.calc.height.label")}
        <Input
          placeholder={t("nutrition.calc.height.placeholder")}
          {...register("height")}
          type="number"
        />
        {errors.height && (
          <span className="text-xs text-destructive mt-1 block">
            {errors.height?.message ? t(errors.height.message as string) : ""}
          </span>
        )}
      </label>

      {/* Alter */}
      <label className="block text-sm font-medium">
        {t("nutrition.calc.age.label")}
        <Input
          placeholder={t("nutrition.calc.age.placeholder")}
          {...register("age")}
          type="number"
        />
        {errors.age && (
          <span className="text-xs text-destructive mt-1 block">
            {errors.age?.message ? t(errors.age.message as string) : ""}
          </span>
        )}
      </label>

      {/* Geschlecht */}
      <label className="block text-sm font-medium">
        {t("nutrition.calc.gender.label")}
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={t("nutrition.calc.gender.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t("nutrition.calc.gender.male")}</SelectItem>
                <SelectItem value="female">{t("nutrition.calc.gender.female")}</SelectItem>
                <SelectItem value="other">{t("nutrition.calc.gender.other")}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.gender && (
          <span className="text-xs text-destructive mt-1 block">
            {errors.gender?.message ? t(errors.gender.message as string) : ""}
          </span>
        )}
      </label>

      {/* Aktivitätslevel */}
      <label className="block text-sm font-medium">
        {t("nutrition.calc.activity.label")}
        <Controller
          control={control}
          name="activityLevel"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={t("nutrition.calc.activity.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {["sedentary","light","moderate","active","very_active"].map((lvl) => (
                  <SelectItem key={lvl} value={lvl}>
                    {t(`nutrition.calc.activity.${lvl}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.activityLevel && (
          <span className="text-xs text-destructive mt-1 block">
            {errors.activityLevel?.message ? t(errors.activityLevel.message as string) : ""}
          </span>
        )}
      </label>

      {/* Einheitensystem */}
      <label className="block text-sm font-medium">
        {t("nutrition.calc.units.label")}
        <Controller
          control={control}
          name="units"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={t("nutrition.calc.units.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">{t("nutrition.calc.units.metric")}</SelectItem>
                <SelectItem value="imperial">{t("nutrition.calc.units.imperial")}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.units && (
          <span className="text-xs text-destructive mt-1 block">
            {errors.units?.message ? t(errors.units.message as string) : ""}
          </span>
        )}
      </label>
    </>
  );
};
