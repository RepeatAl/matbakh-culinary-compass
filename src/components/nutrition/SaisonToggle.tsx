
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";

/**
 * Saisonaler Toggle: Placeholder (State & Handler können später genutzt werden)
 */
export default function SaisonToggle() {
  const { t } = useTranslation();
  const [isSeasonal, setIsSeasonal] = useState(true);

  return (
    <div className="flex items-center gap-4 py-2">
      <span className={"text-sm font-medium"}>{t("nutrition.season.wholeyear")}</span>
      <Switch checked={isSeasonal} onCheckedChange={setIsSeasonal} />
      <span className={"text-sm font-medium"}>{t("nutrition.season.seasonal")}</span>
      <span className="ml-2 text-xs text-muted-foreground">{t("nutrition.season.info")}</span>
    </div>
  );
}
