
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import NutritionInfoTiles from "@/components/nutrition/NutritionInfoTiles";
import SaisonToggle from "@/components/nutrition/SaisonToggle";
import { NutritionCalculatorForm } from "@/components/nutrition/NutritionCalculatorForm";
import { useNavigate } from "react-router-dom";

const NutritionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Hero / Intro */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t('nutrition.hero.title')}</h1>
        <p className="text-lg text-muted-foreground mb-1">
          {t("nutrition.hero.body")}
        </p>
        <p className="mt-2 text-xs text-destructive">{t("nutrition.disclaimer")}</p>
      </div>

      {/* Infokacheln */}
      <NutritionInfoTiles />

      {/* Saison-Toggle */}
      <div className="flex justify-center">
        <SaisonToggle />
      </div>

      {/* Demo-Calculator (prominent platziert, eigene Card, als Demo gelabelt) */}
      <div className="my-10">
        <div className="mb-2 text-center">
          <span className="inline-block rounded px-3 py-1 bg-secondary text-xs font-medium mb-2">
            {t("nutrition.calc.demo.hint")}
          </span>
        </div>
        <NutritionCalculatorForm />
      </div>

      {/* CTA-Bereich */}
      <div className="flex flex-col items-center mt-8 mb-2">
        <Button
          className="w-full md:w-auto"
          size="lg"
          onClick={() => navigate("/profile")}
        >
          {t("nutrition.cta.createProfile")}
        </Button>
        <span className="text-xs text-muted-foreground mt-2">
          {t("nutrition.cta.info")}
        </span>
      </div>
    </div>
  );
};

export default NutritionPage;
