
import React, { useMemo, useState } from "react";
import { useFoods } from "@/hooks/useFoods";
import { useProfileExt, ProfileExt } from "@/hooks/useUserNutritionProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

type Key = "allergies" | "favorite_foods" | "disliked_foods" | "goals";
const keys: { key: Key, label: string }[] = [
  { key: "allergies", label: "profile.health.allergies_label" },
  { key: "favorite_foods", label: "profile.health.favorite_foods_label" },
  { key: "disliked_foods", label: "profile.health.disliked_foods_label" },
  { key: "goals", label: "profile.health.goals_label" },
];

export const NutritionProfileMultiselect: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: foods = [] } = useFoods();
  const { data: profile, refetch } = useProfileExt();
  const { user } = useAuth();

  // Fehler-Status, falls DB-Update fehlschlägt
  const [fieldError, setFieldError] = useState<Partial<Record<Key, string>>>({});

  // Optionen für goals
  const goalOptions = [
    { value: "weight_loss", label: t("nutrition.goals.weight_loss", "Gewicht verlieren") },
    { value: "muscle_gain", label: t("nutrition.goals.muscle_gain", "Muskelaufbau") },
    { value: "maintenance", label: t("nutrition.goals.maintenance", "Gewicht halten") }
  ];

  // Food-Optionen für alle Felder außer goals
  const foodOptions = useMemo(
    () =>
      foods.map(f => ({
        value: f.slug,
        label: f.name?.[i18n.language] || f.name?.de || f.slug
      })),
    [foods, i18n.language]
  );

  // Profilfeld-Update
  const updateProfileField = async (key: Key, value: string[]) => {
    if (!user) return;
    setFieldError(prev => ({ ...prev, [key]: undefined }));
    const update: Partial<ProfileExt> = { [key]: value };
    const { error } = await supabase
      .from("profiles_ext")
      .upsert({ user_id: user.id, ...profile, ...update });
    if (error) {
      setFieldError(prev => ({
        ...prev,
        [key]: t("profile.save_failed", "Profil konnte nicht gespeichert werden.")
      }));
      toast({ title: t("profile.save_failed", "Profil konnte nicht gespeichert werden.") });
    } else {
      toast({ title: t("profile.saved", "Profil gespeichert.") });
      refetch();
    }
  };

  if (!profile) return null;

  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary p-4 rounded-md">
      {keys.map(({ key, label }) => {
        const options = key === "goals" ? goalOptions : foodOptions;
        const selected = profile[key] ?? [];
        return (
          <div key={key}>
            <div className="mb-1 font-medium">{t(label)}</div>
            <Select
              multiple
              value={selected}
              onValueChange={(vals: string[]) => updateProfileField(key, vals)}
            >
              <SelectTrigger className="w-full min-w-[150px]">
                <SelectValue placeholder={t("profile.select_placeholder", "Auswählen...")} />
              </SelectTrigger>
              <SelectContent>
                {options.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError[key] && (
              <span className="text-red-600 text-xs">{fieldError[key]}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};
