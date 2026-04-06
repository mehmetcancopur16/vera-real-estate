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
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  UserRoundSearch,
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteAdminListing,
  getAdminListings,
  toggleAdminListing,
} from "@/services/admin.service";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const LISTING_TYPES = { apartment: "Daire", house: "Villa", land: "Arsa", commercial: "Ticari" };
const SALE_TYPES = { sale: "Satilik", rent: "Kiralik" };

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

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Ilan Yonetimi</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {pagination?.total != null ? `${pagination.total} ilan` : "Tum ilanlar"}
            </p>
            {(ownerId || debouncedSearch) && (
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-violet-700">
                <UserRoundSearch className="h-3.5 w-3.5" />
                Ozel filtre aktif
              </p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-2 self-start">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Yenile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Bu sayfa</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{listings.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <p className="text-xs text-emerald-700">Aktif</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-900">{summary.active}</p>
        </div>
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 shadow-sm">
          <p className="text-xs text-orange-700">Pasif</p>
          <p className="mt-1 text-2xl font-extrabold text-orange-900">{summary.passive}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Toplam sayfa</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{pagination.pages || 0}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Baslik, sehir, ilce, owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
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
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-400",
              ].join(" ")}
            >
              {f.label}
            </button>
          ))}
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
                  <tr key={listing._id} className="transition hover:bg-slate-50/60">
                    <td className="max-w-[220px] px-4 py-3">
                      <p className="truncate font-semibold text-slate-900">{listing.title}</p>
                      <p className="truncate text-xs text-slate-400">
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
                      {listing.price != null ? `${Number(listing.price).toLocaleString("tr-TR")} ${listing.currency || "TRY"}` : "-"}
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
                      {listing.createdAt
                        ? new Date(listing.createdAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => toggleMutation.mutate(listing._id)}
                          disabled={toggleMutation.isPending}
                          title={listing.isActive ? "Pasif yap" : "Aktif yap"}
                        >
                          {toggleMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : listing.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-100" asChild>
                          <Link href={`/properties/${listing._id}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-400 hover:bg-red-50 hover:text-red-600"
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Ilani sil</AlertDialogTitle>
                              <AlertDialogDescription>
                                <strong>{listing.title}</strong> ilani kalici olarak silinecek. Bu islem geri alinamaz.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Iptal</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={() => deleteMutation.mutate(listing._id)}
                              >
                                Sil
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
            <p className="text-xs text-slate-500">Sayfa {pagination.page} / {pagination.pages}</p>
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
    </div>
  );
}
