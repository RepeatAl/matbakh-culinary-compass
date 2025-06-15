
import React, { useRef, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Camera } from "lucide-react";

type Props = { userId: string };

const bucket = "avatars";

export default function AvatarUpload({ userId }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Hole Avatar-URL
    async function fetchAvatar() {
      const { data } = supabase.storage.from(bucket).getPublicUrl(`${userId}/avatar.jpg`);
      setUrl(data.publicUrl);
    }
    fetchAvatar();
  }, [userId]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type) || file.size > 5_000_000) {
      toast({ title: "Nur PNG/JPG und max 5MB erlaubt" });
      return;
    }
    setUploading(true);
    // Lade hoch & setze
    const { error } = await supabase.storage
      .from(bucket)
      .upload(`${userId}/avatar.jpg`, file, { upsert: true });
    setUploading(false);
    if (!error) {
      toast({ title: "Avatar aktualisiert" });
      const { data } = supabase.storage.from(bucket).getPublicUrl(`${userId}/avatar.jpg`);
      setUrl(data.publicUrl + "?cachebreaker=" + Date.now());
    } else {
      toast({ title: "Fehler beim Upload" });
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <label htmlFor="avatar-input" className="cursor-pointer group">
        <Avatar className="h-20 w-20 group-hover:ring-2 ring-primary">
          {url ? (
            <AvatarImage src={url} alt="Avatar" />
          ) : (
            <AvatarFallback>
              <Camera className="h-8 w-8" />
            </AvatarFallback>
          )}
        </Avatar>
        <input
          ref={inputRef}
          id="avatar-input"
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={handleFile}
          disabled={uploading}
        />
      </label>
      <Button size="sm" type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
        {uploading ? "Lädt..." : "Profilbild ändern"}
      </Button>
    </div>
  );
}
