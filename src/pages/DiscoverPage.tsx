
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { RestaurantMap } from "@/components/map/RestaurantMap";
import { SearchForm, SearchParams } from "@/components/discover/SearchForm";
import { ResultsGrid } from "@/components/discover/ResultsGrid";
import { PaginationControls } from "@/components/discover/PaginationControls";

// REMOVE: interface SearchParams { ... }
// The SearchParams interface is now only imported, not redeclared in this file

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

  // Map Center
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

  // Helper für Field Change
  const update = <K extends keyof SearchParams>(key: K, value: SearchParams[K]) => {
    setForm((f) => ({ ...f, [key]: value, page: 1 }));
  };

  // Pagination change
  const handlePageChange = (newPage: number) => {
    setForm((f) => ({ ...f, page: newPage }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Restaurants suchen</h1>
      <SearchForm form={form} onChange={update} onSubmit={e => { e.preventDefault(); refetch(); }} />

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

      {data?.data && <ResultsGrid results={data.data} />}

      {data?.meta && (
        <PaginationControls
          page={data.meta.page}
          total={data.meta.total}
          pageSize={data.meta.pageSize}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
