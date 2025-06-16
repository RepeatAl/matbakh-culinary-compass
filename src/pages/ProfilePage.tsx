
import React from "react";
import { useTranslation } from "react-i18next";
import { ProfileFormWrapper } from "@/components/profile/ProfileFormWrapper";

export default function ProfilePage() {
  const { t } = useTranslation();

  const safeT = (key: string, fallback?: string) => {
    const translation = t(key);
    return translation !== key ? translation : fallback || key;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{safeT("profile.title", "Mein Profil")}</h1>
      <ProfileFormWrapper />
    </div>
  );
}
