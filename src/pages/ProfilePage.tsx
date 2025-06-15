
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

type ProfileFormValues = {
  first_name: string;
  last_name: string;
  language: string;
  avatar_url: string;
  consent_agb: boolean;
  consent_privacy: boolean;
  consent_marketing: boolean;
};

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const methods = useForm<ProfileFormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      language: i18n.language,
      avatar_url: "",
      consent_agb: false,
      consent_privacy: false,
      consent_marketing: false,
    }
  });

  // Lade Daten on mount
  useEffect(() => {
    if (!user) return;
    // Standard-Prozedere zum Laden der Daten (kann noch optimiert in Hook!)
    async function fetchProfile() {
      const { data: basic } = await supabase
        .from("profiles")
        .select("id,first_name,last_name")
        .eq("id", user.id)
        .single();
      const { data: ext } = await supabase
        .from("profiles_ext")
        .select("language,consent_agb,consent_privacy,consent_marketing")
        .eq("user_id", user.id)
        .maybeSingle();
      methods.reset({
        first_name: basic?.first_name || "",
        last_name: basic?.last_name || "",
        language: ext?.language || i18n.language,
        avatar_url: "", // Avatar separat laden
        consent_agb: !!ext?.consent_agb,
        consent_privacy: !!ext?.consent_privacy,
        consent_marketing: !!ext?.consent_marketing,
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
      })
      .eq("user_id", user.id);

    toast({ title: t("profile.saved", "Profil gespeichert") });
  }

  function handleAvatarUpload(url: string) {
    methods.setValue("avatar_url", url);
    // Wenn Avatar URL im Backend gespeichert werden soll:
    // supabase.from("profiles_ext").update({ avatar_url: url }).eq("user_id", user.id);
  }

  // Keine eigenen Formularkomponenten/Markup mehr, nur noch Container
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("profile.title", "Mein Profil")}</h1>
      <FormProvider {...methods}>
        <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
          <AvatarUploader
            currentUrl={methods.watch("avatar_url")}
            onUpload={handleAvatarUpload}
          />
          <ProfileMetaFields />
          <ProfileConsentCheckboxes />
          <ChangePasswordButton />
          <Button type="submit" className="w-full mt-4">
            {t("profile.save", "Speichern")}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
