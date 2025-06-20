
import { useSafeT } from "@/hooks/useSafeT";
import { Sprout, Zap, Layers, Dumbbell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NutritionInfoTiles() {
  const { t, ready } = useSafeT();

  // Guard: Show skeleton while i18n is loading
  if (!ready) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  const tiles = [
    {
      icon: Sprout,
      title: t("nutrition.tiles.fresh.title"),
      desc: t("nutrition.tiles.fresh.desc"),
    },
    {
      icon: Zap,
      title: t("nutrition.tiles.energy.title"),
      desc: t("nutrition.tiles.energy.desc"),
    },
    {
      icon: Layers,
      title: t("nutrition.tiles.variety.title"),
      desc: t("nutrition.tiles.variety.desc"),
    },
    {
      icon: Dumbbell,
      title: t("nutrition.tiles.protein.title"),
      desc: t("nutrition.tiles.protein.desc"),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {tiles.map(({ icon: Icon, title, desc }, i) => (
        <Card key={i} className="bg-muted shadow-sm">
          <CardContent className="flex items-start gap-4 p-4">
            <Icon className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
