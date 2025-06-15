import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { RestaurantMap } from "@/components/map/RestaurantMap";

// Typen für die Search-Params
interface SearchParams {
  location: string;
  q?: string;
  cuisine?: string;
  price_level?: number;
  open_now?: boolean;
  exclude_allergens?: string[];
  page: number;
  pageSize: number;
}

// Meta-Antwort von der Edge Function
interface Meta {
  page: number;
  pageSize: number;
  total: number;
}

// Ergebnis-Item
interface RestaurantSummary {
  place_id: string;
  name: string;
  address: string;
  rating: number;
  location?: { lat: number; lng: number };
  photo_url?: string;
  price_level?: number;
  menu_preview: string[];
}

// Wrapper um deinen Fetch-Call
async function fetchSearch(params: SearchParams): Promise<{ data: RestaurantSummary[]; meta: Meta }> {
  const url = new URL(
    `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || ""}/business-search`
  );
  if (!url.hostname) {
    // Fallback falls keine VAR gesetzt
    url.href = `/functions/v1/business-search`;
  }
  Object.entries(params).forEach(([k, v]) => {
    if (v != null) {
      if (Array.isArray(v)) {
        v.forEach((item) => url.searchParams.append(k, item));
      } else {
        url.searchParams.set(k, String(v));
      }
    }
  });
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export default function DiscoverPage() {
  // Form-State
  const [form, setForm] = useState<SearchParams>({
    location: "",
    page: 1,
    pageSize: 20,
  });

  // React Query im Object style + Typisierung debug
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["business-search", form],
    queryFn: () => fetchSearch(form),
    enabled: !!form.location,
  });

  // Map Center: Erster Treffer oder Berlin
  const mapCenter = useMemo(() => {
    if (data?.data?.length && data.data[0]?.location?.lat && data.data[0]?.location?.lng) {
      return {
        lat: data.data[0].location.lat,
        lng: data.data[0].location.lng,
      };
    }
    // Default auf Berlin
    return { lat: 52.5208, lng: 13.4094 };
  }, [data]);

  const mapContainerStyle = { width: "100%", height: "400px" };

  // Helper für Field Change
  const update = <K extends keyof SearchParams>(key: K, value: SearchParams[K]) => {
    setForm((f) => ({ ...f, [key]: value, page: 1 }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Restaurants suchen</h1>
      <form
        className="grid grid-cols-4 gap-4 mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          refetch();
        }}
      >
        <Input
          placeholder="Stadt oder PLZ*"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          required
        />
        <Input
          placeholder="Stichwort (z.B. Sushi)"
          value={form.q || ""}
          onChange={(e) => update("q", e.target.value)}
        />
        <select
          value={form.cuisine || ""}
          onChange={(e) => update("cuisine", e.target.value || undefined)}
          className="rounded-md border px-3 py-2"
        >
          <option value="">– Küche –</option>
          <option value="italian">Italienisch</option>
          <option value="japanese">Japanisch</option>
          <option value="vegan">Vegan</option>
        </select>
        <select
          value={form.price_level !== undefined ? String(form.price_level) : ""}
          onChange={(e) =>
            update(
              "price_level",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          className="rounded-md border px-3 py-2"
        >
          <option value="">– Preis –</option>
          {[0, 1, 2, 3, 4].map((i) => (
            <option key={i} value={i}>
              {"€".repeat(i + 1)}
            </option>
          ))}
        </select>
        <div className="flex items-center col-span-2 space-x-2">
          <Checkbox
            checked={!!form.open_now}
            onCheckedChange={(v) => update("open_now", !!v)}
            id="open_now"
          />
          <Label htmlFor="open_now">Jetzt geöffnet</Label>
        </div>
        <select
          multiple
          value={form.exclude_allergens || []}
          onChange={(e) =>
            update(
              "exclude_allergens",
              Array.from(e.target.selectedOptions).map((o) => o.value)
            )
          }
          className="col-span-2 rounded-md border px-3 py-2"
        >
          <option value="" disabled>
            – Allergene ausschließen –
          </option>
          <option value="gluten">Gluten</option>
          <option value="lactose">Laktose</option>
          <option value="nuts">Nüsse</option>
        </select>

        <Button type="submit" className="col-span-4">
          Suchen
        </Button>
      </form>

      {/* DSGVO-konforme Google Map */}
      <div className="w-full mb-8">
        <RestaurantMap
          center={mapCenter}
          markers={
            data?.data?.flatMap(r =>
              r.location?.lat && r.location?.lng
                ? [{
                    id: r.place_id,
                    position: { lat: r.location.lat, lng: r.location.lng },
                    title: r.name,
                  }]
                : []
            ) || []
          }
        />
      </div>

      {isLoading && <p>Ergebnisse laden…</p>}
      {isError && <p className="text-red-600">Fehler bei der Suche!</p>}

      <div className="grid grid-cols-3 gap-4">
        {data?.data?.map((r) => (
          <Card key={r.place_id}>
            <CardHeader>
              <CardTitle>{r.name}</CardTitle>
              <CardDescription>{r.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                ⭐ {r.rating}{" "}
                {r.price_level !== undefined &&
                  "|" + "€".repeat(r.price_level + 1)}
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

      {/* Pagination */}
      {data?.meta && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationPrevious
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  page: Math.max(1, data.meta.page - 1),
                }))
              }
              className={data.meta.page === 1 ? "pointer-events-none opacity-50" : ""}
            >
              Zurück
            </PaginationPrevious>
            <PaginationContent>
              {Array.from(
                { length: Math.ceil(data.meta.total / data.meta.pageSize) },
                (_, i) => (
                  <li key={i}>
                    <PaginationLink
                      isActive={data.meta.page === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setForm((f) => ({ ...f, page: i + 1 }));
                      }}
                      href="#"
                    >
                      {i + 1}
                    </PaginationLink>
                  </li>
                )
              )}
            </PaginationContent>
            <PaginationNext
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  page: Math.min(
                    Math.ceil(data.meta.total / data.meta.pageSize),
                    data.meta.page + 1
                  ),
                }))
              }
              className={
                data.meta.page ===
                Math.ceil(data.meta.total / data.meta.pageSize)
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            >
              Weiter
            </PaginationNext>
          </Pagination>
        </div>
      )}
    </div>
  );
}
