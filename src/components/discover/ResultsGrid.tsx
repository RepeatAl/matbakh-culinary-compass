
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Typen importieren!
export interface RestaurantSummary {
  place_id: string;
  name: string;
  address: string;
  rating: number;
  location?: { lat: number; lng: number };
  photo_url?: string;
  price_level?: number;
  menu_preview: string[];
}

type Props = {
  results: RestaurantSummary[];
};

export function ResultsGrid({ results }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {results.map((r) => (
        <Card key={r.place_id}>
          <CardHeader>
            <CardTitle>{r.name}</CardTitle>
            <CardDescription>{r.address}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              ⭐ {r.rating}{" "}
              {r.price_level !== undefined && "|" + "€".repeat(r.price_level + 1)}
            </p>
            <ul className="list-disc list-inside">
              {r.menu_preview?.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
