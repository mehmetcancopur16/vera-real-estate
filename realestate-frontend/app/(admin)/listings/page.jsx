"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  ExternalLink,
  EyeOff,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteAdminListing,
  getAdminListings,
  toggleAdminListing,
} from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
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
const SALE_TYPES = { sale: "Satılık", rent: "Kiralık" };

export default function AdminListingsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["admin-listings", page, debouncedSearch, activeFilter],
    queryFn: () =>
      getAdminListings({ page, limit: 20, search: debouncedSearch, isActive: activeFilter }),
    staleTime: 15_000,
  });

  const listings = data?.data || [];
  const pagination = data?.pagination || {};

  const toggleMutation = useMutation({
    mutationFn: toggleAdminListing,
    onSuccess: (res) => {
      toast.success(res?.message || "İlan durumu güncellendi");
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "İşlem başarısız"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminListing,
    onSuccess: () => {
      toast.success("İlan silindi");
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Silme başarısız"),
  });

  function handleSearch(e) {
    setSearch(e.target.value);
    clearTimeout(window._adminListingSearchTimer);
    window._adminListingSearchTimer = setTimeout(() => {
      setDebouncedSearch(e.target.value);
      setPage(1);
    }, 400);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">İlanlar</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {pagination?.total != null ? `${pagination.total} ilan` : "Tüm ilanlar"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-2 self-start">
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Yenile
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="İlan başlığı ara..."
            value={search}
            onChange={handleSearch}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: "", label: "Tümü" },
            { value: "true", label: "Aktif" },
            { value: "false", label: "Pasif" },
          ].map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => { setActiveFilter(f.value); setPage(1); }}
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

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  İlan
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Tür
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Fiyat
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Sahip
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Durum
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Tarih
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-8 animate-pulse rounded-lg bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Building2 className="mx-auto h-10 w-10 text-slate-200" />
                    <p className="mt-2 text-sm font-semibold text-slate-400">İlan bulunamadı</p>
                  </td>
                </tr>
              ) : (
                listings.map((listing) => (
                  <tr key={listing._id} className="transition hover:bg-slate-50/60">
                    {/* Title */}
                    <td className="max-w-[220px] px-4 py-3">
                      <p className="truncate font-semibold text-slate-900">{listing.title}</p>
                      <p className="truncate text-xs text-slate-400">
                        {listing.location?.city}{listing.location?.district ? `, ${listing.location.district}` : ""}
                      </p>
                    </td>

                    {/* Type */}
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

                    {/* Price */}
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">
                      {listing.price != null
                        ? `${Number(listing.price).toLocaleString("tr-TR")} ${listing.currency || "TRY"}`
                        : "—"}
                    </td>

                    {/* Owner */}
                    <td className="px-4 py-3 text-xs">
                      <p className="font-semibold text-slate-700">{listing.owner?.name || "—"}</p>
                      <p className="text-slate-400">{listing.owner?.email || ""}</p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          listing.isActive
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-orange-50 text-orange-700 border border-orange-200"
                        }`}
                      >
                        {listing.isActive ? (
                          <><Eye className="h-2.5 w-2.5" /> Aktif</>
                        ) : (
                          <><EyeOff className="h-2.5 w-2.5" /> Pasif</>
                        )}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {listing.createdAt
                        ? new Date(listing.createdAt).toLocaleDateString("tr-TR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Actions */}
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
                          {listing.isActive ? (
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
                              <AlertDialogTitle>İlanı sil</AlertDialogTitle>
                              <AlertDialogDescription>
                                <strong>{listing.title}</strong> ilanı kalıcı olarak silinecek. Bu işlem geri alınamaz.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
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

        {/* Pagination */}
        {pagination?.pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <p className="text-xs text-slate-500">
              Sayfa {pagination.page} / {pagination.pages}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Önceki
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
