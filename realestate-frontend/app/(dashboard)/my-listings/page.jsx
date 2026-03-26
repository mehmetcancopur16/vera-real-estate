"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowDownAZ,
  ArrowDownWideNarrow,
  ArrowUpAZ,
  ArrowUpWideNarrow,
  Building,
  Calendar,
  Check,
  Clock,
  Dot,
  Edit,
  Eye,
  Grid2X2,
  Loader2,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { deleteMyProperty, getMyProperties } from "@/services/property.service";

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
  return d.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "2-digit" });
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
      toast.success("Ilan kalici olarak silindi");
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Silme islemi basarisiz");
    },
  });

  const items = useMemo(() => data?.data || [], [data]);
  const totalListings = items.length;
  const activeListings = items.filter((p) => p.isActive).length;
  const inactiveListings = Math.max(0, totalListings - activeListings);
  const totalViews = items.reduce((sum, p) => sum + (p.viewCount || 0), 0);
  const avgViews = totalListings ? Math.round(totalViews / totalListings) : 0;
  const activeRatio = totalListings ? Math.round((activeListings / totalListings) * 100) : 0;
  const topViewed = useMemo(() => {
    const sorted = [...items].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
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
        return title.includes(query) || city.includes(query) || district.includes(query);
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
        case "newest":
          return bd - ad;
        case "oldest":
          return ad - bd;
        case "views_desc":
          return bv - av;
        case "views_asc":
          return av - bv;
        case "price_desc":
          return bp - ap;
        case "price_asc":
          return ap - bp;
        case "title_asc":
          return at.localeCompare(bt, "tr");
        case "title_desc":
          return bt.localeCompare(at, "tr");
        default:
          return bd - ad;
      }
    });
    return arr;
  }, [filteredItems, sortKey]);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-900 p-5 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-40 bg-white/10" />
              <Skeleton className="mt-3 h-8 w-56 bg-white/10" />
            </div>
            <Skeleton className="h-10 w-28 rounded-xl bg-white/10" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-center">
              <Skeleton className="h-24 w-full rounded-lg md:w-24" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div className="flex w-full flex-col gap-2 md:w-40">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="flex min-h-[55vh] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
        <Building className="h-12 w-12 text-slate-300" />
        <h1 className="text-2xl font-semibold text-slate-900">Henüz hiç ilan eklemediniz.</h1>
        <p className="max-w-md text-sm text-slate-600">
          Premium panelinizi doldurmak için ilk ilanınızı hemen ekleyin. İlanlarınız burada analizlerle birlikte görünecek.
        </p>
        <Button asChild className="bg-gold-gradient text-primary hover:brightness-95">
          <Link href="/add-listing">
            <Plus className="mr-2 h-4 w-4" />
            Yeni İlan Ekle
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-900 p-5 pb-14 text-white shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/70">Portföy Yönetimi</p>
            <h1 className="mt-2 text-2xl font-semibold">İlanlarım</h1>
            <p className="mt-1 text-sm text-white/70">
              Toplam <span className="font-semibold text-white">{totalListings}</span> ilan,{" "}
              <span className="font-semibold text-white">{activeListings}</span> aktif —{" "}
              <span className="font-semibold text-white">{totalViews.toLocaleString("tr-TR")}</span> görüntülenme.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
              <Link href="/profile">Profil</Link>
            </Button>
            <Button asChild className="bg-gold-gradient text-primary hover:brightness-95">
              <Link href="/add-listing">
                <Plus className="mr-2 h-4 w-4" />
                Yeni İlan
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="panel-surface rounded-xl p-5 transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Toplam İlan</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{totalListings}</p>
            </div>
            <Building className="h-6 w-6 text-accent" />
          </div>
        </div>
        <div className="panel-surface rounded-xl p-5 transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Aktif İlanlar</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{activeListings}</p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm text-slate-600">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Aktif
            </span>
          </div>
        </div>
        <div className="panel-surface rounded-xl p-5 transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Pasif İlanlar</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{inactiveListings}</p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm text-slate-600">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              Pasif
            </span>
          </div>
        </div>
        <div className="panel-surface rounded-xl p-5 transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Toplam Görüntülenme</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{totalViews.toLocaleString("tr-TR")}</p>
              <p className="mt-1 text-xs text-slate-500">Ortalama: {avgViews.toLocaleString("tr-TR")}/ilan</p>
            </div>
            <TrendingUp className="h-6 w-6 text-accent" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="w-fit">
                  <TabsTrigger value="all">Tümü</TabsTrigger>
                  <TabsTrigger value="active">Aktif</TabsTrigger>
                  <TabsTrigger value="inactive">Pasif</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end">
                <div className="relative w-full md:max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Başlık, şehir, ilçe ara..."
                    className="pl-9"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 md:justify-end">
                  <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="font-medium text-slate-700">{visibleItems.length}</span> sonuç
                  </div>

                  <div className="flex items-center gap-2">
                    <Select value={sortKey} onValueChange={setSortKey}>
                      <SelectTrigger className="w-[180px]" size="sm" aria-label="sort">
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
                            <Eye className="h-4 w-4 text-slate-500" />
                            En çok görüntülenen
                          </span>
                        </SelectItem>
                        <SelectItem value="views_asc">
                          <span className="inline-flex items-center gap-2">
                            <Eye className="h-4 w-4 text-slate-500" />
                            En az görüntülenen
                          </span>
                        </SelectItem>
                        <SelectItem value="price_desc">
                          <span className="inline-flex items-center gap-2">
                            <ArrowDownWideNarrow className="h-4 w-4 text-slate-500" />
                            Fiyat (yüksek → düşük)
                          </span>
                        </SelectItem>
                        <SelectItem value="price_asc">
                          <span className="inline-flex items-center gap-2">
                            <ArrowUpWideNarrow className="h-4 w-4 text-slate-500" />
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

                    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setView("grid")}
                        className={[
                          "inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition",
                          view === "grid" ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-50",
                        ].join(" ")}
                        aria-label="grid"
                      >
                        <Grid2X2 className="h-4 w-4" />
                        Grid
                      </button>
                      <button
                        type="button"
                        onClick={() => setView("list")}
                        className={[
                          "inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition",
                          view === "list" ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-50",
                        ].join(" ")}
                        aria-label="list"
                      >
                        <ArrowDownWideNarrow className="h-4 w-4" />
                        Liste
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
            {view === "grid" ? (
              <div className="grid gap-4 md:grid-cols-2">
                {visibleItems.map((property) => {
                  const imageUrl =
                    property.images?.[0] ||
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop";
                  const isActive = Boolean(property.isActive);
                  const city = property.location?.city || "-";
                  const district = property.location?.district || "Merkez";
                  const detailHref = `/properties/${property._id}`;

                  return (
                    <Card
                      key={property._id}
                      className="rounded-2xl ring-1 ring-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <CardHeader className="pb-0">
                        <CardTitle className="line-clamp-1 text-[15px] font-semibold text-slate-900">{property.title}</CardTitle>
                        <CardDescription className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-accent" />
                            {city} / {district}
                          </span>
                          <Dot className="h-4 w-4 text-slate-300" />
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {formatRelative(property.createdAt)}
                          </span>
                        </CardDescription>

                        <CardAction>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              aria-label="more"
                              className="inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => window.open(detailHref, "_blank", "noopener,noreferrer")}>
                                <Eye />
                                Önizle
                              </DropdownMenuItem>
                              <DropdownMenuItem disabled>
                                <Edit />
                                Düzenle (yakında)
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger
                                  render={<DropdownMenuItem variant="destructive" />}
                                  disabled={deleteMutation.isPending}
                                >
                                  <Trash2 />
                                  Sil
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogMedia className="text-red-600">
                                      <AlertCircle />
                                    </AlertDialogMedia>
                                    <AlertDialogTitle>İlanı Silmek İstediğinize Emin Misiniz?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Bu işlem geri alınamaz. İlan veritabanından kalıcı olarak silinecektir.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>İptal</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                                      onClick={() => deleteMutation.mutate(property._id)}
                                      disabled={deleteMutation.isPending}
                                    >
                                      {deleteMutation.isPending ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Siliniyor...
                                        </>
                                      ) : (
                                        "Sil"
                                      )}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardAction>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <Link href={detailHref} className="group block">
                          <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                            <Image src={imageUrl} alt={property.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-300 group-hover:scale-[1.02]" />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                          </div>
                        </Link>

                        <div className="mt-4 flex items-end justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xl font-bold tracking-tight text-slate-900">{formatTry(property.price)}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <Badge
                                className={
                                  isActive
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                                }
                              >
                                <span className="inline-flex items-center gap-1">
                                  <span className={["h-1.5 w-1.5 rounded-full", isActive ? "bg-green-600" : "bg-slate-400"].join(" ")} />
                                  {isActive ? "Aktif" : "Pasif"}
                                </span>
                              </Badge>
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                                <Eye className="h-4 w-4 text-accent" />
                                {(property.viewCount || 0).toLocaleString("tr-TR")}
                              </span>
                            </div>
                          </div>

                          <Button asChild variant="outline" className="h-9 rounded-xl">
                            <Link href={detailHref}>
                              Görüntüle
                              <span className="sr-only"> {property.title}</span>
                            </Link>
                          </Button>
                        </div>
                      </CardContent>

                      <CardFooter className="justify-between">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                          <Calendar className="h-4 w-4 text-accent" />
                          {formatDate(property.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                          <Check className="h-4 w-4 text-accent" />
                          ID: {String(property._id || "").slice(-6)}
                        </span>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {visibleItems.map((property) => {
                  const imageUrl =
                    property.images?.[0] ||
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop";
                  const isActive = Boolean(property.isActive);
                  const detailHref = `/properties/${property._id}`;

                  return (
                    <div
                      key={property._id}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:flex-row md:items-center"
                    >
                      <Link href={detailHref} className="flex items-start gap-4 md:flex-1">
                        <div className="relative h-24 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 md:size-24 md:w-24">
                          <Image src={imageUrl} alt={property.title} fill sizes="96px" className="object-cover" />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <p className="truncate text-base font-semibold text-slate-900">{property.title}</p>
                          <p className="inline-flex items-center gap-1 text-sm text-slate-500">
                            <MapPin className="h-4 w-4 text-accent" />
                            {property.location?.city} / {property.location?.district || "Merkez"}
                          </p>
                          <p className="inline-flex items-center gap-1 text-sm text-slate-500">
                            <Calendar className="h-4 w-4 text-accent" />
                            {formatDate(property.createdAt)}
                          </p>
                        </div>
                      </Link>

                      <div className="flex flex-col gap-2 md:items-end">
                        <p className="text-xl font-bold text-slate-900">{formatTry(property.price)}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            className={
                              isActive
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                            }
                          >
                            {isActive ? "Aktif" : "Pasif"}
                          </Badge>
                          <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                            <Eye className="h-4 w-4 text-accent" />
                            {(property.viewCount || 0).toLocaleString("tr-TR")}
                          </span>
                        </div>
                      </div>

                      <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:justify-end">
                        <Button asChild variant="outline" className="w-full gap-2 md:w-auto">
                          <Link href={detailHref}>
                            <Eye className="h-4 w-4" />
                            Görüntüle
                          </Link>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <Button
                                variant="outline"
                                className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 md:w-auto"
                              />
                            }
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                            Sil
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogMedia className="text-red-600">
                                <AlertCircle />
                              </AlertDialogMedia>
                              <AlertDialogTitle>İlanı Silmek İstediğinize Emin Misiniz?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bu işlem geri alınamaz. İlan veritabanından kalıcı olarak silinecektir.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                                onClick={() => deleteMutation.mutate(property._id)}
                                disabled={deleteMutation.isPending}
                              >
                                {deleteMutation.isPending ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Siliniyor...
                                  </>
                                ) : (
                                  "Sil"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!visibleItems.length ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <p className="text-sm font-semibold text-slate-900">Filtrenize uygun ilan bulunamadı.</p>
                <p className="mt-1 text-sm text-slate-600">Aramayı temizleyin veya sekmeyi değiştirin.</p>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Hızlı Aksiyonlar</p>
            <p className="mt-1 text-sm text-slate-600">Panelde en sık yaptığınız işlemler.</p>
            <div className="mt-4 grid gap-2">
              <Button asChild className="justify-start bg-gold-gradient text-primary hover:brightness-95">
                <Link href="/add-listing">
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni İlan Oluştur
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/profile">
                  <Edit className="mr-2 h-4 w-4" />
                  Profil Ayarları
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Portföy Sağlığı</p>
            <p className="mt-1 text-sm text-slate-600">Aktiflik ve görüntülenme dağılımı.</p>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-700">Aktif ilan oranı</p>
                <p className="text-xs font-semibold tabular-nums text-slate-900">%{activeRatio}</p>
              </div>
              <Progress value={activeRatio} className="mt-3" />
              <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Aktif: <span className="font-semibold text-slate-900">{activeListings}</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  Pasif: <span className="font-semibold text-slate-900">{inactiveListings}</span>
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Ortalama</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{avgViews.toLocaleString("tr-TR")}</p>
                <p className="mt-0.5 text-xs text-slate-500">görüntülenme/ilan</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Toplam</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{totalViews.toLocaleString("tr-TR")}</p>
                <p className="mt-0.5 text-xs text-slate-500">görüntülenme</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">En Çok Görüntülenen</p>
            <p className="mt-1 text-sm text-slate-600">Portföyünüzün yıldızı.</p>

            {topViewed ? (
              <div className="mt-4 flex gap-3">
                <div className="relative size-16 overflow-hidden rounded-xl border border-slate-200">
                  <Image
                    src={
                      topViewed.images?.[0] ||
                      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop"
                    }
                    alt={topViewed.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{topViewed.title}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-600">
                    <Eye className="h-4 w-4 text-accent" />
                    {(topViewed.viewCount || 0).toLocaleString("tr-TR")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{formatTry(topViewed.price)}</p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Henüz veri yok.</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
