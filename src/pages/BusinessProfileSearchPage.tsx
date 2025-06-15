
import React, { useState } from "react";
import { searchBusinessProfile, BusinessProfileResult } from "@/services/businessProfileService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function BusinessProfileSearchPage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState<BusinessProfileResult[]>([]);
  const [loading, setLoading] = useState(false);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    try {
      const res = await searchBusinessProfile(query, location);
      setResults(res);
      if (!res.length) toast({ title: "Keine Einträge gefunden!" });
    } catch (e) {
      toast({ title: "Fehler", description: String(e) });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Google Business Suche</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSearch} className="flex gap-2 mb-3 flex-wrap">
            <Input
              placeholder="Suchbegriff (z.B. Pizzeria Mario)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              required
            />
            <Input
              placeholder="Ort/Postleitzahl (optional)"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Suche..." : "Suchen"}
            </Button>
          </form>
          {results.length > 0 && (
            <ul className="space-y-3">
              {results.map(r => (
                <li key={r.place_id}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{r.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>Adresse: {r.address}</div>
                      {r.rating && (
                        <div>Bewertung: {r.rating} ⭐ ({r.user_ratings_total || 0} Bewertungen)</div>
                      )}
                      {r.website && (
                        <div>
                          Website:{" "}
                          <a href={r.website} target="_blank" rel="noopener" className="underline text-primary">
                            {r.website}
                          </a>
                        </div>
                      )}
                      <a
                        href={`https://www.google.com/maps/place/?q=place_id:${r.place_id}`}
                        target="_blank"
                        rel="noopener"
                        className="underline text-blue-600"
                      >
                        In Google Maps ansehen
                      </a>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
