"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { getAdminNewsletters, deleteAdminNewsletter } from "@/services/admin.service";
import { Button } from "@/components/ui/button";

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function AdminNewslettersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["admin-newsletters", { page, search }],
    queryFn: () => getAdminNewsletters({ page, limit: 20, search }),
    staleTime: 30_000,
  });

  const subscribers = data?.data || [];
  const pagination = data?.pagination || {};

  const deleteMutation = useMutation({
    mutationFn: deleteAdminNewsletter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-newsletters"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Abone silindi");
    },
    onError: () => toast.error("Silme başarısız"),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const activeCount = subscribers.filter((s) => s.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Newsletter Aboneleri</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {pagination.total != null ? `Toplam ${pagination.total} abone` : "Yükleniyor..."}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2 self-start"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Yenile
        </Button>
      </div>

      {/* Stats row */}
      {!isLoading && pagination.total > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Toplam Abone</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">{pagination.total}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <p className="text-xs font-semibold text-emerald-700">Bu Sayfada Aktif</p>
            <p className="mt-1 text-2xl font-extrabold text-emerald-800">{activeCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Sayfa</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">{pagination.page} / {pagination.pages || 1}</p>
          </div>
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Email adresinde ara..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>
        <Button type="submit" size="sm" className="shrink-0">Ara</Button>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Table header */}
        <div className="hidden grid-cols-[1fr_auto_auto] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 sm:grid">
          <span>Email Adresi</span>
          <span>Durum</span>
          <span>Kayıt Tarihi</span>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : subscribers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Users className="h-10 w-10 text-slate-200" />
            <p className="text-sm font-medium text-slate-500">Abone bulunamadı</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {subscribers.map((sub) => (
              <div
                key={sub._id}
                className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-slate-50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-50">
                  <Mail className="h-4 w-4 text-pink-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{sub.email}</p>
                  <p className="mt-0.5 text-xs text-slate-400 sm:hidden">{formatDate(sub.createdAt)}</p>
                </div>
                <span className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide sm:inline-flex ${sub.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {sub.isActive ? "Aktif" : "Pasif"}
                </span>
                <span className="hidden shrink-0 text-xs text-slate-400 sm:block">{formatDate(sub.createdAt)}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Bu aboneyi silmek istediğinize emin misiniz?")) {
                      deleteMutation.mutate(sub._id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Sayfa {pagination.page} / {pagination.pages} ({pagination.total} abone)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
              className="gap-1"
            >
              Sonraki
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
