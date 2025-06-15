
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  currentUrl?: string;
  onUpload: (url: string) => void;
};
const bucket = "avatars";

export function AvatarUploader({ currentUrl, onUpload }: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!["image/png", "image/jpeg"].includes(file.type) || file.size > 5_000_000) {
      toast({ title: "Nur PNG/JPG, max 5MB erlaubt" });
      return;
    }
    setUploading(true);
    const path = `${user.id}/avatar.jpg`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    setUploading(false);
    if (!error) {
      toast({ title: "Avatar aktualisiert" });
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      setPreview(data.publicUrl + "?cachebreaker=" + Date.now());
      onUpload(data.publicUrl + "?cachebreaker=" + Date.now());
    } else {
      toast({ title: "Fehler beim Upload" });
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="cursor-pointer group">
        <Avatar className="h-20 w-20 group-hover:ring-2 ring-primary">
          {preview ? (
            <AvatarImage src={preview} alt="Avatar" />
          ) : (
            <AvatarFallback>
              <Camera className="h-8 w-8" />
            </AvatarFallback>
          )}
        </Avatar>
        <input
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={handleFile}
          disabled={uploading}
        />
      </label>
      <Button size="sm" type="button" variant="outline" onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()} disabled={uploading}>
        {uploading ? "Lädt..." : "Profilbild ändern"}
      </Button>
    </div>
  );
}
