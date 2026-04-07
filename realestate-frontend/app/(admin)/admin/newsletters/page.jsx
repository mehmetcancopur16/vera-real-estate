"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Filter, Mail, RefreshCw, Search, Sparkles, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { deleteAdminNewsletter, getAdminNewsletters } from "@/services/admin.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function formatDate(dateString) {
  if (!dateString) return "-";
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
  const [isActiveFilter, setIsActiveFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isActiveQuery = isActiveFilter === "all" ? undefined : isActiveFilter;

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["admin-newsletters", { page, search, isActive: isActiveQuery }],
    queryFn: () =>
      getAdminNewsletters({
        page,
        limit: 20,
        search: search || undefined,
        isActive: isActiveQuery,
      }),
    staleTime: 30_000,
  });

  const subscribers = data?.data || [];
  const pagination = data?.pagination || {};
  const activeCount = subscribers.filter((s) => s.isActive).length;
  const passiveCount = Math.max(subscribers.length - activeCount, 0);
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search) count += 1;
    if (isActiveFilter !== "all") count += 1;
    return count;
  }, [search, isActiveFilter]);

  const deleteMutation = useMutation({
    mutationFn: deleteAdminNewsletter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-newsletters"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Abone silindi");
    },
    onError: () => toast.error("Silme basarisiz"),
  });

  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setSearchInput("");
    setIsActiveFilter("all");
    setPage(1);
  }

  function confirmDelete() {
    if (!deleteTarget?._id) return;
    deleteMutation.mutate(deleteTarget._id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="rounded-3xl border border-violet-200/60 bg-gradient-to-br from-white via-violet-50 to-indigo-50 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
              <Sparkles className="h-3.5 w-3.5" />
              Bulten Operasyon Merkezi
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Newsletter Aboneleri
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              E-posta abonelerini filtreleyin, kalite kontrolu yapin ve listeyi temiz tutun.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {pagination.total != null ? `Toplam ${pagination.total} abone` : "Yukleniyor..."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-2 border-violet-200 bg-white/80 hover:bg-violet-50">
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              Yenile
            </Button>
            <Button size="sm" className="gap-2 bg-violet-600 text-white hover:bg-violet-700" asChild>
              <Link href="/admin/contacts">
                <Mail className="h-4 w-4" />
                Mesajlar
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bu sayfa</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{subscribers.length}</p>
          <p className="mt-1 text-xs text-slate-500">Listelenen abone</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Aktif</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-900">{activeCount}</p>
          <p className="mt-1 text-xs text-emerald-700/80">E-posta acik aboneler</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pasif</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-800">{passiveCount}</p>
          <p className="mt-1 text-xs text-slate-500">Kapali aboneler</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Toplam</p>
          <p className="mt-1 text-2xl font-extrabold text-blue-900">{pagination.total || 0}</p>
          <p className="mt-1 text-xs text-blue-700/80">Tum veritabani</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-slate-800">
            <Filter className="h-4 w-4 text-violet-500" />
            Filtreleme ve Arama
          </p>
          <Badge variant={activeFilterCount > 0 ? "default" : "secondary"} className="text-[10px] uppercase tracking-wide">
            {activeFilterCount > 0 ? `${activeFilterCount} aktif filtre` : "Varsayilan"}
          </Badge>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Email adresinde ara..."
              className="pl-9"
            />
          </div>
          <Button type="submit" size="sm" className="shrink-0">Ara</Button>
        </form>
        <Select
          value={isActiveFilter}
          onValueChange={(value) => {
            setIsActiveFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tum aboneler</SelectItem>
            <SelectItem value="true">Aktif</SelectItem>
            <SelectItem value="false">Pasif</SelectItem>
          </SelectContent>
        </Select>
          <Button variant="outline" size="sm" onClick={clearFilters}>Temizle</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1fr_auto_auto] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 sm:grid">
          <span>Email Adresi</span>
          <span>Durum</span>
          <span>Kayit Tarihi</span>
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
            <p className="text-sm font-medium text-slate-500">Abone bulunamadi</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {subscribers.map((sub) => (
              <div key={sub._id} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-violet-50/40">
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
                  disabled={deleteMutation.isPending}
                  onClick={() => setDeleteTarget(sub)}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-sm text-slate-500">
            Sayfa <span className="font-semibold text-slate-700">{pagination.page} / {pagination.pages}</span> ({pagination.total} abone)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => setPage((p) => p - 1)} className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Onceki
            </Button>
            <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages} onClick={() => setPage((p) => p + 1)} className="gap-1">
              Sonraki
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aboneyi sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.email}</strong> kalici olarak silinecek. Bu islem geri alinamaz.
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
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
