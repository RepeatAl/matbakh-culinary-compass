
import React, { useMemo, useState } from "react";
import Select from "react-select";
import { useFoods } from "@/hooks/useFoods";
import { useProfileExt, ProfileExt } from "@/hooks/useUserNutritionProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

// Option-Typ für react-select
interface Option {
  value: string;
  label: string;
}

// Alle verwendeten Felder und Übersetzungen wie gehabt
type Key = "allergies" | "favorite_foods" | "disliked_foods" | "goals";
const keys: { key: Key, label: string, placeholder: string }[] = [
  { key: "allergies", label: "profile.health.allergies_label", placeholder: "nutrition.profile.allergies.placeholder" },
  { key: "favorite_foods", label: "profile.health.favorite_foods_label", placeholder: "nutrition.profile.favoriteFoods.placeholder" },
  { key: "disliked_foods", label: "profile.health.disliked_foods_label", placeholder: "nutrition.profile.dislikedFoods.placeholder" },
  { key: "goals", label: "profile.health.goals_label", placeholder: "nutrition.profile.goals.placeholder" },
];

export const NutritionProfileMultiselect: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: foods = [] } = useFoods();
  const { data: profile, refetch } = useProfileExt();
  const { user } = useAuth();
  const [fieldError, setFieldError] = useState<Partial<Record<Key, string>>>({});

  // Optionen
  const goalOptions: Option[] = [
    { value: "weight_loss", label: t("nutrition.goals.weight_loss", "Gewicht verlieren") as string },
    { value: "muscle_gain", label: t("nutrition.goals.muscle_gain", "Muskelaufbau") as string },
    { value: "maintenance", label: t("nutrition.goals.maintenance", "Gewicht halten") as string }
  ];

  const foodOptions: Option[] = useMemo(
    () =>
      foods.map(f => ({
        value: f.slug,
        label: f.name?.[i18n.language] || f.name?.de || f.slug
      })),
    [foods, i18n.language]
  );

  async function updateProfileField(key: Key, value: string[]) {
    if (!user) return;
    setFieldError(prev => ({ ...prev, [key]: undefined }));
    const update: Partial<ProfileExt> = { [key]: value };
    const { error } = await supabase
      .from("profiles_ext")
      .upsert({ user_id: user.id, ...profile, ...update });
    if (error) {
      setFieldError(prev => ({
        ...prev,
        [key]: t("profile.save_failed", "Profil konnte nicht gespeichert werden.") as string
      }));
      toast({ title: t("profile.save_failed", "Profil konnte nicht gespeichert werden.") as string });
    } else {
      toast({ title: t("profile.saved", "Profil gespeichert.") as string });
      refetch();
    }
  }

  if (!profile) return null;

  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary p-4 rounded-md">
      {keys.map(({ key, label, placeholder }) => {
        // Option-Auswahl je nach Feld
        const options = key === "goals" ? goalOptions : foodOptions;
        const selected = Array.isArray(profile[key]) ? profile[key] : [];
        const selectedOptions = options.filter(opt => selected.includes(opt.value));
        return (
          <div key={key}>
            <div className="mb-1 font-medium">{t(label) as string}</div>
            <Select
              isMulti
              name={key}
              options={options}
              value={selectedOptions}
              onChange={(selected: unknown) =>
                updateProfileField(
                  key,
                  Array.isArray(selected) ? (selected as Option[]).map(o => o.value) : []
                )
              }
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder={String(t("common.select", "Select..."))}
              menuPortalTarget={typeof window !== "undefined" ? document.body : undefined}
              styles={{
                menuPortal: base => ({ ...base, zIndex: 9999 })
              }}
            />
            {fieldError[key] && (
              <p className="text-red-600 text-xs mt-1">{fieldError[key]}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
