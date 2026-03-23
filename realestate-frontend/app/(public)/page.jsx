"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import PropertyGrid from "@/components/property/PropertyGrid";
import MapView from "@/components/map/MapView";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getProperties } from "@/services/property.service";
import { usePropertyStore } from "@/store/usePropertyStore";

const cityCoords = {
  istanbul: { lat: 41.0082, lng: 28.9784 },
  ankara: { lat: 39.9334, lng: 32.8597 },
  izmir: { lat: 38.4192, lng: 27.1287 },
  konya: { lat: 37.8746, lng: 32.4932 },
  antalya: { lat: 36.8969, lng: 30.7133 },
  bursa: { lat: 40.1885, lng: 29.061 },
};

export default function HomePage() {
  const { filters, setFilters, setProperties, setLoading } = usePropertyStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => getProperties({ ...filters, limit: 6 }),
  });

  const properties = useMemo(() => data?.data || [], [data]);

  useEffect(() => {
    setProperties(properties);
    setLoading(isLoading);
  }, [isLoading, properties, setLoading, setProperties]);

  const mapReadyProperties = properties.map((property) => {
    const city = (property.location?.city || "").toLowerCase();
    const fallback = cityCoords[city];
    const coordinates = property.coordinates || fallback || null;
    return { ...property, coordinates };
  });

  function handleSearch(e) {
    e.preventDefault();
  }

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-2xl bg-[#0f172a] px-6 py-16 text-white md:px-12">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_top_right,#d4af37_0,transparent_38%)]" />
        <div className="relative space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-white/80">Vera Real Estate</p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
            Modern Yasamin Yeni Koordinati
          </h1>
          <p className="max-w-2xl text-sm text-white/75 md:text-base">
            Guzel lokasyonlar, akilli filtreler ve premium deneyim ile emlak yolculugunu yeniden
            tanimlayin.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <form className="flex flex-col gap-3 md:flex-row" onSubmit={handleSearch}>
          <Input
            value={filters.city}
            onChange={(e) => setFilters({ city: e.target.value })}
            placeholder="Sehir ara (ornek: Istanbul)"
            className="md:max-w-sm"
          />
          <Button type="submit" className="gap-2" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {isLoading ? "Araniyor" : "Ara"}
          </Button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">One Cikan Ilanlar</h2>
        {isError ? (
          <div className="rounded-lg border border-dashed border-destructive/40 bg-destructive/5 p-5 text-sm text-destructive">
            Ilanlar su an yuklenemedi. Lutfen birazdan tekrar deneyin.
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="h-[340px] w-full" />
            <Skeleton className="h-[340px] w-full" />
            <Skeleton className="h-[340px] w-full" />
          </div>
        ) : (
          <PropertyGrid properties={properties} />
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Haritada Kesfet</h2>
        <MapView properties={mapReadyProperties} />
      </section>
    </div>
  );
}
