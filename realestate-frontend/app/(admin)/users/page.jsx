"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Crown,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  Star,
  Trash2,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
} from "@/services/admin.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function initialsFromName(name) {
  if (!name) return "??";
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

function PlanBadge({ plan }) {
  const styles = {
    free: "border-slate-200 bg-slate-100 text-slate-600",
    professional: "border-blue-200 bg-blue-50 text-blue-700",
    corporate: "border-amber-200 bg-amber-50 text-amber-700",
  };
  const icons = { free: Zap, professional: Star, corporate: Crown };
  const labels = { free: "Free", professional: "Pro", corporate: "Corp" };
  const Icon = icons[plan] || Zap;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles[plan] || styles.free}`}>
      <Icon className="h-2.5 w-2.5" />
      {labels[plan] || plan}
    </span>
  );
}

function RoleBadge({ role }) {
  if (role === "admin") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700">
        <Shield className="h-2.5 w-2.5" />
        Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
      <UserCheck className="h-2.5 w-2.5" />
      Üye
    </span>
  );
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [listingFilter, setListingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["admin-users", page, debouncedSearch, roleFilter, planFilter, listingFilter, sortBy, sortOrder],
    queryFn: () =>
      getAdminUsers({
        page,
        limit: 20,
        search: debouncedSearch || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
        plan: planFilter !== "all" ? planFilter : undefined,
        hasListings: listingFilter !== "all" ? listingFilter : undefined,
        sortBy,
        sortOrder,
      }),
    staleTime: 15_000,
  });

  const users = data?.data || [];
  const pagination = data?.pagination || {};
  const totals = useMemo(() => {
    const adminCount = users.filter((u) => u.role === "admin").length;
    const proCount = users.filter((u) => (u.subscription?.plan || "free") !== "free").length;
    const withListingCount = users.filter((u) => (u.listingCount || 0) > 0).length;
    return { adminCount, proCount, withListingCount };
  }, [users]);

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateAdminUser(id, payload),
    onSuccess: () => {
      toast.success("Kullanıcı güncellendi");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Güncelleme başarısız");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      toast.success("Kullanıcı ve ilanları silindi");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Silme başarısız");
    },
  });

  function handlePlanChange(userId, plan) {
    updateMutation.mutate({ id: userId, payload: { "subscription.plan": plan } });
  }

  function handleRoleChange(userId, role) {
    updateMutation.mutate({ id: userId, payload: { role } });
  }

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setRoleFilter("all");
    setPlanFilter("all");
    setListingFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  }

  function confirmDelete() {
    if (!deleteTarget?._id) return;
    deleteMutation.mutate(deleteTarget._id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Kullanıcılar</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {pagination?.total != null ? `${pagination.total} kayıtlı kullanıcı` : "Tüm üyeler"}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-2 self-start">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Yenile
          </Button>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">Admin Kullanıcı: <span className="font-extrabold text-slate-900">{totals.adminCount}</span></div>
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">Pro/Corp Plan: <span className="font-extrabold text-slate-900">{totals.proCount}</span></div>
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">İlanı Olan: <span className="font-extrabold text-slate-900">{totals.withListingCount}</span></div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <p className="text-sm font-bold text-slate-800">Filtreler ve Sıralama</p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
          <div className="relative xl:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="İsim veya e-posta ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
            <SelectTrigger className="h-10"><SelectValue placeholder="Rol" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Roller</SelectItem>
              <SelectItem value="user">Üye</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setPage(1); }}>
            <SelectTrigger className="h-10"><SelectValue placeholder="Plan" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Planlar</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
            </SelectContent>
          </Select>
          <Select value={listingFilter} onValueChange={(v) => { setListingFilter(v); setPage(1); }}>
            <SelectTrigger className="h-10"><SelectValue placeholder="İlan Durumu" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="true">İlanı Olan</SelectItem>
              <SelectItem value="false">İlanı Olmayan</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Kayıt Tarihi</SelectItem>
                <SelectItem value="name">İsim</SelectItem>
                <SelectItem value="email">E-posta</SelectItem>
                <SelectItem value="listingCount">İlan Sayısı</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={(v) => { setSortOrder(v); setPage(1); }}>
              <SelectTrigger className="h-10 w-[110px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Azalan</SelectItem>
                <SelectItem value="asc">Artan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-3">
          <Button variant="outline" size="sm" onClick={clearFilters}>Filtreleri Temizle</Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Kullanıcı
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Rol
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Plan
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  İlan
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Kayıt Tarihi
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
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-8 animate-pulse rounded-lg bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Users className="mx-auto h-10 w-10 text-slate-200" />
                    <p className="mt-2 text-sm font-semibold text-slate-400">Kullanıcı bulunamadı</p>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="transition hover:bg-slate-50/60">
                    {/* User info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarImage src={u.avatarUrl || ""} alt={u.name} />
                          <AvatarFallback className="bg-slate-900 text-xs font-black text-white">
                            {initialsFromName(u.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">{u.name}</p>
                          <p className="truncate text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <Select
                        value={u.role}
                        onValueChange={(val) => handleRoleChange(u._id, val)}
                      >
                        <SelectTrigger className="h-8 w-[110px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Üye</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-3">
                      <Select
                        value={u.subscription?.plan || "free"}
                        onValueChange={(val) => handlePlanChange(u._id, val)}
                      >
                        <SelectTrigger className="h-8 w-[130px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="corporate">Corporate</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    {/* Listing count */}
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex h-7 w-10 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
                        {u.listingCount ?? 0}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("tr-TR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        disabled={deleteMutation.isPending}
                        onClick={() => setDeleteTarget(u)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Önceki
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Sonraki
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcıyı sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.name}</strong> adlı kullanıcı ve tüm ilanları kalıcı olarak silinecek. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>İptal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={confirmDelete}
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
