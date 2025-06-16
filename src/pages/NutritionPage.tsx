
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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: foods = [] } = useFoods();
  const { data: profile } = useProfileExt();

  const safeT = (key: string, fallback?: string) => {
    const translation = t(key);
    
    if (import.meta.env.DEV && translation === key && fallback) {
      console.warn(`🔍 i18n: Missing translation for "${key}" in language "${i18n.language}"`);
      return `${fallback} [${key}]`;
    }
    
    return translation !== key ? translation : fallback || key;
  };

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
        <h1 className="text-3xl font-bold mb-2">{safeT('nutrition.hero.title', 'Ernährung')}</h1>
        <p className="text-lg text-muted-foreground mb-1">
          {safeT("nutrition.hero.body", "Entdecke personalisierte Ernährungseinblicke und saisonale Zutaten für deinen gesunden Lebensstil.")}
        </p>
        <p className="mt-2 text-xs text-destructive">{safeT("nutrition.disclaimer", "Wichtig: Diese App ersetzt keine medizinische Beratung.")}</p>
      </div>

      {/* Profil Multiselect-Filter */}
      {user && <NutritionProfileMultiselect />}

      {/* Empfehlungen */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">{safeT("nutrition.recommendations.title", "Personalisierte Empfehlungen")}</h2>
        {profile ? (
          <div>
            {favoriteFoodObjs.length > 0 || filteredFoods.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {favoriteFoodObjs.map(f => (
                  <li key={f.slug} className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-900 rounded shadow">
                    <span>★</span>
                    <span>{f.name?.[i18n.language] ?? f.name?.de ?? f.slug}</span>
                  </li>
                ))}
                {filteredFoods
                  .filter(f => !profile.favorite_foods?.includes(f.slug))
                  .map(f => (
                    <li key={f.slug} className="px-3 py-2 bg-muted text-foreground rounded">{f.name?.[i18n.language] ?? f.name?.de ?? f.slug}</li>
                  ))}
              </ul>
            ) : (
              <span className="text-muted-foreground text-sm">{safeT("nutrition.recommendations.noData", "Keine Daten verfügbar")}</span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">{safeT("nutrition.recommendations.noData", "Melde dich an, um personalisierte Empfehlungen zu sehen.")}</span>
        )}
        {/* Optional: Alle Empfehlungen anzeigen */}
        {/* <Button className="mt-3">{safeT("nutrition.recommendations.seeAll", "Alle Empfehlungen anzeigen")}</Button> */}
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
            {safeT("nutrition.calc.demo.hint", "Demo: Schnellrechner für Kalorien und Makros")}
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
          {safeT("nutrition.cta.createProfile", "Erstelle dein Ernährungsprofil")}
        </Button>
        <span className="text-xs text-muted-foreground mt-2">
          {safeT("nutrition.cta.info", "Erhalte personalisierte Empfehlungen basierend auf deinen Zielen.")}
        </span>
      </div>
    </div>
  );
};

export default NutritionPage;
