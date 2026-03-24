"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, SearchX } from "lucide-react";
import PropertyGrid from "@/components/property/PropertyGrid";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProperties } from "@/services/property.service";
import { usePropertyStore } from "@/store/usePropertyStore";

export default function ListingsPage() {
  const { filters, setFilters } = usePropertyStore();
  const { data, isLoading, isError } = useQuery({
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-4 rounded-2xl border bg-card p-4">
                <Skeleton className="h-44 w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-card p-8 text-center">
            <AlertTriangle className="mb-3 h-10 w-10 text-accent" />
            <p className="text-lg font-semibold text-slate-900">Ilanlar su an getirilemiyor</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Baglanti veya sunucu kaynakli bir problem olusmus olabilir. Lutfen kisa bir sure sonra tekrar deneyin.
            </p>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-card p-8 text-center">
            <SearchX className="mb-3 h-10 w-10 text-accent" />
            <p className="text-lg font-semibold text-slate-900">Arama kriterlerinize uygun ilan bulunamadi</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Filtreleri degistirerek veya sehir bilgisini guncelleyerek daha fazla sonuca ulasabilirsiniz.
            </p>
          </div>
        ) : (
          <PropertyGrid properties={properties} />
        )}
      </section>
    </div>
  );
}
