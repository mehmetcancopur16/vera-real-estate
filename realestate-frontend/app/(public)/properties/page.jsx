"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Building2,
  ChevronDown,
  LayoutGrid,
  List,
  MapPin,
  RefreshCw,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyCardList from "@/components/property/PropertyCardList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProperties } from "@/services/property.service";
import { usePropertyStore } from "@/store/usePropertyStore";

/* ── helpers ── */
const FILTER_LABELS = {
  city: "Şehir",
  type: "Tip",
  listingType: "İlan Türü",
  minPrice: "Min Fiyat",
  maxPrice: "Max Fiyat",
  rooms: "Oda",
  search: "Arama",
};

const TYPE_LABELS = {
  apartment: "Daire",
  house: "Villa / Ev",
  land: "Arsa",
  commercial: "Ticari",
  sale: "Satılık",
  rent: "Kiralık",
};

const SORT_LABELS = {
  newest: "En Yeni",
  price_asc: "Fiyat (Artan)",
  price_desc: "Fiyat (Azalan)",
  featured: "Öne Çıkanlar",
};

function normalize(str) {
  return str
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c");
}

const TR_CITIES = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Aksaray","Amasya","Ankara","Antalya",
  "Ardahan","Artvin","Aydın","Balıkesir","Bartın","Batman","Bayburt","Bilecik",
  "Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli",
  "Diyarbakır","Düzce","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep",
  "Giresun","Gümüşhane","Hakkari","Hatay","Iğdır","Isparta","İstanbul","İzmir",
  "Kahramanmaraş","Karabük","Karaman","Kars","Kastamonu","Kayseri","Kırıkkale",
  "Kırklareli","Kırşehir","Kilis","Kocaeli","Konya","Kütahya","Malatya","Manisa",
  "Mardin","Mersin","Muğla","Muş","Nevşehir","Niğde","Ordu","Osmaniye","Rize",
  "Sakarya","Samsun","Siirt","Sinop","Sivas","Şanlıurfa","Şırnak","Tekirdağ",
  "Tokat","Trabzon","Tunceli","Uşak","Van","Yalova","Yozgat","Zonguldak",
];

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

  function select(city) { onChange(city); setOpen(false); setSearch(""); }
  function clear(e) { e.stopPropagation(); onChange(""); setSearch(""); }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="flex h-10 w-full items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
        <span className={`flex-1 truncate ${value ? "text-slate-800" : "text-slate-500"}`}>
          {value || "Şehir seçin"}
        </span>
        {value
          ? <X className="h-3 w-3 shrink-0 text-slate-400 hover:text-slate-700" onClick={clear} />
          : <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
        }
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-100 p-2">
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Şehir ara..."
              className="w-full rounded-lg bg-slate-50 px-3 py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:bg-slate-100"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0
              ? <li className="px-3 py-2 text-xs text-slate-400">Sonuç bulunamadı</li>
              : filtered.map((city) => (
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
            }
          </ul>
        </div>
      )}
    </div>
  );
}

/* ── Loading skeletons ── */
function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="border-t border-border/60 px-5 py-3">
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

/* ── Main content ── */
function ListingsPageContent() {
  const { filters, setFilters, resetFilters } = usePropertyStore();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const q = searchParams?.toString?.() || "";
    if (!q) { resetFilters(); return; }
    resetFilters();
    setFilters({
      city: searchParams.get("city") || "",
      type: searchParams.get("type") || "",
      listingType: searchParams.get("listingType") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      rooms: searchParams.get("rooms") || "",
      search: searchParams.get("search") || "",
      sortBy: searchParams.get("sortBy") || "newest",
    });
  }, [searchParams, resetFilters, setFilters]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["properties-list", filters],
    queryFn: () => getProperties(filters),
  });

  const properties = useMemo(() => data?.data || [], [data]);
  const total = data?.pagination?.total ?? properties.length;

  const activeFilters = useMemo(() =>
    Object.entries(filters).filter(
      ([key, value]) => key !== "sortBy" && value !== "" && value !== undefined && value !== null
    ), [filters]);

  function removeFilter(key) { setFilters({ [key]: "" }); }

  function filterTagLabel(key, value) {
    const prefix = FILTER_LABELS[key] ?? key;
    const val = TYPE_LABELS[value] ?? value;
    return `${prefix}: ${val}`;
  }

  return (
    <div className="space-y-6 pb-12">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden rounded-3xl bg-primary px-8 py-12 text-white premium-ring md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(212,175,55,0.12),transparent_60%)]" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/8 blur-3xl animate-float" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
              <Sparkles className="h-2.5 w-2.5" />
              Vera Collections
            </span>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">İlan Kataloğu</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
              Türkiye genelinde binlerce satılık ve kiralık mülk arasından size en uygun olanı bulun.
              Filtreler ile aramanızı daraltın.
            </p>
          </div>
          <div className="hidden gap-4 md:flex">
            {[
              { value: "2.400+", label: "Aktif İlan", color: "text-accent" },
              { value: "81", label: "Şehir", color: "text-blue-400" },
              { value: "10+", label: "Yıl Tecrübe", color: "text-emerald-400" },
            ].map(({ value, label, color }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center backdrop-blur-sm">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="mt-0.5 text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LAYOUT ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">

        {/* ── SIDEBAR ── */}
        <aside className="space-y-1 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-accent/10 p-1.5">
                  <SlidersHorizontal className="h-4 w-4 text-accent" />
                </div>
                <h2 className="font-bold text-foreground">Filtreler</h2>
              </div>
              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-accent"
                >
                  <RotateCcw className="h-3 w-3" />
                  Temizle
                </button>
              )}
            </div>

            <div className="space-y-5">
              {/* Sale / Rent toggle */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">İlan Türü</p>
                <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                  {[
                    { value: "sale", label: "Satılık" },
                    { value: "rent", label: "Kiralık" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFilters({ listingType: value })}
                      className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                        filters.listingType === value
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* City combobox */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Şehir</p>
                <CityCombobox value={filters.city} onChange={(city) => setFilters({ city })} />
              </div>

              {/* Search */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Anahtar Kelime</p>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Başlık veya açıklama..."
                    value={filters.search}
                    onChange={(e) => setFilters({ search: e.target.value })}
                    className="h-10 rounded-xl border-slate-300 pl-9 text-sm focus-visible:ring-accent/60"
                  />
                </div>
              </div>

              {/* Type */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Emlak Tipi</p>
                <div className="[&_[data-placeholder]]:text-slate-500">
                  <Select
                    value={filters.type || undefined}
                    onValueChange={(v) => setFilters({ type: v === "_all_" ? "" : v })}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl border-slate-300 text-sm font-medium text-slate-800">
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
              </div>

              {/* Price range */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Fiyat Aralığı (₺)</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">₺</span>
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ minPrice: e.target.value })}
                      className="h-10 rounded-xl border-slate-300 pl-6 text-sm focus-visible:ring-accent/60"
                    />
                  </div>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">₺</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ maxPrice: e.target.value })}
                      className="h-10 rounded-xl border-slate-300 pl-6 text-sm focus-visible:ring-accent/60"
                    />
                  </div>
                </div>
              </div>

              {/* Rooms */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Oda Sayısı</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "", label: "Tümü" },
                    { value: "1", label: "1+" },
                    { value: "2", label: "2+" },
                    { value: "3", label: "3+" },
                    { value: "4", label: "4+" },
                  ].map(({ value, label }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setFilters({ rooms: value })}
                      className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition ${
                        filters.rooms === value
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-slate-200 text-slate-600 hover:border-accent/40 hover:text-accent"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Need help card */}
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-accent/15 p-2.5">
                <Building2 className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Doğru Mülkü Bulamıyor musunuz?</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Uzman danışmanlarımız size özel portföy seçenekleri sunabilir.
                </p>
                <a
                  href="/contact"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                >
                  Danışman Talep Et →
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <section className="min-w-0 space-y-5">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card px-5 py-3.5 shadow-sm">
            <p className="text-sm text-slate-500">
              {isLoading
                ? "İlanlar yükleniyor..."
                : <><span className="font-bold text-foreground">{total.toLocaleString("tr-TR")}</span> ilan bulundu</>
              }
            </p>
            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="hidden items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 sm:flex">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg p-2 transition ${viewMode === "grid" ? "bg-white shadow-sm text-foreground" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg p-2 transition ${viewMode === "list" ? "bg-white shadow-sm text-foreground" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              {/* Sort */}
              <div className="[&_[data-placeholder]]:text-slate-600">
                <Select value={filters.sortBy || "newest"} onValueChange={(v) => setFilters({ sortBy: v })}>
                  <SelectTrigger className="h-9 w-[175px] rounded-xl border-slate-300 text-sm font-medium text-slate-700">
                    <SelectValue placeholder="Sıralama" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">En Yeni</SelectItem>
                    <SelectItem value="price_asc">Fiyat (Artan)</SelectItem>
                    <SelectItem value="price_desc">Fiyat (Azalan)</SelectItem>
                    <SelectItem value="featured">Öne Çıkanlar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Active filter tags */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => removeFilter(key)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/8 px-3 py-1 text-xs font-semibold text-accent transition hover:bg-accent/15"
                >
                  {filterTagLabel(key, String(value))}
                  <X className="h-3 w-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
              >
                Tümünü Temizle
              </button>
            </div>
          )}

          {/* Results */}
          {isLoading ? (
            <div className={`grid gap-6 ${viewMode === "list" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : isError ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-red-200 bg-red-50/40 p-10 text-center">
              <div className="rounded-2xl bg-red-100 p-4">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">İlanlar yüklenemedi</p>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Bağlantı veya sunucu kaynaklı bir problem oluşmuş olabilir. Lütfen kısa süre sonra tekrar deneyin.
                </p>
              </div>
              <Button
                onClick={() => refetch()}
                className="gap-2 bg-gold-gradient font-semibold text-slate-900 hover:brightness-105"
              >
                <RefreshCw className="h-4 w-4" />
                Tekrar Dene
              </Button>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
              <div className="rounded-2xl bg-slate-100 p-4">
                <SearchX className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">Uygun ilan bulunamadı</p>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Arama kriterlerinizi genişleterek daha fazla sonuca ulaşabilirsiniz.
                </p>
              </div>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="gap-2 border-slate-300 font-semibold text-slate-700 hover:border-accent hover:text-accent"
              >
                <Sparkles className="h-4 w-4" />
                Filtreleri Sıfırla
              </Button>
            </div>
          ) : (
            <div
              className={`grid gap-4 ${
                viewMode === "list"
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              }`}
            >
              {properties.map((property, i) =>
                viewMode === "list" ? (
                  <PropertyCardList key={property._id || property.id} property={property} index={i} />
                ) : (
                  <PropertyCard key={property._id || property.id} property={property} />
                )
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6 pb-12">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          <Skeleton className="h-[500px] rounded-2xl" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[360px] rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    }>
      <ListingsPageContent />
    </Suspense>
  );
}
