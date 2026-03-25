"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  ArrowRight,
  Building,
  Home,
  MapPin,
  Search,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProperties } from "@/services/property.service";
import { usePropertyStore } from "@/store/usePropertyStore";

const popularLocations = [
  {
    city: "Istanbul",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1400&auto=format&fit=crop",
  },
  {
    city: "Ankara",
    image:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1400&auto=format&fit=crop",
  },
  {
    city: "Izmir",
    image:
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=1400&auto=format&fit=crop",
  },
  {
    city: "Konya",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1400&auto=format&fit=crop",
  },
];

export default function HomePage() {
  const { filters, setFilters } = usePropertyStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["featured-properties", filters.city, filters.type, filters.listingType],
    queryFn: async () =>
      getProperties({
        limit: 6,
        city: filters.city,
        type: filters.type,
        listingType: filters.listingType,
      }),
  });

  const properties = useMemo(() => data?.data || [], [data]);

  return (
    <div className="space-y-24 pb-12">
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden rounded-3xl text-white">
        <Image
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2000&auto=format&fit=crop"
          alt="Luxury estate"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="relative px-6 py-24 text-center md:px-12">
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <p className="text-sm uppercase tracking-[0.24em] text-white/80">Vera Real Estate</p>
            <h1 className="mx-auto max-w-5xl text-4xl font-semibold leading-tight md:text-6xl">
              Modern Yasamin Yeni Koordinatini Kesfedin
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-slate-200 md:text-base">
              Seckin portfoyumuz, guvenilir danismanlik yaklasimimiz ve luks odakli deneyimimiz ile
              hayalinizdeki yasam alanina bir adim daha yakin olun.
            </p>
            <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs text-white/90 backdrop-blur">
              500+ mutlu aile | 10+ yil tecrube | 2 milyar TL+ hacim
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 -bottom-16 px-4">
          <div className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xl">
            <div className="mb-4 inline-flex rounded-full bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setFilters({ listingType: "sale" })}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  filters.listingType !== "rent" ? "bg-primary text-white" : "text-slate-600"
                }`}
              >
                Satilik
              </button>
              <button
                type="button"
                onClick={() => setFilters({ listingType: "rent" })}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  filters.listingType === "rent" ? "bg-primary text-white" : "text-slate-600"
                }`}
              >
                Kiralik
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Input
                value={filters.city}
                onChange={(e) => setFilters({ city: e.target.value })}
                placeholder="Sehir / Ilce"
                className="h-11 border-slate-200"
              />
              <Select value={filters.type || "all"} onValueChange={(value) => setFilters({ type: value === "all" ? "" : value })}>
                <SelectTrigger className="h-11 w-full border-slate-200">
                  <SelectValue placeholder="Emlak Tipi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tum Tipler</SelectItem>
                  <SelectItem value="apartment">Daire</SelectItem>
                  <SelectItem value="house">Villa / Ev</SelectItem>
                  <SelectItem value="land">Arsa</SelectItem>
                  <SelectItem value="commercial">Ticari</SelectItem>
                </SelectContent>
              </Select>
              <Button className="h-11 gap-2 bg-accent text-primary-foreground hover:bg-accent/90 transition-all">
                <Search className="h-4 w-4" />
                Arama Yap
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 pt-18">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-12 bg-accent" />
            <h2 className="text-2xl font-semibold">Seckin Portfoyumuz</h2>
          </div>
          <span className="text-sm text-slate-500">Canli verilerle guncellenen premium ilanlar</span>
        </div>
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <div
                key={property._id || property.id}
                className="rounded-2xl border border-transparent transition-transform duration-300 hover:-translate-y-2 hover:border-slate-200"
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Populer Lokasyonlar</h2>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-accent">
            Tum Lokasyonlar <ArrowRight className="h-4 w-4" />
          </span>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {popularLocations.map((location) => (
            <article key={location.city} className="group relative overflow-hidden rounded-xl border border-slate-200">
              <div className="relative h-64">
                <Image
                  src={location.image}
                  alt={location.city}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/45 transition-colors duration-500 group-hover:bg-black/25" />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white transition-colors group-hover:text-accent">{location.city}</p>
                    <p className="inline-flex items-center gap-1 text-xs text-slate-200">
                      <MapPin className="h-3.5 w-3.5" />
                      Seckin bolgeler
                    </p>
                  </div>
                  {location.city === "Istanbul" || location.city === "Izmir" ? (
                    <Home className="h-5 w-5 text-white/90" />
                  ) : (
                    <Building className="h-5 w-5 text-white/90" />
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-primary px-6 py-10 md:px-8">
        <h2 className="mb-2 text-2xl font-semibold text-white">Neden Vera?</h2>
        <p className="mb-6 max-w-2xl text-sm text-slate-300">
          Sadece ilan listelemiyor, sizin icin dogru yatirimi dogru zamanda dogru stratejiyle planliyoruz.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
            <Shield className="h-10 w-10 text-accent" />
            <h3 className="mt-3 text-lg font-semibold text-white">Guvenilir Danismanlik</h3>
            <p className="mt-2 text-sm text-slate-300">
              Her asamada seffaf, veriye dayali ve profesyonel yonlendirmelerle sureci guvenle yonetiyoruz.
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
            <Star className="h-10 w-10 text-accent" />
            <h3 className="mt-3 text-lg font-semibold text-white">Luks ve Seckin Portfoy</h3>
            <p className="mt-2 text-sm text-slate-300">
              Premium konutlardan prestijli ticari alanlara kadar secici portfoyumuzla fark yaratiyoruz.
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
            <TrendingUp className="h-10 w-10 text-accent" />
            <h3 className="mt-3 text-lg font-semibold text-white">Deger Katan Yatirimlar</h3>
            <p className="mt-2 text-sm text-slate-300">
              Bolgesel analiz ve piyasa takibiyle uzun vadede yuksek potansiyel tasiyan firsatlar sunuyoruz.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
