import { useTranslation } from 'react-i18next';
import { NutritionCalculatorForm } from "@/components/nutrition/NutritionCalculatorForm";

const NutritionPage = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{t('navigation.nutrition')}</h1>
      {/* Hero & Disclaimer */}
      <div className="mt-6 max-w-2xl">
        <h2 className="text-xl font-semibold">{t("nutrition.hero.title")}</h2>
        <p className="mt-2 text-muted-foreground">
          {t("nutrition.hero.body")}
        </p>
        <p className="mt-2 text-xs text-destructive">
          {t("nutrition.disclaimer")}
        </p>
      </div>
      {/* Info-Kacheln / NutritionTiles (später) */}
      <div className="mt-8">
        <NutritionCalculatorForm />
      </div>
    </div>
  );
};

export default NutritionPage;
