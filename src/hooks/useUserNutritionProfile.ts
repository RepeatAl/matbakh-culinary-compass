
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ProfileExt {
  user_id: string;
  allergies: string[];
  favorite_foods: string[];
  disliked_foods: string[];
  goals: string[];
}

export function useProfileExt() {
  const { user } = useAuth();
  return useQuery<ProfileExt | null, Error>({
    queryKey: ["user-nutrition-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("profiles_ext")
        .select("user_id, allergies, favorite_foods, disliked_foods, goals")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
  });
}
