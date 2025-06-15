
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Typen importieren, damit Typsicherheit garantiert ist
export interface SearchParams {
  location: string;
  q?: string;
  cuisine?: string;
  price_level?: number;
  open_now?: boolean;
  exclude_allergens?: string[];
  page: number;
  pageSize: number;
}

type Props = {
  form: SearchParams;
  onChange: <K extends keyof SearchParams>(key: K, value: SearchParams[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function SearchForm({ form, onChange, onSubmit }: Props) {
  return (
    <form className="grid grid-cols-4 gap-4 mb-6" onSubmit={onSubmit}>
      <Input
        placeholder="Stadt oder PLZ*"
        value={form.location}
        onChange={e => onChange("location", e.target.value)}
        required
      />
      <Input
        placeholder="Stichwort (z.B. Sushi)"
        value={form.q || ""}
        onChange={e => onChange("q", e.target.value)}
      />
      <select
        value={form.cuisine || ""}
        onChange={e => onChange("cuisine", e.target.value || undefined)}
        className="rounded-md border px-3 py-2"
      >
        <option value="">– Küche –</option>
        <option value="italian">Italienisch</option>
        <option value="japanese">Japanisch</option>
        <option value="vegan">Vegan</option>
      </select>
      <select
        value={form.price_level !== undefined ? String(form.price_level) : ""}
        onChange={e => onChange("price_level", e.target.value ? Number(e.target.value) : undefined)}
        className="rounded-md border px-3 py-2"
      >
        <option value="">– Preis –</option>
        {[0, 1, 2, 3, 4].map(i => (
          <option key={i} value={i}>
            {"€".repeat(i + 1)}
          </option>
        ))}
      </select>
      <div className="flex items-center col-span-2 space-x-2">
        <Checkbox
          checked={!!form.open_now}
          onCheckedChange={v => onChange("open_now", !!v)}
          id="open_now"
        />
        <Label htmlFor="open_now">Jetzt geöffnet</Label>
      </div>
      <select
        multiple
        value={form.exclude_allergens || []}
        onChange={e =>
          onChange(
            "exclude_allergens",
            Array.from(e.target.selectedOptions).map(o => o.value)
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
  );
}
