
import React from "react";
import { useTranslation } from "react-i18next";
import { useUserNutritionProfile } from "@/hooks/useUserNutritionProfile";
import { useFoods } from "@/hooks/useFoods";
import { Badge } from "@/components/ui/badge";

export const UserProfileFilters: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: profile, isLoading: loadingProfile } = useUserNutritionProfile();
  const { data: foods = [] } = useFoods();

  // Helper für Labels
  const labelFromSlugs = (slugs: string[] | null | undefined) =>
    (slugs || [])
      .map((slug) =>
        foods.find((f) => f.slug === slug)?.name[i18n.language] ||
        foods.find((f) => f.slug === slug)?.name.de ||
        slug
      )
      .filter(Boolean);

  if (loadingProfile) return <div className="mb-2">{t("profile.loading", "Lade persönliche Daten ...")}</div>;
  if (!profile) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">{t("nutrition.personalization.filters", "Deine Ernährungsfilter")}</h2>
      {profile.allergies?.length > 0 && (
        <div className="mb-2">
          <span className="font-medium">{t("profile.health.allergies_label", "Allergien")}:</span>{" "}
          {profile.allergies.map((a) => (
            <Badge variant="destructive" key={a} className="mr-1 mb-1">{a}</Badge>
          ))}
        </div>
      )}
      {profile.favorite_foods?.length > 0 && (
        <div className="mb-2">
          <span className="font-medium">{t("profile.health.favorite_foods_label", "Lieblingslebensmittel")}:</span>{" "}
          {labelFromSlugs(profile.favorite_foods).map((n) => (
            <Badge variant="outline" key={n} className="mr-1 mb-1">{n}</Badge>
          ))}
        </div>
      )}
      {profile.disliked_foods?.length > 0 && (
        <div className="mb-2">
          <span className="font-medium">{t("profile.health.disliked_foods_label", "Nicht gerne essen")}:</span>{" "}
          {labelFromSlugs(profile.disliked_foods).map((n) => (
            <Badge variant="secondary" key={n} className="mr-1 mb-1">{n}</Badge>
          ))}
        </div>
      )}
      {profile.goals?.length > 0 && (
        <div className="mb-2">
          <span className="font-medium">{t("profile.health.goals_label", "Ernährungsziele")}:</span>{" "}
          {profile.goals.map((g) => (
            <Badge variant="default" key={g} className="mr-1 mb-1">{t(`nutrition.goals.${g}`, g)}</Badge>
          ))}
        </div>
      )}
    </div>
  );
};
