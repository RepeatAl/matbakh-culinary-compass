import React from "react";

import { BusinessProfileResult, searchBusinessProfile } from "@/services/businessProfileService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

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

async function fetchSearch(params: SearchParams) {
  return await searchBusinessProfile(
    params.q || "",
    params.location,
    params.cuisine,
    params.price_level,
    params.open_now,
    params.exclude_allergens,
    params.page,
    params.pageSize
  );
}

export default function DiscoverPage() {
  const [form, setForm] = useState<SearchParams>({
    location: '',
    page: 1,
    pageSize: 20,
  });

  const { data, isLoading, isError, refetch } = useQuery(
    ['business-search', form],
    () => fetchSearch(form),
    { enabled: !!form.location }
  );

  const update = <K extends keyof SearchParams>(key: K, value: SearchParams[K]) =>
    setForm(f => ({ ...f, [key]: value, page: 1 }));

  // Karte: Berechne Map Center anhand des ersten Ergebnisses oder Default Berlin
  const mapCenter = useMemo(() => {
    if (data?.data?.length && data.data[0].location?.lat && data.data[0].location?.lng) {
      return {
        lat: data.data[0].location.lat,
        lng: data.data[0].location.lng,
      };
    }
    // Default auf Berlin (z.B.)
    return { lat: 52.5208, lng: 13.4094 };
  }, [data]);

  // Kartenoptionen
  const mapContainerStyle = { width: '100%', height: '400px' };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Restaurants suchen</h1>
      <form
        className="grid grid-cols-4 gap-4 mb-6"
        onSubmit={e => {
          e.preventDefault();
          refetch();
        }}
      >
        <Input
          placeholder="Stadt oder PLZ*"
          value={form.location}
          onChange={e => update('location', e.target.value)}
          required
        />
        <Input
          placeholder="Stichwort (z.B. Sushi)"
          value={form.q || ''}
          onChange={e => update('q', e.target.value)}
        />
        <Select
          value={form.cuisine || ''}
          onChange={e => update('cuisine', e.target.value || undefined)}
        >
          <option value="">– Küche –</option>
          <option value="italian">Italienisch</option>
          <option value="japanese">Japanisch</option>
          <option value="vegan">Vegan</option>
        </Select>
        <Select
          value={form.price_level ?? ''}
          onChange={e =>
            update(
              'price_level',
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        >
          <option value="">– Preis –</option>
          {[0, 1, 2, 3, 4].map(i => (
            <option key={i} value={i}>
              {'€'.repeat(i + 1)}
            </option>
          ))}
        </Select>
        <div className="flex items-center space-x-2 col-span-2">
          <Checkbox
            checked={form.open_now || false}
            onCheckedChange={v => update('open_now', v)}
          >
            Jetzt geöffnet
          </Checkbox>
        </div>
        <Select
          multiple
          value={form.exclude_allergens || []}
          onChange={e =>
            update(
              'exclude_allergens',
              Array.from(e.target.selectedOptions).map(o => o.value)
            )
          }
          className="col-span-2"
        >
          <option value="" disabled>
            – Allergene ausschließen –
          </option>
          <option value="gluten">Gluten</option>
          <option value="lactose">Laktose</option>
          <option value="nuts">Nüsse</option>
        </Select>
        <Button type="submit" className="col-span-4">
          Suchen
        </Button>
      </form>

      {/* 1. Google Map */}
      <div className="w-full mb-8">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={13}
          >
            {/* Marker für jedes Restaurant */}
            {data?.data?.map((r) =>
              r.location?.lat && r.location?.lng ? (
                <Marker
                  key={r.place_id}
                  position={{ lat: r.location.lat, lng: r.location.lng }}
                  title={r.name}
                />
              ) : null
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      {isLoading && <p>Ergebnisse laden…</p>}
      {isError && <p className="text-red-600">Fehler bei der Suche!</p>}

      <div className="grid grid-cols-3 gap-4">
        {data?.data.map(r => (
          <Card key={r.place_id}>
            <CardHeader title={r.name} subtitle={r.address} />
            <CardContent>
              <p>
                ⭐ {r.rating}{' '}
                {r.price_level !== undefined &&
                  '|' + '€'.repeat(r.price_level + 1)}
              </p>
              <ul className="list-disc list-inside">
                {r.menu_preview.map((m, i) => (
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
          <Pagination
            currentPage={data.meta.page}
            totalItems={data.meta.total}
            pageSize={data.meta.pageSize}
            onPageChange={newPage => {
              setForm(f => ({ ...f, page: newPage }))
            }}
          />
        </div>
      )}
    </div>
  );
}
