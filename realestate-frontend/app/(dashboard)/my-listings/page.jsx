"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowDownAZ,
  ArrowDownWideNarrow,
  ArrowUpAZ,
  ArrowUpWideNarrow,
  BedDouble,
  Bath,
  Building,
  Building2,
  Calendar,
  Check,
  Clock,
  Dot,
  Edit,
  Eye,
  EyeOff,
  Grid2X2,
  LayoutList,
  Loader2,
  MapPin,
  Maximize2,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteMyProperty, getMyProperties, updateProperty } from "@/services/property.service";

/* ─── helpers ─── */
function formatTry(price) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price || 0);
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

function minutesAgo(dateString) {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return null;
  const diffMs = Date.now() - d.getTime();
  if (diffMs < 0) return null;
  return Math.floor(diffMs / (1000 * 60));
}

function formatRelative(dateString) {
  const m = minutesAgo(dateString);
  if (m == null) return "-";
  if (m < 1) return "Az önce";
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} saat önce`;
  const day = Math.floor(h / 24);
  if (day < 7) return `${day} gün önce`;
  return formatDate(dateString);
}

/* ─── animated counter ─── */
function AnimatedNumber({ value, duration = 900 }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const target = Number(value) || 0;
    const start = 0;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + eased * (target - start)));
      if (progress < 1) rafRef.current = requestAnimationFrame(update);
    }

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <>{display.toLocaleString("tr-TR")}</>;
}

/* ─── shimmer skeleton ─── */
function ShimmerSkeleton({ className }) {
  return (
    <div
      className={[
        "rounded-xl animate-shimmer",
        className,
      ].join(" ")}
    />
  );
}

/* ─── property type label ─── */
const TYPE_LABELS = {
  apartment: "Daire",
  house: "Villa",
  land: "Arsa",
  commercial: "Ticari",
};

const LISTING_TYPE_LABELS = {
  sale: "Satılık",
  rent: "Kiralık",
};

/* ─── main page ─── */
export default function MyListingsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState("newest");
  const [view, setView] = useState("grid");

  const { data, isLoading } = useQuery({
    queryKey: ["my-properties", { includeInactive: 1 }],
    queryFn: () => getMyProperties({ page: 1, limit: 50, includeInactive: 1 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMyProperty(id),
    onSuccess: () => {
      toast.success("İlan kalıcı olarak silindi");
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Silme işlemi başarısız");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => updateProperty(id, { isActive }),
    onSuccess: (_, { isActive }) => {
      toast.success(isActive ? "İlan aktif edildi" : "İlan pasife alındı");
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
    },
    onError: () => toast.error("Durum güncellenemedi"),
  });

  const items = useMemo(() => data?.data || [], [data]);
  const totalListings = items.length;
  const activeListings = items.filter((p) => p.isActive).length;
  const inactiveListings = Math.max(0, totalListings - activeListings);
  const totalViews = items.reduce((sum, p) => sum + (p.viewCount || 0), 0);
  const avgViews = totalListings ? Math.round(totalViews / totalListings) : 0;
  const activeRatio = totalListings
    ? Math.round((activeListings / totalListings) * 100)
    : 0;
  const topViewed = useMemo(() => {
    const sorted = [...items].sort(
      (a, b) => (b.viewCount || 0) - (a.viewCount || 0)
    );
    return sorted[0] || null;
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = (q || "").trim().toLowerCase();
    return items
      .filter((p) => {
        if (tab === "active") return Boolean(p.isActive);
        if (tab === "inactive") return !p.isActive;
        return true;
      })
      .filter((p) => {
        if (!query) return true;
        const title = String(p.title || "").toLowerCase();
        const city = String(p.location?.city || "").toLowerCase();
        const district = String(p.location?.district || "").toLowerCase();
        return (
          title.includes(query) ||
          city.includes(query) ||
          district.includes(query)
        );
      });
  }, [items, q, tab]);

  const visibleItems = useMemo(() => {
    const arr = [...filteredItems];
    arr.sort((a, b) => {
      const av = a?.viewCount || 0;
      const bv = b?.viewCount || 0;
      const ap = a?.price || 0;
      const bp = b?.price || 0;
      const at = String(a?.title || "");
      const bt = String(b?.title || "");
      const ad = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bd = b?.createdAt ? new Date(b.createdAt).getTime() : 0;

      switch (sortKey) {
        case "newest": return bd - ad;
        case "oldest": return ad - bd;
        case "views_desc": return bv - av;
        case "views_asc": return av - bv;
        case "price_desc": return bp - ap;
        case "price_asc": return ap - bp;
        case "title_asc": return at.localeCompare(bt, "tr");
        case "title_desc": return bt.localeCompare(at, "tr");
        default: return bd - ad;
      }
    });
    return arr;
  }, [filteredItems, sortKey]);

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <section className="space-y-6 animate-in fade-in-0 duration-500">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-900 p-6 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <ShimmerSkeleton className="h-3 w-40 bg-white/10" />
              <ShimmerSkeleton className="h-8 w-56 bg-white/10" />
              <ShimmerSkeleton className="h-4 w-72 bg-white/10" />
            </div>
            <ShimmerSkeleton className="h-10 w-28 rounded-xl bg-white/10" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ShimmerSkeleton key={i} className="h-28 w-full" />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3"
            >
              <ShimmerSkeleton className="h-44 w-full" />
              <ShimmerSkeleton className="h-5 w-3/4" />
              <ShimmerSkeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <ShimmerSkeleton className="h-8 flex-1" />
                <ShimmerSkeleton className="h-8 flex-1" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ── Empty state ── */
  if (!items.length) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-10 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-accent/10 blur-2xl animate-glow-pulse" />
          <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl ring-1 ring-white/10">
            <Building className="h-12 w-12 text-accent" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Henüz hiç ilan eklemediniz
          </h1>
          <p className="max-w-sm text-sm text-slate-500">
            Premium panelinizi doldurmak için ilk ilanınızı hemen ekleyin. İlanlarınız burada analizlerle birlikte görünecek.
          </p>
        </div>
        <Button asChild size="lg" className="bg-gold-gradient text-primary hover:brightness-95 shadow-lg">
          <Link href="/add-listing">
            <Plus className="mr-2 h-5 w-5" />
            İlk İlanımı Ekle
          </Link>
        </Button>
      </section>
    );
  }

  /* ── Main content ── */
  return (
    <section className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-3 duration-700">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 pb-16 text-white shadow-xl">
        {/* Background orbs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl animate-float-delayed" />
        <div className="pointer-events-none absolute right-1/3 top-0 h-40 w-40 rounded-full bg-purple-500/10 blur-2xl" />

        {/* Top border glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-accent" />
              Portföy Yönetimi
            </div>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
              İlanlarım
            </h1>
            <p className="mt-2 text-sm text-white/70">
              Toplam{" "}
              <span className="font-bold text-white">{totalListings}</span> ilan,{" "}
              <span className="font-bold text-green-400">{activeListings}</span> aktif —{" "}
              <span className="font-bold text-accent">{totalViews.toLocaleString("tr-TR")}</span> görüntülenme
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white backdrop-blur-sm"
            >
              <Link href="/profile">Profil</Link>
            </Button>
            <Button
              asChild
              className="bg-gold-gradient text-primary hover:brightness-95 shadow-lg shadow-amber-900/30"
            >
              <Link href="/add-listing">
                <Plus className="mr-2 h-4 w-4" />
                Yeni İlan
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Metric Cards (overlapping hero) ── */}
      <div className="relative z-10 -mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total */}
        <div className="metric-card panel-surface rounded-2xl p-5 border-t-2 border-t-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Toplam İlan</p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                <AnimatedNumber value={totalListings} />
              </p>
              <p className="mt-1 text-xs text-slate-400">portföyünüzde</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-md">
              <Building2 className="h-5 w-5 text-accent" />
            </span>
          </div>
        </div>

        {/* Active */}
        <div className="metric-card panel-surface rounded-2xl p-5 border-t-2 border-t-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Aktif İlanlar</p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                <AnimatedNumber value={activeListings} />
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs text-green-600 font-medium">%{activeRatio} oran</p>
              </div>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
              <Check className="h-5 w-5 text-white" />
            </span>
          </div>
        </div>

        {/* Inactive */}
        <div className="metric-card panel-surface rounded-2xl p-5 border-t-2 border-t-slate-400">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pasif İlanlar</p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                <AnimatedNumber value={inactiveListings} />
              </p>
              <p className="mt-1 text-xs text-slate-400">yayında değil</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 shadow-md">
              <Clock className="h-5 w-5 text-white" />
            </span>
          </div>
        </div>

        {/* Views */}
        <div className="metric-card panel-surface rounded-2xl p-5 border-t-2 border-t-amber-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Toplam Görüntülenme</p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                <AnimatedNumber value={totalViews} />
              </p>
              <p className="mt-1 text-xs text-amber-600 font-medium">
                ort. {avgViews.toLocaleString("tr-TR")}/ilan
              </p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-md">
              <TrendingUp className="h-5 w-5 text-white" />
            </span>
          </div>
        </div>
      </div>

      {/* ── Top Viewed Callout ── */}
      {topViewed && (
        <div className="flex flex-col gap-4 rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-orange-50 p-4 md:flex-row md:items-center animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow">
              <Star className="h-5 w-5 text-white" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">En Çok Görüntülenen</p>
              <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
                {topViewed.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center">
              <p className="text-lg font-black text-amber-700">
                {(topViewed.viewCount || 0).toLocaleString("tr-TR")}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-wide text-amber-600">görüntülenme</p>
            </div>
            <Button asChild size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
              <Link href={`/properties/${topViewed._id}`} target="_blank" rel="noopener noreferrer">
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Görüntüle
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* ── Filter + List ── */}
      <div className="space-y-4">

        {/* Filter bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="w-fit gap-1 bg-slate-100 p-1">
                <TabsTrigger value="all" className="rounded-xl px-4 text-sm font-semibold">
                  Tümü
                  <span className="ml-1.5 rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                    {totalListings}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="active" className="rounded-xl px-4 text-sm font-semibold">
                  Aktif
                  <span className="ml-1.5 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                    {activeListings}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="inactive" className="rounded-xl px-4 text-sm font-semibold">
                  Pasif
                  <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                    {inactiveListings}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end">
              <div className="relative w-full md:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Başlık, şehir, ilçe ara..."
                  className="pl-9 rounded-xl border-slate-200 bg-slate-50 focus-visible:bg-white"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 md:justify-end">
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span className="font-semibold text-slate-700">{visibleItems.length}</span> sonuç
                </div>

                <div className="flex items-center gap-2">
                  <Select value={sortKey} onValueChange={setSortKey}>
                    <SelectTrigger className="w-[185px] rounded-xl border-slate-200" size="sm" aria-label="sort">
                      <SelectValue placeholder="Sırala" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value="newest">
                        <span className="inline-flex items-center gap-2">
                          <ArrowDownWideNarrow className="h-4 w-4 text-slate-500" />
                          En yeni
                        </span>
                      </SelectItem>
                      <SelectItem value="oldest">
                        <span className="inline-flex items-center gap-2">
                          <ArrowUpWideNarrow className="h-4 w-4 text-slate-500" />
                          En eski
                        </span>
                      </SelectItem>
                      <SelectItem value="views_desc">
                        <span className="inline-flex items-center gap-2">
                          <Eye className="h-4 w-4 text-amber-500" />
                          En çok görüntülenen
                        </span>
                      </SelectItem>
                      <SelectItem value="views_asc">
                        <span className="inline-flex items-center gap-2">
                          <Eye className="h-4 w-4 text-slate-400" />
                          En az görüntülenen
                        </span>
                      </SelectItem>
                      <SelectItem value="price_desc">
                        <span className="inline-flex items-center gap-2">
                          <ArrowDownWideNarrow className="h-4 w-4 text-green-500" />
                          Fiyat (yüksek → düşük)
                        </span>
                      </SelectItem>
                      <SelectItem value="price_asc">
                        <span className="inline-flex items-center gap-2">
                          <ArrowUpWideNarrow className="h-4 w-4 text-blue-500" />
                          Fiyat (düşük → yüksek)
                        </span>
                      </SelectItem>
                      <SelectItem value="title_asc">
                        <span className="inline-flex items-center gap-2">
                          <ArrowDownAZ className="h-4 w-4 text-slate-500" />
                          Başlık (A → Z)
                        </span>
                      </SelectItem>
                      <SelectItem value="title_desc">
                        <span className="inline-flex items-center gap-2">
                          <ArrowUpAZ className="h-4 w-4 text-slate-500" />
                          Başlık (Z → A)
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setView("grid")}
                      className={[
                        "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                        view === "grid"
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-600 hover:bg-white hover:text-slate-900",
                      ].join(" ")}
                      aria-label="grid"
                    >
                      <Grid2X2 className="h-3.5 w-3.5" />
                      Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("list")}
                      className={[
                        "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                        view === "list"
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-600 hover:bg-white hover:text-slate-900",
                      ].join(" ")}
                      aria-label="list"
                    >
                      <LayoutList className="h-3.5 w-3.5" />
                      Liste
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty filtered state */}
        {visibleItems.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center animate-in fade-in-0 duration-300">
            <Search className="h-8 w-8 text-slate-300" />
            <p className="font-semibold text-slate-600">Arama sonucu bulunamadı</p>
            <p className="text-sm text-slate-400">Farklı bir başlık veya şehir deneyin</p>
            <Button variant="outline" size="sm" onClick={() => { setQ(""); setTab("all"); }}>
              Filtreleri Temizle
            </Button>
          </div>
        )}

        {/* Grid view */}
        {view === "grid" && visibleItems.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 animate-in fade-in-0 duration-500">
            {visibleItems.map((property, i) => (
              <div key={property._id} className="card-entrance" style={{ animationDelay: `${i * 60}ms` }}>
                <PropertyCardGrid
                  property={property}
                  deleteMutation={deleteMutation}
                  toggleMutation={toggleMutation}
                />
              </div>
            ))}
          </div>
        )}

        {/* List view */}
        {view === "list" && visibleItems.length > 0 && (
          <div className="space-y-3 animate-in fade-in-0 duration-500">
            {visibleItems.map((property, i) => (
              <div key={property._id} className="card-entrance" style={{ animationDelay: `${i * 50}ms` }}>
                <PropertyCardList
                  property={property}
                  deleteMutation={deleteMutation}
                  toggleMutation={toggleMutation}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Grid Card ─── */
function PropertyCardGrid({ property, deleteMutation, toggleMutation }) {
  const imageUrl =
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop";
  const isActive = Boolean(property.isActive);
  const city = property.location?.city || "-";
  const district = property.location?.district || "Merkez";
  const detailHref = `/properties/${property._id}`;
  const editHref = `/edit-listing/${property._id}`;

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={property.title || "İlan"}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Status ribbon */}
        <div className="absolute left-3 top-3">
          <span
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-lg backdrop-blur-sm",
              isActive ? "status-ribbon-active" : "status-ribbon-inactive",
            ].join(" ")}
          >
            <span className={["h-1.5 w-1.5 rounded-full", isActive ? "bg-white animate-pulse" : "bg-white/70"].join(" ")} />
            {isActive ? "Aktif" : "Pasif"}
          </span>
        </div>

        {/* Listing type badge */}
        {property.listingType && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center rounded-full border border-white/30 bg-slate-900/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
              {LISTING_TYPE_LABELS[property.listingType] || property.listingType}
            </span>
          </div>
        )}

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center rounded-xl border border-white/20 bg-slate-950/80 px-3 py-1.5 text-sm font-black text-accent backdrop-blur-sm">
            {formatTry(property.price)}
          </span>
        </div>

        {/* Actions overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 text-sm font-bold text-slate-900">
              {property.title}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3 text-accent" />
                {city} / {district}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatRelative(property.createdAt)}
              </span>
            </div>
          </div>

          <PropertyActionsMenu
            property={property}
            detailHref={detailHref}
            editHref={editHref}
            deleteMutation={deleteMutation}
            toggleMutation={toggleMutation}
          />
        </div>

        {/* Feature pills */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {property.features?.rooms != null && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
              <BedDouble className="h-3 w-3" />
              {property.features.rooms} oda
            </span>
          )}
          {property.features?.bathrooms != null && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-cyan-50 px-2 py-1 text-[11px] font-semibold text-cyan-700">
              <Bath className="h-3 w-3" />
              {property.features.bathrooms} banyo
            </span>
          )}
          {property.size != null && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2 py-1 text-[11px] font-semibold text-purple-700">
              <Maximize2 className="h-3 w-3" />
              {property.size} m²
            </span>
          )}
          {property.type && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
              <Building2 className="h-3 w-3" />
              {TYPE_LABELS[property.type] || property.type}
            </span>
          )}
        </div>

        {/* Views + actions row */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Eye className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-bold text-slate-700">
              {(property.viewCount || 0).toLocaleString("tr-TR")}
            </span>{" "}
            görüntülenme
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="h-8 rounded-lg text-xs border-slate-200">
              <Link href={detailHref} target="_blank" rel="noopener noreferrer">
                <Eye className="mr-1 h-3 w-3" />
                Önizle
              </Link>
            </Button>
            <button
              type="button"
              title={isActive ? "Pasife Al" : "Aktif Et"}
              disabled={toggleMutation.isPending}
              onClick={() => toggleMutation.mutate({ id: property._id, isActive: !isActive })}
              className={[
                "inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs transition",
                isActive
                  ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                  : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
                toggleMutation.isPending ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {toggleMutation.isPending && toggleMutation.variables?.id === property._id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isActive ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
            <Button asChild size="sm" className="h-8 rounded-lg bg-gold-gradient text-xs text-primary hover:brightness-95">
              <Link href={editHref}>
                <Edit className="mr-1 h-3 w-3" />
                Düzenle
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── List Card ─── */
function PropertyCardList({ property, deleteMutation, toggleMutation }) {
  const imageUrl =
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop";
  const isActive = Boolean(property.isActive);
  const city = property.location?.city || "-";
  const district = property.location?.district || "Merkez";
  const detailHref = `/properties/${property._id}`;
  const editHref = `/edit-listing/${property._id}`;

  return (
    <div className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:flex-row md:items-center">
      {/* Status left border */}
      <div
        className={[
          "absolute inset-y-0 left-0 w-1 rounded-l-2xl",
          isActive ? "bg-gradient-to-b from-green-400 to-emerald-600" : "bg-gradient-to-b from-slate-300 to-slate-400",
        ].join(" ")}
      />

      {/* Thumbnail */}
      <div className="relative h-28 w-full overflow-hidden rounded-xl md:h-20 md:w-28 shrink-0">
        <Image
          src={imageUrl}
          alt={property.title || "İlan"}
          fill
          sizes="112px"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={[
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-500",
            ].join(" ")}
          >
            <span className={["h-1.5 w-1.5 rounded-full", isActive ? "bg-green-500 animate-pulse" : "bg-slate-400"].join(" ")} />
            {isActive ? "Aktif" : "Pasif"}
          </span>
          {property.listingType && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
              {LISTING_TYPE_LABELS[property.listingType] || property.listingType}
            </span>
          )}
        </div>
        <h3 className="mt-1 line-clamp-1 text-sm font-bold text-slate-900">
          {property.title}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3 text-accent" />
            {city} / {district}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatRelative(property.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3 w-3 text-amber-500" />
            {(property.viewCount || 0).toLocaleString("tr-TR")} görüntülenme
          </span>
        </div>
      </div>

      {/* Price + actions */}
      <div className="flex flex-col items-end gap-3 shrink-0">
        <p className="text-base font-black text-slate-900">
          {formatTry(property.price)}
        </p>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="h-8 rounded-lg text-xs border-slate-200">
            <Link href={detailHref} target="_blank" rel="noopener noreferrer">
              <Eye className="mr-1 h-3 w-3" />
              Önizle
            </Link>
          </Button>
          <button
            type="button"
            title={isActive ? "Pasife Al" : "Aktif Et"}
            disabled={toggleMutation.isPending}
            onClick={() => toggleMutation.mutate({ id: property._id, isActive: !isActive })}
            className={[
              "inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs transition",
              isActive
                ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
              toggleMutation.isPending ? "opacity-50 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {toggleMutation.isPending && toggleMutation.variables?.id === property._id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isActive ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
          </button>
          <Button asChild size="sm" className="h-8 rounded-lg bg-gold-gradient text-xs text-primary hover:brightness-95">
            <Link href={editHref}>
              <Edit className="mr-1 h-3 w-3" />
              Düzenle
            </Link>
          </Button>
          <DeleteButton property={property} deleteMutation={deleteMutation} />
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Button with AlertDialog ─── */
function DeleteButton({ property, deleteMutation }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-700"
            disabled={deleteMutation.isPending}
          />
        }
        aria-label="delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="text-red-500">
            <AlertCircle className="animate-bounce" />
          </AlertDialogMedia>
          <AlertDialogTitle>İlanı Silmek İstediğinize Emin Misiniz?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong className="text-slate-800">&ldquo;{property.title}&rdquo;</strong> ilanı kalıcı olarak silinecektir. Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => deleteMutation.mutate(property._id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Siliniyor...
              </>
            ) : (
              "Evet, Sil"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ─── Actions Dropdown (for grid cards) ─── */
function PropertyActionsMenu({ property, detailHref, editHref, deleteMutation, toggleMutation }) {
  const router = useRouter();
  const isActive = Boolean(property.isActive);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="more"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
      >
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-slate-500">İşlemler</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => window.open(detailHref, "_blank", "noopener,noreferrer")}
        >
          <Eye className="mr-2 h-4 w-4 text-blue-500" />
          Önizle
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(editHref)}>
          <Edit className="mr-2 h-4 w-4 text-amber-500" />
          Düzenle
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={toggleMutation.isPending}
          onClick={() => toggleMutation.mutate({ id: property._id, isActive: !isActive })}
        >
          {isActive ? (
            <>
              <EyeOff className="mr-2 h-4 w-4 text-orange-500" />
              Pasife Al
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4 text-emerald-500" />
              Aktif Et
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger
            render={<DropdownMenuItem variant="destructive" />}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Sil
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia className="text-red-500">
                <AlertCircle className="animate-bounce" />
              </AlertDialogMedia>
              <AlertDialogTitle>İlanı Silmek İstediğinize Emin Misiniz?</AlertDialogTitle>
              <AlertDialogDescription>
                <strong className="text-slate-800">&ldquo;{property.title}&rdquo;</strong> kalıcı olarak silinecektir.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => deleteMutation.mutate(property._id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Siliniyor...</>
                ) : (
                  "Evet, Sil"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
