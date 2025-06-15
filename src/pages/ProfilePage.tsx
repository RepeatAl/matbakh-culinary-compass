
import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ProfileMetaFields } from "@/components/profile/ProfileMetaFields";
import { ProfileConsentCheckboxes } from "@/components/profile/ProfileConsentCheckboxes";
import { AvatarUploader } from "@/components/profile/AvatarUploader";
import { ChangePasswordButton } from "@/components/profile/ChangePasswordButton";
import { useFoods } from "@/hooks/useFoods";
import Select from "react-select";

// Erweiterte FormValues für Nutrition-Profilfelder
type ProfileFormValues = {
  first_name: string;
  last_name: string;
  language: string;
  avatar_url: string;
  consent_agb: boolean;
  consent_privacy: boolean;
  consent_marketing: boolean;
  allergies: string[];
  other_allergies: string;
  is_diabetic: boolean;
  diabetes_type: string;
  other_conditions: string;
  favorite_foods: string[];
  disliked_foods: string[];
  goals: string[];
};

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { data: foods = [] } = useFoods();

  // Options für Foods
  const foodOptions = foods.map(f => ({
    value: f.slug || f.id,
    label: f.name?.[i18n.language] || f.name?.en || f.name?.de || f.slug,
  }));

  const GOAL_KEYS = [
    "weight_loss", "weight_maintenance", "muscle_gain", "high_protein", "low_carb",
    "vegan", "vegetarian", "keto", "paleo", "diabetic_friendly", "heart_health",
    "gut_health", "anti_inflammatory", "sustainable_eating", "flexitarian", "other"
  ];
  const goalOptions = GOAL_KEYS.map(key => ({
    value: key,
    label: t(`profile.goals.${key}`),
  }));

  const methods = useForm<ProfileFormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      language: i18n.language,
      avatar_url: "",
      consent_agb: false,
      consent_privacy: false,
      consent_marketing: false,
      allergies: [],
      other_allergies: "",
      is_diabetic: false,
      diabetes_type: "",
      other_conditions: "",
      favorite_foods: [],
      disliked_foods: [],
      goals: [],
    }
  });

  // Lade Daten on mount
  useEffect(() => {
    if (!user) return;
    async function fetchProfile() {
      const { data: basic } = await supabase
        .from("profiles")
        .select("id,first_name,last_name")
        .eq("id", user.id)
        .single();
      const { data: ext } = await supabase
        .from("profiles_ext")
        .select("language,consent_agb,consent_privacy,consent_marketing,allergies,other_allergies,is_diabetic,diabetes_type,other_conditions,favorite_foods,disliked_foods,goals")
        .eq("user_id", user.id)
        .maybeSingle();
      methods.reset({
        first_name: basic?.first_name || "",
        last_name: basic?.last_name || "",
        language: ext?.language || i18n.language,
        avatar_url: "",
        consent_agb: !!ext?.consent_agb,
        consent_privacy: !!ext?.consent_privacy,
        consent_marketing: !!ext?.consent_marketing,
        allergies: ext?.allergies || [],
        other_allergies: ext?.other_allergies || "",
        is_diabetic: ext?.is_diabetic ?? false,
        diabetes_type: ext?.diabetes_type || "",
        other_conditions: ext?.other_conditions || "",
        favorite_foods: ext?.favorite_foods || [],
        disliked_foods: ext?.disliked_foods || [],
        goals: ext?.goals || [],
      });
    }
    fetchProfile();
    // eslint-disable-next-line
  }, [user]);

  async function onSubmit(data: ProfileFormValues) {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
      })
      .eq("id", user.id);

    await supabase
      .from("profiles_ext")
      .upsert({
        user_id: user.id,
        language: data.language,
        consent_agb: data.consent_agb,
        consent_privacy: data.consent_privacy,
        consent_marketing: data.consent_marketing,
        allergies: data.allergies,
        other_allergies: data.other_allergies,
        is_diabetic: data.is_diabetic,
        diabetes_type: data.is_diabetic ? data.diabetes_type : "",
        other_conditions: data.other_conditions,
        favorite_foods: data.favorite_foods,
        disliked_foods: data.disliked_foods,
        goals: data.goals,
      })
      .eq("user_id", user.id);

    toast({ title: t("profile.saved", "Profil gespeichert") });
  }

  function handleAvatarUpload(url: string) {
    methods.setValue("avatar_url", url);
  }

  // Handler für react-select Multiselects (damit RHF-Form mit react-select synchron bleibt)
  function handleMultiChange(name: keyof ProfileFormValues, value: any) {
    methods.setValue(name, value ? value.map((v: any) => v.value) : []);
  }

  // ... Haupt-Renderfunktion, jetzt inkl. neuen Feldern für Lieblingsessen usw:
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("profile.title")}</h1>
      <FormProvider {...methods}>
        <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
          <AvatarUploader
            currentUrl={methods.watch("avatar_url")}
            onUpload={handleAvatarUpload}
          />
          <ProfileMetaFields />

          {/* NEU: Lieblingslebensmittel */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("profile.favorite_foods.label")}</label>
            <Select
              isMulti
              options={foodOptions}
              value={foodOptions.filter(o => (methods.watch("favorite_foods") || []).includes(o.value))}
              onChange={val => handleMultiChange("favorite_foods", val)}
              classNamePrefix="react-select"
              placeholder={t("Auswählen...", "Auswählen...")}
            />
          </div>

          {/* NEU: Nicht gerne gegessen */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("profile.disliked_foods.label")}</label>
            <Select
              isMulti
              options={foodOptions}
              value={foodOptions.filter(o => (methods.watch("disliked_foods") || []).includes(o.value))}
              onChange={val => handleMultiChange("disliked_foods", val)}
              classNamePrefix="react-select"
              placeholder={t("Auswählen...", "Auswählen...")}
            />
          </div>

          {/* NEU: Ernährungsziele */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("profile.goals.label")}</label>
            <Select
              isMulti
              options={goalOptions}
              value={goalOptions.filter(o => (methods.watch("goals") || []).includes(o.value))}
              onChange={val => handleMultiChange("goals", val)}
              classNamePrefix="react-select"
              placeholder={t("Auswählen...", "Auswählen...")}
            />
          </div>

          {/* Die restlichen Gesundheits-/Allergie-Felder */}
          {/* Tipp: Wer nur Grund-Profilfelder pflegen will, kann die ProfileHealthFields-Komponente austragen */}

          {/* Consent Checkboxen & Passwort-Button */}
          <ProfileConsentCheckboxes />
          <ChangePasswordButton />
          <Button type="submit" className="w-full mt-4">
            {t("profile.save")}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
