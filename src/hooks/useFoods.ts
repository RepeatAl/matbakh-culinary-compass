
import { useQuery } from "@tanstack/react-query";

export function useFoods() {
  return useQuery({
    queryKey: ["foods"],
    queryFn: async () => {
      // Aufruf der Supabase Edge Function, immer vollständige URL in Vercel/Lovable
      const res = await fetch("https://eztmmerfuxcgmggewvaq.functions.supabase.co/foods-list");
      if (!res.ok) throw new Error("Fehler beim Laden der Lebensmittel");
      return res.json() as Promise<
        { id: string; slug: string; name: Record<string,string>; category: string }[]
      >;
    },
  });
}
