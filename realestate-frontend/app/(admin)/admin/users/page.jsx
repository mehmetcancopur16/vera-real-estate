"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpDown,
  BadgeCheck,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Crown,
  Download,
  Filter,
  Loader2,
  Mail,
  PanelRight,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Star,
  Trash2,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteAdminUser,
  getAdminStats,
  getAdminUsers,
  updateAdminUser,
} from "@/services/admin.service";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

function initialsFromName(name) {
  if (!name) return "??";
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDateShort(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PlanBadge({ plan }) {
  const key = plan || "free";
  const styles = {
    free: "border-slate-200 bg-slate-100 text-slate-600",
    professional: "border-blue-200 bg-blue-50 text-blue-700",
    corporate: "border-amber-200 bg-amber-50 text-amber-700",
  };
  const icons = { free: Zap, professional: Star, corporate: Crown };
  const labels = { free: "Free", professional: "Pro", corporate: "Corp" };
  const Icon = icons[key] || Zap;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles[key] || styles.free}`}
    >
      <Icon className="h-2.5 w-2.5" />
      {labels[key] || key}
    </span>
  );
}

function RoleBadge({ role }) {
  if (role === "admin") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700">
        <Shield className="h-2.5 w-2.5" />
        Admin
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
      <UserCheck className="h-2.5 w-2.5" />
      Uye
    </span>
  );
}

function exportUsersCsv(rows) {
  const headers = [
    "Isim",
    "E-posta",
    "Rol",
    "Plan",
    "Toplam Ilan",
    "Aktif Ilan",
    "Plan Bitis",
    "Kayit Tarihi",
  ];
  const escape = (v) => {
    const s = v == null ? "" : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [
    headers.join(","),
    ...rows.map((u) =>
      [
        escape(u.name),
        escape(u.email),
        escape(u.role),
        escape(u.subscription?.plan || "free"),
        escape(u.listingCount ?? 0),
        escape(u.activeListingCount ?? 0),
        escape(u.subscription?.expiresAt ? formatDateTime(u.subscription.expiresAt) : ""),
        escape(u.createdAt ? formatDateTime(u.createdAt) : ""),
      ].join(",")
    ),
  ];
  const blob = new Blob(["\uFEFF" + lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kullanicilar-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("CSV indirildi");
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const authUser = useAuthStore((s) => s.user);
  const myId = authUser?._id || authUser?.id;

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [roleFilter, setRoleFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [listingFilter, setListingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailUserId, setDetailUserId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkRole, setBulkRole] = useState("none");
  const [bulkPlan, setBulkPlan] = useState("none");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data: statsRes, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
    staleTime: 30_000,
  });

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [
      "admin-users",
      page,
      limit,
      debouncedSearch,
      roleFilter,
      planFilter,
      listingFilter,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      getAdminUsers({
        page,
        limit,
        search: debouncedSearch || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
        plan: planFilter !== "all" ? planFilter : undefined,
        hasListings: listingFilter !== "all" ? listingFilter : undefined,
        sortBy,
        sortOrder,
      }),
    staleTime: 15_000,
  });

  const stats = statsRes?.data;
  const planDistribution = stats?.planDistribution || {};
  const users = useMemo(() => data?.data ?? [], [data?.data]);
  const pagination = data?.pagination || {};
  const totalPages = pagination.total > 0 ? Math.max(1, pagination.pages || 1) : 0;

  const tableStats = useMemo(() => {
    const adminCount = users.filter((u) => u.role === "admin").length;
    const proCorpCount = users.filter(
      (u) => (u.subscription?.plan || "free") !== "free"
    ).length;
    const activeListingUsers = users.filter((u) => (u.activeListingCount || 0) > 0).length;
    return { adminCount, proCorpCount, activeListingUsers };
  }, [users]);

  const detailUser = useMemo(
    () => users.find((u) => u._id === detailUserId) || null,
    [users, detailUserId]
  );

  const selectedUsers = useMemo(
    () => users.filter((u) => selectedIds.includes(u._id)),
    [users, selectedIds]
  );

  const isSelf = (userId) =>
    myId != null && userId != null && String(myId) === String(userId);

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateAdminUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Guncelleme basarisiz");
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ ids, payload }) => {
      await Promise.all(ids.map((id) => updateAdminUser(id, payload)));
      return ids.length;
    },
    onSuccess: (count) => {
      toast.success(`${count} kullanici guncellendi`);
      setSelectedIds([]);
      setBulkPlan("none");
      setBulkRole("none");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Toplu guncelleme basarisiz");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      toast.success("Kullanici ve ilanlari silindi");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Silme basarisiz");
    },
  });

  function handlePlanChange(userId, plan) {
    updateMutation.mutate(
      { id: userId, payload: { "subscription.plan": plan } },
      { onSuccess: () => toast.success("Plan guncellendi") }
    );
  }

  function handleRoleChange(userId, role) {
    updateMutation.mutate(
      { id: userId, payload: { role } },
      { onSuccess: () => toast.success("Rol guncellendi") }
    );
  }

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setRoleFilter("all");
    setPlanFilter("all");
    setListingFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setLimit(20);
    setPage(1);
  }

  function confirmDelete() {
    if (!deleteTarget?._id) return;
    deleteMutation.mutate(deleteTarget._id, {
      onSuccess: () => {
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget._id));
        setDeleteTarget(null);
        if (detailUserId === deleteTarget._id) setDetailUserId(null);
      },
    });
  }

  function toggleUserSelection(userId, nextChecked) {
    setSelectedIds((prev) => {
      if (nextChecked) return [...new Set([...prev, userId])];
      return prev.filter((id) => id !== userId);
    });
  }

  function toggleSelectAll(nextChecked) {
    if (nextChecked) {
      setSelectedIds(users.filter((u) => !isSelf(u._id)).map((u) => u._id));
      return;
    }
    setSelectedIds([]);
  }

  async function copySelectedEmails() {
    if (selectedUsers.length === 0) return;
    const emails = selectedUsers.map((u) => u.email).filter(Boolean);
    if (!emails.length) return;
    try {
      await navigator.clipboard.writeText(emails.join("; "));
      toast.success(`${emails.length} e-posta kopyalandi`);
    } catch {
      toast.error("E-postalar kopyalanamadi");
    }
  }

  function applyBulkRole() {
    if (bulkRole === "none") return;
    const targets = selectedUsers.filter((u) => !isSelf(u._id)).map((u) => u._id);
    if (!targets.length) return toast.error("Guncellenecek kullanici secin");
    bulkUpdateMutation.mutate({ ids: targets, payload: { role: bulkRole } });
  }

  function applyBulkPlan() {
    if (bulkPlan === "none") return;
    const targets = selectedUsers.map((u) => u._id);
    if (!targets.length) return toast.error("Guncellenecek kullanici secin");
    bulkUpdateMutation.mutate({
      ids: targets,
      payload: { "subscription.plan": bulkPlan },
    });
  }

  const selectAllChecked =
    users.length > 0 &&
    users.filter((u) => !isSelf(u._id)).every((u) => selectedIds.includes(u._id));

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-violet-200/50 bg-gradient-to-br from-white to-violet-50 p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
              <Sparkles className="h-3.5 w-3.5" />
              Master Kullanici Kontrol Merkezi
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
              Kullanici Yonetimi
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Rol, plan, ilan aktivitesi ve toplu islem yonetimini tek ekranda yonetin.
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
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-violet-200 bg-white/80 hover:bg-violet-50"
              onClick={() => exportUsersCsv(users)}
              disabled={users.length === 0}
            >
              <Download className="h-4 w-4" />
              CSV
            </Button>
            <Button size="sm" className="gap-2 bg-violet-600 text-white hover:bg-violet-700" asChild>
              <Link href="/admin/listings">
                <Building2 className="h-4 w-4" />
                Ilanlar
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Toplam kullanici</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">
            {statsLoading ? "-" : (stats?.totalUsers ?? 0).toLocaleString("tr-TR")}
          </p>
          <p className="mt-1 text-xs text-slate-500">Tum sistem genelindeki uye sayisi</p>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600">Admin</p>
          <p className="mt-1 text-2xl font-extrabold text-violet-900">
            {statsLoading ? "-" : (stats?.totalAdmins ?? 0).toLocaleString("tr-TR")}
          </p>
          <p className="mt-1 text-xs text-violet-700/80">Yonetici yetkisine sahip hesaplar</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Pro + Corp</p>
          <p className="mt-1 text-2xl font-extrabold text-blue-900">
            {statsLoading
              ? "-"
              : ((planDistribution.professional ?? 0) + (planDistribution.corporate ?? 0)).toLocaleString("tr-TR")}
          </p>
          <p className="mt-1 text-xs text-blue-700/80">Ucretli plan kullananlar</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Bu sayfa aktif ilanli</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-900">
            {tableStats.activeListingUsers.toLocaleString("tr-TR")}
          </p>
          <p className="mt-1 text-xs text-emerald-700/80">Listede aktif ilana sahip uye</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-slate-800">
            <Filter className="h-4 w-4 text-violet-500" />
            Filtreler ve Siralama
          </p>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
            <ArrowUpDown className="mr-1 h-3 w-3" />
            Dinamik
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-12">
          <div className="relative xl:col-span-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Isim veya e-posta ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="xl:col-span-2">
            <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
              <SelectTrigger className="h-10 w-full"><SelectValue placeholder="Rol" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tum roller</SelectItem>
                <SelectItem value="user">Uye</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="xl:col-span-2">
            <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setPage(1); }}>
              <SelectTrigger className="h-10 w-full"><SelectValue placeholder="Plan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tum planlar</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="xl:col-span-2">
            <Select value={listingFilter} onValueChange={(v) => { setListingFilter(v); setPage(1); }}>
              <SelectTrigger className="h-10 w-full"><SelectValue placeholder="Ilan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tumu</SelectItem>
                <SelectItem value="true">Ilani olan</SelectItem>
                <SelectItem value="false">Ilani olmayan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="xl:col-span-1">
            <Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
              <SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 xl:col-span-2">
            <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
              <SelectTrigger className="h-10 flex-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Kayit tarihi</SelectItem>
                <SelectItem value="name">Isim</SelectItem>
                <SelectItem value="email">E-posta</SelectItem>
                <SelectItem value="listingCount">Ilan sayisi</SelectItem>
                <SelectItem value="activeListingCount">Aktif ilan</SelectItem>
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

        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={clearFilters}>Filtreleri temizle</Button>
          <Badge variant="secondary" className="h-8 px-3 text-xs">
            Sayfa icindeki admin: {tableStats.adminCount}
          </Badge>
          <Badge variant="secondary" className="h-8 px-3 text-xs">
            Ucretli plan: {tableStats.proCorpCount}
          </Badge>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-3 shadow-sm animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm font-semibold text-violet-800">
              {selectedIds.length} kullanici secildi
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={copySelectedEmails}>
                <Mail className="h-4 w-4" />
                E-postalari kopyala
              </Button>

              <div className="flex items-center gap-2">
                <Select value={bulkRole} onValueChange={setBulkRole}>
                  <SelectTrigger className="h-8 w-[130px] bg-white"><SelectValue placeholder="Toplu rol" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Toplu rol</SelectItem>
                    <SelectItem value="user">Uye</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={bulkRole === "none" || bulkUpdateMutation.isPending}
                  onClick={applyBulkRole}
                >
                  Uygula
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Select value={bulkPlan} onValueChange={setBulkPlan}>
                  <SelectTrigger className="h-8 w-[130px] bg-white"><SelectValue placeholder="Toplu plan" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Toplu plan</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="professional">Pro</SelectItem>
                    <SelectItem value="corporate">Corp</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={bulkPlan === "none" || bulkUpdateMutation.isPending}
                  onClick={applyBulkPlan}
                >
                  Uygula
                </Button>
              </div>

              <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>Temizle</Button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={selectAllChecked}
                    onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
                    aria-label="Tumunu sec"
                  />
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Kullanici</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Rol</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Plan</th>
                <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">Toplam</th>
                <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">Aktif</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Plan bitis</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Kayit</th>
                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">Islem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-8 animate-pulse rounded-lg bg-slate-100" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <Users className="mx-auto h-10 w-10 text-slate-200" />
                    <p className="mt-2 text-sm font-semibold text-slate-400">Kullanici bulunamadi</p>
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const checked = selectedIds.includes(u._id);
                  return (
                    <tr key={u._id} className="transition hover:bg-violet-50/40">
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={checked}
                          disabled={isSelf(u._id)}
                          onCheckedChange={(next) => toggleUserSelection(u._id, Boolean(next))}
                          aria-label={`${u.name} sec`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-transparent transition group-hover:ring-violet-200">
                            <AvatarImage src={u.avatarUrl || ""} alt={u.name} />
                            <AvatarFallback className="bg-slate-900 text-xs font-black text-white">
                              {initialsFromName(u.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">{u.name}</p>
                            <button
                              type="button"
                              onClick={() => navigator.clipboard.writeText(u.email).then(() => toast.success("E-posta kopyalandi"))}
                              className="inline-flex max-w-[220px] items-center gap-1 truncate text-xs text-slate-500 hover:text-violet-600"
                            >
                              <span className="truncate">{u.email}</span>
                              <Copy className="h-3 w-3 shrink-0" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          <RoleBadge role={u.role} />
                          <Select
                            value={u.role}
                            onValueChange={(val) => handleRoleChange(u._id, val)}
                            disabled={updateMutation.isPending || isSelf(u._id)}
                          >
                            <SelectTrigger className="h-8 w-[120px] text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Uye</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          <PlanBadge plan={u.subscription?.plan || "free"} />
                          <Select
                            value={u.subscription?.plan || "free"}
                            onValueChange={(val) => handlePlanChange(u._id, val)}
                            disabled={updateMutation.isPending}
                          >
                            <SelectTrigger className="h-8 w-[136px] text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="corporate">Corporate</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className="min-w-10 justify-center">{u.listingCount ?? 0}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className="min-w-10 justify-center bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{u.activeListingCount ?? 0}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{u.subscription?.expiresAt ? formatDateShort(u.subscription.expiresAt) : "-"}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{formatDateShort(u.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-500 hover:bg-violet-100 hover:text-violet-700"
                            onClick={() => setDetailUserId(u._id)}
                            aria-label="Detay"
                          >
                            <PanelRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            disabled={deleteMutation.isPending || isSelf(u._id)}
                            onClick={() => setDeleteTarget(u)}
                            aria-label="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination.total > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Sayfa <span className="font-semibold text-slate-700">{pagination.page} / {totalPages}</span>
              <span className="mx-1">-</span>
              Toplam <span className="font-semibold text-slate-700">{pagination.total?.toLocaleString("tr-TR")}</span>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="gap-1">
                <ChevronLeft className="h-4 w-4" /> Onceki
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="gap-1">
                Sonraki <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Sheet open={Boolean(detailUserId)} onOpenChange={(open) => !open && setDetailUserId(null)}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Kullanici Detayi</SheetTitle>
            <SheetDescription>
              Profil, uyelik ve yonetim islemleri.
            </SheetDescription>
          </SheetHeader>
          {detailUser && (
            <div className="flex flex-1 flex-col gap-4 px-4 pb-6">
              <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-14 w-14 ring-4 ring-white shadow-sm">
                    <AvatarImage src={detailUser.avatarUrl || ""} alt={detailUser.name} />
                    <AvatarFallback className="bg-violet-700 text-sm font-black text-white">
                      {initialsFromName(detailUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-black text-slate-900">{detailUser.name}</p>
                    <p className="truncate text-sm text-slate-600">{detailUser.email}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <RoleBadge role={detailUser.role} />
                      <PlanBadge plan={detailUser.subscription?.plan || "free"} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[11px] text-slate-500">Toplam ilan</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{detailUser.listingCount ?? 0}</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-[11px] text-emerald-700">Aktif ilan</p>
                  <p className="mt-1 text-lg font-bold text-emerald-900">{detailUser.activeListingCount ?? 0}</p>
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 text-sm">
                <div className="flex justify-between gap-2"><span className="text-slate-500">Kayit</span><span className="font-medium text-slate-800">{formatDateTime(detailUser.createdAt)}</span></div>
                <div className="flex justify-between gap-2"><span className="text-slate-500">Son guncelleme</span><span className="font-medium text-slate-800">{formatDateTime(detailUser.updatedAt)}</span></div>
                <div className="flex justify-between gap-2"><span className="text-slate-500">Plan bitis</span><span className="font-medium text-slate-800">{detailUser.subscription?.expiresAt ? formatDateTime(detailUser.subscription.expiresAt) : "-"}</span></div>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Hizli islem</p>
                <Select
                  value={detailUser.role}
                  onValueChange={(val) => handleRoleChange(detailUser._id, val)}
                  disabled={updateMutation.isPending || isSelf(detailUser._id)}
                >
                  <SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Uye</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={detailUser.subscription?.plan || "free"}
                  onValueChange={(val) => handlePlanChange(detailUser._id, val)}
                  disabled={updateMutation.isPending}
                >
                  <SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => navigator.clipboard.writeText(detailUser.email).then(() => toast.success("E-posta kopyalandi"))}
                >
                  <Copy className="h-4 w-4" />
                  E-posta kopyala
                </Button>

                <Button variant="outline" className="w-full gap-2" asChild>
                  <Link href={`/admin/listings?ownerId=${detailUser._id}`}>
                    <BadgeCheck className="h-4 w-4" />
                    Bu kullanicinin ilanlarini getir
                  </Link>
                </Button>

                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  disabled={deleteMutation.isPending || isSelf(detailUser._id)}
                  onClick={() => {
                    setDetailUserId(null);
                    setDeleteTarget(detailUser);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Kullaniciyi sil
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullaniciyi sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.name}</strong> ve tum ilanlari kalici olarak silinecek. Bu islem geri alinamaz.
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
                <span className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Sil
                </span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
