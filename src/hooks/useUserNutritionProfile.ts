
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useUserNutritionProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-nutrition-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("profiles_ext")
        .select("allergies, favorite_foods, disliked_foods, goals")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
  });
}
