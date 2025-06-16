
import React from "react";
import { useSafeT } from "@/hooks/useSafeT";
import { ProfileFormWrapper } from "@/components/profile/ProfileFormWrapper";

export default function ProfilePage() {
  const { t } = useSafeT();

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("profile.title", "My Profile")}</h1>
      <ProfileFormWrapper />
    </div>
  );
}
