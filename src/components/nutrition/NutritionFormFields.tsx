
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
      <Input
        label={t("nutrition.calc.weight.label")}
        placeholder={t("nutrition.calc.weight.placeholder")}
        {...register("weight")}
        error={errors.weight?.message as string}
        type="number"
      />
      <Input
        label={t("nutrition.calc.height.label")}
        placeholder={t("nutrition.calc.height.placeholder")}
        {...register("height")}
        error={errors.height?.message as string}
        type="number"
      />
      <Input
        label={t("nutrition.calc.age.label")}
        placeholder={t("nutrition.calc.age.placeholder")}
        {...register("age")}
        error={errors.age?.message as string}
        type="number"
      />
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
    </>
  );
}
