"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RotateCcw, Search, SearchX, SlidersHorizontal, Sparkles } from "lucide-react";
import PropertyGrid from "@/components/property/PropertyGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProperties } from "@/services/property.service";
import { usePropertyStore } from "@/store/usePropertyStore";

export default function ListingsPage() {
  const { filters, setFilters, resetFilters } = usePropertyStore();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["properties-list", filters],
    queryFn: () => getProperties(filters),
  });

  const properties = useMemo(() => data?.data || [], [data]);
  const total = data?.pagination?.total || properties.length;
  const activeFilters = useMemo(() => {
    return Object.entries(filters).filter(
      ([key, value]) => key !== "sortBy" && value !== "" && value !== undefined && value !== null
    );
  }, [filters]);

  function removeFilter(key) {
    setFilters({ [key]: "" });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-primary px-6 py-10 text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Vera Collections</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Seckin Ilanlar</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Lokasyon, butce ve yasam stilinize en uygun premium portfoyleri filtreleyin.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[330px_1fr]">
      <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:h-fit">
        <div className="mb-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-accent" />
            <h2 className="text-lg font-semibold">Filtreler</h2>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-medium text-slate-500 transition hover:text-accent"
          >
            Temizle
          </button>
        </div>

        <div className="space-y-4">
          <div className="inline-flex rounded-full bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setFilters({ listingType: "sale" })}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                filters.listingType !== "rent" ? "bg-primary text-white" : "text-slate-600"
              }`}
            >
              Satilik
            </button>
            <button
              type="button"
              onClick={() => setFilters({ listingType: "rent" })}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                filters.listingType === "rent" ? "bg-primary text-white" : "text-slate-600"
              }`}
            >
              Kiralik
            </button>
          </div>

          <Input placeholder="Sehir veya ilce" value={filters.city} onChange={(e) => setFilters({ city: e.target.value })} />
          <Input placeholder="Arama (baslik, aciklama)" value={filters.search} onChange={(e) => setFilters({ search: e.target.value })} />

          <Select value={filters.type || "all"} onValueChange={(v) => setFilters({ type: v === "all" ? "" : v })}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Emlak tipi" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tum tipler</SelectItem>
              <SelectItem value="apartment">Daire</SelectItem>
              <SelectItem value="house">Villa / Ev</SelectItem>
              <SelectItem value="land">Arsa</SelectItem>
              <SelectItem value="commercial">Ticari</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input type="number" placeholder="Min fiyat" value={filters.minPrice} onChange={(e) => setFilters({ minPrice: e.target.value })} />
            <Input type="number" placeholder="Max fiyat" value={filters.maxPrice} onChange={(e) => setFilters({ maxPrice: e.target.value })} />
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Oda Sayisi</p>
            <div className="flex flex-wrap gap-2">
              {["", "1", "2", "3", "4"].map((room) => {
                const label = room ? `${room}+` : "Tum";
                const active = filters.rooms === room;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setFilters({ rooms: room })}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      active ? "border-accent bg-accent/15 text-accent" : "border-slate-200 text-slate-600 hover:border-accent/50"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
          <p className="text-slate-600"><span className="font-semibold text-slate-900">{total}</span> adet ilan bulundu</p>
          <Select value={filters.sortBy || "newest"} onValueChange={(v) => setFilters({ sortBy: v })}>
            <SelectTrigger className="w-full sm:w-[210px]"><SelectValue placeholder="Siralama" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">En yeni</SelectItem>
              <SelectItem value="price_asc">Fiyat (artan)</SelectItem>
              <SelectItem value="price_desc">Fiyat (azalan)</SelectItem>
              <SelectItem value="featured">One cikanlar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => removeFilter(key)}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-accent hover:text-accent"
              >
                {key}: {String(value)}
                <RotateCcw className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}

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
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <AlertTriangle className="mb-3 h-10 w-10 text-accent" />
            <p className="text-lg font-semibold text-slate-900">Ilanlar su an getirilemiyor</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Baglanti veya sunucu kaynakli bir problem olusmus olabilir. Lutfen kisa bir sure sonra tekrar deneyin.
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4 gap-2 bg-accent text-primary">
              <Search className="h-4 w-4" />
              Tekrar Dene
            </Button>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <SearchX className="mb-3 h-10 w-10 text-accent" />
            <p className="text-lg font-semibold text-slate-900">Arama kriterlerinize uygun ilan bulunamadi</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Filtreleri degistirerek veya sehir bilgisini guncelleyerek daha fazla sonuca ulasabilirsiniz.
            </p>
            <Button onClick={resetFilters} variant="outline" className="mt-4 gap-2">
              <Sparkles className="h-4 w-4" />
              Filtreleri Sifirla
            </Button>
          </div>
        ) : (
          <PropertyGrid properties={properties} />
        )}
      </section>
      </div>
    </div>
  );
}
