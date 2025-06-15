import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import NutritionInfoTiles from "@/components/nutrition/NutritionInfoTiles";
import SaisonToggle from "@/components/nutrition/SaisonToggle";
import { NutritionCalculatorForm } from "@/components/nutrition/NutritionCalculatorForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfileFilters } from "@/components/nutrition/UserProfileFilters";
import { useFoods } from "@/hooks/useFoods";
import { useProfileExt } from "@/hooks/useUserNutritionProfile";
import { NutritionProfileMultiselect } from "@/components/nutrition/NutritionProfileMultiselect";

const NutritionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: foods = [] } = useFoods();
  const { data: profile } = useProfileExt();

  // Filter: Allergene & disliked
  let filteredFoods = foods;
  if (profile) {
    // Set für Allergene und dislikes (nur slugs)
    const exclude = new Set([
      ...(profile.allergies || []),
      ...(profile.disliked_foods || []),
    ].map((s) => s?.toLowerCase()));
    filteredFoods = foods.filter(f => !exclude.has(f.slug.toLowerCase()));
  }

  // Empfehlungen: zuerst Lieblingslebensmittel (favorite_foods) im Vordergrund
  const favoriteFoodObjs = profile?.favorite_foods
    ? foods.filter(f => profile.favorite_foods.includes(f.slug))
    : [];

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

      {/* Profil Multiselect-Filter */}
      {user && <NutritionProfileMultiselect />}

      {/* Empfehlungen */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">{t("nutrition.recommendations.title")}</h2>
        {profile ? (
          <div>
            {favoriteFoodObjs.length > 0 || filteredFoods.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {favoriteFoodObjs.map(f => (
                  <li key={f.slug} className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-900 rounded shadow">
                    <span>★</span>
                    <span>{f.name?.[t("lng", "de")] ?? f.name?.de ?? f.slug}</span>
                  </li>
                ))}
                {filteredFoods
                  .filter(f => !profile.favorite_foods?.includes(f.slug))
                  .map(f => (
                    <li key={f.slug} className="px-3 py-2 bg-muted text-foreground rounded">{f.name?.[t("lng", "de")] ?? f.name?.de ?? f.slug}</li>
                  ))}
              </ul>
            ) : (
              <span className="text-muted-foreground text-sm">{t("nutrition.recommendations.noData")}</span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">{t("nutrition.recommendations.noData")}</span>
        )}
        {/* Optional: Alle Empfehlungen anzeigen */}
        {/* <Button className="mt-3">{t("nutrition.recommendations.seeAll")}</Button> */}
      </div>

      {/* Infokacheln */}
      <NutritionInfoTiles />

      {/* Saison-Toggle */}
      <div className="flex justify-center">
        <SaisonToggle />
      </div>

      {/* Demo-Calculator */}
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
