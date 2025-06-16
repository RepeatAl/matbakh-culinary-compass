
import { useSafeT } from "@/hooks/useSafeT";
import { Sprout, Flame, Apple, Egg } from "lucide-react";

export default function NutritionInfoTiles() {
  const { t } = useSafeT();

  const tiles = [
    {
      icon: Sprout,
      title: t("nutrition.tiles.fresh.title", "Fresh Ingredients"),
      desc: t("nutrition.tiles.fresh.desc", "Discover which foods are in season in your region."),
    },
    {
      icon: Flame,
      title: t("nutrition.tiles.energy.title", "Energy Balance"),
      desc: t("nutrition.tiles.energy.desc", "Calculate your personalized daily caloric needs."),
    },
    {
      icon: Apple,
      title: t("nutrition.tiles.variety.title", "Nutritional Variety"),
      desc: t("nutrition.tiles.variety.desc", "Combine different food groups for a balanced diet."),
    },
    {
      icon: Egg,
      title: t("nutrition.tiles.protein.title", "Quality Proteins"),
      desc: t("nutrition.tiles.protein.desc", "Find the best protein sources for your goals."),
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
