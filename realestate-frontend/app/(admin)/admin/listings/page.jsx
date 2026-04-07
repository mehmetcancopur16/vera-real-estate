"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  UserRoundSearch,
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteAdminListing,
  getAdminListings,
  toggleAdminListing,
} from "@/services/admin.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const LISTING_TYPES = { apartment: "Daire", house: "Villa", land: "Arsa", commercial: "Ticari" };
const SALE_TYPES = { sale: "Satilik", rent: "Kiralik" };

function formatMoney(price, currency) {
  if (price == null) return "-";
  return `${Number(price).toLocaleString("tr-TR")} ${currency || "TRY"}`;
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminListingsPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const urlSearchQ = searchParams.get("search")?.trim() || "";
  const urlOwnerId = searchParams.get("ownerId")?.trim() || "";

  const [search, setSearch] = useState(urlSearchQ);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearchQ);
  const [ownerId, setOwnerId] = useState(urlOwnerId);
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("");
  const [toggleTargetId, setToggleTargetId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    setSearch(urlSearchQ);
    setDebouncedSearch(urlSearchQ);
    setOwnerId(urlOwnerId);
    setPage(1);
  }, [urlOwnerId, urlSearchQ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["admin-listings", page, debouncedSearch, activeFilter, ownerId],
    queryFn: () =>
      getAdminListings({
        page,
        limit: 20,
        search: debouncedSearch || undefined,
        isActive: activeFilter || undefined,
        ownerId: ownerId || undefined,
      }),
    staleTime: 15_000,
  });

  const listings = useMemo(() => data?.data ?? [], [data?.data]);
  const pagination = data?.pagination || {};

  const summary = useMemo(() => {
    const active = listings.filter((i) => i.isActive).length;
    return { active, passive: Math.max(listings.length - active, 0) };
  }, [listings]);
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (debouncedSearch) count += 1;
    if (ownerId) count += 1;
    if (activeFilter) count += 1;
    return count;
  }, [debouncedSearch, ownerId, activeFilter]);

  const toggleMutation = useMutation({
    mutationFn: toggleAdminListing,
    onSuccess: (res) => {
      toast.success(res?.message || "Ilan durumu guncellendi");
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Islem basarisiz"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminListing,
    onSuccess: () => {
      toast.success("Ilan silindi");
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Silme basarisiz"),
  });

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setOwnerId("");
    setActiveFilter("");
    setPage(1);
  }

  function handleToggle(listingId) {
    setToggleTargetId(listingId);
    toggleMutation.mutate(listingId, {
      onSettled: () => setToggleTargetId(null),
    });
  }

  function confirmDelete() {
    if (!deleteTarget?._id) return;
    deleteMutation.mutate(deleteTarget._id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }

  return (
    <div className="space-y-5 pb-6">
      <div className="rounded-3xl border border-violet-200/60 bg-gradient-to-br from-white via-violet-50 to-indigo-50 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
              <Sparkles className="h-3.5 w-3.5" />
              Smart Moderasyon Alani
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Ilan Yonetimi
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Tum ilanlarin gorunurluk, kalite ve aktiflik durumunu tek ekrandan yonetin.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {pagination?.total != null ? `${pagination.total} ilan bulundu` : "Tum ilanlar"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2 border-violet-200 bg-white/80 hover:bg-violet-50"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              Yenile
            </Button>
            <Button size="sm" className="gap-2 bg-violet-600 text-white hover:bg-violet-700" asChild>
              <Link href="/admin/users">
                <UserRoundSearch className="h-4 w-4" />
                Kullanicilar
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bu sayfa</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{listings.length}</p>
          <p className="mt-1 text-xs text-slate-500">Listelenen kayitlar</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Aktif</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-900">{summary.active}</p>
          <p className="mt-1 text-xs text-emerald-700/80">Yayinda olan ilanlar</p>
        </div>
        <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-orange-700">Pasif</p>
          <p className="mt-1 text-2xl font-extrabold text-orange-900">{summary.passive}</p>
          <p className="mt-1 text-xs text-orange-700/80">Inceleme/kapali ilanlar</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Toplam sayfa</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{pagination.pages || 0}</p>
          <p className="mt-1 text-xs text-blue-700/80">Navigasyon kapsamasi</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-slate-800">
            <Filter className="h-4 w-4 text-violet-500" />
            Filtreleme ve Kontrol
          </p>
          <div className="flex items-center gap-2">
            <Badge variant={activeFilterCount > 0 ? "default" : "secondary"} className="text-[10px] uppercase tracking-wide">
              {activeFilterCount > 0 ? `${activeFilterCount} aktif filtre` : "Varsayilan"}
            </Badge>
            {(ownerId || debouncedSearch) && (
              <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                <UserRoundSearch className="mr-1 h-3 w-3" />
                Ozel filtre
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Baslik, sehir, ilce, owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-xl border-slate-200 bg-white pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "", label: "Tumu" },
              { value: "true", label: "Aktif" },
              { value: "false", label: "Pasif" },
            ].map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => {
                  setActiveFilter(f.value);
                  setPage(1);
                }}
                className={[
                  "rounded-xl border px-3 py-1.5 text-xs font-semibold transition",
                  activeFilter === f.value
                    ? "border-violet-600 bg-violet-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-400",
                ].join(" ")}
              >
                {f.label}
              </button>
            ))}
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Temizle
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Ilan</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Tur</th>
                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">Fiyat</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Sahip</th>
                <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">Durum</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Tarih</th>
                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">Islemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-8 animate-pulse rounded-lg bg-slate-100" /></td>
                    ))}
                  </tr>
                ))
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Building2 className="mx-auto h-10 w-10 text-slate-200" />
                    <p className="mt-2 text-sm font-semibold text-slate-400">Ilan bulunamadi</p>
                  </td>
                </tr>
              ) : (
                listings.map((listing) => (
                  <tr key={listing._id} className="transition hover:bg-violet-50/40">
                    <td className="max-w-[220px] px-4 py-3">
                      <p className="truncate font-semibold text-slate-900">{listing.title}</p>
                      <p className="truncate text-xs text-slate-500">
                        {listing.location?.city}
                        {listing.location?.district ? `, ${listing.location.district}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-slate-700">
                          {LISTING_TYPES[listing.type] || listing.type}
                        </span>
                        <span className={`text-[10px] font-bold ${listing.listingType === "sale" ? "text-emerald-600" : "text-blue-600"}`}>
                          {SALE_TYPES[listing.listingType] || listing.listingType}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">
                      {formatMoney(listing.price, listing.currency)}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <p className="font-semibold text-slate-700">{listing.owner?.name || "-"}</p>
                      <p className="text-slate-400">{listing.owner?.email || ""}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        listing.isActive ? "border-green-200 bg-green-50 text-green-700" : "border-orange-200 bg-orange-50 text-orange-700"
                      }`}>
                        {listing.isActive ? <><Eye className="h-2.5 w-2.5" /> Aktif</> : <><EyeOff className="h-2.5 w-2.5" /> Pasif</>}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {formatDate(listing.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => handleToggle(listing._id)}
                          disabled={toggleMutation.isPending}
                          title={listing.isActive ? "Pasif yap" : "Aktif yap"}
                        >
                          {toggleMutation.isPending && toggleTargetId === listing._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : listing.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-100" asChild>
                          <Link href={`/properties/${listing._id}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          disabled={deleteMutation.isPending}
                          onClick={() => setDeleteTarget(listing)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination?.pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <p className="text-xs text-slate-500">
              Sayfa <span className="font-semibold text-slate-700">{pagination.page} / {pagination.pages}</span>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Onceki
              </Button>
              <Button variant="outline" size="sm" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>
                Sonraki
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ilani sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.title}</strong> ilani kalici olarak silinecek. Bu islem geri alinamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Iptal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Siliniyor
                </span>
              ) : (
                "Sil"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
