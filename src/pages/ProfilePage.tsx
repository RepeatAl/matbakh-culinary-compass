
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import AvatarUpload from "@/components/profile/AvatarUpload";
import ProfileConsentCheckbox from "@/components/profile/ProfileConsentCheckbox";
import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";

// Import Typing
import type { Database } from "@/integrations/supabase/types";
type ProfilesExt = Database["public"]["Tables"]["profiles_ext"]["Row"];
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

const LANG_OPTIONS = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
];

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profiles | null>(null);
  const [ext, setExt] = useState<ProfilesExt | null>(null);
  const [loading, setLoading] = useState(true);

  // Consent states
  const [consents, setConsents] = useState({
    agb: false,
    privacy: false,
    marketing: false,
  });
  const [consentDates, setConsentDates] = useState({
    agb: null as string | null,
    privacy: null as string | null,
    marketing: null as string | null,
  });

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Lade Basis- und erweiterte Profilinfos
    supabase
      .from("profiles")
      .select("first_name,last_name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setProfile(data));
    supabase
      .from("profiles_ext")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setExt(data);
          setConsents({
            agb: !!data.consent_agb,
            privacy: !!data.consent_privacy,
            marketing: !!data.consent_marketing,
          });
          setConsentDates({
            agb: data.consent_agb_at,
            privacy: data.consent_privacy_at,
            marketing: data.consent_marketing_at,
          });
        } else {
          // Initialer Eintrag, falls nicht vorhanden
          const newExt: ProfilesExt = {
            id: "",
            user_id: user.id,
            language: i18n.language,
            consent_agb: false,
            consent_privacy: false,
            consent_marketing: false,
            consent_agb_at: null,
            consent_privacy_at: null,
            consent_marketing_at: null,
            phone: null,
            created_at: null,
            updated_at: null,
          };
          setExt(newExt);
        }
        setLoading(false);
      });
  }, [user, i18n.language]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    // Update basics
    await supabase
      .from("profiles")
      .update({
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
      })
      .eq("id", user.id);

    // Upsert profiles_ext (immer user_id mitgeben!)
    await supabase
      .from("profiles_ext")
      .upsert({
        user_id: user.id,
        language: ext?.language || i18n.language,
        consent_agb: consents.agb,
        consent_privacy: consents.privacy,
        consent_marketing: consents.marketing,
        consent_agb_at: consents.agb ? (consentDates.agb || new Date().toISOString()) : null,
        consent_privacy_at: consents.privacy ? (consentDates.privacy || new Date().toISOString()) : null,
        consent_marketing_at: consents.marketing ? (consentDates.marketing || new Date().toISOString()) : null
      })
      .eq("user_id", user.id);

    toast({ title: t("profile.saved", "Profil gespeichert") });
  }

  function handleChange(field: keyof Profiles, value: string) {
    setProfile((prev) => prev ? { ...prev, [field]: value } : prev);
  }

  function handleExtChange(field: keyof ProfilesExt, value: string) {
    setExt((prev) => prev ? { ...prev, [field]: value } : prev);
  }

  function handleConsentChange(key: keyof typeof consents) {
    setConsents((prev) => {
      const checked = !prev[key];
      setConsentDates((cd) => ({
        ...cd,
        [key]: checked ? new Date().toISOString() : null,
      }));
      return { ...prev, [key]: checked };
    });
  }

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("profile.title", "Mein Profil")}</h1>
      {loading ? (
        <div className="text-gray-500">{t("loading", "Lade...")}</div>
      ) : (
        <form className="space-y-6" onSubmit={handleSave}>
          <FormItem>
            <AvatarUpload userId={user.id} />
          </FormItem>
          <FormItem>
            <FormLabel>{t("profile.firstName", "Vorname")}</FormLabel>
            <FormControl>
              <Input
                value={profile?.first_name || ""}
                onChange={(e) => handleChange("first_name", e.target.value)}
                required
                autoFocus
              />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel>{t("profile.lastName", "Nachname")}</FormLabel>
            <FormControl>
              <Input
                value={profile?.last_name || ""}
                onChange={(e) => handleChange("last_name", e.target.value)}
                required
              />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel>{t("profile.email", "E-Mail")}</FormLabel>
            <FormControl>
              <Input value={user.email || ""} readOnly className="bg-gray-100" />
            </FormControl>
          </FormItem>
          <FormItem>
            <FormLabel>{t("profile.language", "Sprache")}</FormLabel>
            <FormControl>
              <select
                className="block w-full border rounded-md px-3 py-2 bg-background"
                value={ext?.language || i18n.language}
                onChange={(e) => handleExtChange("language", e.target.value)}
              >
                {LANG_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FormControl>
          </FormItem>
          <div className="space-y-2">
            <FormLabel>{t("profile.consents", "Einwilligungen")}</FormLabel>
            <ProfileConsentCheckbox
              label={t("profile.consents_agb", "Ich akzeptiere die AGB")}
              value={consents.agb}
              date={consentDates.agb}
              onChange={() => handleConsentChange("agb")}
              required
            />
            <ProfileConsentCheckbox
              label={t("profile.consents_privacy", "Ich stimme der Datenschutzerklärung zu")}
              value={consents.privacy}
              date={consentDates.privacy}
              onChange={() => handleConsentChange("privacy")}
              required
            />
            <ProfileConsentCheckbox
              label={t("profile.consents_marketing", "Ich möchte Marketing-Infos erhalten")}
              value={consents.marketing}
              date={consentDates.marketing}
              onChange={() => handleConsentChange("marketing")}
            />
          </div>
          <div>
            <Button type="submit" className="w-full">
              {t("profile.save", "Speichern")}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
