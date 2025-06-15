
import React, { useState } from "react";
import { fetchMenuFromUrl, FirecrawlResult } from "@/services/firecrawlService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const initialFilters = {
  query: "",
  allergen: "",
  kitchen: "",
  price: "",
  location: "",
};

const exampleUrls = [
  "https://www.losteria.de/restaurants/berlin-ku-damm/",
  "https://www.blockhouse.de/restaurants/berlin-mitte/",
  "https://www.pizzeriamilano.de/"
];

export default function RestaurantSearchPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FirecrawlResult | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleExample = (exampleUrl: string) => {
    setUrl(exampleUrl);
    setResults(null);
  };

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    try {
      const data = await fetchMenuFromUrl(url);
      if (data) setResults(data);
      else toast({ title: "Fehler", description: "Keine Menükarte gefunden.", variant: "destructive" });
    } catch (e) {
      toast({ title: "Fehler", description: "Problem beim Abrufen der Speisekarte." });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Restaurantsuche & Menü-Crawler (Prototyp)</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={onSearch}>
            <Input
              name="url"
              value={url}
              onChange={e => { setUrl(e.target.value); setResults(null); }}
              placeholder="Restaurant-Website (z.B. https://...)"
              required
            />
            <div className="flex flex-wrap gap-2">
              <select name="kitchen" className="border rounded px-2 py-1" value={filters.kitchen} onChange={handleInput}>
                <option value="">Küche</option>
                <option value="italian">Italienisch</option>
                <option value="german">Deutsch</option>
                <option value="asian">Asiatisch</option>
                {/* Weitere Kategorien */}
              </select>
              <select name="allergen" className="border rounded px-2 py-1" value={filters.allergen} onChange={handleInput}>
                <option value="">Allergen</option>
                <option value="glutenfree">Glutenfrei</option>
                <option value="lactosefree">Laktosefrei</option>
                {/* ... */}
              </select>
              <select name="price" className="border rounded px-2 py-1" value={filters.price} onChange={handleInput}>
                <option value="">Preis</option>
                <option value="cheap">Günstig</option>
                <option value="mid">Mittel</option>
                <option value="expensive">Teuer</option>
              </select>
              <Input
                name="location"
                value={filters.location}
                onChange={handleInput}
                placeholder="Ort/Postleitzahl"
                className="flex-grow"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Suche läuft..." : "Suche starten"}
            </Button>
            <div className="text-xs text-muted-foreground mt-1">
              Tipp: Du kannst eine Beispiel-URL wählen:&nbsp;
              {exampleUrls.map(eu => (
                <Button
                  variant="link"
                  type="button"
                  size="sm"
                  key={eu}
                  className="px-1"
                  onClick={() => handleExample(eu)}
                >
                  {eu.split("/")[2]}
                </Button>
              ))}
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="mt-8">
        {results && (
          <Card>
            <CardHeader>
              <CardTitle>
                {results.restaurantInfo?.name ? results.restaurantInfo.name : "Restaurant"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                {results.restaurantInfo?.address && (
                  <div className="mb-1">Adresse: {results.restaurantInfo.address}</div>
                )}
                {results.restaurantInfo?.website && (
                  <div className="mb-1">
                    Webseite: <a href={results.restaurantInfo.website} className="underline text-primary" target="_blank" rel="noopener">Zur Webseite</a>
                  </div>
                )}
                {results.restaurantInfo?.openingHours && (
                  <div className="mb-1">Öffnungszeiten: {results.restaurantInfo.openingHours}</div>
                )}
                {/* Deeplink-Simulation zu Bookatable/OpenTable */}
                <div className="mb-1">
                  <a 
                    href={`https://www.bookatable.de/restaurants/${encodeURIComponent(results.restaurantInfo?.name || "restaurant")}`}
                    className="underline text-blue-600"
                    target="_blank"
                    rel="noopener"
                  >Tisch reservieren (Bookatable)</a>
                </div>
                <div>
                  <a 
                    href={`https://www.opentable.de/s/?covers=2&dateTime=2023-12-24T19%3A00&latitude=&longitude=&metroId=&regionIds=&term=${encodeURIComponent(results.restaurantInfo?.name || "restaurant")}`}
                    className="underline text-blue-600"
                    target="_blank"
                    rel="noopener"
                  >Tisch reservieren (OpenTable)</a>
                </div>
              </div>
              <div>
                <strong>Menü:</strong>
                <ul className="list-disc ml-5 mt-1">
                  {results.menus?.length
                    ? results.menus.map((m, i) => (
                        <li key={i}>
                          <div className="whitespace-pre-wrap text-sm">{m}</div>
                        </li>
                      ))
                    : <li>Keine Menükarten gefunden.</li>}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
