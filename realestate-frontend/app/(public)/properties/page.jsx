"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import PropertyGrid from "@/components/property/PropertyGrid";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProperties } from "@/services/property.service";
import { usePropertyStore } from "@/store/usePropertyStore";

export default function ListingsPage() {
  const { filters, setFilters } = usePropertyStore();
  const { data, isLoading } = useQuery({
    queryKey: ["properties-list", filters],
    queryFn: () => getProperties(filters),
  });

  const properties = useMemo(() => data?.data || [], [data]);
  const total = data?.pagination?.total || properties.length;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="rounded-xl border bg-card p-4 lg:sticky lg:top-24 lg:h-fit">
        <h2 className="mb-3 text-lg font-semibold">Gelismis Filtreleme</h2>
        <div className="space-y-3">
          <Input placeholder="Sehir" value={filters.city} onChange={(e) => setFilters({ city: e.target.value })} />
          <Select value={filters.listingType || "all"} onValueChange={(v) => setFilters({ listingType: v === "all" ? "" : v })}>
            <SelectTrigger><SelectValue placeholder="Satilik / Kiralik" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tum Ilanlar</SelectItem>
              <SelectItem value="sale">Satilik</SelectItem>
              <SelectItem value="rent">Kiralik</SelectItem>
            </SelectContent>
          </Select>
          <Input type="number" placeholder="Oda Sayisi" value={filters.rooms} onChange={(e) => setFilters({ rooms: e.target.value })} />
        </div>
      </aside>
      <section className="space-y-4">
        <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">{total} adet ilan bulundu</div>
        {isLoading ? (
          <div className="inline-flex items-center gap-2 rounded-xl border bg-card p-4 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Ilanlar yukleniyor...
          </div>
        ) : (
          <PropertyGrid properties={properties} />
        )}
      </section>
    </div>
  );
}
