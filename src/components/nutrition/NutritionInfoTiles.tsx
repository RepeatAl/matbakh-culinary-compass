
import { useTranslation } from "react-i18next";
import { Sprout, Flame, Apple, Egg } from "lucide-react";

export default function NutritionInfoTiles() {
  const { t } = useTranslation();

  const tiles = [
    {
      icon: Sprout,
      title: t("nutrition.tiles.fresh.title"),
      desc: t("nutrition.tiles.fresh.desc"),
    },
    {
      icon: Flame,
      title: t("nutrition.tiles.energy.title"),
      desc: t("nutrition.tiles.energy.desc"),
    },
    {
      icon: Apple,
      title: t("nutrition.tiles.variety.title"),
      desc: t("nutrition.tiles.variety.desc"),
    },
    {
      icon: Egg,
      title: t("nutrition.tiles.protein.title"),
      desc: t("nutrition.tiles.protein.desc"),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {tiles.map(({ icon: Icon, title, desc }, i) => (
        <div key={i} className="flex items-start gap-4 bg-muted rounded-lg p-4 shadow-sm">
          <Icon className="w-8 h-8 text-primary mt-1" />
          <div>
            <div className="font-semibold mb-1">{title}</div>
            <div className="text-sm text-muted-foreground">{desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
