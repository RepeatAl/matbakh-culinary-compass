
export interface FirecrawlResult {
  menus?: string[];
  restaurantInfo?: {
    name?: string;
    address?: string;
    phone?: string;
    website?: string;
    openingHours?: string;
  };
}

export async function fetchMenuFromUrl(url: string): Promise<FirecrawlResult | null> {
  const apiKey = localStorage.getItem("firecrawl_api_key");
  if (!apiKey) {
    throw new Error("Firecrawl API-Key nicht gefunden.");
  }
  const res = await fetch("https://api.firecrawl.dev/v1/crawl", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url,
      options: {
        extractMenus: true,
        extractRestaurantInfo: true,
        formats: ["markdown", "html"],
        limit: 3, // Wir nehmen als Demo max. 3 Seiten im Crawl
      },
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  // Die Firecrawl-API gibt ggf. verschachtelte Ergebnisse aus:
  return {
    menus: data.menus || [],
    restaurantInfo: data.restaurantInfo || {},
  };
}
