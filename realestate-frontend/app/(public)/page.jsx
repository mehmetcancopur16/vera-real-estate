"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  MapPin,
  Search,
  Shield,
  Star,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProperties } from "@/services/property.service";
import { usePropertyStore } from "@/store/usePropertyStore";

const TR_CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya",
  "Ankara", "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın",
  "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur",
  "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce",
  "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep",
  "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta",
  "İstanbul", "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars",
  "Kastamonu", "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir", "Kilis",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin",
  "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize",
  "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak",
  "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova",
  "Yozgat", "Zonguldak",
];

const popularLocations = [
  {
    city: "İstanbul",
    cityEn: "İstanbul",
    subtitle: "12.000+ İlan",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1400&auto=format&fit=crop",
  },
  {
    city: "Ankara",
    cityEn: "Ankara",
    subtitle: "5.400+ İlan",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1400&auto=format&fit=crop",
  },
  {
    city: "İzmir",
    cityEn: "İzmir",
    subtitle: "4.200+ İlan",
    image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=1400&auto=format&fit=crop",
  },
  {
    city: "Konya",
    cityEn: "Konya",
    subtitle: "1.800+ İlan",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1400&auto=format&fit=crop",
  },
];

const stats = [
  { label: "Mutlu Aile", value: "500+" },
  { label: "Aktif İlan", value: "2.400+" },
  { label: "Yıl Tecrübe", value: "10+" },
  { label: "İşlem Hacmi", value: "₺2M+" },
];

const features = [
  {
    icon: Shield,
    title: "Güvenilir Danışmanlık",
    desc: "Her aşamada şeffaf, veriye dayalı ve profesyonel yönlendirmelerle süreci güvenle yönetiyoruz.",
    gradient: "from-blue-500/15 to-blue-700/5",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Star,
    title: "Lüks ve Seçkin Portföy",
    desc: "Premium konutlardan prestijli ticari alanlara kadar seçici portföyümüzle fark yaratıyoruz.",
    gradient: "from-amber-500/15 to-amber-700/5",
    iconBg: "bg-amber-500/20",
    iconColor: "text-accent",
  },
  {
    icon: TrendingUp,
    title: "Değer Katan Yatırımlar",
    desc: "Bölgesel analiz ve piyasa takibiyle uzun vadede yüksek potansiyel taşıyan fırsatlar sunuyoruz.",
    gradient: "from-emerald-500/15 to-emerald-700/5",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
  },
];

function normalize(str) {
  return str
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function CityCombobox({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return TR_CITIES;
    const q = normalize(search.trim());
    return TR_CITIES.filter((c) => normalize(c).includes(q));
  }, [search]);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(city) {
    onChange(city);
    setOpen(false);
    setSearch("");
  }

  function clear(e) {
    e.stopPropagation();
    onChange("");
    setSearch("");
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="flex h-12 w-full items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
        <span className={`flex-1 truncate ${value ? "text-slate-900" : "text-slate-500"}`}>
          {value || "Şehir Seçin"}
        </span>
        {value ? (
          <X className="h-3.5 w-3.5 shrink-0 text-slate-400 hover:text-slate-700" onClick={clear} />
        ) : (
          <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-100 p-2">
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Şehir ara..."
              className="w-full rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:bg-slate-100"
            />
          </div>
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-xs text-slate-400">Sonuç bulunamadı</li>
            ) : (
              filtered.map((city) => (
                <li key={city}>
                  <button
                    type="button"
                    onClick={() => select(city)}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-accent/10 hover:text-accent ${
                      value === city ? "bg-accent/10 font-semibold text-accent" : "text-slate-800"
                    }`}
                  >
                    {city}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const { filters, setFilters } = usePropertyStore();
  const router = useRouter();

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
  const listingType = filters.listingType || "sale";
  const hasFeaturedProperties = properties.length > 0;

  const buildFilterQuery = useCallback(() => {
    const query = new URLSearchParams();
    if (filters.city?.trim()) query.set("city", filters.city.trim());
    if (filters.type?.trim()) query.set("type", filters.type.trim());
    if (filters.listingType?.trim()) query.set("listingType", filters.listingType.trim());
    return query.toString();
  }, [filters.city, filters.listingType, filters.type]);

  const handleSearch = useCallback(() => {
    const query = buildFilterQuery();
    router.push(query ? `/properties?${query}` : "/properties");
  }, [buildFilterQuery, router]);

  return (
    <div className="space-y-24 pb-12">

      {/* ── HERO ── */}
      <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden rounded-3xl text-white">
        <Image
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2000&auto=format&fit=crop"
          alt="Luxury estate"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/50 to-slate-950/88" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_35%_25%,rgba(212,175,55,0.14),transparent_58%)]" />

        <div className="relative z-10 w-full px-6 py-24 text-center md:px-12">
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-7">

            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-black/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent backdrop-blur-md">
              <span className="size-1.5 animate-pulse rounded-full bg-accent" />
              Türkiye&apos;nin Premium Emlak Platformu
            </span>

            <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-2xl md:text-7xl">
              Hayalinizdeki{" "}
              <span className="text-gradient-gold">Evi</span>{" "}
              Birlikte Bulalım
            </h1>

            <p className="mx-auto max-w-xl text-base text-slate-300 md:text-lg">
              Seçkin portföyümüz ve güvenilir danışmanlık anlayışımızla
              yaşam alanınızı birlikte keşfedelim.
            </p>

            {/* Search Panel */}
            <div className="mx-auto mt-4 w-full max-w-3xl rounded-2xl border border-white/20 bg-black/30 p-3 shadow-2xl backdrop-blur-xl">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_auto]">
                <CityCombobox
                  value={filters.city}
                  onChange={(city) => setFilters({ city })}
                />
                <div className="[&_[data-placeholder]]:text-slate-500 [&_[data-placeholder]]:font-normal">
                  <Select
                    value={filters.type || undefined}
                    onValueChange={(v) => setFilters({ type: v === "_all_" ? "" : v })}
                  >
                    <SelectTrigger className="h-12 w-full rounded-xl border-slate-300 bg-white font-medium text-slate-900 focus:ring-accent/60">
                      <SelectValue placeholder="Tüm Tipler" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_all_">Tüm Tipler</SelectItem>
                      <SelectItem value="apartment">Daire</SelectItem>
                      <SelectItem value="house">Villa / Ev</SelectItem>
                      <SelectItem value="land">Arsa</SelectItem>
                      <SelectItem value="commercial">Ticari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-12 gap-2 rounded-xl bg-gold-gradient px-8 font-bold text-slate-900 shadow-lg transition-all hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Search className="h-4 w-4" />
                  Ara
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-slate-950/65 backdrop-blur-md">
          <div className="mx-auto grid max-w-3xl grid-cols-2 md:grid-cols-4">
            {stats.map(({ label, value }, i) => (
              <div
                key={label}
                className={`flex flex-col items-center justify-center gap-0.5 px-4 py-5 ${
                  i > 0 ? "border-l border-white/10" : ""
                }`}
              >
                <p className="text-2xl font-bold text-accent">{value}</p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ── */}
      <section className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-accent">Portföyümüz</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Seçkin İlanlar</h2>
          </div>
          <Link
            href="/properties"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-all"
          >
            Tümünü Gör
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setFilters({ listingType: "sale" })}
            className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
              listingType !== "rent"
                ? "bg-slate-900 text-white shadow"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Satılık
          </button>
          <button
            type="button"
            onClick={() => setFilters({ listingType: "rent" })}
            className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
              listingType === "rent"
                ? "bg-slate-900 text-white shadow"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Kiralık
          </button>
        </div>

        {isError ? (
          <div className="rounded-xl border border-dashed border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
            İlanlar şu an yüklenemedi. Lütfen birazdan tekrar deneyin.
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[340px] w-full rounded-2xl" />
            ))}
          </div>
        ) : hasFeaturedProperties ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <div
                key={property._id || property.id}
                className="group rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-xl"
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center text-sm text-muted-foreground">
            Seçilen kriterlere uygun öne çıkan ilan bulunamadı. Farklı bir şehir veya emlak tipi deneyin.
          </div>
        )}
      </section>

      {/* ── POPULAR LOCATIONS ── */}
      <section className="space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-accent">Keşfedin</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Popüler Lokasyonlar</h2>
          </div>
          <Link
            href="/properties"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
          >
            Tüm Lokasyonlar
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {popularLocations.map((location) => (
            <Link
              key={location.city}
              href={`/properties?city=${encodeURIComponent(location.cityEn)}&listingType=${listingType}`}
              className="group relative block overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="relative h-72">
                <Image
                  src={location.image}
                  alt={location.city}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xl font-bold text-white transition-colors group-hover:text-accent">
                    {location.city}
                  </p>
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-medium text-accent backdrop-blur-sm">
                    <MapPin className="h-3 w-3" />
                    {location.subtitle}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── WHY VERA ── */}
      <section className="rounded-3xl bg-primary px-6 py-16 md:px-10 premium-ring">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Farkımız</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Neden Vera?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400">
            Sadece ilan listelemiyor, sizin için doğru yatırımı doğru zamanda doğru stratejiyle planlıyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${f.gradient} p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30`}
            >
              <div className={`mb-5 inline-flex rounded-2xl ${f.iconBg} p-3.5`}>
                <f.icon className={`h-6 w-6 ${f.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-300">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-20 text-center md:px-10 premium-ring">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.18),transparent_65%)]" />
        <div className="relative mx-auto max-w-2xl space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Hemen Başlayın</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Gayrimenkulünüzü İlan Edin
          </h2>
          <p className="text-base leading-relaxed text-slate-300">
            Binlerce potansiyel alıcı ve kiracıya ulaşmak için ilan oluşturun.
            Ücretsiz ve dakikalar içinde hazır.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-gold-gradient px-8 py-3 text-base font-bold text-slate-900 shadow-lg transition hover:brightness-110"
            >
              Ücretsiz Üye Ol
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/50 px-8 py-3 text-base font-semibold text-white transition hover:border-accent hover:bg-white/10 hover:text-accent"
            >
              İlanları İncele
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
